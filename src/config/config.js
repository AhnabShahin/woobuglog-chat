require('dotenv').config();

module.exports = {
  // Discord Configuration
  discord: {
    token: process.env.DISCORD_BOT_TOKEN,
    guildId: process.env.DISCORD_GUILD_ID,
    defaultChannelId: process.env.DISCORD_DEFAULT_CHANNEL_ID,
  },

  // API Configuration
  api: {
    port: process.env.PORT || 3000,
    nodeEnv: process.env.NODE_ENV || 'development',
  },

  // Authentication Configuration
  auth: {
    enabled: process.env.API_AUTH_ENABLED === 'true',
    token: process.env.API_TOKEN,
  },

  // Rate Limiting
  rateLimit: {
    windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS) || 60000,
    maxRequests: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS) || 100,
  },

  // Application Settings
  app: {
    logLevel: process.env.LOG_LEVEL || 'info',
    corsOrigin: process.env.CORS_ORIGIN || '*',
    requestTimeout: parseInt(process.env.REQUEST_TIMEOUT) || 30000,
    maxMessageLength: parseInt(process.env.MAX_MESSAGE_LENGTH) || 2000,
    defaultMessageLimit: parseInt(process.env.DEFAULT_MESSAGE_LIMIT) || 50,
  },
};
