const usersService = require('../services/users.service');

const getUsers = async (req, res, next) => {
	try {
		const filters = {
			role: req.query.role,
			email: req.query.email
		};
		const users = await usersService.getAll(filters);
		return res.status(200).json({ status: 'success', data: users });
	} catch (error) {
		if (error.statusCode) res.status(error.statusCode);
		next(error);
	}
};

const getUserById = async (req, res, next) => {
	try {
		const { id } = req.params;
		const user = await usersService.getById(id);
		if (!user) return res.status(404).json({ status: 'error', message: 'User not found' });
		return res.status(200).json({ status: 'success', data: user });
	} catch (error) {
		if (error.statusCode) res.status(error.statusCode);
		next(error);
	}
};

const createUser = async (req, res, next) => {
	try {
		const user = req.body;
		const created = await usersService.create(user);
		return res.status(201).json({ status: 'success', data: created });
	} catch (error) {
		if (error.statusCode) res.status(error.statusCode);
		next(error);
	}
};

const updateUser = async (req, res, next) => {
	try {
		const { id } = req.params;
		const updates = req.body;
		const updated = await usersService.update(id, updates);
		return res.status(200).json({ status: 'success', data: updated });
	} catch (error) {
		if (error.statusCode) res.status(error.statusCode);
		next(error);
	}
};

const deleteUser = async (req, res, next) => {
	try {
		const { id } = req.params;
		const result = await usersService.deleteById(id);
		return res.status(200).json({ status: 'success', data: result });
	} catch (error) {
		if (error.statusCode) res.status(error.statusCode);
		next(error);
	}
};

module.exports = {
	getUsers,
	getUserById,
	createUser,
	updateUser,
	deleteUser
};
