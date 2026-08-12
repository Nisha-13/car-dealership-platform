const TestDrive = require('../models/TestDrive');
const Car = require('../models/Car');
const User = require('../models/User');
const appEvents = require('../events/appEvents');
const eventTypes = require('../events/eventTypes');

class TestDriveService {
  static async bookTestDrive(userId, bookingData) {
    const car = await Car.findById(bookingData.carId);
    if (!car) {
      const error = new Error('Selected vehicle not found.');
      error.statusCode = 404;
      throw error;
    }

    if (car.status === 'Sold') {
      const error = new Error('This vehicle has already been sold.');
      error.statusCode = 400;
      throw error;
    }

    // Check for existing pending or confirmed test drive for same car & user
    const existingBooking = await TestDrive.findOne({
      user: userId,
      car: bookingData.carId,
      status: { $in: ['Pending', 'Confirmed'] }
    });

    if (existingBooking) {
      const error = new Error('You already have an active test drive booking for this vehicle.');
      error.statusCode = 400;
      throw error;
    }

    const preferredDate = new Date(bookingData.preferredDate);
    if (isNaN(preferredDate.getTime()) || preferredDate < new Date()) {
      const error = new Error('Preferred date must be a valid future date.');
      error.statusCode = 400;
      throw error;
    }

    const testDrive = await TestDrive.create({
      user: userId,
      car: bookingData.carId,
      preferredDate,
      preferredTime: bookingData.preferredTime,
      notes: bookingData.notes || ''
    });

    const user = await User.findById(userId);

    // Emit Domain Event
    appEvents.emit(eventTypes.TEST_DRIVE_BOOKED, {
      testDriveId: testDrive._id,
      userId,
      email: user.email,
      carId: car._id,
      carTitle: car.title,
      preferredDate: testDrive.preferredDate,
      preferredTime: testDrive.preferredTime
    });

    return await TestDrive.findById(testDrive._id)
      .populate('car', 'title brand model price images status category')
      .populate('user', 'name email phone');
  }

  static async getUserBookings(userId) {
    return await TestDrive.find({ user: userId })
      .populate({
        path: 'car',
        populate: { path: 'category', select: 'name slug' }
      })
      .sort('-createdAt');
  }

  static async getAllBookings(query = {}) {
    const filter = {};
    if (query.status) filter.status = query.status;

    return await TestDrive.find(filter)
      .populate({
        path: 'car',
        populate: { path: 'category', select: 'name slug' }
      })
      .populate('user', 'name email phone avatar')
      .sort('-createdAt');
  }

  static async updateStatus(testDriveId, status, dealerNotes = '', updatedByUserId = null) {
    const testDrive = await TestDrive.findById(testDriveId).populate('car', 'title brand model');
    if (!testDrive) {
      const error = new Error('Test drive booking not found.');
      error.statusCode = 404;
      throw error;
    }

    const oldStatus = testDrive.status;
    testDrive.status = status;
    if (dealerNotes) testDrive.dealerNotes = dealerNotes;

    await testDrive.save();

    if (oldStatus !== status) {
      appEvents.emit(eventTypes.TEST_DRIVE_STATUS_CHANGED, {
        testDriveId: testDrive._id,
        userId: testDrive.user,
        carTitle: testDrive.car ? testDrive.car.title : 'Vehicle',
        status,
        updatedBy: updatedByUserId
      });
    }

    return await TestDrive.findById(testDrive._id)
      .populate('car', 'title brand model price images status category')
      .populate('user', 'name email phone');
  }

  static async cancelBooking(testDriveId, userId) {
    const testDrive = await TestDrive.findOne({ _id: testDriveId, user: userId });
    if (!testDrive) {
      const error = new Error('Test drive booking not found.');
      error.statusCode = 404;
      throw error;
    }

    if (['Completed', 'Cancelled'].includes(testDrive.status)) {
      const error = new Error(`Cannot cancel a booking that is already ${testDrive.status}.`);
      error.statusCode = 400;
      throw error;
    }

    testDrive.status = 'Cancelled';
    await testDrive.save();

    appEvents.emit(eventTypes.TEST_DRIVE_STATUS_CHANGED, {
      testDriveId: testDrive._id,
      userId: testDrive.user,
      carTitle: 'Vehicle',
      status: 'Cancelled',
      updatedBy: userId
    });

    return testDrive;
  }
}

module.exports = TestDriveService;
