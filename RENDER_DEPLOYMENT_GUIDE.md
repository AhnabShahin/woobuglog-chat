# Render Deployment Guide

This guide will help you deploy the WooBugLog Chat API to Render with automatic deployments from your GitHub main branch.

## Prerequisites

- ✅ A [Render account](https://render.com/) (free tier available)
- ✅ A GitHub account with this repository
- ✅ Discord Bot Token and Server IDs
- ✅ A secure API token for authentication

## Step 1: Push Your Code to GitHub

1. **Initialize Git repository** (if not already done):
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   ```

2. **Create a new GitHub repository** at https://github.com/new

3. **Push your code to GitHub**:
   ```bash
   git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO_NAME.git
   git branch -M main
   git push -u origin main
   ```

## Step 2: Connect Render to GitHub

1. **Sign up/Login to Render**: Go to https://render.com/ and sign up or log in

2. **Connect your GitHub account**:
   - Click on your profile icon (top right)
   - Go to "Account Settings"
   - Under "Connected Accounts", connect your GitHub account
   - Authorize Render to access your repositories

## Step 3: Create a New Web Service

1. **From Render Dashboard**, click **"New +"** → **"Web Service"**

2. **Connect your repository**:
   - Select your GitHub repository from the list
   - Click "Connect"

3. **Configure your service**:
   - **Name**: `woobuglog-chat` (or your preferred name)
   - **Region**: Choose the closest region to your users
   - **Branch**: `main` (this enables auto-deploy on push to main)
   - **Root Directory**: Leave blank (unless your app is in a subdirectory)
   - **Environment**: `Node`
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
   - **Plan**: Select "Free" or your preferred plan

## Step 4: Configure Environment Variables

In the Environment section, add these variables:

### Required Variables (MUST be set):

| Variable | Value | Notes |
|----------|-------|-------|
| `NODE_ENV` | `production` | Sets the environment |
| `DISCORD_BOT_TOKEN` | Your Discord bot token | Get from Discord Developer Portal |
| `DISCORD_GUILD_ID` | Your Discord server ID | Right-click server → Copy ID |
| `DISCORD_DEFAULT_CHANNEL_ID` | Your default channel ID | Right-click channel → Copy ID |
| `API_AUTH_ENABLED` | `true` | Enable API authentication |
| `API_TOKEN` | Your secure API token | Generate using crypto |

### Optional Variables (with defaults):

| Variable | Default | Purpose |
|----------|---------|---------|
| `PORT` | `10000` | Render uses port 10000 |
| `RATE_LIMIT_WINDOW_MS` | `60000` | Rate limit window (1 minute) |
| `RATE_LIMIT_MAX_REQUESTS` | `100` | Max requests per window |
| `LOG_LEVEL` | `info` | Logging level |
| `CORS_ORIGIN` | `*` | CORS configuration |
| `REQUEST_TIMEOUT` | `30000` | Request timeout |
| `MAX_MESSAGE_LENGTH` | `2000` | Max message length |
| `DEFAULT_MESSAGE_LIMIT` | `50` | Default message retrieval limit |

### How to add environment variables:

1. Scroll to the "Environment Variables" section
2. Click "Add Environment Variable"
3. Enter the key and value
4. Click "Add" and repeat for all variables
5. For sensitive values (tokens, keys), use the "Secret File" option if needed

### Generate a secure API token:
```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

## Step 5: Deploy

1. **Review your settings** and click **"Create Web Service"**

2. **Wait for deployment**:
   - Render will automatically start building and deploying
   - You can view logs in real-time
   - First deployment takes 2-5 minutes

3. **Check deployment status**:
   - Green "Live" badge = successful deployment
   - Click on the service URL to test your API

## Step 6: Verify Deployment

Once deployed, test your API:

```bash
# Replace YOUR_SERVICE_URL with your Render URL
curl https://YOUR_SERVICE_URL.onrender.com/api/v1/health
```

Expected response:
```json
{
  "status": "OK",
  "timestamp": "2026-03-03T...",
  "service": "Discord Chat API",
  "version": "1.0.0"
}
```

## Auto-Deployment Setup ✅

**You're done!** Auto-deployment is now active. Here's how it works:

### Automatic Deploys

Every time you push or merge code to the `main` branch, Render will:

1. ✅ Detect the changes automatically
2. ✅ Pull the latest code
3. ✅ Run `npm install`
4. ✅ Start the server with `npm start`
5. ✅ Replace the old version with zero downtime

### To deploy changes:

```bash
# Make your changes
git add .
git commit -m "Your commit message"
git push origin main
```

That's it! Render will automatically deploy your changes in 1-3 minutes.

## Monitoring & Management

### View Logs:
- Go to your Render dashboard
- Click on your service
- Click "Logs" tab to view real-time logs

### Manual Deploy:
- Click "Manual Deploy" → "Clear build cache & deploy"
- Use this if auto-deploy isn't working

### Service URL:
Your service will be available at: `https://YOUR_SERVICE_NAME.onrender.com`

## Troubleshooting

### Build Fails:
- Check the build logs in Render dashboard
- Ensure `package.json` has all required dependencies
- Verify Node.js version compatibility

### Discord Bot Not Connecting:
- Verify `DISCORD_BOT_TOKEN` is correct
- Ensure bot has necessary permissions in your Discord server
- Check bot is invited to your server

### Environment Variable Issues:
- All variables must be set in Render dashboard
- Sensitive variables should be marked as "secret"
- Restart service after changing environment variables

### Free Tier Sleep Mode:
- Free tier services sleep after 15 minutes of inactivity
- First request after sleep takes 30-60 seconds
- Upgrade to paid plan to prevent sleeping

## Important Notes

- **Free Tier Limits**: 750 hours/month of runtime, services sleep after inactivity
- **Custom Domain**: Can be added in service settings (requires upgrade)
- **HTTPS**: Automatically enabled for all Render services
- **Health Checks**: Render pings `/api/v1/health` to verify service health
- **Zero Downtime**: Deployments are zero-downtime by default

## Next Steps

- ✅ Set up custom domain (optional)
- ✅ Configure monitoring and alerts
- ✅ Review logs for any issues
- ✅ Test all API endpoints
- ✅ Update your API consumers with the new URL

## Support Resources

- **Render Docs**: https://render.com/docs
- **Discord.js Guide**: https://discordjs.guide/
- **Your API Docs**: See `FEATURE_DOCUMENTATION.md`

---

**🎉 Your Discord Chat API is now live on Render with automatic deployments!**

Any push to the `main` branch will automatically trigger a new deployment.
