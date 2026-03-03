const app = require('./src/app');
const config = require('./src/config/config');
const discordService = require('./src/services/discord.service');

const startServer = async () => {
  try {
    // Initialize Discord bot
    console.log('🤖 Initializing Discord bot...');
    await discordService.initialize();
    console.log('✅ Discord bot connected successfully\n');

    // Start Express server
    const PORT = config.api.port;
    app.listen(PORT, () => {
      console.log('═══════════════════════════════════════════════════');
      console.log('🚀 Server running on port ' + PORT);
      console.log('📍 API Base URL: http://localhost:' + PORT + '/api/v1');
      console.log('🔐 Authentication: ' + (config.auth.enabled ? 'ENABLED' : 'DISABLED'));
      console.log('🌍 Environment: ' + config.api.nodeEnv);
      console.log('═══════════════════════════════════════════════════\n');
      console.log('📖 Available endpoints:');
      console.log('   GET  /api/v1/health');
      console.log('   POST /api/v1/threads/create');
      console.log('   POST /api/v1/messages/send');
      console.log('   GET  /api/v1/messages/:channelId');
      console.log('\n💡 Tip: Check FEATURE_DOCUMENTATION.md for full API details');
      console.log('═══════════════════════════════════════════════════\n');
    });
  } catch (error) {
    console.error('❌ Failed to start server:', error);
    process.exit(1);
  }
};

// Handle graceful shutdown
process.on('SIGTERM', () => {
  console.log('\n⚠️  SIGTERM received, shutting down gracefully...');
  discordService.client?.destroy();
  process.exit(0);
});

process.on('SIGINT', () => {
  console.log('\n⚠️  SIGINT received, shutting down gracefully...');
  discordService.client?.destroy();
  process.exit(0);
});

// Start the server
startServer();
