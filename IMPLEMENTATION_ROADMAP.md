# Implementation Roadmap

This document provides a step-by-step guide to implement the Discord API Integration application.

## 📋 Implementation Checklist

### Phase 1: Project Setup ✅
- [x] Create project structure
- [x] Create `package.json`
- [x] Create `.env.example`
- [x] Create documentation files

### Phase 2: Core Files Implementation
- [ ] Create configuration system
- [ ] Create Discord service
- [ ] Create authentication middleware
- [ ] Create utility functions
- [ ] Create error handler

### Phase 3: Controllers & Routes
- [ ] Create thread controller
- [ ] Create message controller
- [ ] Create thread routes
- [ ] Create message routes
- [ ] Create health route

### Phase 4: Application Setup
- [ ] Create Express app configuration
- [ ] Create server entry point
- [ ] Integrate all components

### Phase 5: Testing & Deployment
- [ ] Test all endpoints
- [ ] Configure for production
- [ ] Deploy application

---

## 📁 Files to Create

### 1. Configuration Files

#### `src/config/config.js`
```javascript
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
```

---

### 2. Discord Service

#### `src/services/discord.service.js`
```javascript
const { Client, GatewayIntentBits, ChannelType } = require('discord.js');
const config = require('../config/config');

class DiscordService {
  constructor() {
    this.client = null;
    this.isReady = false;
  }

  async initialize() {
    this.client = new Client({
      intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent,
        GatewayIntentBits.GuildMembers,
      ],
    });

    this.client.once('ready', () => {
      console.log(`Discord bot logged in as ${this.client.user.tag}`);
      this.isReady = true;
    });

    this.client.on('error', (error) => {
      console.error('Discord client error:', error);
    });

    await this.client.login(config.discord.token);
  }

  // Thread Operations
  async createThread(channelId, options) {
    const channel = await this.client.channels.fetch(channelId);
    if (!channel) throw new Error('Channel not found');

    const thread = await channel.threads.create({
      name: options.name,
      autoArchiveDuration: options.autoArchiveDuration || 60,
      type: options.type || ChannelType.PublicThread,
    });

    if (options.message) {
      await thread.send(options.message);
    }

    return this._formatThread(thread);
  }

  async getThread(threadId) {
    const thread = await this.client.channels.fetch(threadId);
    if (!thread || !thread.isThread()) {
      throw new Error('Thread not found');
    }
    return this._formatThread(thread);
  }

  async getThreadsByChannel(channelId, includeArchived = false) {
    const channel = await this.client.channels.fetch(channelId);
    if (!channel) throw new Error('Channel not found');

    const threads = await channel.threads.fetch({ archived: includeArchived });
    return threads.threads.map(thread => this._formatThread(thread));
  }

  async archiveThread(threadId, locked = false) {
    const thread = await this.client.channels.fetch(threadId);
    if (!thread || !thread.isThread()) {
      throw new Error('Thread not found');
    }

    await thread.setArchived(true);
    if (locked) await thread.setLocked(true);

    return this._formatThread(thread);
  }

  async unarchiveThread(threadId) {
    const thread = await this.client.channels.fetch(threadId);
    if (!thread || !thread.isThread()) {
      throw new Error('Thread not found');
    }

    await thread.setArchived(false);
    return this._formatThread(thread);
  }

  // Message Operations
  async sendMessage(channelId, content, options = {}) {
    const channel = await this.client.channels.fetch(channelId);
    if (!channel) throw new Error('Channel not found');

    const message = await channel.send({
      content,
      embeds: options.embeds,
      reply: options.reply ? { messageReference: options.reply } : undefined,
    });

    return this._formatMessage(message);
  }

  async getMessage(channelId, messageId) {
    const channel = await this.client.channels.fetch(channelId);
    if (!channel) throw new Error('Channel not found');

    const message = await channel.messages.fetch(messageId);
    if (!message) throw new Error('Message not found');

    return this._formatMessage(message);
  }

  async getMessages(channelId, options = {}) {
    const channel = await this.client.channels.fetch(channelId);
    if (!channel) throw new Error('Channel not found');

    const messages = await channel.messages.fetch({
      limit: options.limit || 50,
      before: options.before,
      after: options.after,
    });

    return messages.map(msg => this._formatMessage(msg));
  }

  async editMessage(channelId, messageId, newContent) {
    const channel = await this.client.channels.fetch(channelId);
    if (!channel) throw new Error('Channel not found');

    const message = await channel.messages.fetch(messageId);
    if (!message) throw new Error('Message not found');

    const edited = await message.edit(newContent);
    return this._formatMessage(edited);
  }

  async deleteMessage(channelId, messageId) {
    const channel = await this.client.channels.fetch(channelId);
    if (!channel) throw new Error('Channel not found');

    const message = await channel.messages.fetch(messageId);
    if (!message) throw new Error('Message not found');

    await message.delete();
    return { messageId, channelId };
  }

  // Helper Methods
  _formatThread(thread) {
    return {
      threadId: thread.id,
      name: thread.name,
      channelId: thread.parentId,
      ownerId: thread.ownerId,
      memberCount: thread.memberCount,
      messageCount: thread.messageCount,
      archived: thread.archived,
      locked: thread.locked,
      autoArchiveDuration: thread.autoArchiveDuration,
      createdAt: thread.createdAt,
    };
  }

  _formatMessage(message) {
    return {
      messageId: message.id,
      content: message.content,
      authorId: message.author.id,
      authorUsername: message.author.username,
      channelId: message.channelId,
      timestamp: message.createdAt,
      edited: message.edited,
      editedTimestamp: message.editedAt,
      attachments: message.attachments.map(a => ({
        id: a.id,
        url: a.url,
        filename: a.name,
        size: a.size,
      })),
      embeds: message.embeds.length,
      reactions: message.reactions.cache.map(r => ({
        emoji: r.emoji.name,
        count: r.count,
      })),
      reference: message.reference ? message.reference.messageId : null,
      url: message.url,
    };
  }

  getStatus() {
    return {
      connected: this.isReady,
      user: this.client?.user?.tag || 'Not connected',
      uptime: this.client?.uptime || 0,
    };
  }
}

// Singleton instance
const discordService = new DiscordService();
module.exports = discordService;
```

