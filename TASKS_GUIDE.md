# Discord API Project - Sequential Task Guide

Complete these tasks in order. Mark each as done as you complete them.

---

## 📋 Phase 1: Discord Bot Setup (Tasks 1-4)

### ✅ Task 1: Set up Discord Bot on Developer Portal
**Instructions:**
1. Go to https://discord.com/developers/applications
2. Click "New Application"
3. Enter name: "WooBugLog Chat Bot" (or your preferred name)
4. Click "Create"

**Verification:** You should see your application dashboard

---

### ✅ Task 2: Enable bot intents and copy bot token
**Instructions:**
1. Click "Bot" in left sidebar
2. Click "Add Bot" → "Yes, do it!"
3. Under "Privileged Gateway Intents" enable:
   - ☑️ Message Content Intent
   - ☑️ Server Members Intent (optional)
4. Click "Reset Token" → Copy the token (save it securely!)

**⚠️ Warning:** Never share this token publicly!

**Verification:** You have the bot token saved

---

### ✅ Task 3: Add bot to Discord server with permissions
**Instructions:**
1. Go to "OAuth2" → "URL Generator"
2. Select scopes:
   - ☑️ bot
   - ☑️ applications.commands
3. Select bot permissions:
   - ☑️ Send Messages
   - ☑️ Send Messages in Threads
   - ☑️ Create Public Threads
   - ☑️ Create Private Threads
   - ☑️ Manage Threads
   - ☑️ Read Message History
   - ☑️ View Channels
4. Copy the generated URL
5. Paste in browser and add bot to your server

**Verification:** Bot appears in your Discord server member list (offline)

---

### ✅ Task 4: Copy Guild ID and Channel IDs from Discord
**Instructions:**
1. In Discord, go to Settings → Advanced
2. Enable "Developer Mode"
3. Right-click your server icon → "Copy Server ID" (this is Guild ID)
4. Right-click any channel → "Copy Channel ID" (save for testing)

**Verification:** You have Guild ID and at least one Channel ID

---

## 📦 Phase 2: Project Setup (Tasks 5-8)

### ✅ Task 5: Install npm dependencies (npm install)
**Instructions:**
```bash
cd /Users/shahin/Desktop/Xpeed/wordpress/woobuglog-chat
npm install
```

**Dependencies installed:**
- express
- discord.js
- dotenv
- cors
- helmet
- express-rate-limit
- nodemon (dev)

**Verification:** `node_modules/` folder exists with packages

---

### ✅ Task 6: Copy .env.example to .env and configure values
**Instructions:**
```bash
cp .env.example .env
```

Edit `.env` file with your values:
```env
DISCORD_BOT_TOKEN=paste_your_bot_token_here
DISCORD_GUILD_ID=paste_your_guild_id_here
DISCORD_DEFAULT_CHANNEL_ID=paste_channel_id_here
PORT=3000
NODE_ENV=development
API_AUTH_ENABLED=true
API_TOKEN=will_generate_in_next_task
RATE_LIMIT_WINDOW_MS=60000
RATE_LIMIT_MAX_REQUESTS=100
LOG_LEVEL=info
```

**Verification:** `.env` file exists with your Discord credentials

---

