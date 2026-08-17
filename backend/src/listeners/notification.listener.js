const appEvents = require('../events/appEvents');
const eventTypes = require('../events/eventTypes');
const Notification = require('../models/Notification');
const User = require('../models/User');
const { getIO } = require('../sockets/socketManager');

function registerNotificationListeners() {
  // Test Drive Booked -> Notify Admin
  appEvents.on(eventTypes.TEST_DRIVE_BOOKED, async (data) => {
    try {
      const admins = await User.find({ role: 'admin' });
      for (const admin of admins) {
        const notif = await Notification.create({
          recipient: admin._id,
          title: '🏎️ New Test Drive Booking',
          message: `Customer booked a test drive for vehicle: ${data.carTitle} on ${new Date(data.preferredDate).toLocaleDateString()} at ${data.preferredTime}.`,
          type: 'test_drive',
          link: '/admin/test-drives'
        });

        const io = getIO();
        if (io) {
          io.to(`user:${admin._id}`).emit('notification_received', notif);
          io.to('admin').emit('notification_received', notif);
        }
      }
    } catch (err) {
      console.error('[Listener Notification Error]:', err.message);
    }
  });

  // Test Drive Status Changed -> Notify Customer
  appEvents.on(eventTypes.TEST_DRIVE_STATUS_CHANGED, async (data) => {
    try {
      const statusIcon = data.status === 'Confirmed' ? '✅' : data.status === 'Rejected' ? '❌' : 'ℹ️';
      const notif = await Notification.create({
        recipient: data.userId,
        title: `${statusIcon} Test Drive ${data.status}`,
        message: `Your test drive request for ${data.carTitle} has been updated to: ${data.status}.`,
        type: 'test_drive',
        link: '/dashboard/test-drives'
      });

      const io = getIO();
      if (io) {
        io.to(`user:${data.userId}`).emit('notification_received', notif);
        io.to(`user:${data.userId}`).emit('test_drive_updated', {
          testDriveId: data.testDriveId,
          status: data.status
        });
      }
    } catch (err) {
      console.error('[Listener Notification Error]:', err.message);
    }
  });

  // Inquiry Created -> Notify Admin
  appEvents.on(eventTypes.INQUIRY_CREATED, async (data) => {
    try {
      const admins = await User.find({ role: 'admin' });
      for (const admin of admins) {
        const notif = await Notification.create({
          recipient: admin._id,
          title: '💬 New Car Inquiry',
          message: `Inquiry received from ${data.name} regarding ${data.carTitle}.`,
          type: 'inquiry',
          link: '/admin/inquiries'
        });

        const io = getIO();
        if (io) {
          io.to(`user:${admin._id}`).emit('notification_received', notif);
          io.to('admin').emit('notification_received', notif);
        }
      }
    } catch (err) {
      console.error('[Listener Notification Error]:', err.message);
    }
  });

  // Reservation Created -> Notify Admin
  appEvents.on(eventTypes.RESERVATION_CREATED, async (data) => {
    try {
      const admins = await User.find({ role: 'admin' });
      for (const admin of admins) {
        const notif = await Notification.create({
          recipient: admin._id,
          title: '🚗 New Vehicle Reservation',
          message: `Customer reserved ${data.carTitle} from ${new Date(data.startDate).toLocaleDateString()} to ${new Date(data.endDate).toLocaleDateString()} (Deposit: $${(data.depositAmount || 500).toLocaleString()}).`,
          type: 'reservation',
          link: '/admin/reservations'
        });

        const io = getIO();
        if (io) {
          io.to(`user:${admin._id}`).emit('notification_received', notif);
          io.to('admin').emit('notification_received', notif);
          io.to('admin').emit('reservation_created', data);
        }
      }
    } catch (err) {
      console.error('[Listener Notification Error]:', err.message);
    }
  });

  // Reservation Status Changed -> Notify Customer
  appEvents.on(eventTypes.RESERVATION_STATUS_CHANGED, async (data) => {
    try {
      const statusIcon = data.status === 'Confirmed' ? '✅' : data.status === 'Cancelled' ? '❌' : data.status === 'Completed' ? '🏆' : 'ℹ️';
      const notif = await Notification.create({
        recipient: data.userId,
        title: `${statusIcon} Reservation ${data.status}`,
        message: `Your reservation for ${data.carTitle} has been updated to: ${data.status}.`,
        type: 'reservation',
        link: '/dashboard/reservations'
      });

      const io = getIO();
      if (io) {
        io.to(`user:${data.userId}`).emit('notification_received', notif);
        io.to(`user:${data.userId}`).emit('reservation_updated', {
          reservationId: data.reservationId,
          status: data.status
        });
        io.to('admin').emit('reservation_updated', {
          reservationId: data.reservationId,
          status: data.status
        });
      }
    } catch (err) {
      console.error('[Listener Notification Error]:', err.message);
    }
  });

  // Reservation Cancelled -> Notify Admin
  appEvents.on(eventTypes.RESERVATION_CANCELLED, async (data) => {
    try {
      const admins = await User.find({ role: 'admin' });
      for (const admin of admins) {
        const notif = await Notification.create({
          recipient: admin._id,
          title: '❌ Reservation Cancelled',
          message: `Reservation for ${data.carTitle} was cancelled. Vehicle restored to showroom fleet.`,
          type: 'reservation',
          link: '/admin/reservations'
        });

        const io = getIO();
        if (io) {
          io.to(`user:${admin._id}`).emit('notification_received', notif);
          io.to('admin').emit('notification_received', notif);
          io.to('admin').emit('reservation_updated', {
            reservationId: data.reservationId,
            status: 'Cancelled'
          });
        }
      }
    } catch (err) {
      console.error('[Listener Notification Error]:', err.message);
    }
  });

  console.log('[Listeners] Notification listeners registered');
}

module.exports = registerNotificationListeners;
