const { Worker } = require('bullmq');
const { getRedisClient, isRedisAvailable } = require('../config/redis');
const emailService = require('../services/email.service');

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
              await emailService.sendWelcomeEmail(job.data);
              break;

            case 'sendAdminNewCustomerAlert':
              await emailService.sendAdminNewCustomerAlert(job.data);
              break;

            case 'sendLoginNotificationEmail':
              await emailService.sendLoginNotificationEmail(job.data);
              break;

            case 'sendTestDriveConfirmation':
              await emailService.sendTestDriveConfirmation(job.data);
              break;

            case 'sendInquiryReceivedEmail':
              await emailService.sendInquiryReceivedEmail(job.data);
              break;

            case 'sendReservationConfirmation':
              await emailService.sendReservationConfirmation(job.data);
              break;

            default:
              console.log(
                `[BullMQ Worker - Email] Unhandled job '${job.name}' with data:`,
                job.data
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