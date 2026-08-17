const { body } = require('express-validator');

const createReservationValidation = [
  body('carId')
    .notEmpty()
    .withMessage('Vehicle ID is required')
    .isMongoId()
    .withMessage('Invalid Vehicle ID format'),
  body('startDate')
    .notEmpty()
    .withMessage('Reservation start / pickup date is required')
    .isISO8601()
    .withMessage('Start date must be a valid date format'),
  body('endDate')
    .notEmpty()
    .withMessage('Reservation end / return date is required')
    .isISO8601()
    .withMessage('End date must be a valid date format'),
  body('contactPhone')
    .notEmpty()
    .withMessage('Contact phone is required')
    .isString()
    .trim(),
  body('driverLicense')
    .notEmpty()
    .withMessage("Driver's license number is required")
    .isString()
    .trim()
];

const updateReservationStatusValidation = [
  body('status')
    .notEmpty()
    .withMessage('Status is required')
    .isIn(['Pending', 'Confirmed', 'Cancelled', 'Completed'])
    .withMessage('Status must be one of: Pending, Confirmed, Cancelled, Completed'),
  body('adminNotes')
    .optional()
    .isString()
    .trim()
];

module.exports = {
  createReservationValidation,
  updateReservationStatusValidation
};
