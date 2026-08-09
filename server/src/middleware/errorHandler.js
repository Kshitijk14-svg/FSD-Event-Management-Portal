import { ApiError } from '../utils/ApiError.js';

// The 4th argument is what makes Express treat this as an error handler,
// so don't remove next even though it is unused.
export const errorHandler = (err, req, res, next) => {
  let statusCode = 500;
  let message = 'Internal server error';
  let errors = [];

  if (err instanceof ApiError) {
    statusCode = err.statusCode;
    message = err.message;
    errors = err.errors;
  } else if (err.name === 'CastError') {
    statusCode = 400;
    message = `Invalid ${err.path}: ${err.value}`;
  } else if (err.name === 'ValidationError') {
    statusCode = 422;
    message = 'Validation failed';
    errors = Object.values(err.errors).map((e) => ({
      field: e.path,
      message: e.message,
    }));
  } else if (err.code === 11000) {
    statusCode = 409;
    const field = Object.keys(err.keyValue ?? {})[0];
    message = field ? `${field} already exists` : 'Duplicate value';
    errors = field ? [{ field, message }] : [];
  }

  console.error(`[error] ${req.method} ${req.originalUrl} -> ${statusCode}`, err);

  const body = { success: false, message, errors };

  // A stack trace would expose our file paths, so it never leaves the server
  // in production.
  if (process.env.NODE_ENV !== 'production') {
    body.stack = err.stack;
  }

  res.status(statusCode).json(body);
};
