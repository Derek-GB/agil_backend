const pool = require('../config/db.config');
const bcrypt = require('bcryptjs');
const {
    createDoctorFields,
    updateDoctorFields,
    validateDoctorPayload
} = require('../models/doctor.model');

const normalizeResultSet = (resultSets) => {
    if (Array.isArray(resultSets) && Array.isArray(resultSets[0])) {
        return resultSets[0];
    }
    return resultSets;
};

const getAll = async () => {
    const [resultSets] = await pool.execute('CALL sp_ObtenerDoctores()');
    return normalizeResultSet(resultSets);
};

const getById = async (id) => {
    const [resultSets] = await pool.execute('CALL sp_ObtenerDoctorPorId(?)', [id]);
    const rows = normalizeResultSet(resultSets);
    return rows[0];
};

const create = async (doctor) => {
    const validDoctor = validateDoctorPayload(doctor, createDoctorFields, true);
    const hashedPassword = await bcrypt.hash(validDoctor.password, 10);
    const [resultSets] = await pool.execute(
        'CALL sp_CrearDoctor(?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
        [
            validDoctor.nombre,
            validDoctor.apellidos,
            validDoctor.cedula,
            validDoctor.fecha_nacimiento,
            validDoctor.genero,
            validDoctor.telefono,
            validDoctor.email,
            validDoctor.direccion,
            validDoctor.fecha_ingreso,
            validDoctor.especialidad_id,
            validDoctor.num_licencia,
            validDoctor.nombre_usuario,
            hashedPassword
        ]
    );
    const rows = normalizeResultSet(resultSets);
    return rows[0];
};

const update = async (id, doctor) => {
    const validDoctor = validateDoctorPayload(doctor, updateDoctorFields, true);
    await pool.execute(
        'CALL sp_ActualizarDoctor(?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
        [
            id,
            validDoctor.nombre,
            validDoctor.apellidos,
            validDoctor.cedula,
            validDoctor.fecha_nacimiento,
            validDoctor.genero,
            validDoctor.telefono,
            validDoctor.email,
            validDoctor.direccion,
            validDoctor.especialidad_id,
            validDoctor.num_licencia,
            validDoctor.activo
        ]
    );
    return getById(id);
};

const deactivateById = async (id) => {
    const [resultSets] = await pool.execute('CALL sp_DesactivarDoctor(?)', [id]);
    const rows = normalizeResultSet(resultSets);
    return rows[0] || { message: 'Doctor desactivado exitosamente.' };
};

module.exports = {
    getAll,
    getById,
    create,
    update,
    deactivateById
};
