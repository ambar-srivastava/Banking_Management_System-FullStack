const express = require('express');
const router = express.Router();
const authenticateToken = require('../middleware/authMiddleware');
const { getDashboard } = require('../controllers/dashboardController');

router.use(authenticateToken);
router.get('/', getDashboard);

module.exports = router;