---

### 3. Authentication Middleware

#### `src/middleware/auth.middleware.js`
```javascript
const config = require('../config/config');

const authMiddleware = (req, res, next) => {
  // If authentication is disabled, skip checks
  if (!config.auth.enabled) {
    return next();
  }

  // Check for Authorization header
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return res.status(401).json({
      success: false,
      error: {
        code: 'AUTH_REQUIRED',
        message: 'Authentication required. Please provide an API token.',
      },
    });
  }

  // Extract token from "Bearer <token>"
  const token = authHeader.split(' ')[1];

  if (!token || token !== config.auth.token) {
    return res.status(401).json({
      success: false,
      error: {
        code: 'INVALID_TOKEN',
        message: 'Invalid or expired API token.',
      },
    });
  }

  next();
};

module.exports = authMiddleware;
```

---

### 4. Utility Functions

#### `src/utils/errorHandler.js`
```javascript
class AppError extends Error {
  constructor(message, statusCode, code) {
    super(message);
    this.statusCode = statusCode;
    this.code = code;
    Error.captureStackTrace(this, this.constructor);
  }
}

const errorHandler = (err, req, res, next) => {
  let error = { ...err };
  error.message = err.message;

  // Log error for debugging
  if (process.env.NODE_ENV === 'development') {
    console.error('Error:', err);
  }

  // Discord API errors
  if (err.code === 10003 || err.code === 10008) {
    error = new AppError('Channel not found', 404, 'CHANNEL_NOT_FOUND');
  }

  if (err.code === 50001) {
    error = new AppError('Missing permissions', 403, 'PERMISSION_DENIED');
  }

  if (err.code === 50035) {
    error = new AppError('Invalid form body', 400, 'VALIDATION_ERROR');
  }

  // Default to 500 server error
  const statusCode = error.statusCode || 500;
  const code = error.code || 'INTERNAL_ERROR';

  res.status(statusCode).json({
    success: false,
    error: {
      code,
      message: error.message || 'Internal server error',
      details: process.env.NODE_ENV === 'development' ? err.stack : undefined,
    },
  });
};

module.exports = { AppError, errorHandler };
```

