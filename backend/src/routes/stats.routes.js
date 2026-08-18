const express = require('express');
const StatsController = require('../controllers/stats.controller');
const { protect, authorize } = require('../middleware/auth.middleware');

const router = express.Router();

router.get('/public', StatsController.getPublicStats);                          // no auth
router.get('/admin', protect, authorize('admin'), StatsController.getAdminStats);
router.get('/customer', protect, StatsController.getCustomerStats);

module.exports = router;
