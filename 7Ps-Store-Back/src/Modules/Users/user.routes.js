
const router = require('express').Router();

const userController = require('./user.controller');
const validate = require('../../middlewares/errorHandler');
const authMiddleware = require('../../middlewares/authMiddleware');
const { registerSchema, updateSchema, loginSchema } = require('./user.validator');
const adminFilter = require('../../middlewares/adminMiddleware');
// User routes
router.get('/', userController.getAllUsers);
router.post('/', validate(registerSchema), userController.createUser);
router.post('/login', validate(loginSchema), userController.login);
router.post('/logout', authMiddleware, userController.logout);
router.patch('/promote/:id', authMiddleware, adminFilter, userController.promoteUserToAdmin);
router.get('/:id', userController.getUserById);
router.put('/:id', authMiddleware, validate(updateSchema), userController.updateUser);
router.delete('/:id', authMiddleware, userController.deleteUser);

module.exports = router;