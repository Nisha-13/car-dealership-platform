const StatsService = require('../services/stats.service');
const ApiResponse = require('../utils/apiResponse');

class StatsController {
  static async getAdminStats(req, res, next) {
    try {
      const stats = await StatsService.getAdminDashboardStats();
      return ApiResponse.success(res, stats, 'Admin stats retrieved');
    } catch (err) {
      next(err);
    }
  }

  static async getCustomerStats(req, res, next) {
    try {
      const stats = await StatsService.getCustomerDashboardStats(req.user._id);
      return ApiResponse.success(res, stats, 'Customer stats retrieved');
    } catch (err) {
      next(err);
    }
  }
}

module.exports = StatsController;
