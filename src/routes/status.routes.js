/**
 * src/routes/status.routes.js
 * Routing for status endpoints.
 */

const express = require('express');
const router = express.Router();
const { getStatus } = require('../controllers/status.controller');

// Route mapping: GET /api/status -> getStatus controller function
router.get('/', getStatus);

module.exports = router;
