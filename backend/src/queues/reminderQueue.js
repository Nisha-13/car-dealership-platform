const { Queue } = require('bullmq');
const { getRedisClient, isRedisAvailable } = require('../config/redis');

let reminderQueue = null;

try {
  const redisConnection = getRedisClient();
  if (redisConnection) {
    reminderQueue = new Queue('reminderQueue', {
      connection: redisConnection
    });
    console.log('[BullMQ] reminderQueue initialized');
  }
} catch (err) {
  console.warn('[BullMQ Warning] Unable to initialize reminderQueue:', err.message);
}

const addReminderJob = async (jobName, data, delayMs = 0) => {
  if (reminderQueue && isRedisAvailable()) {
    try {
      await reminderQueue.add(jobName, data, { delay: delayMs, attempts: 3 });
      console.log(`[BullMQ Queue] Scheduled reminder '${jobName}' in ${delayMs}ms`);
    } catch (err) {
      console.warn(`[BullMQ Queue Warning] Could not enqueue reminder '${jobName}':`, err.message);
    }
  } else {
    console.log(`[BullMQ Simulation] Direct appointment reminder scheduled:`, data);
  }
};

module.exports = { addReminderJob, reminderQueue };
