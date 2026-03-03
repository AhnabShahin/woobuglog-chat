# 🚀 Quick Deployment Checklist

Use this checklist to deploy your app to Render with GitHub auto-deploy.

## ✅ Pre-Deployment Checklist

- [ ] Code is pushed to GitHub `main` branch
- [ ] `.env` file is in `.gitignore` (already done ✓)
- [ ] `render.yaml` exists in root directory (already done ✓)
- [ ] Discord Bot Token is ready
- [ ] Discord Server (Guild) ID is ready
- [ ] Discord Default Channel ID is ready
- [ ] API Token generated (use: `node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"`)

## 📋 Deployment Steps

### 1. Push to GitHub
```bash
# If not already on GitHub:
git init
git add .
git commit -m "Initial commit"
git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO.git
git branch -M main
git push -u origin main
```

### 2. Create Render Service
1. Go to https://render.com/ and sign up/login
2. Click **"New +"** → **"Web Service"**
3. Connect your GitHub repository
4. Select the `main` branch
5. Use these settings:
   - **Environment**: Node
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
   - **Plan**: Free (or upgrade later)

### 3. Add Environment Variables
Add these in Render dashboard:

**Required:**
- `NODE_ENV` = `production`
- `DISCORD_BOT_TOKEN` = Your Discord bot token
- `DISCORD_GUILD_ID` = Your Discord server ID
- `DISCORD_DEFAULT_CHANNEL_ID` = Your default channel ID
- `API_AUTH_ENABLED` = `true`
- `API_TOKEN` = Your secure API token

**Optional (defaults provided):**
- `PORT` = `10000`
- `RATE_LIMIT_WINDOW_MS` = `60000`
- `RATE_LIMIT_MAX_REQUESTS` = `100`
- `LOG_LEVEL` = `info`
- `CORS_ORIGIN` = `*`

### 4. Deploy
Click **"Create Web Service"** and wait for deployment (2-5 minutes)

### 5. Verify
Test your API:
```bash
curl https://YOUR-SERVICE.onrender.com/api/v1/health
```

## 🔄 Auto-Deploy is Active!

From now on, every time you:
```bash
git add .
git commit -m "Your changes"
git push origin main
```

Render will automatically:
1. Detect the push
2. Build your app
3. Deploy with zero downtime
4. You'll get a notification

**That's it! Your app updates automatically on every push to `main`!**

## 📱 After Deployment

- [ ] Test all endpoints with your Render URL
- [ ] Update any external services with new URL
- [ ] Monitor logs for any issues
- [ ] Set up custom domain (optional)

## 🆘 Quick Troubleshooting

**Build fails?**
- Check logs in Render dashboard
- Verify `package.json` is correct

**Bot not connecting?**
- Verify Discord bot token is correct
- Check bot permissions in Discord server

**Service sleeping?**
- Free tier sleeps after 15 mins inactivity
- First request takes 30-60 seconds to wake up
- Upgrade to paid plan to prevent sleeping

## 📚 Full Documentation

See [RENDER_DEPLOYMENT_GUIDE.md](RENDER_DEPLOYMENT_GUIDE.md) for detailed instructions.

---

**Current Status**: Ready for deployment ✅
