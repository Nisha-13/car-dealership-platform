const { body } = require('express-validator');

const inquiryValidation = [
  body('carId').notEmpty().withMessage('Vehicle ID is required'),
  body('name').notEmpty().withMessage('Name is required').trim(),
  body('email').isEmail().withMessage('Valid email is required').normalizeEmail(),
  body('phone').notEmpty().withMessage('Phone number is required').trim(),
  body('message').notEmpty().withMessage('Inquiry message is required')
];

module.exports = { inquiryValidation };
