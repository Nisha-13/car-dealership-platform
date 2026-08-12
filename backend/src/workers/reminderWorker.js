const { Worker } = require('bullmq');
const { getRedisClient, isRedisAvailable } = require('../config/redis');

function startReminderWorker() {
  const connection = getRedisClient();
  if (!connection || !isRedisAvailable()) {
    console.log('[BullMQ Worker] Redis unavailable. Reminder worker running in mock mode.');
    return;
  }

  try {
    const worker = new Worker(
      'reminderQueue',
      async (job) => {
        console.log(`[BullMQ Worker - Reminder] Processing job ID ${job.id} (${job.name})`);
        if (job.name === 'sendTestDriveReminder') {
          console.log(`[Reminder Processed] Test drive reminder sent to user ${job.data.userId} for booking ${job.data.testDriveId}`);
        }
      },
      { connection }
    );

    worker.on('completed', (job) => {
      console.log(`[BullMQ Worker - Reminder] Job ${job.id} completed.`);
    });

    console.log('[BullMQ Workers] Reminder Worker initialized and listening');
  } catch (err) {
    console.warn('[BullMQ Worker Notice] Could not start Reminder worker:', err.message);
  }
}

module.exports = startReminderWorker;
