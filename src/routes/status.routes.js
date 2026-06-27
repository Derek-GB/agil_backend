/**
 * src/routes/status.routes.js
 * Routing for status endpoints.
 */

const express = require('express');
const router = express.Router();
const { getStatus, getProtectedStatus } = require('../controllers/status.controller');
const { protect } = require('../middlewares/auth.middleware');

// Route mapping: GET /api/status -> getStatus controller function
router.get('/', getStatus);

// Route mapping: GET /api/status/protected -> protected status details (requires valid JWT token)
router.get('/protected', protect, getProtectedStatus);

module.exports = router;
