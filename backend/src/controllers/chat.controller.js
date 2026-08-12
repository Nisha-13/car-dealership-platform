const ChatService = require('../services/chat.service');
const ApiResponse = require('../utils/apiResponse');

class ChatController {
  static async getConversation(req, res, next) {
    try {
      const messages = await ChatService.getConversation(req.user._id, req.params.peerId);
      return ApiResponse.success(res, messages, 'Conversation retrieved');
    } catch (err) {
      next(err);
    }
  }

  static async getActiveConversations(req, res, next) {
    try {
      const conversations = await ChatService.getActiveConversations(req.user._id, req.user.role);
      return ApiResponse.success(res, conversations, 'Conversations loaded');
    } catch (err) {
      next(err);
    }
  }
}

module.exports = ChatController;
