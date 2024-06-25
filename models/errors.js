// /* eslint-disable no-magic-numbers */

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
  constructor(message, statusCode = 400) {
    super(message);
    this.name = this.constructor.name;
    this.statusCode = statusCode;
  }
}

export { NodeError, MonerodError, ValidationError };
