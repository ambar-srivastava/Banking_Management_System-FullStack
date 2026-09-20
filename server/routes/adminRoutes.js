const express = require('express');
const router = express.Router();
const authenticateToken = require('../middleware/authMiddleware');
const authorizeRoles = require('../middleware/roleMiddleware');
const { createStaffUser, getAllUsers, updateUserRole } = require('../controllers/adminController');

router.use(authenticateToken);

router.get('/users', authorizeRoles('employee', 'admin'), getAllUsers);
router.post('/users', authorizeRoles('admin'), createStaffUser);
router.patch('/users/:userId/role', authorizeRoles('admin'), updateUserRole);

module.exports = router;