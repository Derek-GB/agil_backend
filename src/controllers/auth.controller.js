/**
 * src/controllers/auth.controller.js
 * Controller handling user registration and login requests.
 */

const authService = require('../services/auth.service');

/**
 * @desc    Register a new user
 * @route   POST /api/auth/register
 * @access  Public
 */
const register = async (req, res, next) => {
  try {
    const { name, email, password } = req.body;
    
    const user = await authService.registerUser(name, email, password);
    
    return res.status(201).json({
      status: 'success',
      message: 'User registered successfully',
      data: { user }
    });
  } catch (error) {
    // If the service attached a specific statusCode, set it on the response
    if (error.statusCode) {
      res.status(error.statusCode);
    }
    next(error);
  }
};

/**
 * @desc    Authenticate user & return JWT token
 * @route   POST /api/auth/login
 * @access  Public
 */
const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    
    const result = await authService.loginUser(email, password);
    
    return res.status(200).json({
      status: 'success',
      message: 'Authentication successful',
      data: result
    });
  } catch (error) {
    if (error.statusCode) {
      res.status(error.statusCode);
    }
    next(error);
  }
};

module.exports = {
  register,
  login
};
