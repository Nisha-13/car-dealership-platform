const Redis = require('ioredis');
const config = require('./env');

let redisClient = null;
let redisAvailable = false;

try {
  redisClient = new Redis(config.redisUrl, {
    maxRetriesPerRequest: null,
    enableReadyCheck: false,
    retryStrategy(times) {
      if (times > 3) {
        console.warn('[Redis Warning] Redis server unreachable after retries. Caching will be bypassed.');
        return null; // Stop retrying
      }
      return Math.min(times * 100, 2000);
    }
  });

  redisClient.on('connect', () => {
    redisAvailable = true;
    console.log('[Redis] Connected successfully');
  });

  redisClient.on('error', (err) => {
    redisAvailable = false;
    // Suppress repeated spam logs
  });
} catch (err) {
  console.warn('[Redis] Redis client initialization notice:', err.message);
}

const getRedisClient = () => redisClient;
const isRedisAvailable = () => redisAvailable;

module.exports = {
  getRedisClient,
  isRedisAvailable
};
