const TestDriveService = require('../services/testDrive.service');
const ApiResponse = require('../utils/apiResponse');

class TestDriveController {
  static async bookTestDrive(req, res, next) {
    try {
      const testDrive = await TestDriveService.bookTestDrive(req.user._id, req.body);
      return ApiResponse.success(res, testDrive, 'Test drive booked successfully', 201);
    } catch (err) {
      next(err);
    }
  }

  static async getUserBookings(req, res, next) {
    try {
      const bookings = await TestDriveService.getUserBookings(req.user._id);
      return ApiResponse.success(res, bookings, 'User bookings retrieved');
    } catch (err) {
      next(err);
    }
  }

  static async getAllBookings(req, res, next) {
    try {
      const bookings = await TestDriveService.getAllBookings(req.query);
      return ApiResponse.success(res, bookings, 'All test drive bookings retrieved');
    } catch (err) {
      next(err);
    }
  }

  static async updateStatus(req, res, next) {
    try {
      const { status, dealerNotes } = req.body;
      const testDrive = await TestDriveService.updateStatus(req.params.id, status, dealerNotes, req.user._id);
      return ApiResponse.success(res, testDrive, `Booking status updated to ${status}`);
    } catch (err) {
      next(err);
    }
  }

  static async cancelBooking(req, res, next) {
    try {
      const testDrive = await TestDriveService.cancelBooking(req.params.id, req.user._id);
      return ApiResponse.success(res, testDrive, 'Booking cancelled successfully');
    } catch (err) {
      next(err);
    }
  }
}

module.exports = TestDriveController;
