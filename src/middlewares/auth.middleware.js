/**
 * src/middlewares/auth.middleware.js
 * Middleware to verify JWT tokens and protect private routes.
 */

const jwt = require('jsonwebtoken');
const db = require('../config/db.config');

/**
 * Protects route endpoints ensuring only authenticated users with valid JWTs can proceed
 */
const protect = async (req, res, next) => {
  let token;

  // Check for token in Authorization header (standard: "Bearer <Token>")
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    try {
      // Split the header to extract the token string
      token = req.headers.authorization.split(' ')[1];

      // Verify the token
      const secret = process.env.JWT_SECRET || 'supersecretfallback';
      const decoded = jwt.verify(token, secret);

      // Query the database to ensure the user still exists
      const [rows] = await db.execute('CALL sp_obtener_usuario_por_email(?)', [decoded.email]);
      const user = rows[0][0];

      if (!user) {
        return res.status(401).json({
          status: 'error',
          message: 'Not authorized, user no longer exists'
        });
      }

      // Attach user details to request object (excluding password)
      const { password_hash: _, ...userWithoutPassword } = user;
      req.user = userWithoutPassword;

      // Move to the next middleware/controller
      return next();
    } catch (error) {
      console.error(`💥 Auth Middleware Error: ${error.message}`);
      return res.status(401).json({
        status: 'error',
        message: 'Not authorized, token failed'
      });
    }
  }

  // If no token is provided in the headers
  if (!token) {
    return res.status(401).json({
      status: 'error',
      message: 'Not authorized, no token provided'
    });
  }
};

module.exports = {
  protect
};
