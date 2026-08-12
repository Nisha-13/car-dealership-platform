const { Queue } = require('bullmq');
const { getRedisClient, isRedisAvailable } = require('../config/redis');

let emailQueue = null;

try {
  const redisConnection = getRedisClient();
  if (redisConnection) {
    emailQueue = new Queue('emailQueue', {
      connection: redisConnection
    });
    console.log('[BullMQ] emailQueue initialized');
  }
} catch (err) {
  console.warn('[BullMQ Warning] Unable to initialize emailQueue:', err.message);
}

const addEmailJob = async (jobName, data) => {
  if (emailQueue && isRedisAvailable()) {
    try {
      await emailQueue.add(jobName, data, { attempts: 3, backoff: 5000 });
      console.log(`[BullMQ Queue] Added job '${jobName}' to emailQueue`);
    } catch (err) {
      console.warn(`[BullMQ Queue Warning] Could not enqueue '${jobName}':`, err.message);
    }
  } else {
    console.log(`[BullMQ Simulation] Direct processing for job '${jobName}':`, data);
  }
};

module.exports = { addEmailJob, emailQueue };
