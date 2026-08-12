const { getRedisClient, isRedisAvailable } = require('../config/redis');

const DEFAULT_EXPIRATION = 300; // 5 minutes cache

async function getCachedData(key) {
  if (!isRedisAvailable()) return null;
  try {
    const client = getRedisClient();
    const cached = await client.get(key);
    return cached ? JSON.parse(cached) : null;
  } catch (err) {
    return null;
  }
}

async function setCachedData(key, data, durationSeconds = DEFAULT_EXPIRATION) {
  if (!isRedisAvailable()) return;
  try {
    const client = getRedisClient();
    await client.set(key, JSON.stringify(data), 'EX', durationSeconds);
  } catch (err) {
    // Silent fail
  }
}

async function clearCachePattern(pattern) {
  if (!isRedisAvailable()) return;
  try {
    const client = getRedisClient();
    const keys = await client.keys(pattern);
    if (keys.length > 0) {
      await client.del(keys);
    }
  } catch (err) {
    // Silent fail
  }
}

module.exports = {
  getCachedData,
  setCachedData,
  clearCachePattern
};
