/**
 * src/models/paciente.model.js
 * Patient payload validation and shared field definitions.
 */

const pacienteFields = [
    'nombre',
    'apellidos',
    'cedula',
    'fecha_nacimiento',
    'genero',
    'telefono',
    'email',
    'direccion',
    'tipo_sangre',
    'observaciones'
];

const validatePacientePayload = (payload, requireAllFields = false) => {
    if (!payload || typeof payload !== 'object') {
        const error = new Error('Payload de paciente inválido');
        error.statusCode = 400;
        throw error;
    }

    const missingFields = [];
    if (requireAllFields) {
        pacienteFields.forEach((field) => {
            if (payload[field] === undefined || payload[field] === null || payload[field] === '') {
                missingFields.push(field);
            }
        });
    }

    if (missingFields.length > 0) {
        const error = new Error(`Faltan datos del paciente: ${missingFields.join(', ')}`);
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
        tipo_sangre: payload.tipo_sangre,
        observaciones: payload.observaciones
    };
};

module.exports = {
    pacienteFields,
    validatePacientePayload
};
