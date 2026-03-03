# Render Environment Variables Setup Guide

## 🚨 CRITICAL: Your bot is timing out because environment variables are not set in Render!

## Step-by-Step Instructions

### 1. Go to Render Dashboard
Visit: https://dashboard.render.com/

### 2. Select Your Service
- Click on your service: **woobuglog-chat**

### 3. Go to Environment Tab
- Click on the **"Environment"** tab in the left sidebar

### 4. Add Environment Variables

Click **"Add Environment Variable"** and add these **ONE BY ONE**:

#### Required Variables:

**Variable 1: DISCORD_BOT_TOKEN** (MOST IMPORTANT)
```
Key: DISCORD_BOT_TOKEN
Value: <YOUR_DISCORD_BOT_TOKEN_FROM_.ENV_FILE>
```
⚠️ **Important**: 
- Copy the token from your `.env` file (starts with MTQ7...)
- Paste the token WITHOUT quotes, WITHOUT spaces
- It should be approximately 72 characters long

**Variable 2: DISCORD_GUILD_ID**
```
Key: DISCORD_GUILD_ID
Value: 1475734634649358430
```

**Variable 3: DISCORD_DEFAULT_CHANNEL_ID**
```
Key: DISCORD_DEFAULT_CHANNEL_ID
Value: 1475734635781554251
```

**Variable 4: API_TOKEN** (for authentication)
```
Key: API_TOKEN
Value: <YOUR_API_TOKEN_FROM_.ENV_FILE>
```
⚠️ Copy this from your `.env` file

#### Optional Variables (if not already set):

```
Key: API_AUTH_ENABLED
Value: true
```

```
Key: NODE_ENV
Value: production
```

### 5. Save Changes
- Click **"Save Changes"** button
- Render will automatically redeploy your service (takes 1-2 minutes)

### 6. Verify Deployment
After redeployment completes:

1. **Check the Logs** (click "Logs" tab)
   - Look for: `🔑 Token present: YES`
   - Look for: `✅ Discord bot logged in as...`

2. **Test the Health Endpoint**
   ```
   https://woobuglog-chat.onrender.com/api/v1/health
   ```
   Should show:
   ```json
   {
     "services": {
       "discord": {
         "status": "connected",
         "user": "YourBotName#1234",
         "ready": true
       }
     }
   }
   ```

3. **Test Your Messages Endpoint**
   ```
   https://woobuglog-chat.onrender.com/api/v1/messages/1475734635781554251
   ```

---

## 🔍 Troubleshooting

### If you still see "Token present: NO"
- Double-check you typed `DISCORD_BOT_TOKEN` exactly (case-sensitive)
- Make sure there are no spaces before or after the token value
- Click "Save Changes" after adding each variable

### If you see "Token present: YES" but still timeout
1. Your bot token might be expired:
   - Go to https://discord.com/developers/applications
   - Select your application
   - Go to "Bot" section
   - If you see "Reset Token" button and it was clicked before, generate new token
   - Update the token in Render

2. Check bot intents are enabled:
   - In Discord Developer Portal → Bot → Privileged Gateway Intents
   - Enable: **MESSAGE CONTENT INTENT** ✅
   - Enable: **SERVER MEMBERS INTENT** ✅
   - Click "Save Changes"

3. Verify bot is invited to your server:
   - The bot must be a member of your Discord server
   - Use this invite URL (replace YOUR_BOT_ID):
   ```
   https://discord.com/api/oauth2/authorize?client_id=YOUR_BOT_ID&permissions=8&scope=bot
   ```

---
Where to Find These Values

Copy these from your local `.env` file:

| Variable | Location in .env |
|----------|------------------|
| DISCORD_BOT_TOKEN | Line 3 in `.env` (starts with MTQ..., ~72 chars) |
| DISCORD_GUILD_ID | Line 7 in `.env` |
| DISCORD_DEFAULT_CHANNEL_ID | Line 11 in `.env` |
| API_TOKEN | Line 22 in `.env` (64 character hex string) |
| API_AUTH_ENABLED | Set to `true` for production |
| NODE_ENV | Set to `production` for Rendere` |
| NODE_ENV | `production` |

---

## ✅ Verification Checklist

- [ ] Added DISCORD_BOT_TOKEN to Render Environment variables
- [ ] Added DISCORD_GUILD_ID to Render Environment variables
- [ ] Added DISCORD_DEFAULT_CHANNEL_ID to Render Environment variables
- [ ] Added API_TOKEN to Render Environment variables
- [ ] Clicked "Save Changes" in Render
- [ ] Waited for redeployment to complete
- [ ] Checked logs show "Token present: YES"
- [ ] Checked logs show "Discord bot logged in"
- [ ] Tested /api/v1/health endpoint
- [ ] Tested /api/v1/messages endpoint

---

**Need help?** Share your Render logs after following these steps.
