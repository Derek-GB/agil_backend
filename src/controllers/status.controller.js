/**
 * src/controllers/status.controller.js
 * Controller handling health checks and API status.
 */

const { getStatusDetails } = require('../services/status.service');

/**
 * @desc    Get API Status / Health Check
 * @route   GET /api/status
 * @access  Public
 */
const getStatus = (req, res, next) => {
  try {
    const statusInfo = getStatusDetails();
    return res.status(200).json(statusInfo);
  } catch (error) {
    // Passes any unexpected errors to the global error handler middleware
    next(error);
  }
};

module.exports = {
  getStatus
};
