const appEvents = require('../events/appEvents');
const eventTypes = require('../events/eventTypes');
const { addEmailJob } = require('../queues/emailQueue');
const { addReminderJob } = require('../queues/reminderQueue');

function registerQueueProducerListeners() {
  // 1. Customer Registration -> Send Welcome Email to Customer & Alert Email to Admin
  appEvents.on(eventTypes.USER_REGISTERED, (data) => {
    // Send welcome email to customer
    addEmailJob('sendWelcomeEmail', {
      userId: data.userId,
      email: data.email,
      name: data.name
    });

    // Send new customer registration alert to Admin
    addEmailJob('sendAdminNewCustomerAlert', {
      customerName: data.name,
      customerEmail: data.email,
      customerPhone: data.phone,
      registeredAt: data.createdAt
    });
  });

  // 2. Customer Login -> Send Login Confirmation/Security Email to Customer
  appEvents.on(eventTypes.USER_LOGGED_IN, (data) => {
    addEmailJob('sendLoginNotificationEmail', {
      userId: data.userId,
      email: data.email,
      name: data.name,
      loginTime: data.loginTime
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
