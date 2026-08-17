const ReservationService = require('../services/reservation.service');
const ApiResponse = require('../utils/apiResponse');

class ReservationController {
  // ─────────────────────────────────────────────────────────────────────────
  // CUSTOMER METHODS
  // ─────────────────────────────────────────────────────────────────────────
  static async createReservation(req, res, next) {
    try {
      const reservation = await ReservationService.createReservation(req.user._id, req.body);
      return ApiResponse.success(res, reservation, 'Vehicle reserved successfully! Our team will contact you shortly.', 201);
    } catch (err) {
      next(err);
    }
  }

  static async getMyReservations(req, res, next) {
    try {
      const reservations = await ReservationService.getUserReservations(req.user._id);
      return ApiResponse.success(res, reservations, 'User reservations retrieved');
    } catch (err) {
      next(err);
    }
  }

  static async getReservationById(req, res, next) {
    try {
      const isAdmin = req.user.role === 'admin';
      const reservation = await ReservationService.getReservationById(req.params.id, req.user._id, isAdmin);
      return ApiResponse.success(res, reservation, 'Reservation retrieved');
    } catch (err) {
      next(err);
    }
  }

  static async cancelMyReservation(req, res, next) {
    try {
      const { cancellationReason } = req.body;
      const reservation = await ReservationService.cancelReservation(req.params.id, req.user._id, cancellationReason);
      return ApiResponse.success(res, reservation, 'Reservation cancelled successfully. Vehicle restored to inventory.');
    } catch (err) {
      next(err);
    }
  }

  // ─────────────────────────────────────────────────────────────────────────
  // ADMIN METHODS
  // ─────────────────────────────────────────────────────────────────────────
  static async getAllReservations(req, res, next) {
    try {
      const reservations = await ReservationService.getAllReservations(req.query);
      return ApiResponse.success(res, reservations, 'All reservations retrieved');
    } catch (err) {
      next(err);
    }
  }

  static async updateStatus(req, res, next) {
    try {
      const { status, adminNotes } = req.body;
      const reservation = await ReservationService.updateStatus(req.params.id, status, adminNotes, req.user._id);
      return ApiResponse.success(res, reservation, `Reservation status updated to ${status}`);
    } catch (err) {
      next(err);
    }
  }

  static async releaseCar(req, res, next) {
    try {
      const reservation = await ReservationService.releaseCar(req.params.id, req.user._id);
      return ApiResponse.success(res, reservation, 'Vehicle successfully released back to showroom inventory as Available.');
    } catch (err) {
      next(err);
    }
  }
}

module.exports = ReservationController;
