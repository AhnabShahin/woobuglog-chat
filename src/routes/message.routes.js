const express = require('express');
const router = express.Router();
const messageController = require('../controllers/message.controller');
const authMiddleware = require('../middleware/auth.middleware');

// Apply authentication middleware to all routes
router.use(authMiddleware);

router.post('/send', messageController.sendMessage);
router.post('/send-embed', messageController.sendEmbed);
router.post('/reply', messageController.replyToMessage);
router.get('/:channelId', messageController.getMessages);
router.get('/:channelId/latest', messageController.getLatestMessages);
router.get('/:channelId/:messageId', messageController.getMessage);
router.patch('/:channelId/:messageId', messageController.editMessage);
router.delete('/:channelId/:messageId', messageController.deleteMessage);

module.exports = router;
