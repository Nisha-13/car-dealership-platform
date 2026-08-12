const dotenv = require('dotenv');
const path = require('path');

dotenv.config({ path: path.join(__dirname, '../../.env') });

module.exports = {
  port: process.env.PORT || 5000,
  mongoUri: process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/car_dealership',
  jwtSecret: process.env.JWT_SECRET || 'autoluxe_super_secret_jwt_key_2026_production',
  redisUrl: process.env.REDIS_URL || 'redis://127.0.0.1:6379',
  clientUrl: process.env.CLIENT_URL || 'http://localhost:5173',
  nodeEnv: process.env.NODE_ENV || 'development'
};
