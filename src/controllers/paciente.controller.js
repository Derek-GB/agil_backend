const pacienteService = require('../services/paciente.service');

const getPacientes = async (req, res, next) => {
  try {
    const pacientes = await pacienteService.getAll();
    return res.status(200).json({ status: 'success', data: pacientes });
  } catch (error) {
    if (error.statusCode) res.status(error.statusCode);
    next(error);
  }
};

const getPacienteById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const paciente = await pacienteService.getById(id);

    if (!paciente) {
      return res.status(404).json({ status: 'error', message: 'Paciente no encontrado' });
    }

    return res.status(200).json({ status: 'success', data: paciente });
  } catch (error) {
    if (error.statusCode) res.status(error.statusCode);
    next(error);
  }
};

const createPaciente = async (req, res, next) => {
  try {
    const paciente = req.body;
    const created = await pacienteService.create(paciente);
    return res.status(201).json({ status: 'success', data: created });
  } catch (error) {
    if (error.statusCode) res.status(error.statusCode);
    next(error);
  }
};

const updatePaciente = async (req, res, next) => {
  try {
    const { id } = req.params;
    const updates = req.body;
    const updated = await pacienteService.update(id, updates);

    return res.status(200).json({ status: 'success', data: updated });
  } catch (error) {
    if (error.statusCode) res.status(error.statusCode);
    next(error);
  }
};

const deletePaciente = async (req, res, next) => {
  try {
    const { id } = req.params;
    const result = await pacienteService.deleteById(id);
    return res.status(200).json({ status: 'success', data: result });
  } catch (error) {
    if (error.statusCode) res.status(error.statusCode);
    next(error);
  }
};

module.exports = {
  getPacientes,
  getPacienteById,
  createPaciente,
  updatePaciente,
  deletePaciente
};