#### `src/utils/validator.js`
```javascript
const config = require('../config/config');

const validateMessageContent = (content) => {
  if (!content || typeof content !== 'string') {
    throw new Error('Message content is required and must be a string');
  }

  if (content.length > config.app.maxMessageLength) {
    throw new Error(`Message content exceeds maximum length of ${config.app.maxMessageLength} characters`);
  }

  return true;
};

const validateThreadName = (name) => {
  if (!name || typeof name !== 'string') {
    throw new Error('Thread name is required and must be a string');
  }

  if (name.length < 1 || name.length > 100) {
    throw new Error('Thread name must be between 1 and 100 characters');
  }

  return true;
};

const validateSnowflake = (id, fieldName = 'ID') => {
  if (!id || typeof id !== 'string') {
    throw new Error(`${fieldName} is required and must be a string`);
  }

  if (!/^\d{17,19}$/.test(id)) {
    throw new Error(`${fieldName} must be a valid Discord snowflake ID`);
  }

  return true;
};

module.exports = {
  validateMessageContent,
  validateThreadName,
  validateSnowflake,
};
```

---

### 5. Controllers

#### `src/controllers/thread.controller.js`
```javascript
const discordService = require('../services/discord.service');
const { validateThreadName, validateSnowflake } = require('../utils/validator');
const { AppError } = require('../utils/errorHandler');

exports.createThread = async (req, res, next) => {
  try {
    const { channelId, name, autoArchiveDuration, type, message } = req.body;

    validateSnowflake(channelId, 'channelId');
    validateThreadName(name);

    const thread = await discordService.createThread(channelId, {
      name,
      autoArchiveDuration,
      type,
      message,
    });

    res.status(201).json({
      success: true,
      data: thread,
    });
  } catch (error) {
    next(error);
  }
};

exports.getThread = async (req, res, next) => {
  try {
    const { threadId } = req.params;
    validateSnowflake(threadId, 'threadId');

    const thread = await discordService.getThread(threadId);

    res.json({
      success: true,
      data: thread,
    });
  } catch (error) {
    next(error);
  }
};

exports.getThreadsByChannel = async (req, res, next) => {
  try {
    const { channelId } = req.params;
    const { archived } = req.query;

    validateSnowflake(channelId, 'channelId');

    const threads = await discordService.getThreadsByChannel(
      channelId,
      archived === 'true'
    );

    res.json({
      success: true,
      data: {
        threads,
        total: threads.length,
      },
    });
  } catch (error) {
    next(error);
  }
};

exports.archiveThread = async (req, res, next) => {
  try {
    const { threadId } = req.params;
    const { locked } = req.body;

    validateSnowflake(threadId, 'threadId');

    const thread = await discordService.archiveThread(threadId, locked);

    res.json({
      success: true,
      message: 'Thread archived successfully',
      data: thread,
    });
  } catch (error) {
    next(error);
  }
};

exports.unarchiveThread = async (req, res, next) => {
  try {
    const { threadId } = req.params;
    validateSnowflake(threadId, 'threadId');

    const thread = await discordService.unarchiveThread(threadId);

    res.json({
      success: true,
      message: 'Thread unarchived successfully',
      data: thread,
    });
  } catch (error) {
    next(error);
  }
};
```

