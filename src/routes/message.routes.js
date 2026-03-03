const express = require('express');
const router = express.Router();
const messageController = require('../controllers/message.controller');
const authMiddleware = require('../middleware/auth.middleware');
const checkDiscordReady = require('../middleware/discord.middleware');

// Apply authentication middleware to all routes
router.use(authMiddleware);

// Check if Discord bot is ready
router.use(checkDiscordReady);

router.post('/send', messageController.sendMessage);
router.post('/send-embed', messageController.sendEmbed);
router.post('/reply', messageController.replyToMessage);
router.get('/:channelId', messageController.getMessages);
router.get('/:channelId/latest', messageController.getLatestMessages);
router.get('/:channelId/:messageId', messageController.getMessage);
router.patch('/:channelId/:messageId', messageController.editMessage);
router.delete('/:channelId/:messageId', messageController.deleteMessage);

module.exports = router;
