// /* eslint-disable no-magic-numbers */
// function NodeError(message, statusCode) {
//   Error.captureStackTrace(this, this.constructor);
//   this.name = this.constructor.name;
//   this.message = message;
//   this.statusCode = statusCode;
// }
// require('util').inherits(NodeError, Error);

// function MonerodError(message, error, statusCode) {
//   Error.captureStackTrace(this, this.constructor);
//   this.name = this.constructor.name;
//   this.message = message;
//   this.error = error;
//   this.statusCode = statusCode;
// }
// require('util').inherits(MonerodError, Error);

// function ValidationError(message, statusCode) {
//   Error.captureStackTrace(this, this.constructor);
//   this.name = this.constructor.name;
//   this.message = message;
//   this.statusCode = statusCode || 400;
// }
// require('util').inherits(ValidationError, Error);

// module.exports = {
//   NodeError,
//   MonerodError,
//   ValidationError
// };

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
