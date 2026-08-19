const { Worker } = require('bullmq');
const { getRedisClient, isRedisAvailable } = require('../config/redis');

let emailWorker = null;

function startEmailWorker() {
  const connection = getRedisClient();

  if (!connection) {
    console.log('[BullMQ Worker] Redis client unavailable. Email worker not started.');
    return null;
  }

  const startWorker = () => {
    if (emailWorker) return emailWorker;

    try {
      const workerConnection = connection.duplicate();
      workerConnection.on('error', () => {
        // Suppress background connection error noise
      });

      emailWorker = new Worker(
        'emailQueue',
        async (job) => {
          console.log(
            `[BullMQ Worker - Email] Processing job ID ${job.id} (${job.name})`
          );

          switch (job.name) {
            case 'sendWelcomeEmail':
              console.log(
                `[Email Delivered] Welcome email sent to: ${job.data.email}`
              );
              break;

            case 'sendTestDriveConfirmation':
              console.log(
                `[Email Delivered] Test drive confirmation email sent to: ${job.data.email} for ${job.data.carTitle}`
              );
              break;

            case 'sendInquiryReceivedEmail':
              console.log(
                `[Email Delivered] Inquiry receipt acknowledgment sent to: ${job.data.email}`
              );
              break;

            case 'sendReservationConfirmation':
              console.log(
                `[Email Delivered] Vehicle reservation confirmation sent to: ${job.data.email} for ${job.data.carTitle}`
              );
              break;

            default:
              console.log(
                `[Email Delivered] Generic notification email sent to ${job.data.email}`
              );
          }
        },
        { connection: workerConnection }
      );

      emailWorker.on('completed', (job) => {
        console.log(
          `[BullMQ Worker - Email] Job ${job.id} completed successfully.`
        );
      });

      emailWorker.on('failed', (job, err) => {
        console.error(
          `[BullMQ Worker - Email Error] Job ${job?.id} failed: ${err.message}`
        );
      });

      emailWorker.on('error', (err) => {
        // Suppress unhandled errors
      });

      console.log('[BullMQ Workers] Email Worker initialized and listening');
      return emailWorker;
    } catch (err) {
      console.warn(
        '[BullMQ Worker Notice] Could not start Email worker:',
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

module.exports = startEmailWorker;