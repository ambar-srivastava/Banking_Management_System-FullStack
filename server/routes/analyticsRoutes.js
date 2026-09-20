const express = require('express')
const router = express.Router();
const authenticateToken = require('../middleware/authMiddleware')
const { getAnalytics, getAccountBalanceTrend } = require('../controllers/analyticsController')

router.use(authenticateToken);
router.get('/', getAnalytics);
router.get('/accounts/:accountId/balance-trend', getAccountBalanceTrend)

module.exports = router;