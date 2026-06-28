import pool from '../config/db.config.js';
import bcrypt from 'bcrypt';

export const getAll = async (filters) => {
  const role = filters && filters.role ? filters.role : null;
  const email = filters && filters.email ? filters.email : null;
  const [resultSets] = await pool.execute('CALL sp_get_all_users(?, ?)', [role, email]);
  const rows = Array.isArray(resultSets) && Array.isArray(resultSets[0]) ? resultSets[0] : resultSets;
  return rows;
  
};

export const getById = async (id) => {
    const [resultSets] = await pool.execute('CALL sp_get_user_by_id(?)', [id]);
  const rows = Array.isArray(resultSets) && Array.isArray(resultSets[0]) ? resultSets[0] : resultSets;
  return rows[0];
}

export const create = async (user) => {
    const {name, email, username, password, role, telefono, direccion} = user;
    if (!name || !email || !username || !password || !role || !telefono || !direccion){
        throw new Error('Faltan datos del usuario');
    }

    const hashedPass = await bcrypt.hash(password, 10);
    const [resultSets] = await pool.execute('CALL sp_create_user(?, ?, ?, ?, ?, ?, ?)', [name, email, username, hashedPass, role, telefono, direccion]);
    const rows = Array.isArray(resultSets) && Array.isArray(resultSets[0]) ? resultSets[0] : resultSets;
    return rows[0];
}

export const update = async (id, user) => {
  const { name, email, username, password, telefono, direccion } = user;
  if (name === undefined && email === undefined && username === undefined && password === undefined && telefono === undefined && direccion === undefined) {
    throw new Error('No hay datos para actualizar');
  }

  const hashedPass = password !== undefined ? await bcrypt.hash(password, 10) : null;
  await pool.execute('CALL sp_update_user(?, ?, ?, ?, ?, ?, ?)', [id, name || null, email || null, username || null, hashedPass, telefono || null, direccion || null]);
  return getById(id);
};

export const validateCredentials = async (username, password) => {
  const [resultSets] = await pool.execute('CALL sp_get_user_by_username(?)', [username]);
  const rows = Array.isArray(resultSets) && Array.isArray(resultSets[0]) ? resultSets[0] : resultSets;
  if (!rows || rows.length === 0) return null;
  const user = rows[0];
  const valid = await bcrypt.compare(password, user.password);
  if (!valid) return null;
  delete user.password;
  return user;
};

export const deleteById = async (id) => {
  await pool.execute('CALL sp_delete_user(?)', [id]);
  return { message: 'User deleted successfully' };
};