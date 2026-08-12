const { body } = require('express-validator');

const testDriveValidation = [
  body('carId').notEmpty().withMessage('Vehicle ID is required'),
  body('preferredDate').notEmpty().withMessage('Preferred date is required'),
  body('preferredTime').notEmpty().withMessage('Preferred time slot is required')
];

module.exports = { testDriveValidation };
