const express = require('express');
const UserController = require('../controllers/user.controller');
const { protect, authorize } = require('../middleware/auth.middleware');

const router = express.Router();

router.get('/customers', protect, authorize('admin'), UserController.getAllCustomers);
router.get('/activity-logs', protect, authorize('admin'), UserController.getActivityLogs);

module.exports = router;
