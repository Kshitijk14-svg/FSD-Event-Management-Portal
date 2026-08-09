/**
 * The one place the success envelope is defined. Every successful response in
 * the API goes through this so the client can rely on a single shape:
 *   { success, data, message, meta }
 * `meta` carries pagination ({ page, limit, total, totalPages }) on list
 * endpoints and stays null everywhere else.
 */
export const sendResponse = (
  res,
  { statusCode = 200, data = null, message = 'OK', meta = null } = {}
) => res.status(statusCode).json({ success: true, data, message, meta });
