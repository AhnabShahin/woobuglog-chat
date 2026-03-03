# 📨 Complete Guide: Messaging in Threads

## 🎯 Quick Start

### Send Message to a Thread

```bash
curl -X POST http://localhost:3000/api/v1/messages/send \
  -H "Authorization: Bearer YOUR_API_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "threadId": "YOUR_THREAD_ID",
    "content": "This message will appear inside the thread"
  }'
```

**That's it!** Just use `threadId` instead of `channelId`.

---

## 📚 All Thread Messaging Methods

### 1️⃣ Send Simple Text Message to Thread

```bash
POST /api/v1/messages/send
```

**Request:**
```json
{
  "threadId": "1475734635781554251",
  "content": "Hello from inside the thread!"
}
```

**Example cURL:**
```bash
curl -X POST http://localhost:3000/api/v1/messages/send \
  -H "Authorization: Bearer 779640d4be14f99c6bebbfe9e68cf9a544c323872f0dd4b48d71139dd09a5431" \
  -H "Content-Type: application/json" \
  -d '{
    "threadId": "1475734635781554251",
    "content": "hussain vai kemon achen?"
  }'
```

---

### 2️⃣ Send Rich Embed to Thread

```bash
POST /api/v1/messages/send-embed
```

**Request:**
```json
{
  "threadId": "1475734635781554251",
  "embed": {
    "title": "Status Update",
    "description": "This is an embed message in the thread",
    "color": 3447003,
    "fields": [
      {
        "name": "Status",
        "value": "Active",
        "inline": true
      }
    ]
  }
}
```

**Example cURL:**
```bash
curl -X POST http://localhost:3000/api/v1/messages/send-embed \
  -H "Authorization: Bearer 779640d4be14f99c6bebbfe9e68cf9a544c323872f0dd4b48d71139dd09a5431" \
  -H "Content-Type: application/json" \
  -d '{
    "threadId": "1475734635781554251",
    "embed": {
      "title": "Thread Notification",
      "description": "Important update in this thread",
      "color": 16711680
    }
  }'
```

---

### 3️⃣ Reply to a Message Inside a Thread

```bash
POST /api/v1/messages/reply
```

**Request:**
```json
{
  "channelId": "1475734635781554251",
  "messageId": "1234567890123456789",
  "content": "This is a reply to a message in the thread",
  "mention": false
}
```

**Note:** For threads, use the `threadId` as the `channelId` parameter.

---

### 4️⃣ Get Messages from a Thread

```bash
GET /api/v1/messages/{threadId}
```

**Example:**
```bash
curl -H "Authorization: Bearer 779640d4be14f99c6bebbfe9e68cf9a544c323872f0dd4b48d71139dd09a5431" \
  "http://localhost:3000/api/v1/messages/1475734635781554251?limit=20"
```

**Response:**
```json
{
  "success": true,
  "data": {
    "messages": [
      {
        "messageId": "1234567890",
        "content": "Message content",
        "authorUsername": "Username",
        "timestamp": "2026-03-01T12:00:00.000Z"
      }
    ],
    "count": 20
  }
}
```

---

### 5️⃣ Edit Message in a Thread

```bash
PATCH /api/v1/messages/{threadId}/{messageId}
```

**Request:**
```json
{
  "content": "Updated message content"
}
```

**Example:**
```bash
curl -X PATCH http://localhost:3000/api/v1/messages/1475734635781554251/1234567890123456789 \
  -H "Authorization: Bearer 779640d4be14f99c6bebbfe9e68cf9a544c323872f0dd4b48d71139dd09a5431" \
  -H "Content-Type: application/json" \
  -d '{
    "content": "Edited message text"
  }'
```

---

### 6️⃣ Delete Message from a Thread

```bash
DELETE /api/v1/messages/{threadId}/{messageId}
```

