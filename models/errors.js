// /* eslint-disable no-magic-numbers */
const STATUS_CODE_BAD_REQUEST = 400;

class NodeError extends Error {
  constructor(message, statusCode) {
    super(message);
    this.name = this.constructor.name;
    this.statusCode = statusCode;
  }
}

class MonerodError extends Error {
  constructor(message, error, statusCode) {
    super(message);
    this.name = this.constructor.name;
    this.error = error;
    this.statusCode = statusCode;
  }
}

class ValidationError extends Error {
  constructor(message, statusCode = STATUS_CODE_BAD_REQUEST) {
    super(message);
    this.name = this.constructor.name;
    this.statusCode = statusCode;
  }
}

export {NodeError, MonerodError, ValidationError};
