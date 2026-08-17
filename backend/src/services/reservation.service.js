const Reservation = require('../models/Reservation');
const Car = require('../models/Car');
const Category = require('../models/Category');
const User = require('../models/User');
const { clearCachePattern } = require('./redis.service');
const appEvents = require('../events/appEvents');
const eventTypes = require('../events/eventTypes');
const { getIO } = require('../sockets/socketManager');

class ReservationService {
  // ─────────────────────────────────────────────────────────────────────────
  // CREATE DIRECT RESERVATION
  // Atomically locks vehicle and creates reservation record
  // ─────────────────────────────────────────────────────────────────────────
  static async createReservation(userId, reservationData) {
    const {
      carId,
      startDate,
      endDate,
      contactPhone,
      driverLicense,
      pickupLocation,
      customerNotes
    } = reservationData;

    // 1. Verify User
    const user = await User.findById(userId);
    if (!user) {
      const error = new Error('User not found.');
      error.statusCode = 404;
      throw error;
    }

    // 2. Verify Car existence and status
    const car = await Car.findById(carId);
    if (!car) {
      const error = new Error('Selected vehicle not found.');
      error.statusCode = 404;
      throw error;
    }

    if (car.status === 'Sold') {
      const error = new Error('This vehicle has already been sold and is no longer available.');
      error.statusCode = 400;
      throw error;
    }

    if (car.status === 'Reserved') {
      const error = new Error('This vehicle is currently reserved by another client.');
      error.statusCode = 409;
      throw error;
    }

    // 3. Validate reservation date range
    const start = new Date(startDate);
    const end = new Date(endDate);
    const now = new Date();
    now.setHours(0, 0, 0, 0);

    if (isNaN(start.getTime()) || isNaN(end.getTime())) {
      const error = new Error('Valid reservation start and end dates are required.');
      error.statusCode = 400;
      throw error;
    }

    const startDay = new Date(start);
    startDay.setHours(0, 0, 0, 0);
    if (startDay < now) {
      const error = new Error('Reservation start date cannot be in the past.');
      error.statusCode = 400;
      throw error;
    }

    if (end < start) {
      const error = new Error('Reservation end date must be on or after the start date.');
      error.statusCode = 400;
      throw error;
    }

    if (!contactPhone || !contactPhone.trim()) {
      const error = new Error('Contact phone number is required.');
      error.statusCode = 400;
      throw error;
    }

    if (!driverLicense || !driverLicense.trim()) {
      const error = new Error("Driver's license number is required for VIP vehicle hold.");
      error.statusCode = 400;
      throw error;
    }

    const totalDays = Math.max(1, Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24)) + 1);

    // 4. Atomic Concurrency Lock: only one client can lock this car
    const lockedCar = await Car.findOneAndUpdate(
      { _id: carId, status: 'Available' },
      { status: 'Reserved' },
      { new: true }
    );

    if (!lockedCar) {
      const error = new Error('This vehicle was just reserved by another customer. Please select another vehicle.');
      error.statusCode = 409;
      throw error;
    }

    // 5. Create Reservation in DB
    let reservation;
    try {
      reservation = await Reservation.create({
        user: userId,
        car: carId,
        startDate: start,
        endDate: end,
        totalDays,
        totalPrice: car.price || 0,
        status: 'Pending',
        contactPhone: contactPhone.trim(),
        driverLicense: driverLicense.trim(),
        pickupLocation: pickupLocation || 'AutoLuxe VIP Flagship Showroom',
        customerNotes: customerNotes || ''
      });
    } catch (dbErr) {
      // Rollback car lock if creation fails
      await Car.findByIdAndUpdate(carId, { status: 'Available' });
      await clearCachePattern('cars_*');
      await clearCachePattern(`car_detail_${carId}`);
      throw dbErr;
    }

    // 6. Invalidate caches & emit domain events
    await clearCachePattern('cars_*');
    await clearCachePattern(`car_detail_${carId}`);

    appEvents.emit(eventTypes.CAR_STATUS_CHANGED, {
      carId: car._id,
      title: car.title,
      newStatus: 'Reserved'
    });

    appEvents.emit(eventTypes.RESERVATION_CREATED, {
      reservationId: reservation._id,
      userId,
      email: user.email,
      name: user.name,
      carId: car._id,
      carTitle: car.title,
      startDate: reservation.startDate,
      endDate: reservation.endDate,
      totalDays
    });

    const io = getIO();
    if (io) {
      io.emit('car_status_changed', { carId: car._id, status: 'Reserved' });
      io.to('admin').emit('reservation_created', {
        reservationId: reservation._id,
        carTitle: car.title,
        userName: user.name
      });
    }

    return await Reservation.findById(reservation._id)
      .populate({ path: 'car', populate: { path: 'category', select: 'name slug' } })
      .populate('user', 'name email phone avatar');
  }

  // ─────────────────────────────────────────────────────────────────────────
  // GET USER RESERVATIONS
  // ─────────────────────────────────────────────────────────────────────────
  static async getUserReservations(userId) {
    return await Reservation.find({ user: userId })
      .populate({ path: 'car', populate: { path: 'category', select: 'name slug' } })
      .sort('-createdAt');
  }

  // ─────────────────────────────────────────────────────────────────────────
  // GET SINGLE RESERVATION
  // ─────────────────────────────────────────────────────────────────────────
  static async getReservationById(reservationId, userId, isAdmin = false) {
    const filter = { _id: reservationId };
    if (!isAdmin) filter.user = userId;

    const reservation = await Reservation.findOne(filter)
      .populate({ path: 'car', populate: { path: 'category', select: 'name slug' } })
      .populate('user', 'name email phone avatar');

    if (!reservation) {
      const error = new Error('Reservation not found.');
      error.statusCode = 404;
      throw error;
    }
    return reservation;
  }

  // ─────────────────────────────────────────────────────────────────────────
  // GET ALL RESERVATIONS (ADMIN)
  // ─────────────────────────────────────────────────────────────────────────
  static async getAllReservations(query = {}) {
    const filter = {};
    if (query.status) filter.status = query.status;

    return await Reservation.find(filter)
      .populate({ path: 'car', populate: { path: 'category', select: 'name slug' } })
      .populate('user', 'name email phone avatar')
      .sort('-createdAt');
  }

  // ─────────────────────────────────────────────────────────────────────────
  // UPDATE RESERVATION STATUS & ADMIN NOTES (ADMIN)
  // ─────────────────────────────────────────────────────────────────────────
  static async updateStatus(reservationId, status, adminNotes = '', adminUserId = null) {
    const reservation = await Reservation.findById(reservationId).populate('car');
    if (!reservation) {
      const error = new Error('Reservation not found.');
      error.statusCode = 404;
      throw error;
    }

    const prevStatus = reservation.status;
    reservation.status = status;
    if (adminNotes !== undefined && adminNotes !== null) {
      reservation.adminNotes = adminNotes;
    }

    const io = getIO();

    if (status === 'Confirmed') {
      reservation.confirmedAt = new Date();
      if (reservation.car && reservation.car.status !== 'Reserved') {
        await Car.findByIdAndUpdate(reservation.car._id, { status: 'Reserved' });
        await clearCachePattern('cars_*');
        await clearCachePattern(`car_detail_${reservation.car._id}`);
        if (io) io.emit('car_status_changed', { carId: reservation.car._id, status: 'Reserved' });
      }
    } else if (status === 'Cancelled') {
      reservation.cancelledAt = new Date();
      reservation.cancelledBy = adminUserId;
      if (reservation.car) {
        await Car.findByIdAndUpdate(reservation.car._id, { status: 'Available' });
        await clearCachePattern('cars_*');
        await clearCachePattern(`car_detail_${reservation.car._id}`);
        appEvents.emit(eventTypes.CAR_STATUS_CHANGED, {
          carId: reservation.car._id,
          title: reservation.car.title,
          newStatus: 'Available'
        });
        if (io) io.emit('car_status_changed', { carId: reservation.car._id, status: 'Available' });
      }
    } else if (status === 'Completed') {
      reservation.completedAt = new Date();
      if (reservation.car && reservation.car.status === 'Reserved') {
        await Car.findByIdAndUpdate(reservation.car._id, { status: 'Available' });
        await clearCachePattern('cars_*');
        await clearCachePattern(`car_detail_${reservation.car._id}`);
        if (io) io.emit('car_status_changed', { carId: reservation.car._id, status: 'Available' });
      }
    }

    await reservation.save();

    if (prevStatus !== status) {
      appEvents.emit(eventTypes.RESERVATION_STATUS_CHANGED, {
        reservationId: reservation._id,
        userId: reservation.user,
        carTitle: reservation.car ? reservation.car.title : 'Luxury Vehicle',
        status,
        updatedBy: adminUserId
      });

      if (io) {
        const userIdStr = String(reservation.user?._id || reservation.user);
        io.to(`user:${userIdStr}`).emit('reservation_updated', {
          reservationId: reservation._id,
          status
        });
      }
    }

    return await Reservation.findById(reservation._id)
      .populate({ path: 'car', populate: { path: 'category', select: 'name slug' } })
      .populate('user', 'name email phone avatar');
  }

  // ─────────────────────────────────────────────────────────────────────────
  // CANCEL RESERVATION (CUSTOMER)
  // ─────────────────────────────────────────────────────────────────────────
  static async cancelReservation(reservationId, userId, cancellationReason = '') {
    const reservation = await Reservation.findOne({ _id: reservationId, user: userId }).populate('car');
    if (!reservation) {
      const error = new Error('Reservation not found.');
      error.statusCode = 404;
      throw error;
    }

    if (['Cancelled', 'Completed'].includes(reservation.status)) {
      const error = new Error(`Cannot cancel a reservation that is already ${reservation.status}.`);
      error.statusCode = 400;
      throw error;
    }

    reservation.status = 'Cancelled';
    reservation.cancelledAt = new Date();
    reservation.cancelledBy = userId;
    if (cancellationReason) reservation.cancellationReason = cancellationReason;
    await reservation.save();

    if (reservation.car) {
      await Car.findByIdAndUpdate(reservation.car._id, { status: 'Available' });
      await clearCachePattern('cars_*');
      await clearCachePattern(`car_detail_${reservation.car._id}`);
      appEvents.emit(eventTypes.CAR_STATUS_CHANGED, {
        carId: reservation.car._id,
        title: reservation.car.title,
        newStatus: 'Available'
      });
      const io = getIO();
      if (io) io.emit('car_status_changed', { carId: reservation.car._id, status: 'Available' });
    }

    appEvents.emit(eventTypes.RESERVATION_CANCELLED, {
      reservationId: reservation._id,
      userId: reservation.user,
      carTitle: reservation.car ? reservation.car.title : 'Luxury Vehicle',
      status: 'Cancelled',
      updatedBy: userId
    });

    return reservation;
  }

  // ─────────────────────────────────────────────────────────────────────────
  // RELEASE CAR BACK TO INVENTORY (ADMIN)
  // ─────────────────────────────────────────────────────────────────────────
  static async releaseCar(reservationId, adminUserId = null) {
    const reservation = await Reservation.findById(reservationId).populate('car');
    if (!reservation) {
      const error = new Error('Reservation not found.');
      error.statusCode = 404;
      throw error;
    }

    if (reservation.car) {
      await Car.findByIdAndUpdate(reservation.car._id, { status: 'Available' });
      await clearCachePattern('cars_*');
      await clearCachePattern(`car_detail_${reservation.car._id}`);
      appEvents.emit(eventTypes.CAR_STATUS_CHANGED, {
        carId: reservation.car._id,
        title: reservation.car.title,
        newStatus: 'Available'
      });
      const io = getIO();
      if (io) io.emit('car_status_changed', { carId: reservation.car._id, status: 'Available' });
    }

    return await Reservation.findById(reservationId)
      .populate({ path: 'car', populate: { path: 'category', select: 'name slug' } })
      .populate('user', 'name email phone avatar');
  }
}

module.exports = ReservationService;
