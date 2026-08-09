import { ApiError } from '../utils/ApiError.js';

/**
 * Runs after every route has declined the request. Handing it to next() keeps
 * 404s on the same envelope as every other error instead of Express's HTML page.
 */
export const notFound = (req, res, next) => {
  next(new ApiError(404, `Route ${req.originalUrl} not found`));
};
