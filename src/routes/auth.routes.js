/**
 * src/routes/auth.routes.js
 * Routing for authentication endpoints.
 */

const express = require('express');
const router = express.Router();
const authController = require('../controllers/auth.controller');

// Route mapping: POST /api/auth/register -> register controller
router.post('/register', authController.register);

// Route mapping: POST /api/auth/login -> login controller
router.post('/login', authController.login);

module.exports = router;
