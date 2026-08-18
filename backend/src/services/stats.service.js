const Car = require('../models/Car');
const User = require('../models/User');
const TestDrive = require('../models/TestDrive');
const Inquiry = require('../models/Inquiry');
const ActivityLog = require('../models/ActivityLog');
const Reservation = require('../models/Reservation');
const Category = require('../models/Category');

class StatsService {
  static async getAdminDashboardStats() {
    const [
      totalCars,
      availableCars,
      reservedCars,
      soldCars,
      totalCustomers,
      pendingTestDrives,
      totalTestDrives,
      pendingReservations,
      activeReservations,
      totalReservations,
      newInquiries,
      recentActivity
    ] = await Promise.all([
      Car.countDocuments(),
      Car.countDocuments({ status: 'Available' }),
      Car.countDocuments({ status: 'Reserved' }),
      Car.countDocuments({ status: 'Sold' }),
      User.countDocuments({ role: 'customer' }),
      TestDrive.countDocuments({ status: 'Pending' }),
      TestDrive.countDocuments(),
      Reservation.countDocuments({ status: 'Pending' }),
      Reservation.countDocuments({ status: { $in: ['Pending', 'Confirmed'] } }),
      Reservation.countDocuments(),
      Inquiry.countDocuments({ status: 'New' }),
      ActivityLog.find().populate('user', 'name email').sort('-createdAt').limit(10)
    ]);

    // Calculate total inventory value
    const cars = await Car.find({}, 'price status');
    const totalInventoryValue = cars.reduce((acc, c) => acc + (c.price || 0), 0);

    return {
      totalCars,
      availableCars,
      reservedCars,
      soldCars,
      totalCustomers,
      pendingTestDrives,
      totalTestDrives,
      pendingReservations,
      activeReservations,
      totalReservations,
      newInquiries,
      totalInventoryValue,
      recentActivity
    };
  }

  static async getCustomerDashboardStats(userId) {
    const [
      activeTestDrives,
      totalTestDrives,
      activeReservations,
      totalReservations,
      unreadInquiries,
      recentActivity
    ] = await Promise.all([
      TestDrive.countDocuments({ user: userId, status: { $in: ['Pending', 'Confirmed'] } }),
      TestDrive.countDocuments({ user: userId }),
      Reservation.countDocuments({ user: userId, status: { $in: ['Pending', 'Confirmed'] } }),
      Reservation.countDocuments({ user: userId }),
      Inquiry.countDocuments({ user: userId, status: 'Responded' }),
      TestDrive.find({ user: userId }).populate('car', 'title brand images').sort('-createdAt').limit(5)
    ]);

    return {
      activeTestDrives,
      totalTestDrives,
      activeReservations,
      totalReservations,
      unreadInquiries,
      recentActivity
    };
  }

  // Public stats for About page — no auth required
  static async getPublicStats() {
    const [
      soldCars,
      totalBrands,
      totalCustomers,
      totalTestDrives,
      confirmedReservations
    ] = await Promise.all([
      Car.countDocuments({ status: 'Sold' }),
      Category.countDocuments(),
      User.countDocuments({ role: 'customer' }),
      TestDrive.countDocuments({ status: 'Confirmed' }),
      Reservation.countDocuments({ status: 'Confirmed' })
    ]);

    // Satisfaction = (confirmed test drives + confirmed reservations) / total * 100
    const totalInteractions = totalTestDrives + confirmedReservations;
    const totalReservations = await Reservation.countDocuments();
    const totalTD = await TestDrive.countDocuments();
    const totalAll = totalTD + totalReservations;
    const satisfactionPct = totalAll > 0
      ? Math.round((totalInteractions / totalAll) * 100)
      : 98; // default if no data yet

    return {
      vehiclesDelivered: soldCars,
      exclusiveBrands:   totalBrands,
      satisfactionPct:   Math.min(satisfactionPct, 99), // cap at 99%
      totalCustomers
    };
  }
}

module.exports = StatsService;
