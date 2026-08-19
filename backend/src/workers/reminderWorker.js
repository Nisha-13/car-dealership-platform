const { Worker } = require('bullmq');
const { getRedisClient, isRedisAvailable } = require('../config/redis');

let reminderWorker = null;

function startReminderWorker() {
  const connection = getRedisClient();

  if (!connection) {
    console.log('[BullMQ Worker] Redis client unavailable. Reminder worker not started.');
    return null;
  }

  const startWorker = () => {
    if (reminderWorker) return reminderWorker;

    try {
      const workerConnection = connection.duplicate();
      workerConnection.on('error', () => {
        // Suppress background connection error noise
      });

      reminderWorker = new Worker(
        'reminderQueue',
        async (job) => {
          console.log(
            `[BullMQ Worker - Reminder] Processing job ID ${job.id} (${job.name})`
          );

          if (job.name === 'sendTestDriveReminder') {
            console.log(
              `[Reminder Processed] Test drive reminder sent to user ${job.data.userId} for booking ${job.data.testDriveId}`
            );
          }
        },
        { connection: workerConnection }
      );

      reminderWorker.on('completed', (job) => {
        console.log(
          `[BullMQ Worker - Reminder] Job ${job.id} completed.`
        );
      });

      reminderWorker.on('failed', (job, err) => {
        console.error(
          `[BullMQ Worker - Reminder Error] Job ${job?.id} failed: ${err.message}`
        );
      });

      reminderWorker.on('error', (err) => {
        // Suppress unhandled errors
      });

      console.log(
        '[BullMQ Workers] Reminder Worker initialized and listening'
      );

      return reminderWorker;
    } catch (err) {
      console.warn(
        '[BullMQ Worker Notice] Could not start Reminder worker:',
        err.message
      );
      return null;
    }
  };

  if (isRedisAvailable() || connection.status === 'ready') {
    return startWorker();
  }

  connection.on('ready', startWorker);

  return null;
}

module.exports = startReminderWorker;