const mongoose = require('mongoose');
const config = require('../config/env');
const User = require('../models/User');
const Category = require('../models/Category');
const Car = require('../models/Car');
const TestDrive = require('../models/TestDrive');
const Favorite = require('../models/Favorite');
const Inquiry = require('../models/Inquiry');
const Message = require('../models/Message');
const Notification = require('../models/Notification');
const ActivityLog = require('../models/ActivityLog');
const Reservation = require('../models/Reservation');

const { categoriesData, carsData } = require('./seedData');

async function seedDatabase() {
  try {
    console.log('[Seed] Connecting to MongoDB...');
    await mongoose.connect(config.mongoUri);
    console.log('[Seed] Connected to database');

    console.log('[Seed] Clearing existing collections...');
    await Promise.all([
      User.deleteMany({}),
      Category.deleteMany({}),
      Car.deleteMany({}),
      TestDrive.deleteMany({}),
      Favorite.deleteMany({}),
      Inquiry.deleteMany({}),
      Message.deleteMany({}),
      Notification.deleteMany({}),
      ActivityLog.deleteMany({}),
      Reservation.deleteMany({})
    ]);

    console.log('[Seed] Creating demo users...');
    const adminUser = await User.create({
      name: 'AutoLuxe Dealer Admin',
      email: 'admin@autoluxe.com',
      password: 'Admin123!',
      role: 'admin',
      phone: '+1 (800) 555-LUXE'
    });

    const customer1 = await User.create({
      name: 'John Doe',
      email: 'john@example.com',
      password: 'Customer123!',
      role: 'customer',
      phone: '+1 (555) 234-5678'
    });

    const customer2 = await User.create({
      name: 'Sarah Connor',
      email: 'sarah@example.com',
      password: 'Customer123!',
      role: 'customer',
      phone: '+1 (555) 987-6543'
    });

    console.log('[Seed] Creating vehicle categories...');
    const createdCategories = await Category.insertMany(categoriesData);
    const categoryMap = {};
    createdCategories.forEach(cat => {
      categoryMap[cat.slug] = cat._id;
    });

    console.log('[Seed] Inserting realistic cars...');
    const carsToInsert = carsData.map(car => {
      const { categorySlug, ...rest } = car;
      return {
        ...rest,
        category: categoryMap[categorySlug] || createdCategories[0]._id
      };
    });

    const createdCars = await Car.insertMany(carsToInsert);

    console.log('[Seed] Creating initial test drive bookings...');
    const testDrive1 = await TestDrive.create({
      user: customer1._id,
      car: createdCars[0]._id, // Porsche Taycan
      preferredDate: new Date(Date.now() + 86400000 * 3), // 3 days from now
      preferredTime: '10:30 AM',
      status: 'Confirmed',
      notes: 'Interested in track pack options and fast charging speed.',
      dealerNotes: 'Confirmed VIP slot with specialist advisor Michael.'
    });

    await TestDrive.create({
      user: customer2._id,
      car: createdCars[1]._id, // BMW M5
      preferredDate: new Date(Date.now() + 86400000 * 5),
      preferredTime: '02:00 PM',
      status: 'Pending',
      notes: 'Would like a trade-in evaluation for my 2020 M3.'
    });

    console.log('[Seed] Creating initial vehicle reservations...');
    // Reservation 1: Mercedes-AMG GT (Customer 1 - Confirmed)
    await Car.findByIdAndUpdate(createdCars[2]._id, { status: 'Reserved' });
    await Reservation.create({
      user: customer1._id,
      car: createdCars[2]._id,
      startDate: new Date(Date.now() + 86400000 * 2),
      endDate: new Date(Date.now() + 86400000 * 6),
      totalDays: 5,
      totalPrice: createdCars[2].price,
      status: 'Confirmed',
      contactPhone: customer1.phone,
      driverLicense: 'DL-98234-NY',
      pickupLocation: 'AutoLuxe VIP Flagship Showroom',
      customerNotes: 'Please have the vehicle fully detailed and preconditioned before pickup.',
      adminNotes: 'VIP client reservation confirmed. Assigned luxury concierge Marcus.',
      confirmedAt: new Date()
    });

    // Reservation 2: Ferrari F8 Tributo (Customer 2 - Pending)
    await Car.findByIdAndUpdate(createdCars[6]._id, { status: 'Reserved' });
    await Reservation.create({
      user: customer2._id,
      car: createdCars[6]._id,
      startDate: new Date(Date.now() + 86400000 * 3),
      endDate: new Date(Date.now() + 86400000 * 7),
      totalDays: 5,
      totalPrice: createdCars[6].price,
      status: 'Pending',
      contactPhone: customer2.phone,
      driverLicense: 'DL-55412-CA',
      pickupLocation: 'AutoLuxe VIP Flagship Showroom',
      customerNotes: 'Requesting enclosed trailer delivery option if available.',
      adminNotes: 'Awaiting ID verification before confirming slot.'
    });

    console.log('[Seed] Creating sample inquiries & chat messages...');
    await Inquiry.create({
      user: customer1._id,
      car: createdCars[0]._id,
      name: customer1.name,
      email: customer1.email,
      phone: customer1.phone,
      message: 'Does this Taycan Turbo S come with the home charger installation service?',
      status: 'Responded',
      dealerResponse: 'Yes, John! AutoLuxe provides complimentary home charger installation consultation.'
    });

    await Message.create({
      sender: customer1._id,
      recipient: adminUser._id,
      car: createdCars[0]._id,
      content: 'Hello, is the Frozen Blue Taycan Turbo S currently available in your showroom for a walkthrough?',
      read: true
    });

    await Message.create({
      sender: adminUser._id,
      recipient: customer1._id,
      car: createdCars[0]._id,
      content: 'Welcome John! Yes, it is parked in our main VIP showroom floor. We look forward to your test drive appointment!',
      read: false
    });

    console.log('[Seed] Creating notifications & audit logs...');
    await Notification.create({
      recipient: customer1._id,
      title: '✅ Test Drive Confirmed',
      message: 'Your test drive for the 2024 Porsche Taycan Turbo S has been confirmed for 10:30 AM.',
      type: 'test_drive',
      link: '/dashboard/test-drives'
    });

    await ActivityLog.create({
      user: adminUser._id,
      action: 'Database Initialized',
      details: 'Populated 8 luxury cars and demo accounts.'
    });

    console.log('\n==================================================');
    console.log('✅ DATABASE SEEDING COMPLETED SUCCESSFULLY!');
    console.log('==================================================');
    console.log('DEMO ACCOUNTS READY FOR TESTING:');
    console.log('--------------------------------------------------');
    console.log('👑 ADMIN / DEALER LOGIN:');
    console.log('   Email: admin@autoluxe.com');
    console.log('   Password: Admin123!');
    console.log('--------------------------------------------------');
    console.log('👤 CUSTOMER LOGIN 1:');
    console.log('   Email: john@example.com');
    console.log('   Password: Customer123!');
    console.log('--------------------------------------------------');
    console.log('👤 CUSTOMER LOGIN 2:');
    console.log('   Email: sarah@example.com');
    console.log('   Password: Customer123!');
    console.log('==================================================\n');

    process.exit(0);
  } catch (err) {
    console.error('[Seed Error]:', err);
    process.exit(1);
  }
}

seedDatabase();
