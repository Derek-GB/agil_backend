/**
 * src/models/doctor.model.js
 * Validación de payload y campos compartidos para doctores.
 */

const createDoctorFields = [
    'nombre',
    'apellidos',
    'cedula',
    'fecha_nacimiento',
    'genero',
    'telefono',
    'email',
    'direccion',
    'fecha_ingreso',
    'especialidad_id',
    'num_licencia',
    'nombre_usuario',
    'password'
];

const updateDoctorFields = [
    'nombre',
    'apellidos',
    'cedula',
    'fecha_nacimiento',
    'genero',
    'telefono',
    'email',
    'direccion',
    'especialidad_id',
    'num_licencia',
    'activo'
];

const validateDoctorPayload = (payload, requiredFields = [], requireAllFields = false) => {
    if (!payload || typeof payload !== 'object') {
        const error = new Error('Payload de doctor inválido');
        error.statusCode = 400;
        throw error;
    }

    const missingFields = [];
    if (requireAllFields) {
        requiredFields.forEach((field) => {
            if (payload[field] === undefined || payload[field] === null || payload[field] === '') {
                missingFields.push(field);
            }
        });
    }

    if (missingFields.length > 0) {
        const error = new Error(`Faltan datos del doctor: ${missingFields.join(', ')}`);
        error.statusCode = 400;
        throw error;
    }

    return {
        nombre: payload.nombre,
        apellidos: payload.apellidos,
        cedula: payload.cedula,
        fecha_nacimiento: payload.fecha_nacimiento,
        genero: payload.genero,
        telefono: payload.telefono,
        email: payload.email,
        direccion: payload.direccion,
        fecha_ingreso: payload.fecha_ingreso,
        especialidad_id: payload.especialidad_id,
        num_licencia: payload.num_licencia,
        nombre_usuario: payload.nombre_usuario,
        password: payload.password,
        activo: payload.activo
    };
};

module.exports = {
    createDoctorFields,
    updateDoctorFields,
    validateDoctorPayload
};