### ✅ Task 7: Generate secure API token for authentication
**Instructions:**
```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

Copy the output and paste it into `.env` as `API_TOKEN` value.

**Verification:** Your `.env` has a long random string for API_TOKEN

---

### ✅ Task 8: Create src directory structure (7 folders)
**Instructions:**
```bash
mkdir -p src/config
mkdir -p src/middleware
mkdir -p src/controllers
mkdir -p src/services
mkdir -p src/routes
mkdir -p src/utils
```

**Verification:** Run `ls -la src/` and see 6 folders

---

## 🔧 Phase 3: Core Files Implementation (Tasks 9-13)

### ✅ Task 9: Create src/config/config.js file
**Instructions:**
Open `IMPLEMENTATION_ROADMAP.md` and copy the code for `src/config/config.js`

Create the file at: `src/config/config.js`

**What this does:** Centralizes all configuration from environment variables

**Verification:** File exists and exports config object

---

### ✅ Task 10: Create src/services/discord.service.js file
**Instructions:**
Open `IMPLEMENTATION_ROADMAP.md` and copy the code for `src/services/discord.service.js`

Create the file at: `src/services/discord.service.js`

**What this does:** Wraps Discord.js client and provides methods for all Discord operations

**Verification:** File exists with DiscordService class

---

### ✅ Task 11: Create src/middleware/auth.middleware.js file
**Instructions:**
Open `IMPLEMENTATION_ROADMAP.md` and copy the code for `src/middleware/auth.middleware.js`

Create the file at: `src/middleware/auth.middleware.js`

**What this does:** Checks API token when authentication is enabled

**Verification:** File exports authMiddleware function

---

### ✅ Task 12: Create src/utils/errorHandler.js file
**Instructions:**
Open `IMPLEMENTATION_ROADMAP.md` and copy the code for `src/utils/errorHandler.js`

Create the file at: `src/utils/errorHandler.js`

**What this does:** Custom error class and error handling middleware

**Verification:** File exports AppError and errorHandler

---

### ✅ Task 13: Create src/utils/validator.js file
**Instructions:**
Open `IMPLEMENTATION_ROADMAP.md` and copy the code for `src/utils/validator.js`

Create the file at: `src/utils/validator.js`

**What this does:** Input validation functions for messages, threads, IDs

**Verification:** File exports validation functions

---

## 🎮 Phase 4: Controllers Implementation (Tasks 14-15)

### ✅ Task 14: Create src/controllers/thread.controller.js file
**Instructions:**
Open `IMPLEMENTATION_ROADMAP.md` and copy the code for `src/controllers/thread.controller.js`

Create the file at: `src/controllers/thread.controller.js`

**What this does:** Handles all thread-related API requests

**Verification:** File exports 5 controller functions

---

### ✅ Task 15: Create src/controllers/message.controller.js file
**Instructions:**
Open `IMPLEMENTATION_ROADMAP.md` and copy the code for `src/controllers/message.controller.js`

Create the file at: `src/controllers/message.controller.js`

**What this does:** Handles all message-related API requests

**Verification:** File exports 8 controller functions

---

## 🛣️ Phase 5: Routes Implementation (Tasks 16-17)

### ✅ Task 16: Create src/routes/thread.routes.js file
**Instructions:**
Open `IMPLEMENTATION_ROADMAP.md` and copy the code for `src/routes/thread.routes.js`

Create the file at: `src/routes/thread.routes.js`

**What this does:** Defines thread API endpoints and connects to controllers

**Verification:** File exports Express router with 5 routes

---

### ✅ Task 17: Create src/routes/message.routes.js file
**Instructions:**
Open `IMPLEMENTATION_ROADMAP.md` and copy the code for `src/routes/message.routes.js`

Create the file at: `src/routes/message.routes.js`

**What this does:** Defines message API endpoints and connects to controllers

**Verification:** File exports Express router with 8 routes

---

## 🚀 Phase 6: Application Setup (Tasks 18-20)

### ✅ Task 18: Create src/app.js Express app setup
**Instructions:**
Open `IMPLEMENTATION_ROADMAP.md` and copy the code for `src/app.js`

Create the file at: `src/app.js`

**What this does:** Sets up Express with middleware, routes, and error handling

**Verification:** File exports configured Express app

---

### ✅ Task 19: Create server.js entry point file
**Instructions:**
Open `IMPLEMENTATION_ROADMAP.md` and copy the code for `server.js`

Create the file at: `server.js` (root directory)

**What this does:** Initializes Discord bot and starts Express server

**Verification:** File exists in root directory

---

### ✅ Task 20: Start server in dev mode (npm run dev)
**Instructions:**
```bash
npm run dev
```

**Expected output:**
```
Initializing Discord bot...
Discord bot logged in as YourBot#1234
Discord bot connected successfully

