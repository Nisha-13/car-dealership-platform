const Redis = require('ioredis');
const config = require('./env');

let redisClient = null;
let redisAvailable = false;

try {
  redisClient = new Redis(config.redisUrl, {
    maxRetriesPerRequest: null,
    enableReadyCheck: true,
    lazyConnect: false,
    retryStrategy(times) {
      if (times > 3) {
        console.warn('[Redis Warning] Redis server unreachable after retries. Caching will be bypassed.');
        return null; // Stop retrying
      }
      return Math.min(times * 200, 2000);
    }
  });

  redisClient.on('connect', () => {
    // Socket connected
  });

  redisClient.on('ready', () => {
    redisAvailable = true;
    console.log('[Redis] Connected and ready');
  });

  redisClient.on('error', (err) => {
    redisAvailable = false;
    // Suppress repeated unhandled error spam
  });

  redisClient.on('close', () => {
    redisAvailable = false;
  });

  redisClient.on('end', () => {
    redisAvailable = false;
  });
} catch (err) {
  console.warn('[Redis] Redis client initialization notice:', err.message);
}

const getRedisClient = () => redisClient;
const isRedisAvailable = () => redisAvailable && redisClient && redisClient.status === 'ready';

module.exports = {
  getRedisClient,
  isRedisAvailable
};
