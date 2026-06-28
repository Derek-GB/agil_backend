const express = require('express');
const router = express.Router();
const usersController = require('../controllers/users.controller');
const { protect } = require('../middlewares/auth.middleware');

router.get('/', usersController.getUsers);
router.get('/:id', usersController.getUserById);

router.post('/', protect, usersController.createUser);
router.put('/:id', protect, usersController.updateUser);
router.delete('/:id', protect, usersController.deleteUser);

module.exports = router;