🚀 Server running on port 3000
📍 API Base URL: http://localhost:3000/api/v1
🔐 Authentication: ENABLED
🌍 Environment: development
```

**Verification:** Server starts without errors and bot shows as online in Discord

**Troubleshooting:**
- If bot doesn't connect: Check `DISCORD_BOT_TOKEN` in `.env`
- If port conflict: Change `PORT` in `.env`
- If module errors: Run `npm install` again

---

## 🧪 Phase 7: Testing Core Endpoints (Tasks 21-27)

### ✅ Task 21: Test health endpoint - verify bot connection
**Instructions:**
```bash
curl http://localhost:3000/api/v1/health
```

**Expected response:**
```json
{
  "success": true,
  "status": "healthy",
  "services": {
    "api": "up",
    "discord": "connected",
    "authentication": "enabled"
  }
}
```

**Verification:** You get a successful response with discord: "connected"

---

### ✅ Task 22: Test thread creation endpoint
**Instructions:**
```bash
curl -X POST http://localhost:3000/api/v1/threads/create \
  -H "Authorization: Bearer YOUR_API_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "channelId": "YOUR_CHANNEL_ID",
    "name": "Test Thread #1",
    "message": "This is a test thread"
  }'
```

Replace:
- `YOUR_API_TOKEN` with token from `.env`
- `YOUR_CHANNEL_ID` with your Discord channel ID

**Verification:** Thread appears in Discord and you get thread data in response

---

### ✅ Task 23: Test send message endpoint
**Instructions:**
```bash
curl -X POST http://localhost:3000/api/v1/messages/send \
  -H "Authorization: Bearer YOUR_API_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "channelId": "YOUR_CHANNEL_ID",
    "content": "Hello from the API! 👋"
  }'
```

**Verification:** Message appears in Discord channel

---

### ✅ Task 24: Test get messages endpoint
**Instructions:**
```bash
curl -H "Authorization: Bearer YOUR_API_TOKEN" \
  "http://localhost:3000/api/v1/messages/YOUR_CHANNEL_ID?limit=5"
```

**Verification:** You receive array of recent messages from the channel

---

### ✅ Task 25: Test send embed message endpoint
**Instructions:**
```bash
curl -X POST http://localhost:3000/api/v1/messages/send-embed \
  -H "Authorization: Bearer YOUR_API_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "channelId": "YOUR_CHANNEL_ID",
    "embed": {
      "title": "Test Embed",
      "description": "This is a beautiful embed message",
      "color": 3066993,
      "fields": [
        {"name": "Field 1", "value": "Value 1", "inline": true},
        {"name": "Field 2", "value": "Value 2", "inline": true}
      ]
    }
  }'
```

**Verification:** Rich embed appears in Discord

---

### ✅ Task 26: Test reply to message endpoint
**Instructions:**
First, copy a message ID from Discord (right-click message → Copy Message ID)

```bash
curl -X POST http://localhost:3000/api/v1/messages/reply \
  -H "Authorization: Bearer YOUR_API_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "channelId": "YOUR_CHANNEL_ID",
    "messageId": "MESSAGE_ID_TO_REPLY_TO",
    "content": "This is a reply!",
    "mention": false
  }'
```

**Verification:** Reply appears in Discord threaded to original message

---

### ✅ Task 27: Test edit and delete message endpoints
**Instructions:**

**Edit message:**
```bash
curl -X PATCH http://localhost:3000/api/v1/messages/CHANNEL_ID/MESSAGE_ID \
  -H "Authorization: Bearer YOUR_API_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "content": "Updated message content"
  }'
```

**Delete message:**
```bash
curl -X DELETE http://localhost:3000/api/v1/messages/CHANNEL_ID/MESSAGE_ID \
  -H "Authorization: Bearer YOUR_API_TOKEN"
```

**Verification:** Message is edited/deleted in Discord

---

## 🔒 Phase 8: Authentication Testing (Tasks 28-30)

### ✅ Task 28: Test authentication with valid token
**Instructions:**
Make any API request with correct token (already tested above)

**Verification:** Request succeeds with 200/201 status

---

### ✅ Task 29: Test authentication with invalid token
**Instructions:**
```bash
curl -X POST http://localhost:3000/api/v1/messages/send \
  -H "Authorization: Bearer WRONG_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"channelId":"test","content":"test"}'
