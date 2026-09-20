const express = require('express')
const router = express.Router();
const { register, login } = require('../controllers/authController');
const authenticateToken = require('../middleware/authMiddleware')
const { authLimiter } = require('../middleware/rateLimiter');

const { setupTwoFactor, verifyTwoFactorSetup, disableTwoFactorHandler, verifyTwoFactorLogin } = require('../controllers/twoFactorController')

router.post('/register', authLimiter, register);
router.post('/login', authLimiter, login);
router.post('/2fa/login-verify', authLimiter, verifyTwoFactorLogin)

router.post('/2fa/setup', authenticateToken, setupTwoFactor)
router.post('/2fa/verify', authenticateToken, verifyTwoFactorSetup)
router.post('/2fa/disable', authenticateToken, disableTwoFactorHandler)

module.exports = router;