const { Queue } = require('bullmq');
const { getRedisClient, isRedisAvailable } = require('../config/redis');

let emailQueue = null;

function getQueue() {
  if (!emailQueue) {
    const redisConnection = getRedisClient();
    if (redisConnection) {
      try {
        emailQueue = new Queue('emailQueue', {
          connection: redisConnection.duplicate()
        });
        emailQueue.on('error', () => {});
        console.log('[BullMQ] emailQueue initialized');
      } catch (err) {
        console.warn('[BullMQ Warning] Unable to initialize emailQueue:', err.message);
      }
    }
  }
  return emailQueue;
}

// Initial attempt
getQueue();

const addEmailJob = async (jobName, data) => {
  if (isRedisAvailable()) {
    try {
      const q = getQueue();
      if (q) {
        await q.add(jobName, data, { attempts: 3, backoff: 5000 });
        console.log(`[BullMQ Queue] Added job '${jobName}' to emailQueue`);
        return;
      }
    } catch (err) {
      console.warn(`[BullMQ Queue Warning] Could not enqueue '${jobName}':`, err.message);
    }
  }
  
  // Fallback simulation when Redis is not active/available
  console.log(`[BullMQ Simulation] Direct processing for job '${jobName}':`, data);
};

module.exports = { addEmailJob, emailQueue };
