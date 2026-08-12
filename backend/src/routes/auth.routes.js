const express = require('express');
const AuthController = require('../controllers/auth.controller');
const { registerValidation, loginValidation } = require('../validators/auth.validator');
const validate = require('../middleware/validate.middleware');
const { protect } = require('../middleware/auth.middleware');
const { authLimiter } = require('../middleware/rateLimiter.middleware');

const router = express.Router();

router.post('/register', authLimiter, registerValidation, validate, AuthController.register);
router.post('/login', authLimiter, loginValidation, validate, AuthController.login);
router.get('/me', protect, AuthController.getProfile);
router.put('/profile', protect, AuthController.updateProfile);

module.exports = router;
