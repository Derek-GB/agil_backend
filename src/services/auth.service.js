/**
 * src/services/auth.service.js
 * Service handling user authentication business logic using MySQL Stored Procedures.
 */

const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const db = require('../config/db.config'); // Conexión a la base de datos (Pool de mysql2)

/**
 * Generates a JSON Web Token (JWT)
 */
const generateToken = (payload) => {
  const secret = process.env.JWT_SECRET || 'supersecretfallback';
  const expiresIn = process.env.JWT_EXPIRES_IN || '1h';
  
  return jwt.sign(payload, secret, { expiresIn });
};

/**
 * Register a new user calling sp_registrar_usuario
 */
const registerUser = async (name, email, password) => {
  if (!name || !email || !password) {
    const error = new Error('Please provide name, email, and password');
    error.statusCode = 400;
    throw error;
  }

  // 1. Verificar si el usuario ya existe usando el SP de lectura
  const [existingRows] = await db.execute('CALL sp_obtener_usuario_por_email(?)', [email]);
  const existingUser = existingRows[0][0];

  if (existingUser) {
    const error = new Error('User already exists');
    error.statusCode = 400;
    throw error;
  }

  // 2. Hashear la contraseña
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);

  // 3. Registrar mediante el SP
  const [registerRows] = await db.execute('CALL sp_registrar_usuario(?, ?, ?)', [
    name,
    email,
    hashedPassword
  ]);
  
  // Extraer el ID retornado por el SP
  const newUserId = registerRows[0][0].usuario_id;

  return {
    usuario_id: newUserId,
    nombre_usuario: name,
    email: email.toLowerCase()
  };
};

/**
 * Authenticates a user and generates a JWT token
 */
const loginUser = async (email, password) => {
  if (!email || !password) {
    const error = new Error('Please provide email and password');
    error.statusCode = 400;
    throw error;
  }

  // 1. Obtener usuario usando el SP de lectura
  const [rows] = await db.execute('CALL sp_obtener_usuario_por_email(?)', [email]);
  const user = rows[0][0];

  // ===== AGREGAR ESTE LOG =====
  console.log('Usuario encontrado en DB:', user);

  if (!user) {
    const error = new Error('Invalid email or password');
    error.statusCode = 401;
    throw error;
  }

  if (user.activo !== 1) {
    const error = new Error('User account is inactive');
    error.statusCode = 403;
    throw error;
  }

  // const salt = await bcrypt.genSalt(10);
  // const hashedPassword = await bcrypt.hash(password, salt);
  // console.log(hashedPassword)

  // 2. Comparar la contraseña ingresada con el hash de la base de datos
  const isMatch = await bcrypt.compare(password, user.password_hash);

  // ===== AGREGAR ESTE LOG =====
  console.log('¿La contraseña coincide?:', isMatch);

  if (!isMatch) {
    const error = new Error('Invalid email or password');
    error.statusCode = 401;
    throw error;
  }

  // 3. Generar JWT
  const token = generateToken({ usuario_id: user.usuario_id, email: user.email });

  // 4. Retornar datos del usuario omitiendo la contraseña
  const { password_hash: _, ...userWithoutPassword } = user;
  return {
    user: userWithoutPassword,
    token
  };
};

module.exports = {
  registerUser,
  loginUser,
  generateToken
};