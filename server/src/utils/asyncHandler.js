// Express 4 doesn't catch rejected promises, so async controllers need this
// wrapper to pass their errors to the error handler.
export const asyncHandler = (fn) => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};