```

**Expected response:**
```json
{
  "success": false,
  "error": {
    "code": "INVALID_TOKEN",
    "message": "Invalid or expired API token."
  }
}
```

**Verification:** You receive 401 Unauthorized error

---

### ✅ Task 30: Test API_AUTH_ENABLED toggle (on/off)
**Instructions:**

1. Edit `.env` and set: `API_AUTH_ENABLED=false`
2. Restart server: `Ctrl+C` then `npm run dev`
3. Test without token:
```bash
curl -X POST http://localhost:3000/api/v1/messages/send \
  -H "Content-Type: application/json" \
  -d '{
    "channelId": "YOUR_CHANNEL_ID",
    "content": "No auth test"
  }'
```

**Verification:** Request succeeds without Authorization header

4. Set back to `API_AUTH_ENABLED=true` and restart

---

## 🛡️ Phase 9: Error & Security Testing (Tasks 31-32)

### ✅ Task 31: Test error handling with invalid requests
**Instructions:**

**Test 1 - Invalid Channel ID:**
```bash
curl -X POST http://localhost:3000/api/v1/messages/send \
  -H "Authorization: Bearer YOUR_API_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"channelId":"invalid","content":"test"}'
```

**Test 2 - Missing Required Field:**
```bash
curl -X POST http://localhost:3000/api/v1/threads/create \
  -H "Authorization: Bearer YOUR_API_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"channelId":"123"}'
```

**Verification:** You receive proper error responses with error codes

---

### ✅ Task 32: Test rate limiting functionality
**Instructions:**
Run this command multiple times quickly (>100 requests in 1 minute):
```bash
for i in {1..110}; do 
  curl http://localhost:3000/api/v1/health
  echo "Request $i"
done
```

**Expected:** After ~100 requests, you should see:
```json
{
  "success": false,
  "error": {
    "code": "RATE_LIMIT",
    "message": "Too many requests, please try again later."
  }
}
```

**Verification:** Rate limiting kicks in after configured limit

---

## 🚀 Phase 10: Production & Deployment (Tasks 33-35)

### ✅ Task 33: Configure production environment settings
**Instructions:**
Create `.env.production`:
```env
DISCORD_BOT_TOKEN=your_token
DISCORD_GUILD_ID=your_guild_id
PORT=3000
NODE_ENV=production
API_AUTH_ENABLED=true
API_TOKEN=strong_production_token
RATE_LIMIT_WINDOW_MS=60000
RATE_LIMIT_MAX_REQUESTS=100
LOG_LEVEL=error
```

**Verification:** Production config file exists

---

### ✅ Task 34: Set up PM2 or process manager (optional)
**Instructions:**
```bash
npm install -g pm2
pm2 start server.js --name discord-api
pm2 save
pm2 startup
```

**Verification:** 
```bash
pm2 list
```
Shows your app running

---

### ✅ Task 35: Deploy to hosting service
**Instructions:**

**Option 1 - Heroku:**
1. Install Heroku CLI
2. `heroku create your-app-name`
3. `heroku config:set DISCORD_BOT_TOKEN=your_token`
4. `git push heroku main`

**Option 2 - DigitalOcean:**
1. Create Node.js App
2. Connect GitHub repo
3. Add environment variables
4. Deploy

**Option 3 - VPS (Ubuntu):**
1. SSH to server
2. Clone repo
3. Install Node.js
4. Configure `.env`
5. Use PM2 to run
6. Configure Nginx reverse proxy

**Verification:** Your API is accessible from the internet

---

## 🎉 Project Complete!

Congratulations! You've successfully built and deployed your Discord API Integration application.

## 📊 Completion Checklist

- [ ] All 35 tasks marked as complete
- [ ] Bot is online in Discord
- [ ] All endpoints tested and working
- [ ] Authentication system working
- [ ] Error handling verified
- [ ] Application deployed (optional)

## 🔄 Next Steps

1. Monitor logs and errors
2. Add additional features as needed
3. Set up monitoring/alerts
4. Create backup procedures
5. Document any custom modifications

---

**Need Help?**
- Refer to [FEATURE_DOCUMENTATION.md](FEATURE_DOCUMENTATION.md) for detailed API reference
- Check [IMPLEMENTATION_ROADMAP.md](IMPLEMENTATION_ROADMAP.md) for code samples
- Review [API_QUICK_REFERENCE.md](API_QUICK_REFERENCE.md) for quick lookup

**Happy Coding! 🚀**
