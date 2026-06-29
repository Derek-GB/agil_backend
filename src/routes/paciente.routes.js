const express = require('express');
const router = express.Router();
const pacienteController = require('../controllers/paciente.controller');
const { protect } = require('../middlewares/auth.middleware');

router.get('/all', pacienteController.getPacientes);
router.get('/:id', pacienteController.getPacienteById);
router.post('/', protect, pacienteController.createPaciente);
router.put('/:id', protect, pacienteController.updatePaciente);
router.delete('/:id', protect, pacienteController.deletePaciente);

module.exports = router;
