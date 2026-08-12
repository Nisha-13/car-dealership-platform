const Car = require('../models/Car');
const Category = require('../models/Category');
const Favorite = require('../models/Favorite');
const { getCachedData, setCachedData, clearCachePattern } = require('./redis.service');
const appEvents = require('../events/appEvents');
const eventTypes = require('../events/eventTypes');

class CarService {
  static async getAllCars(query = {}) {
    const cacheKey = `cars_list_${JSON.stringify(query)}`;
    const cached = await getCachedData(cacheKey);
    if (cached) return cached;

    const {
      brand,
      category,
      fuelType,
      transmission,
      minPrice,
      maxPrice,
      year,
      status,
      search,
      featured,
      sort = '-createdAt',
      page = 1,
      limit = 12
    } = query;

    const filter = {};

    if (brand) filter.brand = new RegExp(brand, 'i');
    if (fuelType) filter.fuelType = fuelType;
    if (transmission) filter.transmission = transmission;
    if (status) filter.status = status;
    if (featured !== undefined) filter.featured = featured === 'true';

    if (year) filter.year = Number(year);

    if (minPrice || maxPrice) {
      filter.price = {};
      if (minPrice) filter.price.$gte = Number(minPrice);
      if (maxPrice) filter.price.$lte = Number(maxPrice);
    }

    if (category) {
      if (category.match(/^[0-9a-fA-F]{24}$/)) {
        filter.category = category;
      } else {
        const catObj = await Category.findOne({ slug: category });
        if (catObj) filter.category = catObj._id;
      }
    }

    if (search) {
      filter.$or = [
        { title: new RegExp(search, 'i') },
        { brand: new RegExp(search, 'i') },
        { model: new RegExp(search, 'i') },
        { description: new RegExp(search, 'i') }
      ];
    }

    const skip = (Number(page) - 1) * Number(limit);
    const total = await Car.countDocuments(filter);

    const cars = await Car.find(filter)
      .populate('category', 'name slug')
      .sort(sort)
      .skip(skip)
      .limit(Number(limit));

    const result = {
      cars,
      pagination: {
        total,
        page: Number(page),
        pages: Math.ceil(total / Number(limit))
      }
    };

    await setCachedData(cacheKey, result, 300);
    return result;
  }

  static async getCarById(id) {
    const cacheKey = `car_detail_${id}`;
    const cached = await getCachedData(cacheKey);
    if (cached) return cached;

    const car = await Car.findById(id).populate('category', 'name slug description');
    if (!car) {
      const error = new Error('Vehicle not found.');
      error.statusCode = 404;
      throw error;
    }

    await setCachedData(cacheKey, car, 600);
    return car;
  }

  static async createCar(carData, files = []) {
    const imageUrls = files.map(file => `/uploads/cars/${file.filename}`);
    if (carData.images && Array.isArray(carData.images)) {
      imageUrls.push(...carData.images);
    }

    if (imageUrls.length === 0) {
      // Default fallback luxury image if none provided
      imageUrls.push('https://images.unsplash.com/photo-1617814076367-b759c7d7e738?auto=format&fit=crop&w=1200&q=80');
    }

    let parsedSpecs = {};
    if (typeof carData.specifications === 'string') {
      try { parsedSpecs = JSON.parse(carData.specifications); } catch(e){}
    } else if (carData.specifications) {
      parsedSpecs = carData.specifications;
    }

    let parsedFeatures = [];
    if (typeof carData.features === 'string') {
      try { parsedFeatures = JSON.parse(carData.features); } catch(e){
        parsedFeatures = carData.features.split(',').map(f => f.trim());
      }
    } else if (Array.isArray(carData.features)) {
      parsedFeatures = carData.features;
    }

    const car = await Car.create({
      title: carData.title,
      brand: carData.brand,
      model: carData.model,
      year: Number(carData.year),
      price: Number(carData.price),
      category: carData.category,
      mileage: Number(carData.mileage),
      fuelType: carData.fuelType,
      transmission: carData.transmission,
      engine: carData.engine || 'N/A',
      color: carData.color,
      description: carData.description,
      features: parsedFeatures,
      status: carData.status || 'Available',
      images: imageUrls,
      featured: carData.featured === 'true' || carData.featured === true,
      specifications: parsedSpecs
    });

    await clearCachePattern('cars_*');
    await clearCachePattern(`car_detail_${car._id}`);
    return car;
  }

  static async updateCar(id, carData, files = []) {
    const car = await Car.findById(id);
    if (!car) {
      const error = new Error('Vehicle not found.');
      error.statusCode = 404;
      throw error;
    }

    if (files.length > 0) {
      const newImages = files.map(file => `/uploads/cars/${file.filename}`);
      car.images = [...car.images, ...newImages];
    }

    if (carData.title) car.title = carData.title;
    if (carData.brand) car.brand = carData.brand;
    if (carData.model) car.model = carData.model;
    if (carData.year) car.year = Number(carData.year);
    if (carData.price) car.price = Number(carData.price);
    if (carData.category) car.category = carData.category;
    if (carData.mileage) car.mileage = Number(carData.mileage);
    if (carData.fuelType) car.fuelType = carData.fuelType;
    if (carData.transmission) car.transmission = carData.transmission;
    if (carData.engine) car.engine = carData.engine;
    if (carData.color) car.color = carData.color;
    if (carData.description) car.description = carData.description;
    if (carData.status) {
      const prevStatus = car.status;
      car.status = carData.status;
      if (prevStatus !== carData.status) {
        appEvents.emit(eventTypes.CAR_STATUS_CHANGED, { carId: car._id, title: car.title, newStatus: carData.status });
      }
    }
    if (carData.featured !== undefined) car.featured = carData.featured === 'true' || carData.featured === true;

    if (carData.features) {
      if (typeof carData.features === 'string') {
        try { car.features = JSON.parse(carData.features); } catch(e){
          car.features = carData.features.split(',').map(f => f.trim());
        }
      } else if (Array.isArray(carData.features)) {
        car.features = carData.features;
      }
    }

    if (carData.specifications) {
      if (typeof carData.specifications === 'string') {
        try { car.specifications = JSON.parse(carData.specifications); } catch(e){}
      } else {
        car.specifications = { ...car.specifications, ...carData.specifications };
      }
    }

    await car.save();
    await clearCachePattern('cars_*');
    await clearCachePattern(`car_detail_${id}`);
    return car;
  }

  static async deleteCar(id) {
    const car = await Car.findById(id);
    if (!car) {
      const error = new Error('Vehicle not found.');
      error.statusCode = 404;
      throw error;
    }
    await car.deleteOne();
    await clearCachePattern('cars_*');
    await clearCachePattern(`car_detail_${id}`);
    return true;
  }

  static async toggleFavorite(userId, carId) {
    const existing = await Favorite.findOne({ user: userId, car: carId });
    if (existing) {
      await existing.deleteOne();
      return { isFavorite: false };
    } else {
      await Favorite.create({ user: userId, car: carId });
      return { isFavorite: true };
    }
  }

  static async getUserFavorites(userId) {
    const favorites = await Favorite.find({ user: userId }).populate({
      path: 'car',
      populate: { path: 'category', select: 'name slug' }
    });
    return favorites.map(f => f.car).filter(Boolean);
  }
}

module.exports = CarService;