**Example:**
```bash
curl -X DELETE http://localhost:3000/api/v1/messages/1475734635781554251/1234567890123456789 \
  -H "Authorization: Bearer 779640d4be14f99c6bebbfe9e68cf9a544c323872f0dd4b48d71139dd09a5431"
```

---

## 🔍 Understanding Thread vs Channel IDs

### What's a Thread ID?

A thread is a sub-conversation within a channel. Each thread has its own unique ID.

**How to Get Thread ID:**
1. In Discord, enable **Developer Mode** (Settings → Advanced → Developer Mode)
2. Right-click on the **thread name** (not the channel)
3. Click **"Copy Thread ID"**

### Example:
- **Channel ID**: `1477559419951779963` (the main channel)
- **Thread ID**: `1475734635781554251` (a thread inside that channel)

---

## 📊 Comparison: Channel vs Thread Messaging

| Feature | Channel Message | Thread Message |
|---------|----------------|----------------|
| **Parameter** | `"channelId": "..."` | `"threadId": "..."` |
| **Where it appears** | Main channel | Inside thread |
| **Who sees it** | Everyone with channel access | Thread members + channel viewers |
| **API endpoint** | Same: `/messages/send` | Same: `/messages/send` |

---

## ⚙️ Advanced: Mixed Requests

### What if I provide BOTH channelId and threadId?

**Thread takes priority!**

```json
{
  "channelId": "1477559419951779963",
  "threadId": "1475734635781554251",
  "content": "This goes to the THREAD (not channel)"
}
```

**Result:** Message appears in **thread**, NOT in channel.

**Why?** The API prioritizes `threadId` when both are provided.

---

## 🧪 Testing Thread Messages

### Test Script

Create a file `test-thread.sh`:

```bash
#!/bin/bash

API_TOKEN="779640d4be14f99c6bebbfe9e68cf9a544c323872f0dd4b48d71139dd09a5431"
THREAD_ID="1475734635781554251"

# Send message to thread
curl -X POST http://localhost:3000/api/v1/messages/send \
  -H "Authorization: Bearer ${API_TOKEN}" \
  -H "Content-Type: application/json" \
  -d "{
    \"threadId\": \"${THREAD_ID}\",
    \"content\": \"Test message at $(date)\"
  }"
```

Run it:
```bash
chmod +x test-thread.sh
./test-thread.sh
```

---

## 💡 Common Use Cases

### 1. Bug Tracking Thread

```javascript
// Create thread for bug report
const createBugThread = async (bugId, title) => {
  const thread = await fetch('http://localhost:3000/api/v1/threads/create', {
    method: 'POST',
    headers: {
      'Authorization': 'Bearer YOUR_TOKEN',
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      channelId: 'YOUR_CHANNEL_ID',
      name: `Bug #${bugId}: ${title}`,
      message: 'Bug report created'
    })
  });
  
  const { data } = await thread.json();
  return data.threadId;
};

// Send updates to bug thread
const updateBugThread = async (threadId, message) => {
  await fetch('http://localhost:3000/api/v1/messages/send', {
    method: 'POST',
    headers: {
      'Authorization': 'Bearer YOUR_TOKEN',
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      threadId: threadId,
      content: message
    })
  });
};

// Usage
const threadId = await createBugThread(123, 'Login Issue');
await updateBugThread(threadId, 'Bug reproduced on staging');
await updateBugThread(threadId, 'Fix deployed to production');
```

---

### 2. Customer Support Thread

```javascript
// Create support ticket thread
const createSupportThread = async (customerId, issue) => {
  const response = await fetch('http://localhost:3000/api/v1/threads/create', {
    method: 'POST',
    headers: {
      'Authorization': 'Bearer YOUR_TOKEN',
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      channelId: 'SUPPORT_CHANNEL_ID',
      name: `Support #${customerId}`,
      message: `**Issue:** ${issue}\n**Created:** ${new Date().toISOString()}`
    })
  });
  
  return await response.json();
};

