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

/**
 * @desc    Get Protected API Status (requires login)
 * @route   GET /api/status/protected
 * @access  Private
 */
const getProtectedStatus = (req, res, next) => {
  try {
    const statusInfo = getStatusDetails();
    return res.status(200).json({
      status: 'success',
      message: 'You have accessed a protected route successfully!',
      user: req.user, // Attached by protect middleware
      details: statusInfo
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getStatus,
  getProtectedStatus
};
