# WooBugLog Chat API

A RESTful API for Discord bot operations with thread and message management capabilities.

## 🚀 Quick Start

### Local Development

1. **Clone the repository**
   ```bash
   git clone <your-repo-url>
   cd woobuglog-chat
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure environment variables**
   ```bash
   cp .env.example .env
   # Edit .env with your Discord bot credentials
   ```

4. **Start the development server**
   ```bash
   npm run dev
   ```

The API will be available at `http://localhost:3000/api/v1`

## 🌐 Deployment to Render

This app is configured for automatic deployment on Render with GitHub integration.

### Quick Deploy

1. Push your code to GitHub `main` branch
2. Connect your GitHub repo to Render
3. Configure environment variables in Render dashboard
4. Deploy!

**Every push to `main` will automatically deploy** 🎉

📖 **See detailed instructions**: [RENDER_DEPLOYMENT_GUIDE.md](RENDER_DEPLOYMENT_GUIDE.md)  
✅ **Quick checklist**: [DEPLOYMENT_CHECKLIST.md](DEPLOYMENT_CHECKLIST.md)

## 📚 Documentation

- **[API Documentation](FEATURE_DOCUMENTATION.md)** - Complete API reference
- **[Setup Guide](SETUP_COMPLETE.md)** - Initial setup instructions
- **[Thread Messaging Guide](THREAD_MESSAGING_GUIDE.md)** - Thread operations
- **[Tasks Guide](TASKS_GUIDE.md)** - Development tasks
- **[Deployment Guide](RENDER_DEPLOYMENT_GUIDE.md)** - Deploy to Render

## 🔑 Environment Variables

Required variables:
- `DISCORD_BOT_TOKEN` - Your Discord bot token
- `DISCORD_GUILD_ID` - Your Discord server ID
- `DISCORD_DEFAULT_CHANNEL_ID` - Default channel ID
- `API_AUTH_ENABLED` - Enable/disable authentication
- `API_TOKEN` - Your API authentication token

See [.env.example](.env.example) for all available options.

## 🛠️ Tech Stack

- **Node.js** - Runtime environment
- **Express** - Web framework
- **Discord.js** - Discord API integration
- **Helmet** - Security middleware
- **CORS** - Cross-origin resource sharing
- **Express Rate Limit** - Rate limiting

## 📡 API Endpoints

- `GET /api/v1/health` - Health check
- `POST /api/v1/threads/create` - Create a new thread
- `POST /api/v1/messages/send` - Send a message
- `GET /api/v1/messages/:channelId` - Retrieve messages

Full API documentation: [FEATURE_DOCUMENTATION.md](FEATURE_DOCUMENTATION.md)

## 🔐 Authentication

API authentication can be toggled using the `API_AUTH_ENABLED` environment variable.

When enabled, include your API token in requests:
```bash
curl -H "Authorization: Bearer YOUR_API_TOKEN" \
     https://your-api-url/api/v1/health
```

## 📝 License

ISC

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

