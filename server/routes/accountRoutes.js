const express = require('express');
const router = express.Router();
const authenticateToken = require('../middleware/authMiddleware');
const { openAccount, getMyAccount, transfer, getHistory, downloadStatement } = require('../controllers/accountController');

// Every route in this file requires a valid token
router.use(authenticateToken);

router.post('/', openAccount);
router.get('/', getMyAccount);
router.post('/transfer', transfer);
router.get('/:accountId/transactions', getHistory);
router.get('/:accountId/statement', downloadStatement);

module.exports = router;