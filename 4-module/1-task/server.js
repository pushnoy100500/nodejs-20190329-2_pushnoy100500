const url = require('url');
const http = require('http');
const path = require('path');
const fs = require('fs');

function hasNestedDirs(pathname) {
  const dirs = pathname.split('/');
  return dirs.length > 1;
}

function serveFile(filepath, res) {
  const fileStream = fs.createReadStream(filepath);

  fileStream.on('error', (err) => {
    switch (err.code) {
      case 'ENOENT':
        res.statusCode = 404;
        res.end('requested file does not exist');
        break;
      default:
        res.statusCode = 500;
        res.end('server error occured');
        break;
    }
  })

  fileStream.pipe(res);
}

const server = new http.Server();

server.on('request', (req, res) => {
  const pathname = url.parse(req.url).pathname.slice(1);

  const filepath = path.join(__dirname, 'files', pathname);

  switch (req.method) {
    case 'GET':
      if (hasNestedDirs(pathname)) {
        res.statusCode = 400;
        res.end('nested directories are not supported');
      }
      serveFile(filepath, res);
      break;
    default:
      res.statusCode = 501;
      res.end('Not implemented');
  }
});

module.exports = server;
