
const router = require('express').Router();

const userController = require('./user.controller');
const validate = require('../../middlewares/errorHandler');
const authMiddleware = require('../../middlewares/authMiddleware');
const { registerSchema, loginSchema } = require('./user.validator');
const adminFilter = require('../../middlewares/adminMiddleware');
// User routes
router.get('/', userController.getAllUsers);
router.get('/pending', authMiddleware, adminFilter, userController.GetAllPindingUsers);
router.post('/', authMiddleware, adminFilter, validate(loginSchema), userController.createUser);
router.post('/login', userController.login);
router.get('/:id', authMiddleware, userController.getUserById);
router.put('/:id', authMiddleware, adminFilter, validate(registerSchema), userController.updateUser);
router.delete('/:id', authMiddleware, adminFilter, userController.deleteUser);

module.exports = router;

