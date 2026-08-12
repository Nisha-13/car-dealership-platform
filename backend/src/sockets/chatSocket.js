const Message = require('../models/Message');
const Notification = require('../models/Notification');
const appEvents = require('../events/appEvents');
const eventTypes = require('../events/eventTypes');

function registerChatSocket(io, socket) {
  // Real-time message sending
  socket.on('send_message', async (data, callback) => {
    try {
      const { recipientId, content, carId } = data;
      const senderId = socket.user ? socket.user.id : null;

      if (!senderId) {
        if (callback) callback({ status: 'error', message: 'Authentication required' });
        return;
      }

      if (!recipientId || !content) {
        if (callback) callback({ status: 'error', message: 'Recipient and content required' });
        return;
      }

      // Persist message to DB
      const messageObj = await Message.create({
        sender: senderId,
        recipient: recipientId,
        car: carId || null,
        content: content,
        read: false
      });

      const populatedMsg = await Message.findById(messageObj._id)
        .populate('sender', 'name email role avatar')
        .populate('recipient', 'name email role avatar')
        .populate('car', 'title brand model price images');

      // Emit to recipient room
      io.to(`user:${recipientId}`).emit('receive_message', populatedMsg);
      // Emit back to sender room for multi-device sync
      io.to(`user:${senderId}`).emit('receive_message', populatedMsg);

      // Create notification for recipient if not already active
      await Notification.create({
        recipient: recipientId,
        title: '💬 New Chat Message',
        message: `${populatedMsg.sender.name}: ${content.substring(0, 50)}${content.length > 50 ? '...' : ''}`,
        type: 'chat',
        link: socket.user.role === 'admin' ? '/dashboard/messages' : '/admin/messages'
      });

      appEvents.emit(eventTypes.MESSAGE_SENT, populatedMsg);

      if (callback) callback({ status: 'ok', data: populatedMsg });
    } catch (err) {
      console.error('[Socket Chat Error]:', err.message);
      if (callback) callback({ status: 'error', message: err.message });
    }
  });

  // Typing indicators
  socket.on('typing_start', (data) => {
    if (data.recipientId && socket.user) {
      io.to(`user:${data.recipientId}`).emit('user_typing', { senderId: socket.user.id });
    }
  });

  socket.on('typing_stop', (data) => {
    if (data.recipientId && socket.user) {
      io.to(`user:${data.recipientId}`).emit('user_stop_typing', { senderId: socket.user.id });
    }
  });
}

module.exports = registerChatSocket;
