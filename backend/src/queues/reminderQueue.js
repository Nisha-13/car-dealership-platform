const { Queue } = require('bullmq');
const { getRedisClient, isRedisAvailable } = require('../config/redis');

let reminderQueue = null;

function getQueue() {
  if (!reminderQueue) {
    const redisConnection = getRedisClient();
    if (redisConnection) {
      try {
        reminderQueue = new Queue('reminderQueue', {
          connection: redisConnection.duplicate()
        });
        reminderQueue.on('error', () => {});
        console.log('[BullMQ] reminderQueue initialized');
      } catch (err) {
        console.warn('[BullMQ Warning] Unable to initialize reminderQueue:', err.message);
      }
    }
  }
  return reminderQueue;
}

// Initial attempt
getQueue();

const addReminderJob = async (jobName, data, delayMs = 0) => {
  if (isRedisAvailable()) {
    try {
      const q = getQueue();
      if (q) {
        await q.add(jobName, data, { delay: delayMs, attempts: 3 });
        console.log(`[BullMQ Queue] Scheduled reminder '${jobName}' in ${delayMs}ms`);
        return;
      }
    } catch (err) {
      console.warn(`[BullMQ Queue Warning] Could not enqueue reminder '${jobName}':`, err.message);
    }
  }
  
  // Fallback simulation when Redis is not active/available
  console.log(`[BullMQ Simulation] Direct appointment reminder scheduled:`, data);
};

module.exports = { addReminderJob, reminderQueue };
