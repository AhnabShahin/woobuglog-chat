const express = require('express');
const router = express.Router();
const threadController = require('../controllers/thread.controller');
const authMiddleware = require('../middleware/auth.middleware');
const checkDiscordReady = require('../middleware/discord.middleware');

// Apply authentication middleware to all routes
router.use(authMiddleware);

// Check if Discord bot is ready
router.use(checkDiscordReady);

router.post('/create', threadController.createThread);
router.get('/:threadId', threadController.getThread);
router.get('/channel/:channelId', threadController.getThreadsByChannel);
router.post('/:threadId/archive', threadController.archiveThread);
router.post('/:threadId/unarchive', threadController.unarchiveThread);

module.exports = router;
