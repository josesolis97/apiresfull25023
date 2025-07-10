// ===========================================
// 11. ROUTES/AUTH_ROUTES.JS
// ===========================================

const express = require('express');
const router = express.Router();
const authController = require('../controllers/auth_controller');
const { authenticate } = require('../middleware/auth_middleware');
const { validate } = require('../middleware/validation_middleware');
const { registerSchema, loginSchema } = require('../validators/auth_validator');

router.post('/login', validate(loginSchema), authController.login);
router.post('/register', validate(registerSchema), authController.register);
router.get('/profile', authenticate, authController.profile);

module.exports = router;