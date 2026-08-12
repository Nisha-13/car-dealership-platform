const express = require('express');
const TestDriveController = require('../controllers/testDrive.controller');
const { protect, authorize } = require('../middleware/auth.middleware');
const { testDriveValidation } = require('../validators/testDrive.validator');
const validate = require('../middleware/validate.middleware');

const router = express.Router();

router.post('/', protect, testDriveValidation, validate, TestDriveController.bookTestDrive);
router.get('/my-bookings', protect, TestDriveController.getUserBookings);
router.put('/:id/cancel', protect, TestDriveController.cancelBooking);

// Admin Routes
router.get('/admin/all', protect, authorize('admin'), TestDriveController.getAllBookings);
router.put('/admin/:id/status', protect, authorize('admin'), TestDriveController.updateStatus);

module.exports = router;
