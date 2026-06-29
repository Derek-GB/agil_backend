const express = require('express');
const router = express.Router();
const doctorController = require('../controllers/doctor.controller');
const { protect } = require('../middlewares/auth.middleware');

router.get('/all', doctorController.getDoctores);
router.get('/:id', doctorController.getDoctorById);
router.post('/', protect, doctorController.createDoctor);
router.put('/:id', protect, doctorController.updateDoctor);
router.patch('/:id/desactivar', protect, doctorController.deactivateDoctor);

module.exports = router;
