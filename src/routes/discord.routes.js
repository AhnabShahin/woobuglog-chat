const express = require('express');
const router = express.Router();
const discordService = require('../services/discord.service');
const authMiddleware = require('../middleware/auth.middleware');

// Apply authentication middleware to all routes
router.use(authMiddleware);

/**
 * Get Discord bot status
 * GET /api/v1/discord/status
 */
router.get('/status', (req, res) => {
  const status = discordService.getStatus();
  
  res.json({
    success: true,
    data: {
      connected: status.connected,
      user: status.user,
      uptime: status.uptime,
      retryCount: discordService.retryCount,
      maxRetries: discordService.maxRetries,
    },
  });
});

/**
 * Manually trigger Discord bot reconnection
 * POST /api/v1/discord/reconnect
 */
router.post('/reconnect', async (req, res, next) => {
  try {
    console.log('🔄 Manual reconnection requested via API');
    
    const currentStatus = discordService.getStatus();
    if (currentStatus.connected) {
      return res.json({
        success: true,
        message: 'Bot is already connected',
        data: currentStatus,
      });
    }
    
    // Reset retry count for manual reconnection
    discordService.retryCount = 0;
    
    // Attempt reconnection (don't await, let it run in background)
    discordService.reconnect()
      .then(() => {
        console.log('✅ Manual reconnection successful');
      })
      .catch((error) => {
        console.error('❌ Manual reconnection failed:', error.message);
      });
    
    res.json({
      success: true,
      message: 'Reconnection initiated. Check status in a few moments.',
      data: {
        retryAttempt: 1,
        maxRetries: discordService.maxRetries,
      },
    });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
