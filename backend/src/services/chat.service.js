const Message = require('../models/Message');
const User = require('../models/User');

class ChatService {
  static async getConversation(userId, peerId) {
    // Mark incoming messages as read
    await Message.updateMany(
      { sender: peerId, recipient: userId, read: false },
      { $set: { read: true } }
    );

    return await Message.find({
      $or: [
        { sender: userId, recipient: peerId },
        { sender: peerId, recipient: userId }
      ]
    })
      .populate('sender', 'name email role avatar')
      .populate('recipient', 'name email role avatar')
      .populate('car', 'title brand model price images')
      .sort('createdAt');
  }

  static async getActiveConversations(userId, role) {
    if (role === 'admin') {
      // For Admin, get all unique customers who have messaged or been messaged
      const messages = await Message.find({
        $or: [{ sender: userId }, { recipient: userId }]
      })
        .populate('sender', 'name email role avatar phone')
        .populate('recipient', 'name email role avatar phone')
        .sort('-createdAt');

      const conversationsMap = new Map();

      for (const msg of messages) {
        const peer = msg.sender._id.toString() === userId.toString() ? msg.recipient : msg.sender;
        if (peer && !conversationsMap.has(peer._id.toString())) {
          conversationsMap.set(peer._id.toString(), {
            peer,
            lastMessage: msg.content,
            lastMessageDate: msg.createdAt,
            unreadCount: msg.recipient._id.toString() === userId.toString() && !msg.read ? 1 : 0
          });
        }
      }

      return Array.from(conversationsMap.values());
    } else {
      // For customer, conversation is with the primary Admin / Dealer team
      const adminUser = await User.findOne({ role: 'admin' });
      if (!adminUser) return [];

      const messages = await Message.find({
        $or: [
          { sender: userId, recipient: adminUser._id },
          { sender: adminUser._id, recipient: userId }
        ]
      })
        .populate('sender', 'name email role avatar')
        .populate('recipient', 'name email role avatar')
        .sort('-createdAt');

      const unreadCount = await Message.countDocuments({
        sender: adminUser._id,
        recipient: userId,
        read: false
      });

      return [{
        peer: adminUser,
        lastMessage: messages.length > 0 ? messages[0].content : 'Start a conversation with our dealer team',
        lastMessageDate: messages.length > 0 ? messages[0].createdAt : new Date(),
        unreadCount
      }];
    }
  }
}

module.exports = ChatService;
