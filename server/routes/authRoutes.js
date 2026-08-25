const express = require('express')
const router = express.Router();
const { registerController, login } = require('../controllers/authController');

router.post('/register', registerController);
router.post('/login', login);

module.exports = router;