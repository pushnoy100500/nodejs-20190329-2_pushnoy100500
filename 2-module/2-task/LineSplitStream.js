const stream = require('stream');
const os = require('os');

class LineSplitStream extends stream.Transform {
  constructor(options) {
    super(options);
    this.chunksQueue = [];
  }

  _handleQueue(chunk) {
    let splitStr = chunk.toString().split(os.EOL);
    if (this.chunksQueue.length) {
      this.chunksQueue[this.chunksQueue.length - 1] = this.chunksQueue[this.chunksQueue.length - 1] + splitStr[0];
      splitStr = splitStr.slice(1);
    }
    this.chunksQueue = this.chunksQueue.concat(splitStr);
  }

  _transform(chunk, encoding, callback) {
    this._handleQueue(chunk);

    while(this.chunksQueue.length - 1) {
      this.push(this.chunksQueue.shift());
    }

    callback();
  }

  _flush(callback) {
    if (this.chunksQueue.length) {
      callback(null, this.chunksQueue.shift());
    }
  }
}

module.exports = LineSplitStream;