#### `src/controllers/message.controller.js`
```javascript
const discordService = require('../services/discord.service');
const { validateMessageContent, validateSnowflake } = require('../utils/validator');

exports.sendMessage = async (req, res, next) => {
  try {
    const { channelId, threadId, content } = req.body;

    const targetId = threadId || channelId;
    if (!targetId) {
      throw new Error('Either channelId or threadId is required');
    }

    validateSnowflake(targetId, 'channelId/threadId');
    validateMessageContent(content);

    const message = await discordService.sendMessage(targetId, content);

    res.status(201).json({
      success: true,
      data: message,
    });
  } catch (error) {
    next(error);
  }
};

exports.sendEmbed = async (req, res, next) => {
  try {
    const { channelId, threadId, embed } = req.body;

    const targetId = threadId || channelId;
    if (!targetId) {
      throw new Error('Either channelId or threadId is required');
    }

    validateSnowflake(targetId, 'channelId/threadId');

    if (!embed || typeof embed !== 'object') {
      throw new Error('Embed object is required');
    }

    const message = await discordService.sendMessage(targetId, '', {
      embeds: [embed],
    });

    res.status(201).json({
      success: true,
      data: message,
    });
  } catch (error) {
    next(error);
  }
};

exports.replyToMessage = async (req, res, next) => {
  try {
    const { channelId, messageId, content, mention } = req.body;

    validateSnowflake(channelId, 'channelId');
    validateSnowflake(messageId, 'messageId');
    validateMessageContent(content);

    const message = await discordService.sendMessage(channelId, content, {
      reply: { messageReference: messageId, failIfNotExists: false },
    });

    res.status(201).json({
      success: true,
      data: message,
    });
  } catch (error) {
    next(error);
  }
};

exports.getMessages = async (req, res, next) => {
  try {
    const { channelId } = req.params;
    const { limit, before, after } = req.query;

    validateSnowflake(channelId, 'channelId');

    const messages = await discordService.getMessages(channelId, {
      limit: parseInt(limit) || 50,
      before,
      after,
    });

    res.json({
      success: true,
      data: {
        messages,
        count: messages.length,
        hasMore: messages.length === (parseInt(limit) || 50),
      },
    });
  } catch (error) {
    next(error);
  }
};

exports.getLatestMessages = async (req, res, next) => {
  try {
    const { channelId } = req.params;
    const { count } = req.query;

    validateSnowflake(channelId, 'channelId');

    const messages = await discordService.getMessages(channelId, {
      limit: Math.min(parseInt(count) || 10, 50),
    });

    res.json({
      success: true,
      data: {
        messages,
        count: messages.length,
      },
    });
  } catch (error) {
    next(error);
  }
};

exports.getMessage = async (req, res, next) => {
  try {
    const { channelId, messageId } = req.params;

    validateSnowflake(channelId, 'channelId');
    validateSnowflake(messageId, 'messageId');

    const message = await discordService.getMessage(channelId, messageId);

    res.json({
      success: true,
      data: message,
    });
  } catch (error) {
    next(error);
  }
};

exports.editMessage = async (req, res, next) => {
  try {
    const { channelId, messageId } = req.params;
    const { content } = req.body;

    validateSnowflake(channelId, 'channelId');
    validateSnowflake(messageId, 'messageId');
    validateMessageContent(content);

    const message = await discordService.editMessage(channelId, messageId, content);

    res.json({
      success: true,
      message: 'Message updated successfully',
      data: message,
    });
  } catch (error) {
    next(error);
  }
};

exports.deleteMessage = async (req, res, next) => {
  try {
    const { channelId, messageId } = req.params;

    validateSnowflake(channelId, 'channelId');
    validateSnowflake(messageId, 'messageId');

    const result = await discordService.deleteMessage(channelId, messageId);

    res.json({
      success: true,
      message: 'Message deleted successfully',
      data: result,
    });
  } catch (error) {
    next(error);
  }
};
```

---

### 6. Routes

