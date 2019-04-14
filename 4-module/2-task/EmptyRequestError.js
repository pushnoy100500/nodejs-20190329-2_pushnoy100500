class EmptyRequestError extends Error {
  constructor() {
    super('Empty request body.');

    this.name = this.constructor.name;
    Error.captureStackTrace(this, this.constructor);

    this.code = 'EMPTY_BODY';
  }
}

module.exports = EmptyRequestError;
