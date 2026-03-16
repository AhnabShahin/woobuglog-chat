const serverless = require('serverless-http');
const app = require('../../src/app');
const discordService = require('../../src/services/discord.service');

const expressHandler = serverless(app);
let discordInitPromise = null;

async function ensureDiscordInitialized() {
  const status = discordService.getStatus();

  if (status.connected) {
    return;
  }

  if (!discordInitPromise) {
    discordInitPromise = discordService.initialize().catch((error) => {
      console.error('Discord initialization in Netlify failed:', error.message);
    });
  }

  await discordInitPromise;
}

exports.handler = async (event, context) => {
  // Keep warm instances from waiting on open Discord sockets.
  context.callbackWaitsForEmptyEventLoop = false;

  await ensureDiscordInitialized();
  return expressHandler(event, context);
};
