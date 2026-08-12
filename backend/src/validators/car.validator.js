const { body } = require('express-validator');

const carValidation = [
  body('title').notEmpty().withMessage('Car title is required').trim(),
  body('brand').notEmpty().withMessage('Brand is required').trim(),
  body('model').notEmpty().withMessage('Model is required').trim(),
  body('year').isNumeric().withMessage('Year must be a number'),
  body('price').isNumeric().withMessage('Price must be a number'),
  body('category').notEmpty().withMessage('Category ID is required'),
  body('mileage').isNumeric().withMessage('Mileage must be a number'),
  body('fuelType').isIn(['Petrol', 'Diesel', 'Electric', 'Hybrid']).withMessage('Invalid fuel type'),
  body('transmission').isIn(['Automatic', 'Manual']).withMessage('Invalid transmission type'),
  body('color').notEmpty().withMessage('Color is required'),
  body('description').notEmpty().withMessage('Description is required')
];

module.exports = { carValidation };
