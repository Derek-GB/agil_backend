const pool = require('../config/db.config');
const { validatePacientePayload, pacienteFields } = require('../models/paciente.model');

const normalizeResultSet = (resultSets) => {
  if (Array.isArray(resultSets) && Array.isArray(resultSets[0])) {
    return resultSets[0];
  }
  return resultSets;
};

const getAll = async () => {
  const [resultSets] = await pool.execute('CALL sp_ObtenerPacientes()');
  return normalizeResultSet(resultSets);
};

const getById = async (id) => {
  const [resultSets] = await pool.execute('CALL sp_ObtenerPacientePorId(?)', [id]);
  const rows = normalizeResultSet(resultSets);
  return rows[0];
};

const create = async (patient) => {
  const validPatient = validatePacientePayload(patient, true);
  const {
    nombre,
    apellidos,
    cedula,
    fecha_nacimiento,
    genero,
    telefono,
    email,
    direccion,
    tipo_sangre,
    observaciones
  } = validPatient;

  const [resultSets] = await pool.execute(
    'CALL sp_CrearPaciente(?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
    [
      nombre,
      apellidos,
      cedula,
      fecha_nacimiento,
      genero,
      telefono,
      email,
      direccion,
      tipo_sangre,
      observaciones
    ]
  );

  const rows = normalizeResultSet(resultSets);
  return rows[0];
};

const update = async (id, patient) => {
  if (!patient || typeof patient !== 'object') {
    const error = new Error('Payload de paciente inválido');
    error.statusCode = 400;
    throw error;
  }

  const validPatient = validatePacientePayload(patient, true);
  const {
    nombre,
    apellidos,
    cedula,
    fecha_nacimiento,
    genero,
    telefono,
    email,
    direccion,
    tipo_sangre,
    observaciones
  } = validPatient;

  await pool.execute(
    'CALL sp_ActualizarPaciente(?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
    [
      id,
      nombre,
      apellidos,
      cedula,
      fecha_nacimiento,
      genero,
      telefono,
      email,
      direccion,
      tipo_sangre,
      observaciones
    ]
  );

  return getById(id);
};

const deleteById = async (id) => {
  const [resultSets] = await pool.execute('CALL sp_EliminarPaciente(?)', [id]);
  const rows = normalizeResultSet(resultSets);
  return rows[0] || { message: 'Paciente eliminado exitosamente.' };
};

module.exports = {
  getAll,
  getById,
  create,
  update,
  deleteById
};
