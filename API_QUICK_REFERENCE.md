# Discord API - Quick Reference Guide

Quick reference for all API endpoints. For detailed documentation, see [FEATURE_DOCUMENTATION.md](FEATURE_DOCUMENTATION.md)

**Base URL**: `http://localhost:3000/api/v1`

**Authentication**: `Authorization: Bearer YOUR_API_TOKEN` (when enabled)

---

## 🧵 Thread Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| `POST` | `/threads/create` | Create a new thread |
| `GET` | `/threads/:threadId` | Get thread information |
| `GET` | `/threads/channel/:channelId` | List all threads in a channel |
| `POST` | `/threads/:threadId/archive` | Archive a thread |
| `POST` | `/threads/:threadId/unarchive` | Unarchive a thread |

### Create Thread
```bash
POST /api/v1/threads/create
Body: {
  "channelId": "string",
  "name": "string",
  "autoArchiveDuration": 60,
  "message": "string (optional)"
}
```

---

## 💬 Message Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| `POST` | `/messages/send` | Send a message |
| `POST` | `/messages/send-embed` | Send an embed message |
| `POST` | `/messages/reply` | Reply to a message |
| `GET` | `/messages/:channelId` | Get messages from channel/thread |
| `GET` | `/messages/:channelId/latest` | Get latest messages |
| `GET` | `/messages/:channelId/:messageId` | Get specific message |
| `PATCH` | `/messages/:channelId/:messageId` | Edit a message |
| `DELETE` | `/messages/:channelId/:messageId` | Delete a message |

### Send Message

**To Channel:**
```bash
POST /api/v1/messages/send
Body: {
  "channelId": "string",
  "content": "string"
}
```

**To Thread:**
```bash
POST /api/v1/messages/send
Body: {
  "threadId": "string",
  "content": "string"
}
```

**Priority:** If both `channelId` and `threadId` are provided, message goes to **thread**.

### Send Embed
```bash
POST /api/v1/messages/send-embed
Body: {
  "channelId": "string",
  "embed": {
    "title": "string",
    "description": "string",
    "color": 3447003,
    "fields": []
  }
}
```

### Get Messages
```bash
GET /api/v1/messages/:channelId?limit=50&before=id&after=id
```

### Reply to Message
```bash
POST /api/v1/messages/reply
Body: {
  "channelId": "string",
  "messageId": "string",
  "content": "string",
  "mention": false
}
```

---

## 🏥 Health Endpoint

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/health` | Check API health status |

```bash
GET /api/v1/health
```

---

## 🔑 Authentication Toggle

Control authentication from `.env` file:

**Enable Authentication:**
```env
API_AUTH_ENABLED=true
API_TOKEN=your_secret_token
```

**Disable Authentication:**
```env
API_AUTH_ENABLED=false
```

When enabled, include header in all requests:
```
Authorization: Bearer YOUR_API_TOKEN
```

---

## 📝 Quick Examples

### Example 1: Create Thread & Send Message
```bash
# Create thread
curl -X POST http://localhost:3000/api/v1/threads/create \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"channelId":"123","name":"New Thread"}'

# Send message to thread
curl -X POST http://localhost:3000/api/v1/messages/send \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"threadId":"456","content":"Hello!"}'
```

### Example 2: Get Latest Messages
```bash
curl -H "Authorization: Bearer YOUR_TOKEN" \
  "http://localhost:3000/api/v1/messages/CHANNEL_ID/latest?count=10"
```

### Example 3: Send Embed
```bash
curl -X POST http://localhost:3000/api/v1/messages/send-embed \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "channelId":"123",
    "embed":{
      "title":"Alert",
      "description":"System notification",
      "color":16711680
    }
  }'
```

---

## ⚠️ Error Codes

| Code | Status | Meaning |
|------|--------|---------|
| `AUTH_REQUIRED` | 401 | Token missing |
| `INVALID_TOKEN` | 401 | Invalid token |
| `CHANNEL_NOT_FOUND` | 404 | Channel doesn't exist |
| `THREAD_NOT_FOUND` | 404 | Thread doesn't exist |
| `MESSAGE_NOT_FOUND` | 404 | Message doesn't exist |
| `PERMISSION_DENIED` | 403 | Insufficient permissions |
| `VALIDATION_ERROR` | 400 | Invalid parameters |
| `RATE_LIMIT` | 429 | Too many requests |

---

## 🎨 Common Embed Colors

| Color | Decimal | Hex |
|-------|---------|-----|
| Red | 15158332 | #FF5733 |
| Green | 3066993 | #2ECC71 |
| Blue | 3447003 | #3498DB |
| Yellow | 16776960 | #FFFF00 |
| Orange | 16744192 | #FF8000 |
| Purple | 10181046 | #9B59B6 |

---

## 🔧 Setup Checklist

- [ ] Create Discord bot at [Discord Developer Portal](https://discord.com/developers/applications)
- [ ] Copy bot token
- [ ] Add bot to your server with proper permissions
- [ ] Copy `.env.example` to `.env`
- [ ] Fill in `DISCORD_BOT_TOKEN` and `DISCORD_GUILD_ID`
- [ ] Generate secure `API_TOKEN` if using authentication
- [ ] Set `API_AUTH_ENABLED=true` or `false`
- [ ] Install dependencies: `npm install`
- [ ] Start server: `npm start`

---

## 📚 Resources

- Full Documentation: [FEATURE_DOCUMENTATION.md](FEATURE_DOCUMENTATION.md)
- Discord Developer Portal: https://discord.com/developers/applications
- Discord.js Guide: https://discordjs.guide/

---

**Version**: 1.0 | **Updated**: March 1, 2026
