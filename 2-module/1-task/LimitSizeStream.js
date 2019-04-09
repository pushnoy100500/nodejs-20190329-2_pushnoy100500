const stream = require('stream');
const LimitExceededError = require('./LimitExceededError');

class LimitSizeStream extends stream.Transform {
  constructor(options) {
    super(options);
    this.limit = options.limit || 10;
    this.currSize = 0;
  }

  _transform(chunk, encoding, callback) {
    this.currSize += chunk.length;
    if (this.currSize > this.limit) {
      callback(new LimitExceededError());
    }
    callback(null, chunk);
  }
}

module.exports = LimitSizeStream;
