const appEvents = require('../events/appEvents');
const eventTypes = require('../events/eventTypes');
const ActivityLog = require('../models/ActivityLog');

function registerActivityLogListeners() {
  appEvents.on(eventTypes.USER_REGISTERED, async (data) => {
    try {
      await ActivityLog.create({
        user: data.userId,
        action: 'User Registered',
        details: `Account created for ${data.email} (${data.role})`
      });
    } catch (err) {
      console.error('[Listener ActivityLog Error]:', err.message);
    }
  });

  appEvents.on(eventTypes.TEST_DRIVE_BOOKED, async (data) => {
    try {
      await ActivityLog.create({
        user: data.userId,
        action: 'Test Drive Booked',
        details: `Booked ${data.carTitle} for ${data.preferredDate}`
      });
    } catch (err) {
      console.error('[Listener ActivityLog Error]:', err.message);
    }
  });

  appEvents.on(eventTypes.TEST_DRIVE_STATUS_CHANGED, async (data) => {
    try {
      await ActivityLog.create({
        user: data.updatedBy || null,
        action: 'Test Drive Status Changed',
        details: `Booking ${data.testDriveId} changed to ${data.status}`
      });
    } catch (err) {
      console.error('[Listener ActivityLog Error]:', err.message);
    }
  });

  appEvents.on(eventTypes.RESERVATION_CREATED, async (data) => {
    try {
      await ActivityLog.create({
        user: data.userId,
        action: 'Car Reserved',
        details: `Reserved ${data.carTitle} for ${new Date(data.startDate).toLocaleDateString()} - ${new Date(data.endDate).toLocaleDateString()}`
      });
    } catch (err) {
      console.error('[Listener ActivityLog Error]:', err.message);
    }
  });

  appEvents.on(eventTypes.RESERVATION_STATUS_CHANGED, async (data) => {
    try {
      await ActivityLog.create({
        user: data.updatedBy || null,
        action: 'Reservation Status Changed',
        details: `Reservation for ${data.carTitle} changed to ${data.status}`
      });
    } catch (err) {
      console.error('[Listener ActivityLog Error]:', err.message);
    }
  });

  appEvents.on(eventTypes.RESERVATION_CANCELLED, async (data) => {
    try {
      await ActivityLog.create({
        user: data.updatedBy || null,
        action: 'Reservation Cancelled',
        details: `Reservation for ${data.carTitle} was cancelled. Car restored to Available.`
      });
    } catch (err) {
      console.error('[Listener ActivityLog Error]:', err.message);
    }
  });

  console.log('[Listeners] ActivityLog listeners registered');
}

module.exports = registerActivityLogListeners;
