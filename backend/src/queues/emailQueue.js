const { Queue } = require('bullmq');
const { getRedisClient, isRedisAvailable } = require('../config/redis');
const emailService = require('../services/email.service');

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
  
  // Fallback processing when Redis is not active/available
  console.log(`[Email Queue Fallback] Dispatching direct email for job '${jobName}'`);
  emailService.processDirectEmail(jobName, data).catch((err) => {
    console.error(`[Email Queue Fallback Error for '${jobName}']`, err.message);
  });
};

module.exports = { addEmailJob, emailQueue };

