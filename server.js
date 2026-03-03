const app = require('./src/app');
const config = require('./src/config/config');
const discordService = require('./src/services/discord.service');

let server;

const startServer = async () => {
  try {
    // Start Express server FIRST so Render can detect the open port
    const PORT = config.api.port;
    server = app.listen(PORT, '0.0.0.0', () => {
      console.log('═══════════════════════════════════════════════════');
      console.log('🚀 Server running on port ' + PORT);
      console.log('📍 API Base URL: http://localhost:' + PORT + '/api/v1');
      console.log('🔐 Authentication: ' + (config.auth.enabled ? 'ENABLED' : 'DISABLED'));
      console.log('🌍 Environment: ' + config.api.nodeEnv);
      console.log('═══════════════════════════════════════════════════\n');
      console.log('📖 Available endpoints:');
      console.log('   GET  /api/v1/health');
      console.log('   GET  /api/v1/discord/status');
      console.log('   POST /api/v1/discord/reconnect');
      console.log('   POST /api/v1/threads/create');
      console.log('   POST /api/v1/messages/send');
      console.log('   GET  /api/v1/messages/:channelId');
      console.log('\n💡 Tip: Check FEATURE_DOCUMENTATION.md for full API details');
      console.log('═══════════════════════════════════════════════════\n');
    });

    // Initialize Discord bot AFTER server is listening
    console.log('🤖 Initializing Discord bot...');
    console.log('⏳ Connection may take up to 60 seconds, with automatic retries...\n');
    
    discordService.initialize()
      .then(() => {
        const status = discordService.getStatus();
        if (status.connected) {
          console.log('✅ Discord bot connected successfully');
          console.log(`👤 Bot user: ${status.user}`);
          console.log('🎯 API is ready to handle Discord requests\n');
        } else {
          console.error('⚠️  Discord bot initialization completed but bot is not connected');
          console.error('⚠️  Please check your DISCORD_BOT_TOKEN in Render dashboard');
          console.error('⚠️  Server is running but Discord API endpoints will return 503\n');
        }
      })
      .catch((error) => {
        console.error('❌ Discord bot failed to connect:', error.message);
        console.error('⚠️  Server is running but Discord features will not work');
        console.error('📋 Action required: Verify environment variables in Render dashboard:');
        console.error('   - DISCORD_BOT_TOKEN (required)');
        console.error('   - DISCORD_GUILD_ID (optional)');
        console.error('   - DISCORD_DEFAULT_CHANNEL_ID (optional)\n');
      });

  } catch (error) {
    console.error('❌ Failed to start server:', error);
    process.exit(1);
  }
};

// Handle graceful shutdown
const shutdown = () => {
  console.log('\n⚠️  Shutting down gracefully...');
  if (server) {
    server.close(() => {
      console.log('✅ HTTP server closed');
      discordService.client?.destroy();
      process.exit(0);
    });
  } else {
    discordService.client?.destroy();
    process.exit(0);
  }
};

process.on('SIGTERM', shutdown);
process.on('SIGINT', shutdown);

// Start the server
startServer();
