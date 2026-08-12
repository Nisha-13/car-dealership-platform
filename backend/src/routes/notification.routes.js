const express = require('express');
const NotificationController = require('../controllers/notification.controller');
const { protect } = require('../middleware/auth.middleware');

const router = express.Router();

router.get('/', protect, NotificationController.getUserNotifications);
router.put('/:id/read', protect, NotificationController.markAsRead);
router.put('/mark-all-read', protect, NotificationController.markAllAsRead);

module.exports = router;
