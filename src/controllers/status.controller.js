/**
 * src/controllers/status.controller.js
 * Controller handling health checks and API status.
 */

/**
 * @desc    Get API Status / Health Check
 * @route   GET /api/status
 * @access  Public
 */
const getStatus = (req, res, next) => {
  try {
    const statusInfo = {
      status: 'ok',
      message: 'API is running successfully (Reloaded)',
      timestamp: new Date().toISOString(),
      uptime: `${process.uptime().toFixed(2)}s`,
      environment: process.env.NODE_ENV || 'development'
    };
    
    return res.status(200).json(statusInfo);
  } catch (error) {
    // Passes any unexpected errors to the global error handler middleware
    next(error);
  }
};

module.exports = {
  getStatus
};
