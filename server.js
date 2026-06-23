/**
 * server.js
 * Entry point of the Express API.
 * Configures the port, starts the server listener, and handles graceful shutdown.
 */

// Load environment variables as early as possible
require('dotenv').config();

const app = require('./src/app');

// Determine the port (fallback to 5000 if not specified)
const PORT = process.env.PORT || 5000;
const NODE_ENV = process.env.NODE_ENV || 'development';

// Start server listener
const server = app.listen(PORT, () => {
  console.log(`=============================================`);
  console.log(`🚀 Server running in ${NODE_ENV.toUpperCase()} mode`);
  console.log(`📡 Listening on http://localhost:${PORT}`);
  console.log(`=============================================`);
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (err, promise) => {
  console.error(`💥 Unhandled Rejection: ${err.message}`);
  // Close server & exit process
  server.close(() => process.exit(1));
});

// Handle graceful shutdown signals
const gracefulShutdown = (signal) => {
  console.log(`\n🤖 Received ${signal}. Shutting down gracefully...`);
  server.close(() => {
    console.log('💤 Http server closed. Process terminated.');
    process.exit(0);
  });
};

process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
process.on('SIGINT', () => gracefulShutdown('SIGINT'));
