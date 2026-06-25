/**
 * src/services/status.service.js
 * Service handling health check business logic.
 */

/**
 * Get the current API status details
 * @returns {Object} Status information object
 */
const getStatusDetails = () => {
  return {
    status: 'ok',
    message: 'API is running successfully (Reloaded with Services Layer)',
    timestamp: new Date().toISOString(),
    uptime: `${process.uptime().toFixed(2)}s`,
    environment: process.env.NODE_ENV || 'development'
  };
};

module.exports = {
  getStatusDetails
};