// Send status updates
const sendStatusUpdate = async (threadId, status) => {
  await fetch('http://localhost:3000/api/v1/messages/send-embed', {
    method: 'POST',
    headers: {
      'Authorization': 'Bearer YOUR_TOKEN',
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      threadId: threadId,
      embed: {
        title: 'Status Update',
        description: status,
        color: status === 'Resolved' ? 0x00FF00 : 0xFFAA00,
        timestamp: new Date().toISOString()
      }
    })
  });
};
```

---

### 3. Project Task Thread

```javascript
// Create task thread
const createTask = async (taskId, taskName, assignee) => {
  const response = await fetch('http://localhost:3000/api/v1/threads/create', {
    method: 'POST',
    headers: {
      'Authorization': 'Bearer YOUR_TOKEN',
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      channelId: 'PROJECT_CHANNEL_ID',
      name: `Task #${taskId}: ${taskName}`,
      message: `Assigned to: ${assignee}`
    })
  });
  
  return await response.json();
};

// Post progress updates
const postProgress = async (threadId, percentage, note) => {
  await fetch('http://localhost:3000/api/v1/messages/send', {
    method: 'POST',
    headers: {
      'Authorization': 'Bearer YOUR_TOKEN',
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      threadId: threadId,
      content: `📊 Progress: ${percentage}%\n📝 ${note}`
    })
  });
};
```

---

## 🐛 Troubleshooting

### Problem: Message goes to channel instead of thread

**Solution:**
- Make sure you're using `threadId`, not `channelId`
- Verify the thread ID is correct (right-click thread → Copy Thread ID)
- Check server logs for: `📤 Sending message to thread: [name]`

### Problem: "Channel or thread not found"

**Solutions:**
1. Verify the thread ID is correct
2. Make sure the thread exists and isn't deleted
3. Check if thread is archived (bot needs permission to send to archived threads)
4. Ensure bot is a member of the server

### Problem: Can't find thread ID

**Steps:**
1. Discord → Settings → Advanced → Enable "Developer Mode"
2. Go to your server
3. Find the thread (look for 🧵 icon)
4. Right-click the **thread name** (not the channel)
5. Click "Copy Thread ID"

---

## 📝 Quick Reference Card

```
┌─────────────────────────────────────────────┐
│  SEND MESSAGE TO THREAD                     │
├─────────────────────────────────────────────┤
│  POST /api/v1/messages/send                 │
│                                             │
│  {                                          │
│    "threadId": "YOUR_THREAD_ID",            │
│    "content": "Your message"                │
│  }                                          │
└─────────────────────────────────────────────┘

┌─────────────────────────────────────────────┐
│  SEND EMBED TO THREAD                       │
├─────────────────────────────────────────────┤
│  POST /api/v1/messages/send-embed           │
│                                             │
│  {                                          │
│    "threadId": "YOUR_THREAD_ID",            │
│    "embed": { ... }                         │
│  }                                          │
└─────────────────────────────────────────────┘

┌─────────────────────────────────────────────┐
│  GET MESSAGES FROM THREAD                   │
├─────────────────────────────────────────────┤
│  GET /api/v1/messages/{threadId}            │
└─────────────────────────────────────────────┘
```

---

## ✅ Summary

**To send a message inside a thread:**
1. Use `threadId` parameter (not `channelId`)
2. Get thread ID from Discord (right-click thread → Copy Thread ID)
3. Use same endpoint: `/api/v1/messages/send`
4. Message will appear inside the thread

**Key Point:** Threads are just special channels in Discord's API. Treat `threadId` like a `channelId`!

---

**Need more help?** Check:
- [FEATURE_DOCUMENTATION.md](FEATURE_DOCUMENTATION.md) - Full API docs
- [API_QUICK_REFERENCE.md](API_QUICK_REFERENCE.md) - Quick lookup
- [THREAD_FIX.md](THREAD_FIX.md) - Recent thread messaging fix

**Ready to test?** Run: `./test-thread-messaging.sh` 🚀
