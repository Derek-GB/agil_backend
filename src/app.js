/**
 * src/app.js
 * Configures the Express application instance, global middleware, and routing.
 */

const express = require('express');
const cors = require('cors');
const morgan = require('morgan');

// Import routes
const statusRoutes = require('./routes/status.routes');
const authRoutes = require('./routes/auth.routes');

// Import middlewares
const { errorHandler, notFoundHandler } = require('./middlewares/error.middleware');

// Initialize express app
const app = express();

// Global Middlewares
app.use(cors()); // Enable Cross-Origin Resource Sharing
app.use(express.json()); // Body parser for JSON requests
app.use(express.urlencoded({ extended: true })); // Body parser for urlencoded payloads

// HTTP request logging (Morgan)
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev')); // Slim dev logging
} else {
  app.use(morgan('combined')); // Detailed production logging
}

// API Base Routes
app.use('/api/status', statusRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/pacientes', require('./routes/paciente.routes'));
app.use('/api/doctores', require('./routes/doctor.routes'));

// Catch-all 404 handler for any undefined route
app.use(notFoundHandler);

// Global centralized error handling middleware
app.use(errorHandler);

module.exports = app;
