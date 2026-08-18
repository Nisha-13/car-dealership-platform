const express = require('express');
const CarController = require('../controllers/car.controller');
const { protect, authorize } = require('../middleware/auth.middleware');
const upload = require('../config/multer');
const { carValidation } = require('../validators/car.validator');
const validate = require('../middleware/validate.middleware');

const router = express.Router();

router.get('/', CarController.getAllCars);
router.get('/price-range', CarController.getPriceRange);   // must be before /:id
router.get('/favorites', protect, CarController.getUserFavorites);
router.get('/:id', CarController.getCarById);

router.post('/', protect, authorize('admin'), upload.array('images', 8), carValidation, validate, CarController.createCar);
router.put('/:id', protect, authorize('admin'), upload.array('images', 8), CarController.updateCar);
router.delete('/:id', protect, authorize('admin'), CarController.deleteCar);

router.post('/:id/favorite', protect, CarController.toggleFavorite);

module.exports = router;
