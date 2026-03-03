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
      console.log('   POST /api/v1/threads/create');
      console.log('   POST /api/v1/messages/send');
      console.log('   GET  /api/v1/messages/:channelId');
      console.log('\n💡 Tip: Check FEATURE_DOCUMENTATION.md for full API details');
      console.log('═══════════════════════════════════════════════════\n');
    });

    // Initialize Discord bot AFTER server is listening
    console.log('🤖 Initializing Discord bot...');
    discordService.initialize()
      .then(() => {
        console.log('✅ Discord bot connected successfully\n');
      })
      .catch((error) => {
        console.error('⚠️  Warning: Discord bot failed to connect:', error.message);
        console.log('⚠️  Server is running but Discord features may not work\n');
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
