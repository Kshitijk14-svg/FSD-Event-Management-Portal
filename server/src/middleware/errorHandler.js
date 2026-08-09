import { ApiError } from '../utils/ApiError.js';

/**
 * The single exit point for every failure in the API. Always responds with
 *   { success: false, message, errors: [] }
 * and translates the Mongoose errors we cannot control into the right status
 * codes, so controllers never have to try/catch database problems themselves.
 *
 * The four-argument signature is what marks this as an error handler to
 * Express — do not remove `next` even though it is unused.
 */
// eslint-disable-next-line no-unused-vars
export const errorHandler = (err, req, res, next) => {
  let statusCode = 500;
  let message = 'Internal server error';
  let errors = [];

  if (err instanceof ApiError) {
    statusCode = err.statusCode;
    message = err.message;
    errors = err.errors;
  } else if (err.name === 'CastError') {
    // A malformed ObjectId in the URL, e.g. GET /events/not-an-id
    statusCode = 400;
    message = `Invalid ${err.path}: ${err.value}`;
  } else if (err.name === 'ValidationError') {
    // Mongoose schema validation — report every offending field at once.
    statusCode = 422;
    message = 'Validation failed';
    errors = Object.values(err.errors).map((e) => ({
      field: e.path,
      message: e.message,
    }));
  } else if (err.code === 11000) {
    // Unique index violation (duplicate email, ticketCode, slug...).
    statusCode = 409;
    const field = Object.keys(err.keyValue ?? {})[0];
    message = field ? `${field} already exists` : 'Duplicate value';
    errors = field ? [{ field, message }] : [];
  }

  // Always log the real error server-side, even when the client sees a generic
  // message — otherwise a 500 in production is undebuggable.
  console.error(`[error] ${req.method} ${req.originalUrl} -> ${statusCode}`, err);

  const body = { success: false, message, errors };

  // Stack traces are a disclosure risk, so they never cross the wire in production.
  if (process.env.NODE_ENV !== 'production') {
    body.stack = err.stack;
  }

  res.status(statusCode).json(body);
};
