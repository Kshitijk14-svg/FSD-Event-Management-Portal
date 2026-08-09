export const sendResponse = (
  res,
  { statusCode = 200, data = null, message = 'OK', meta = null } = {}
) => res.status(statusCode).json({ success: true, data, message, meta });
