const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const config = require('./config/config');
const { errorHandler } = require('./utils/errorHandler');
const discordService = require('./services/discord.service');

// Import routes
const threadRoutes = require('./routes/thread.routes');
const messageRoutes = require('./routes/message.routes');

const app = express();

// Security middleware
app.use(helmet());
app.use(cors({ origin: config.app.corsOrigin }));

// Body parsing middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Rate limiting
const limiter = rateLimit({
  windowMs: config.rateLimit.windowMs,
  max: config.rateLimit.maxRequests,
  message: {
    success: false,
    error: {
      code: 'RATE_LIMIT',
      message: 'Too many requests, please try again later.',
    },
  },
});
app.use('/api/', limiter);

// Health check endpoint
app.get('/api/v1/health', (req, res) => {
  const discordStatus = discordService.getStatus();
  
  res.json({
    success: true,
    status: 'healthy',
    timestamp: new Date().toISOString(),
    services: {
      api: 'up',
      discord: {
        status: discordStatus.connected ? 'connected' : 'disconnected',
        user: discordStatus.user,
        uptime: discordStatus.uptime,
        ready: discordStatus.connected,
      },
      authentication: config.auth.enabled ? 'enabled' : 'disabled',
    },
    uptime: process.uptime(),
    environment: config.api.nodeEnv,
  });
});

// API routes
app.use('/api/v1/threads', threadRoutes);
app.use('/api/v1/messages', messageRoutes);

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    error: {
      code: 'NOT_FOUND',
      message: 'Endpoint not found',
    },
  });
});

// Error handling middleware (must be last)
app.use(errorHandler);

module.exports = app;
