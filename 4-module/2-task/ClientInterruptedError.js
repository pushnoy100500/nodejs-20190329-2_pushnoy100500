class ClientInterruptedError extends Error {
  constructor() {
    super('Request was interrupted.');

    this.name = this.constructor.name;
    Error.captureStackTrace(this, this.constructor);

    this.code = 'REQUEST_INTERRUPTED';
  }
}

module.exports = ClientInterruptedError;
