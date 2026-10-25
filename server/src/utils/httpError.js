// Create an error carrying an HTTP status for the central error handler.
const httpError = (status, message) => Object.assign(new Error(message), { status });

module.exports = httpError;
