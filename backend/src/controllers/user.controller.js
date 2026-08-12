const User = require('../models/User');
const ActivityLog = require('../models/ActivityLog');
const ApiResponse = require('../utils/apiResponse');

class UserController {
  static async getAllCustomers(req, res, next) {
    try {
      const customers = await User.find({ role: 'customer' }).select('-password').sort('-createdAt');
      return ApiResponse.success(res, customers, 'Customers retrieved');
    } catch (err) {
      next(err);
    }
  }

  static async getActivityLogs(req, res, next) {
    try {
      const logs = await ActivityLog.find().populate('user', 'name email role').sort('-createdAt').limit(100);
      return ApiResponse.success(res, logs, 'Activity logs retrieved');
    } catch (err) {
      next(err);
    }
  }
}

module.exports = UserController;