#### `src/routes/thread.routes.js`
```javascript
const express = require('express');
const router = express.Router();
const threadController = require('../controllers/thread.controller');
const authMiddleware = require('../middleware/auth.middleware');

// Apply authentication middleware to all routes
router.use(authMiddleware);

router.post('/create', threadController.createThread);
router.get('/:threadId', threadController.getThread);
router.get('/channel/:channelId', threadController.getThreadsByChannel);
router.post('/:threadId/archive', threadController.archiveThread);
router.post('/:threadId/unarchive', threadController.unarchiveThread);

module.exports = router;
```

#### `src/routes/message.routes.js`
```javascript
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
```

---

### 7. Express Application

#### `src/app.js`
```javascript
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
      discord: discordStatus.connected ? 'connected' : 'disconnected',
      authentication: config.auth.enabled ? 'enabled' : 'disabled',
    },
    uptime: process.uptime(),
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
```

---

### 8. Server Entry Point

#### `server.js`
```javascript
const app = require('./src/app');
const config = require('./src/config/config');
const discordService = require('./src/services/discord.service');

const startServer = async () => {
  try {
    // Initialize Discord bot
    console.log('Initializing Discord bot...');
    await discordService.initialize();
    console.log('Discord bot connected successfully');

    // Start Express server
    const PORT = config.api.port;
    app.listen(PORT, () => {
      console.log(`\n🚀 Server running on port ${PORT}`);
      console.log(`📍 API Base URL: http://localhost:${PORT}/api/v1`);
      console.log(`🔐 Authentication: ${config.auth.enabled ? 'ENABLED' : 'DISABLED'}`);
      console.log(`🌍 Environment: ${config.api.nodeEnv}\n`);
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
};

// Handle graceful shutdown
process.on('SIGTERM', () => {
  console.log('SIGTERM received, shutting down gracefully...');
  discordService.client?.destroy();
  process.exit(0);
});

process.on('SIGINT', () => {
  console.log('SIGINT received, shutting down gracefully...');
  discordService.client?.destroy();
  process.exit(0);
});

// Start the server
startServer();
```

---

## 🚀 Implementation Steps

### Step 1: Create Directory Structure
```bash
mkdir -p src/{config,middleware,controllers,services,routes,utils}
```

### Step 2: Install Dependencies
```bash
npm install
```

### Step 3: Create `.env` File
```bash
cp .env.example .env
# Edit .env with your Discord credentials
```

### Step 4: Create All Source Files
Create each file listed above in the correct directory with the provided code.

### Step 5: Test the Application
```bash
# Start in development mode
npm run dev

# Test health endpoint
curl http://localhost:3000/api/v1/health
```

### Step 6: Test API Endpoints
Use the examples in `API_QUICK_REFERENCE.md` to test each endpoint.

---

## ✅ Implementation Verification

After implementing all files, verify:

1. **Discord Bot Connects**: Check console for "Discord bot logged in as..."
2. **Server Starts**: Check for "Server running on port 3000"
3. **Health Endpoint Works**: `curl http://localhost:3000/api/v1/health`
4. **Authentication Works**: Test with and without token
5. **Create Thread Works**: Test thread creation
6. **Send Message Works**: Test message sending
7. **Get Messages Works**: Test message retrieval
8. **Error Handling Works**: Test invalid requests

---

## 🐛 Common Issues & Solutions

### Issue: "Invalid authentication token"
- Check `.env` file has correct `DISCORD_BOT_TOKEN`
- Verify token hasn't been regenerated in Discord portal

### Issue: "Channel not found"
- Enable Developer Mode in Discord
- Right-click channel and copy ID
- Ensure bot has access to the channel

### Issue: "Missing permissions"
- Check bot permissions in Discord server
- Ensure required permissions are granted

---

## 📚 Next Steps

After implementation:
1. Test all endpoints thoroughly
2. Add additional features as needed
3. Configure for production deployment
4. Set up monitoring and logging
5. Create backup procedures

---

**Happy Coding! 🎉**
