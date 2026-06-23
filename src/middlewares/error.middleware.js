/**
 * src/middlewares/error.middleware.js
 * Centralized error handler and 404 (Not Found) route handler.
 */

/**
 * Handles requests to endpoints that do not exist (404 Not Found)
 */
const notFoundHandler = (req, res, next) => {
  const error = new Error(`Not Found - ${req.originalUrl}`);
  res.status(404);
  next(error);
};

/**
 * Catches all errors thrown in controllers/routes and formats them into a clean JSON response
 */
const errorHandler = (err, req, res, next) => {
  // If status code is 200, default to 500 (Internal Server Error)
  const statusCode = res.statusCode === 200 ? 500 : res.statusCode;
  
  res.status(statusCode).json({
    status: 'error',
    message: err.message || 'Internal Server Error',
    // Expose stack trace only in development mode to prevent information leakage in production
    stack: process.env.NODE_ENV === 'development' ? err.stack : undefined
  });
};

module.exports = {
  notFoundHandler,
  errorHandler
};
