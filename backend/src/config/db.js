const mongoose = require('mongoose');
const config = require('./env');

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(config.mongoUri);
    console.log(`[MongoDB] Connected: ${conn.connection.host} / ${conn.connection.name}`);
  } catch (error) {
    console.error(`[MongoDB Error]: ${error.message}`);
    // Non-fatal exit if DB unavailable during local build, but log clearly
    console.warn('[MongoDB Warning] Ensure MongoDB is running on your system.');
  }
};

module.exports = connectDB;
