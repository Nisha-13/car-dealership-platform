const CarService = require('../services/car.service');
const ApiResponse = require('../utils/apiResponse');

class CarController {
  static async getAllCars(req, res, next) {
    try {
      const data = await CarService.getAllCars(req.query);
      return ApiResponse.success(res, data, 'Cars retrieved');
    } catch (err) {
      next(err);
    }
  }

  static async getCarById(req, res, next) {
    try {
      const car = await CarService.getCarById(req.params.id);
      return ApiResponse.success(res, car, 'Car detail retrieved');
    } catch (err) {
      next(err);
    }
  }

  static async createCar(req, res, next) {
    try {
      const car = await CarService.createCar(req.body, req.files || []);
      return ApiResponse.success(res, car, 'Car created successfully', 201);
    } catch (err) {
      next(err);
    }
  }

  static async updateCar(req, res, next) {
    try {
      const car = await CarService.updateCar(req.params.id, req.body, req.files || []);
      return ApiResponse.success(res, car, 'Car updated successfully');
    } catch (err) {
      next(err);
    }
  }

  static async deleteCar(req, res, next) {
    try {
      await CarService.deleteCar(req.params.id);
      return ApiResponse.success(res, null, 'Car deleted successfully');
    } catch (err) {
      next(err);
    }
  }

  static async toggleFavorite(req, res, next) {
    try {
      const result = await CarService.toggleFavorite(req.user._id, req.params.id);
      return ApiResponse.success(res, result, result.isFavorite ? 'Car added to favorites' : 'Car removed from favorites');
    } catch (err) {
      next(err);
    }
  }

  static async getUserFavorites(req, res, next) {
    try {
      const favorites = await CarService.getUserFavorites(req.user._id);
      return ApiResponse.success(res, favorites, 'User favorites retrieved');
    } catch (err) {
      next(err);
    }
  }
  static async getPriceRange(req, res, next) {
    try {
      const range = await CarService.getPriceRange();
      return ApiResponse.success(res, range, 'Price range retrieved');
    } catch (err) {
      next(err);
    }
  }
}

module.exports = CarController;
