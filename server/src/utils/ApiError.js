/**
 * Error type for failures we raise on purpose (bad input, missing resource,
 * forbidden action). The global error handler trusts `message` on these and
 * shows it to the client; every other error gets a generic 500 message so an
 * unexpected crash can never leak internals.
 */
export class ApiError extends Error {
  constructor(statusCode, message, errors = []) {
    super(message);
    this.statusCode = statusCode;
    this.errors = errors;
    this.isOperational = true;

    Error.captureStackTrace(this, this.constructor);
  }
}
