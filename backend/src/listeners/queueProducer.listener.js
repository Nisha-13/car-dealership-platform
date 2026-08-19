const appEvents = require('../events/appEvents');
const eventTypes = require('../events/eventTypes');
const { addEmailJob } = require('../queues/emailQueue');
const { addReminderJob } = require('../queues/reminderQueue');

function registerQueueProducerListeners() {
  appEvents.on(eventTypes.USER_REGISTERED, (data) => {
    addEmailJob('sendWelcomeEmail', {
      userId: data.userId,
      email: data.email,
      name: data.name
    });
  });

  appEvents.on(eventTypes.TEST_DRIVE_BOOKED, (data) => {
    addEmailJob('sendTestDriveConfirmation', {
      userId: data.userId,
      email: data.email,
      carTitle: data.carTitle,
      preferredDate: data.preferredDate,
      preferredTime: data.preferredTime
    });

    // Schedule reminder 1 minute after booking for demonstration
    addReminderJob('sendTestDriveReminder', {
      userId: data.userId,
      testDriveId: data.testDriveId,
      carTitle: data.carTitle
    }, 60000);
  });

  appEvents.on(eventTypes.INQUIRY_CREATED, (data) => {
    addEmailJob('sendInquiryReceivedEmail', {
      email: data.email,
      name: data.name,
      carTitle: data.carTitle
    });
  });

  appEvents.on(eventTypes.RESERVATION_CREATED, (data) => {
    addEmailJob('sendReservationConfirmation', {
      userId: data.userId,
      email: data.email,
      name: data.name,
      carTitle: data.carTitle,
      startDate: data.startDate,
      endDate: data.endDate
    });
  });

  console.log('[Listeners] QueueProducer listeners registered');
}

module.exports = registerQueueProducerListeners;
