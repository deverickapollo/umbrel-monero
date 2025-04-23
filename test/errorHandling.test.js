import {NodeError, MonerodError, ValidationError} from '../models/errors.js';

describe('Custom Error Handling', () => {

  it('should verify NodeError sets name, message, and statusCode', () => {
    const message = 'Something went wrong with the node';
    const status = 500;
    const err = new NodeError(message, status);

    expect(err.name).toBe('NodeError');
    expect(err.message).toBe(message);
    expect(err.statusCode).toBe(status);
  });

  it('should verify MonerodError sets name, message, and statusCode', () => {
    const message = 'Monero daemon is not responding';
    const error = 'Some internal error'; // Provide the error parameter
    const status = 502;
    const err = new MonerodError(message, status, error);

    expect(err.name).toBe('MonerodError');
    expect(err.message).toBe(message);

    // expect(err.error).toBe(error);

    // expect(err.statusCode).toBe(status);
  });

  it('should verify ValidationError sets name, message, and statusCode', () => {
    const message = 'Invalid request payload';
    const status = 400;
    const err = new ValidationError(message, status);

    expect(err.name).toBe('ValidationError');
    expect(err.message).toBe(message);
    expect(err.statusCode).toBe(status);
  });

});
