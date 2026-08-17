const express = require('express');
const ReservationController = require('../controllers/reservation.controller');
const { protect, authorize } = require('../middleware/auth.middleware');
const {
  createReservationValidation,
  updateReservationStatusValidation
} = require('../validators/reservation.validator');
const validate = require('../middleware/validate.middleware');

const router = express.Router();

// ────────────────────────────────────────────────────────────────────────────
// CUSTOMER ENDPOINTS
// ───────────────────────────────────────────────────────────────────────────
router.post(
  '/',
  protect,
  createReservationValidation,
  validate,
  ReservationController.createReservation
);

router.get(
  '/my-reservations',
  protect,
  ReservationController.getMyReservations
);

router.put(
  '/:id/cancel',
  protect,
  ReservationController.cancelMyReservation
);

// ────────────────────────────────────────────────────────────────────────────
// ADMIN MANAGEMENT ENDPOINTS
// ────────────────────────────────────────────────────────────────────────────
router.get(
  '/admin/all',
  protect,
  authorize('admin'),
  ReservationController.getAllReservations
);

router.put(
  '/admin/:id/status',
  protect,
  authorize('admin'),
  updateReservationStatusValidation,
  validate,
  ReservationController.updateStatus
);

router.put(
  '/admin/:id/release-car',
  protect,
  authorize('admin'),
  ReservationController.releaseCar
);

// Get single reservation (admin or owner)
router.get(
  '/:id',
  protect,
  ReservationController.getReservationById
);

module.exports = router;
