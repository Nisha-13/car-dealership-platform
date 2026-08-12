const Notification = require('../models/Notification');

class NotificationService {
  static async getUserNotifications(userId) {
    return await Notification.find({ recipient: userId }).sort('-createdAt').limit(50);
  }

  static async getUnreadCount(userId) {
    return await Notification.countDocuments({ recipient: userId, read: false });
  }

  static async markAsRead(notificationId, userId) {
    const notif = await Notification.findOne({ _id: notificationId, recipient: userId });
    if (notif) {
      notif.read = true;
      await notif.save();
    }
    return notif;
  }

  static async markAllAsRead(userId) {
    await Notification.updateMany({ recipient: userId, read: false }, { $set: { read: true } });
    return true;
  }
}

module.exports = NotificationService;
