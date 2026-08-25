const express = require('express');
const router = express.Router();
const authenticateToken = require('../middleware/authMiddleware');
const authorizeRoles = require('../middleware/roleMiddleware');
const { applyForLoan, getMyLoans, getPendingLoans, decideLoan } = require('../controllers/loanController');

router.use(authenticateToken); // every loan route requires login

// Customer routes
router.post('/', applyForLoan);
router.get('/my', getMyLoans);

// Employee/admin-only routes
router.get('/pending', authorizeRoles('employee', 'admin'), getPendingLoans);
router.patch('/:loanId/decision', authorizeRoles('employee', 'admin'), decideLoan);

module.exports = router;
