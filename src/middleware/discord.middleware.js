const discordService = require('../services/discord.service');

/**
 * Middleware to check if Discord bot is ready before processing requests
 */
const checkDiscordReady = (req, res, next) => {
  const status = discordService.getStatus();
  
  if (!status.connected) {
    return res.status(503).json({
      success: false,
      error: {
        code: 'DISCORD_NOT_READY',
        message: 'Discord bot is not connected yet. Please try again in a few moments.',
      },
    });
  }
  
  next();
};

module.exports = checkDiscordReady;
