const NotificationService = require('../services/notification.service');
const ApiResponse = require('../utils/apiResponse');

class NotificationController {
  static async getUserNotifications(req, res, next) {
    try {
      const notifications = await NotificationService.getUserNotifications(req.user._id);
      const unreadCount = await NotificationService.getUnreadCount(req.user._id);
      return ApiResponse.success(res, { notifications, unreadCount }, 'Notifications retrieved');
    } catch (err) {
      next(err);
    }
  }

  static async markAsRead(req, res, next) {
    try {
      await NotificationService.markAsRead(req.params.id, req.user._id);
      return ApiResponse.success(res, null, 'Notification marked as read');
    } catch (err) {
      next(err);
    }
  }

  static async markAllAsRead(req, res, next) {
    try {
      await NotificationService.markAllAsRead(req.user._id);
      return ApiResponse.success(res, null, 'All notifications marked as read');
    } catch (err) {
      next(err);
    }
  }
}

module.exports = NotificationController;
