const doctorService = require('../services/doctor.service');

const getDoctores = async (req, res, next) => {
    try {
        const doctores = await doctorService.getAll();
        return res.status(200).json({ status: 'success', data: doctores });
    } catch (error) {
        if (error.statusCode) res.status(error.statusCode);
        next(error);
    }
};

const getDoctorById = async (req, res, next) => {
    try {
        const { id } = req.params;
        const doctor = await doctorService.getById(id);
        if (!doctor) {
            return res.status(404).json({ status: 'error', message: 'Doctor no encontrado' });
        }
        return res.status(200).json({ status: 'success', data: doctor });
    } catch (error) {
        if (error.statusCode) res.status(error.statusCode);
        next(error);
    }
};

const createDoctor = async (req, res, next) => {
    try {
        const doctor = req.body;
        const created = await doctorService.create(doctor);
        return res.status(201).json({ status: 'success', data: created });
    } catch (error) {
        if (error.statusCode) res.status(error.statusCode);
        next(error);
    }
};

const updateDoctor = async (req, res, next) => {
    try {
        const { id } = req.params;
        const updates = req.body;
        const updated = await doctorService.update(id, updates);
        return res.status(200).json({ status: 'success', data: updated });
    } catch (error) {
        if (error.statusCode) res.status(error.statusCode);
        next(error);
    }
};

const deactivateDoctor = async (req, res, next) => {
    try {
        const { id } = req.params;
        const result = await doctorService.deactivateById(id);
        return res.status(200).json({ status: 'success', data: result });
    } catch (error) {
        if (error.statusCode) res.status(error.statusCode);
        next(error);
    }
};

module.exports = {
    getDoctores,
    getDoctorById,
    createDoctor,
    updateDoctor,
    deactivateDoctor
};
