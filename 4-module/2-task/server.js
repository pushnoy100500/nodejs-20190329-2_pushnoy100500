const url = require('url');
const http = require('http');
const path = require('path');
const fs = require('fs');
const EmptyRequestError = require('./EmptyRequestError');
const LimitSizeStream = require('./LimitSizeStream');
const ClientInterruptedError  =require('./ClientInterruptedError');

const server = new http.Server();

function hasNestedDirs(pathname) {
  const dirs = pathname.split('/');
  return dirs.length > 1;
}

function writeFile(req, filepath) {
  const fileWriteStream = fs.createWriteStream(
    filepath,
    {
      flags: 'wx',
    },
  );
  const limitedSizeStream = new LimitSizeStream({ limit: 1000000 });

  return new Promise((resolve, reject) => {
    fileWriteStream.on('finish', () => {      
      if (fileWriteStream.bytesWritten === 0) {
        reject(new EmptyRequestError());
      } else {
        resolve();
      }
    })

    fileWriteStream.on('error', (err) => {
      reject(err);
    })

    req.on('error', (err) => {
      fileWriteStream.close();
      fs.unlink(filepath);
      reject(err);
    })

    limitedSizeStream.on('error', (err) => {
      fs.unlink(filepath, (unlinkErr) => {
        reject(err);
      });
    });

    req.on('close', () => {
      fileWriteStream.close();
      fs.unlink(filepath, (unlinkErr) => {
        reject(new ClientInterruptedError());
      });
    })

    req.pipe(limitedSizeStream)
      .pipe(fileWriteStream);
  });
}

server.on('request', (req, res) => {
  const pathname = url.parse(req.url).pathname.slice(1);

  const filepath = path.join(__dirname, 'files', pathname);

  switch (req.method) {
    case 'POST':
      if (hasNestedDirs(pathname)) {
        res.statusCode = 400;
        res.end('nested directories are not supported');
        return;
      }
      writeFile(req, filepath)
        .then(() => {
          res.statusCode = 201;
          res.end('file created');
        })
        .catch((err) => {
          switch (err.code) {
            case 'EEXIST':
              res.statusCode = 409;
              res.end('file already exists');
              break;
            case 'EMPTY_BODY':
              res.statusCode = 409;
              res.end(err.message);
              break;
            case 'LIMIT_EXCEEDED':
              res.statusCode = 413
              res.end('uploaded file is too big');
            default:
              break;
          }
        });
      break;

    default:
      res.statusCode = 501;
      res.end('Not implemented');
  }
});

module.exports = server;
