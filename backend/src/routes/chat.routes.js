const express = require('express');
const ChatController = require('../controllers/chat.controller');
const { protect } = require('../middleware/auth.middleware');

const router = express.Router();

router.get('/conversations', protect, ChatController.getActiveConversations);
router.get('/conversation/:peerId', protect, ChatController.getConversation);

module.exports = router;
