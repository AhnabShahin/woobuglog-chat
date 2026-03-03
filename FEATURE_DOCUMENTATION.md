# Discord API Integration - Feature Developer Documentation

## 📋 Table of Contents
1. [Overview](#overview)
2. [Architecture](#architecture)
3. [Core Features](#core-features)
4. [Environment Configuration](#environment-configuration)
5. [API Reference](#api-reference)
6. [Authentication & Security](#authentication--security)
7. [Error Handling](#error-handling)
8. [Setup & Installation](#setup--installation)
9. [Usage Examples](#usage-examples)

---

## Overview

This Node.js application provides a RESTful API layer for Discord bot operations, enabling programmatic interaction with Discord servers through HTTP endpoints. The application allows external systems to create threads, send messages, and retrieve messages from Discord channels without direct Discord API integration.

### Key Capabilities
- Create and manage Discord threads
- Send messages to channels and threads
- Retrieve messages from channels and threads
- Read thread information and metadata
- Configurable API token authentication (enable/disable)
- No database dependency - stateless architecture
- Rate limiting and error handling

---

## Architecture

### Technology Stack
- **Runtime**: Node.js (v16+)
- **Framework**: Express.js
- **Discord Integration**: discord.js v14
- **Authentication**: Custom token middleware
- **Configuration**: Environment variables

### Application Structure
```
woobuglog-chat/
├── src/
│   ├── config/
│   │   └── config.js              # Central configuration
│   ├── middleware/
│   │   └── auth.middleware.js     # API token authentication
│   ├── controllers/
│   │   ├── thread.controller.js   # Thread operations
│   │   └── message.controller.js  # Message operations
│   ├── services/
│   │   └── discord.service.js     # Discord client wrapper
│   ├── routes/
│   │   ├── thread.routes.js       # Thread endpoints
│   │   └── message.routes.js      # Message endpoints
│   ├── utils/
│   │   ├── errorHandler.js        # Error handling utilities
│   │   └── validator.js           # Input validation
│   └── app.js                     # Express app setup
├── .env                            # Environment variables
├── .env.example                    # Environment template
├── server.js                       # Application entry point
├── package.json
└── FEATURE_DOCUMENTATION.md        # This file
```

---

## Core Features

### 1. Thread Management
- **Create Thread**: Create new threads in Discord channels
- **Get Thread Info**: Retrieve thread metadata and status
- **List Threads**: Get all threads in a channel
- **Archive/Unarchive Thread**: Manage thread lifecycle

### 2. Message Operations
- **Send Message**: Post messages to channels or threads
- **Send Embed**: Send rich embed messages
- **Reply to Message**: Reply to specific messages
- **Edit Message**: Update existing messages
- **Delete Message**: Remove messages

### 3. Message Retrieval
- **Get Messages**: Fetch messages from channels/threads
- **Get Message by ID**: Retrieve specific message
- **Get Latest Messages**: Fetch most recent messages
- **Search Messages**: Filter messages by criteria

### 4. Authentication System
- **Toggle Authentication**: Enable/disable API token requirement
- **Centralized Control**: Manage auth from `.env` configuration
- **Token Validation**: Secure endpoint access when enabled

---

## Environment Configuration

### Required Variables

Create a `.env` file in the root directory:

```env
# Discord Bot Configuration
DISCORD_BOT_TOKEN=your_discord_bot_token_here
DISCORD_GUILD_ID=your_server_id_here
DISCORD_DEFAULT_CHANNEL_ID=your_default_channel_id

# API Configuration
PORT=3000
NODE_ENV=development

# Authentication Configuration
API_AUTH_ENABLED=true                    # Toggle: true/false
API_TOKEN=your_secure_api_token_here    # Your custom API token

# Rate Limiting (Optional)
RATE_LIMIT_WINDOW_MS=60000              # 1 minute
RATE_LIMIT_MAX_REQUESTS=100             # Max requests per window

# Logging
LOG_LEVEL=info                          # debug, info, warn, error
```

### Configuration Details

| Variable | Type | Required | Description |
|----------|------|----------|-------------|
| `DISCORD_BOT_TOKEN` | String | Yes | Discord bot token from Developer Portal |
| `DISCORD_GUILD_ID` | String | Yes | Discord server (guild) ID |
| `DISCORD_DEFAULT_CHANNEL_ID` | String | No | Default channel for operations |
| `PORT` | Number | No | Server port (default: 3000) |
| `API_AUTH_ENABLED` | Boolean | Yes | Enable/disable token authentication |
| `API_TOKEN` | String | Conditional | Required when `API_AUTH_ENABLED=true` |
| `RATE_LIMIT_WINDOW_MS` | Number | No | Rate limit time window in ms |
| `RATE_LIMIT_MAX_REQUESTS` | Number | No | Max requests per window |

---

## API Reference

### Base URL
```
http://localhost:3000/api/v1
```

### Authentication Header
When `API_AUTH_ENABLED=true`, include the token in all requests:
```
Authorization: Bearer YOUR_API_TOKEN
```

---

### Thread Endpoints

#### 1. Create Thread
**POST** `/threads/create`

Create a new thread in a Discord channel.

**Request Body:**
```json
{
  "channelId": "1234567890123456789",
  "name": "Bug Report #123",
  "autoArchiveDuration": 60,
  "type": "GUILD_PUBLIC_THREAD",
  "message": "Initial thread message (optional)"
}
```

**Parameters:**
| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `channelId` | String | Yes | Discord channel ID |
| `name` | String | Yes | Thread name (1-100 chars) |
| `autoArchiveDuration` | Number | No | Auto-archive duration (60, 1440, 4320, 10080 minutes) |
| `type` | String | No | Thread type: `GUILD_PUBLIC_THREAD`, `GUILD_PRIVATE_THREAD` |
| `message` | String | No | Initial message content |

**Response:**
```json
{
  "success": true,
  "data": {
    "threadId": "9876543210987654321",
    "name": "Bug Report #123",
    "channelId": "1234567890123456789",
    "ownerId": "1111111111111111111",
    "archived": false,
    "autoArchiveDuration": 60,
    "createdAt": "2026-03-01T10:30:00.000Z"
  }
}
```

---

#### 2. Get Thread Information
**GET** `/threads/:threadId`

Retrieve details about a specific thread.

**Response:**
```json
{
  "success": true,
  "data": {
    "threadId": "9876543210987654321",
    "name": "Bug Report #123",
    "channelId": "1234567890123456789",
    "parentChannelId": "1234567890123456789",
    "ownerId": "1111111111111111111",
    "memberCount": 5,
    "messageCount": 23,
    "archived": false,
    "locked": false,
    "autoArchiveDuration": 60,
    "createdAt": "2026-03-01T10:30:00.000Z"
  }
}
```

---

#### 3. List All Threads
**GET** `/threads/channel/:channelId`

Get all active and archived threads in a channel.

**Query Parameters:**
- `archived` (boolean): Include archived threads (default: false)
- `limit` (number): Max threads to return (default: 50, max: 100)

**Response:**
```json
{
  "success": true,
  "data": {
    "threads": [
      {
        "threadId": "9876543210987654321",
        "name": "Bug Report #123",
        "messageCount": 23,
        "memberCount": 5,
        "archived": false,
        "createdAt": "2026-03-01T10:30:00.000Z"
      }
    ],
    "total": 1
  }
}
```

---

#### 4. Archive Thread
**POST** `/threads/:threadId/archive`

Archive a thread.

**Request Body:**
```json
{
  "locked": false
}
```

**Response:**
```json
{
  "success": true,
  "message": "Thread archived successfully",
  "data": {
    "threadId": "9876543210987654321",
    "archived": true,
    "locked": false
  }
}
```

---

#### 5. Unarchive Thread
**POST** `/threads/:threadId/unarchive`

Unarchive a thread to make it active.

**Response:**
```json
{
  "success": true,
  "message": "Thread unarchived successfully",
  "data": {
    "threadId": "9876543210987654321",
    "archived": false
  }
}
```

---

### Message Endpoints

#### 1. Send Message
**POST** `/messages/send`

Send a message to a channel or thread.

**Request Body:**
```json
{
  "channelId": "1234567890123456789",
  "content": "Hello from the API!",
  "threadId": "9876543210987654321"
}
```

**Parameters:**
| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `channelId` | String | Yes* | Discord channel ID |
| `threadId` | String | Yes* | Discord thread ID (use channelId OR threadId) |
| `content` | String | Yes** | Message content (up to 2000 chars) |
| `embeds` | Array | No | Array of embed objects |

**Response:**
```json
{
  "success": true,
  "data": {
    "messageId": "5555555555555555555",
    "channelId": "1234567890123456789",
    "content": "Hello from the API!",
    "authorId": "bot_user_id",
    "timestamp": "2026-03-01T10:35:00.000Z",
    "url": "https://discord.com/channels/..."
  }
}
```

---

#### 2. Send Embed Message
**POST** `/messages/send-embed`

Send a rich embed message.

**Request Body:**
```json
{
  "channelId": "1234567890123456789",
  "embed": {
    "title": "System Alert",
    "description": "This is an important notification",
    "color": 3447003,
    "fields": [
      {
        "name": "Status",
        "value": "Active",
        "inline": true
      },
      {
        "name": "Priority",
        "value": "High",
        "inline": true
      }
    ],
    "footer": {
      "text": "Automated System"
    },
    "timestamp": "2026-03-01T10:35:00.000Z"
  }
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "messageId": "6666666666666666666",
    "channelId": "1234567890123456789",
    "embeds": 1,
    "timestamp": "2026-03-01T10:35:00.000Z"
  }
}
```

---

#### 3. Get Messages
**GET** `/messages/:channelId`

Retrieve messages from a channel or thread.

**Query Parameters:**
- `limit` (number): Number of messages (default: 50, max: 100)
- `before` (string): Get messages before this message ID
- `after` (string): Get messages after this message ID

**Response:**
```json
{
  "success": true,
  "data": {
    "messages": [
      {
        "messageId": "5555555555555555555",
        "content": "Hello from the API!",
        "authorId": "1111111111111111111",
        "authorUsername": "BotUser",
        "channelId": "1234567890123456789",
        "timestamp": "2026-03-01T10:35:00.000Z",
        "edited": false,
        "attachments": [],
        "embeds": [],
        "reactions": []
      }
    ],
    "count": 1,
    "hasMore": false
  }
}
```

---

#### 4. Get Message by ID
**GET** `/messages/:channelId/:messageId`

Retrieve a specific message.

**Response:**
```json
{
  "success": true,
  "data": {
    "messageId": "5555555555555555555",
    "content": "Hello from the API!",
    "authorId": "1111111111111111111",
    "authorUsername": "BotUser",
    "channelId": "1234567890123456789",
    "timestamp": "2026-03-01T10:35:00.000Z",
    "edited": false,
    "editedTimestamp": null,
    "attachments": [],
    "embeds": [],
    "reactions": [],
    "reference": null
  }
}
```

---

#### 5. Reply to Message
**POST** `/messages/reply`

Reply to a specific message.

**Request Body:**
```json
{
  "channelId": "1234567890123456789",
  "messageId": "5555555555555555555",
  "content": "This is a reply!",
  "mention": false
}
```

**Parameters:**
| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `channelId` | String | Yes | Discord channel ID |
| `messageId` | String | Yes | ID of message to reply to |
| `content` | String | Yes | Reply content |
| `mention` | Boolean | No | Mention the original author (default: false) |

**Response:**
```json
{
  "success": true,
  "data": {
    "messageId": "7777777777777777777",
    "channelId": "1234567890123456789",
    "content": "This is a reply!",
    "replyTo": "5555555555555555555",
    "timestamp": "2026-03-01T10:40:00.000Z"
  }
}
```

---

#### 6. Edit Message
**PATCH** `/messages/:channelId/:messageId`

Edit an existing message sent by the bot.

**Request Body:**
```json
{
  "content": "Updated message content"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Message updated successfully",
  "data": {
    "messageId": "5555555555555555555",
    "content": "Updated message content",
    "edited": true,
    "editedTimestamp": "2026-03-01T10:45:00.000Z"
  }
}
```

---

#### 7. Delete Message
**DELETE** `/messages/:channelId/:messageId`

Delete a message.

**Response:**
```json
{
  "success": true,
  "message": "Message deleted successfully",
  "data": {
    "messageId": "5555555555555555555",
    "channelId": "1234567890123456789"
  }
}
```

---

#### 8. Get Latest Messages
**GET** `/messages/:channelId/latest`

Get the most recent messages from a channel/thread.

**Query Parameters:**
- `count` (number): Number of messages (default: 10, max: 50)

**Response:**
```json
{
  "success": true,
  "data": {
    "messages": [
      {
        "messageId": "8888888888888888888",
        "content": "Latest message",
        "authorId": "1111111111111111111",
        "authorUsername": "User",
        "timestamp": "2026-03-01T11:00:00.000Z"
      }
    ],
    "count": 1
  }
}
```

---

### Health & Status Endpoints

#### Health Check
**GET** `/health`

Check API and Discord bot status.

**Response:**
```json
{
  "success": true,
  "status": "healthy",
  "timestamp": "2026-03-01T10:00:00.000Z",
  "services": {
    "api": "up",
    "discord": "connected",
    "authentication": "enabled"
  }
}
```

---

## Authentication & Security

### Token System

The application features a centralized authentication system that can be toggled on/off via environment configuration.

#### Enabling Authentication
Set in `.env`:
```env
API_AUTH_ENABLED=true
API_TOKEN=your_secure_random_token_here
```

#### Disabling Authentication
Set in `.env`:
```env
API_AUTH_ENABLED=false
```

#### Making Authenticated Requests

When authentication is enabled, include the token in the request header:

**cURL Example:**
```bash
curl -X POST http://localhost:3000/api/v1/messages/send \
  -H "Authorization: Bearer your_secure_random_token_here" \
  -H "Content-Type: application/json" \
  -d '{
    "channelId": "1234567890123456789",
    "content": "Hello Discord!"
  }'
```

**JavaScript Example:**
```javascript
fetch('http://localhost:3000/api/v1/messages/send', {
  method: 'POST',
  headers: {
    'Authorization': 'Bearer your_secure_random_token_here',
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    channelId: '1234567890123456789',
    content: 'Hello Discord!'
  })
});
```

### Security Best Practices

1. **Token Generation**: Use cryptographically secure random tokens
   ```bash
   # Generate a secure token
   node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
   ```

2. **HTTPS**: Use HTTPS in production environments
3. **Rate Limiting**: Configure rate limits to prevent abuse
4. **Environment Variables**: Never commit `.env` to version control
5. **Bot Permissions**: Grant only necessary Discord permissions

---

## Error Handling

### Standard Error Response Format

```json
{
  "success": false,
  "error": {
    "code": "ERROR_CODE",
    "message": "Human-readable error message",
    "details": "Additional context (optional)"
  }
}
```

### Error Codes

| Code | Status | Description |
|------|--------|-------------|
| `AUTH_REQUIRED` | 401 | API token required but not provided |
| `INVALID_TOKEN` | 401 | Invalid or expired API token |
| `CHANNEL_NOT_FOUND` | 404 | Discord channel not found |
| `THREAD_NOT_FOUND` | 404 | Discord thread not found |
| `MESSAGE_NOT_FOUND` | 404 | Message not found |
| `PERMISSION_DENIED` | 403 | Bot lacks required permissions |
| `VALIDATION_ERROR` | 400 | Invalid request parameters |
| `RATE_LIMIT` | 429 | Rate limit exceeded |
| `DISCORD_API_ERROR` | 502 | Discord API returned an error |
| `INTERNAL_ERROR` | 500 | Internal server error |

### Example Error Response

```json
{
  "success": false,
  "error": {
    "code": "CHANNEL_NOT_FOUND",
    "message": "The specified channel does not exist or is not accessible",
    "details": "ChannelId: 1234567890123456789"
  }
}
```

---

## Setup & Installation

### Prerequisites
- Node.js v16 or higher
- npm or yarn
- Discord Bot Token
- Discord Server (Guild) with bot added

### Step 1: Discord Bot Setup

1. Go to [Discord Developer Portal](https://discord.com/developers/applications)
2. Create a new application
3. Navigate to "Bot" section and create a bot
4. Copy the bot token
5. Enable required Privileged Gateway Intents:
   - Message Content Intent
   - Server Members Intent (optional)
6. Generate OAuth2 URL with permissions:
   - Send Messages
   - Send Messages in Threads
   - Create Public Threads
   - Create Private Threads
   - Manage Threads
   - Read Message History
   - View Channels
7. Add bot to your server using the generated URL

### Step 2: Project Setup

```bash
# Clone or create project directory
mkdir woobuglog-chat
cd woobuglog-chat

# Initialize Node.js project
npm init -y

# Install dependencies
npm install express discord.js dotenv cors helmet express-rate-limit
npm install -D nodemon

# Create project structure
mkdir -p src/{config,middleware,controllers,services,routes,utils}
```

### Step 3: Configuration

1. Copy `.env.example` to `.env`
2. Fill in your Discord credentials and preferences
3. Generate a secure API token if enabling authentication

### Step 4: Run Application

**Development:**
```bash
npm run dev
```

**Production:**
```bash
npm start
```

The API will be available at `http://localhost:3000` (or your configured port).

---

## Usage Examples

### Example 1: Create Thread and Send Message

```javascript
// Create a thread
const createThreadResponse = await fetch('http://localhost:3000/api/v1/threads/create', {
  method: 'POST',
  headers: {
    'Authorization': 'Bearer YOUR_API_TOKEN',
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    channelId: '1234567890123456789',
    name: 'Customer Support #501',
    autoArchiveDuration: 1440,
    message: 'Support ticket created for customer inquiry'
  })
});

const threadData = await createThreadResponse.json();
const threadId = threadData.data.threadId;

// Send a message to the thread
await fetch('http://localhost:3000/api/v1/messages/send', {
  method: 'POST',
  headers: {
    'Authorization': 'Bearer YOUR_API_TOKEN',
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    threadId: threadId,
    content: 'Thank you for contacting support. We will assist you shortly.'
  })
});
```

### Example 2: Retrieve and Process Messages

```javascript
// Get latest messages from a channel
const response = await fetch(
  'http://localhost:3000/api/v1/messages/1234567890123456789?limit=10',
  {
    headers: {
      'Authorization': 'Bearer YOUR_API_TOKEN'
    }
  }
);

const data = await response.json();

// Process messages
data.data.messages.forEach(message => {
  console.log(`${message.authorUsername}: ${message.content}`);
});
```

### Example 3: Send Rich Embed

```javascript
await fetch('http://localhost:3000/api/v1/messages/send-embed', {
  method: 'POST',
  headers: {
    'Authorization': 'Bearer YOUR_API_TOKEN',
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    channelId: '1234567890123456789',
    embed: {
      title: 'Server Status Update',
      description: 'All systems operational',
      color: 0x00FF00,
      fields: [
        { name: 'API', value: '✅ Online', inline: true },
        { name: 'Database', value: '✅ Online', inline: true },
        { name: 'Uptime', value: '99.9%', inline: true }
      ],
      footer: { text: 'System Monitor' },
      timestamp: new Date().toISOString()
    }
  })
});
```

### Example 4: Monitor Thread for New Messages

```javascript
let lastMessageId = null;

async function pollForNewMessages(threadId) {
  const url = lastMessageId 
    ? `http://localhost:3000/api/v1/messages/${threadId}?after=${lastMessageId}&limit=100`
    : `http://localhost:3000/api/v1/messages/${threadId}?limit=10`;
    
  const response = await fetch(url, {
    headers: { 'Authorization': 'Bearer YOUR_API_TOKEN' }
  });
  
  const data = await response.json();
  
  if (data.success && data.data.messages.length > 0) {
    // Process new messages
    data.data.messages.forEach(msg => {
      console.log('New message:', msg.content);
    });
    
    // Update last message ID
    lastMessageId = data.data.messages[0].messageId;
  }
}

// Poll every 5 seconds
setInterval(() => pollForNewMessages('9876543210987654321'), 5000);
```

---

## Advanced Features

### Rate Limiting Configuration

The application includes rate limiting to prevent abuse:

```javascript
// Configure in .env
RATE_LIMIT_WINDOW_MS=60000        // 1 minute window
RATE_LIMIT_MAX_REQUESTS=100       // 100 requests per minute
```

### Webhook Alternative (Optional Enhancement)

For real-time message delivery, consider implementing webhooks:

**Proposed endpoint:**
```
POST /webhooks/discord
```

This would receive Discord events directly, eliminating the need for polling.

---

## Testing the API

### Using cURL

**Test Health Endpoint:**
```bash
curl http://localhost:3000/api/v1/health
```

**Create Thread:**
```bash
curl -X POST http://localhost:3000/api/v1/threads/create \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "channelId": "YOUR_CHANNEL_ID",
    "name": "Test Thread"
  }'
```

**Send Message:**
```bash
curl -X POST http://localhost:3000/api/v1/messages/send \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "channelId": "YOUR_CHANNEL_ID",
    "content": "Test message from API"
  }'
```

**Get Messages:**
```bash
curl -H "Authorization: Bearer YOUR_TOKEN" \
  http://localhost:3000/api/v1/messages/YOUR_CHANNEL_ID?limit=5
```

### Using Postman

1. Import the API endpoints as a collection
2. Set environment variable for `API_TOKEN`
3. Add authorization header: `Authorization: Bearer {{API_TOKEN}}`
4. Test each endpoint with sample data

---

## Deployment Considerations

### Environment-Specific Configuration

**Development:**
```env
NODE_ENV=development
LOG_LEVEL=debug
API_AUTH_ENABLED=false
```

**Production:**
```env
NODE_ENV=production
LOG_LEVEL=error
API_AUTH_ENABLED=true
API_TOKEN=<strong-random-token>
```

### Recommended Hosting
- **Heroku**: Easy deployment with environment variables
- **DigitalOcean App Platform**: Node.js support
- **AWS Elastic Beanstalk**: Scalable option
- **Docker**: Containerized deployment

### Process Management
Use PM2 for production:
```bash
npm install -g pm2
pm2 start server.js --name discord-api
pm2 save
pm2 startup
```

---

## Troubleshooting

### Common Issues

**1. Bot Not Responding**
- Verify `DISCORD_BOT_TOKEN` is correct
- Ensure bot has proper permissions in Discord server
- Check bot is online in Discord

**2. Authentication Errors**
- Verify `API_AUTH_ENABLED` matches your usage
- Check `API_TOKEN` in `.env` matches request header
- Ensure `Authorization: Bearer <token>` format is correct

**3. Channel/Thread Not Found**
- Verify channel/thread IDs are correct (right-click → Copy ID in Discord)
- Ensure bot has access to the channel
- Check Developer Mode is enabled in Discord settings

**4. Permission Errors**
- Review bot permissions in Discord server settings
- Ensure bot role has sufficient privileges
- Check channel-specific permission overrides

---

## API Versioning

Current version: **v1**

All endpoints are prefixed with `/api/v1/`

Future versions will be introduced as `/api/v2/`, maintaining backward compatibility.

---

## Support & Maintenance

### Logging

Application logs include:
- Request/response logging
- Discord API interactions
- Authentication attempts
- Error stack traces

Configure log level in `.env`:
```env
LOG_LEVEL=info  # debug | info | warn | error
```

### Monitoring Recommendations

1. Monitor API response times
2. Track Discord API rate limits
3. Log authentication failures
4. Monitor bot uptime
5. Track error rates by endpoint

---

## Future Enhancements (Roadmap)

1. **Webhook Support**: Real-time Discord event delivery
2. **Batch Operations**: Send multiple messages in one request
3. **Message Scheduling**: Schedule messages for future delivery
4. **File Upload**: Support for attachments and files
5. **Reaction Management**: Add/remove reactions to messages
6. **User Management**: Get user info and permissions
7. **Channel Management**: Create and manage channels
8. **Role Assignment**: Manage user roles through API
9. **Voice Channel Support**: Voice channel operations
10. **Analytics**: Track message and thread statistics

---

## Contributing

This is an internal feature documentation. For implementation questions or enhancements, contact the development team.

---

## License & Legal

- Ensure compliance with Discord's [Terms of Service](https://discord.com/terms)
- Follow Discord's [Developer Terms](https://discord.com/developers/docs/policies-and-agreements/developer-terms-of-service)
- Respect rate limits and API guidelines
- Do not use for spam or malicious purposes

---

## Appendix

### A. Discord Snowflake IDs

Discord uses Snowflake IDs (Twitter's format):
- 64-bit integers represented as strings
- Sortable by time
- Extract timestamp: `(id >> 22) + 1420070400000`

### B. Auto-Archive Duration Values

Valid values for thread auto-archive:
- `60` - 1 hour
- `1440` - 24 hours
- `4320` - 3 days
- `10080` - 7 days (requires server boost level 2)

### C. Discord Embed Color Codes

Common colors (decimal):
- Red: `15158332` (0xFF5733)
- Green: `3066993` (0x2ECC71)
- Blue: `3447003` (0x3498DB)
- Yellow: `16776960` (0xFFFF00)
- Orange: `16744192` (0xFF8000)
- Purple: `10181046` (0x9B59B6)

### D. Required Discord Bot Permissions

Minimum integer value: `277025508416`

Breakdown:
- View Channels: `1024`
- Send Messages: `2048`
- Send Messages in Threads: `274877906944`
- Create Public Threads: `34359738368`
- Create Private Threads: `68719476736`
- Manage Threads: `17179869184`
- Read Message History: `65536`

---

**Document Version**: 1.0  
**Last Updated**: March 1, 2026  
**Maintained By**: Development Team

