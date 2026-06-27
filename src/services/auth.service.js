/**
 * src/services/auth.service.js
 * Service handling user authentication business logic.
 * Incorporates password hashing, verification, token generation, and a mock in-memory database.
 */

const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// Mock User DB storage
// In production, replace this with calls to your database (e.g. User.create, User.findOne)
const users = [];

/**
 * Generates a JSON Web Token (JWT)
 * @param {Object} payload - Data to embed in the token
 * @returns {string} Signed JWT
 */
const generateToken = (payload) => {
  const secret = process.env.JWT_SECRET || 'supersecretfallback';
  const expiresIn = process.env.JWT_EXPIRES_IN || '1h';
  
  return jwt.sign(payload, secret, { expiresIn });
};

/**
 * Register a new user
 * @param {string} name - User's name
 * @param {string} email - User's email
 * @param {string} password - User's password
 * @returns {Promise<Object>} Created user information (excluding password)
 */
const registerUser = async (name, email, password) => {
  // Input validation
  if (!name || !email || !password) {
    const error = new Error('Please provide name, email, and password');
    error.statusCode = 400;
    throw error;
  }

  // Check if user already exists
  const existingUser = users.find(u => u.email.toLowerCase() === email.toLowerCase());
  if (existingUser) {
    const error = new Error('User already exists');
    error.statusCode = 400;
    throw error;
  }

  // Hash password
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);

  // Save new user in mock DB
  const newUser = {
    id: (users.length + 1).toString(),
    name,
    email: email.toLowerCase(),
    password: hashedPassword,
    createdAt: new Date().toISOString()
  };
  users.push(newUser);

  // Return user info without the hashed password
  const { password: _, ...userWithoutPassword } = newUser;
  return userWithoutPassword;
};

/**
 * Authenticates a user and generates a JWT token
 * @param {string} email - User's email
 * @param {string} password - User's password
 * @returns {Promise<Object>} Object containing user details and the token
 */
const loginUser = async (email, password) => {
  // Input validation
  if (!email || !password) {
    const error = new Error('Please provide email and password');
    error.statusCode = 400;
    throw error;
  }

  // Find user in mock DB
  const user = users.find(u => u.email.toLowerCase() === email.toLowerCase());
  if (!user) {
    const error = new Error('Invalid email or password');
    error.statusCode = 401;
    throw error;
  }

  // Compare passwords
  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    const error = new Error('Invalid email or password');
    error.statusCode = 401;
    throw error;
  }

  // Generate JWT
  const token = generateToken({ id: user.id, email: user.email });

  // Return user details and token
  const { password: _, ...userWithoutPassword } = user;
  return {
    user: userWithoutPassword,
    token
  };
};

module.exports = {
  registerUser,
  loginUser,
  generateToken,
  // Exporting users array so middleware can verify user presence if needed
  users
};
