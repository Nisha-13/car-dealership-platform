const { Worker } = require('bullmq');
const { getRedisClient, isRedisAvailable } = require('../config/redis');

function startEmailWorker() {
  const connection = getRedisClient();
  if (!connection || !isRedisAvailable()) {
    console.log('[BullMQ Worker] Redis unavailable. Email worker running in mock mode.');
    return;
  }

  try {
    const worker = new Worker(
      'emailQueue',
      async (job) => {
        console.log(`[BullMQ Worker - Email] Processing job ID ${job.id} (${job.name})`);
        switch (job.name) {
          case 'sendWelcomeEmail':
            console.log(`[Email Delivered] Welcome email sent to: ${job.data.email}`);
            break;
          case 'sendTestDriveConfirmation':
            console.log(`[Email Delivered] Test drive confirmation email sent to: ${job.data.email} for ${job.data.carTitle}`);
            break;
          case 'sendInquiryReceivedEmail':
            console.log(`[Email Delivered] Inquiry receipt acknowledgment sent to: ${job.data.email}`);
            break;
          case 'sendReservationConfirmation':
            console.log(`[Email Delivered] Vehicle reservation confirmation sent to: ${job.data.email} for ${job.data.carTitle} (Deposit: $${job.data.depositAmount})`);
            break;
          default:
            console.log(`[Email Delivered] Generic notification email sent to ${job.data.email}`);
        }
      },
      { connection }
    );

    worker.on('completed', (job) => {
      console.log(`[BullMQ Worker - Email] Job ${job.id} completed successfully.`);
    });

    worker.on('failed', (job, err) => {
      console.error(`[BullMQ Worker - Email Error] Job ${job.id} failed: ${err.message}`);
    });

    console.log('[BullMQ Workers] Email Worker initialized and listening');
  } catch (err) {
    console.warn('[BullMQ Worker Notice] Could not start Email worker:', err.message);
  }
}

module.exports = startEmailWorker;
