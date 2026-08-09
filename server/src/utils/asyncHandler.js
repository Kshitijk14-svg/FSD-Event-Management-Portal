/**
 * Express 4 does not catch rejected promises, so an `await` that throws inside
 * a controller would hang the request forever. Wrapping the controller pipes
 * that rejection into next(), which reaches the global error handler.
 *
 * Usage: router.post('/', asyncHandler(createEvent))
 */
export const asyncHandler = (fn) => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};
