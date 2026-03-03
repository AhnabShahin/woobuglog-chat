#!/usr/bin/env node

/**
 * Discord Bot Connection Test
 * This script tests if your Discord bot token is valid and can connect
 * Run: node test-discord-connection.js
 */

require('dotenv').config();
const { Client, GatewayIntentBits } = require('discord.js');

console.log('🧪 Discord Bot Connection Test\n');
console.log('═'.repeat(50));

// Check environment variables
console.log('📋 Environment Variables Check:');
console.log('   NODE_ENV:', process.env.NODE_ENV || 'not set');
console.log('   DISCORD_BOT_TOKEN:', process.env.DISCORD_BOT_TOKEN ? '✅ SET' : '❌ NOT SET');

if (!process.env.DISCORD_BOT_TOKEN) {
  console.error('\n❌ ERROR: DISCORD_BOT_TOKEN is not set!');
  console.error('💡 Solution: Add DISCORD_BOT_TOKEN to your .env file or Render dashboard');
  process.exit(1);
}

// Mask token for display
const token = process.env.DISCORD_BOT_TOKEN;
const maskedToken = token.substring(0, 20) + '...' + token.slice(-4);
console.log('   Token (masked):', maskedToken);
console.log('   Token length:', token.length, 'characters');

// Validate token format
if (!token.includes('.')) {
  console.error('\n❌ ERROR: Token format appears invalid (should contain dots)');
  process.exit(1);
}

console.log('\n═'.repeat(50));
console.log('🔌 Attempting to connect to Discord...\n');

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
    GatewayIntentBits.GuildMembers,
  ],
});

const timeout = setTimeout(() => {
  console.error('\n❌ Connection FAILED: Timeout after 30 seconds');
  console.error('\n💡 Possible reasons:');
  console.error('   1. Invalid or expired bot token');
  console.error('   2. Bot intents not enabled in Discord Developer Portal:');
  console.error('      - Go to https://discord.com/developers/applications');
  console.error('      - Select your app → Bot → Privileged Gateway Intents');
  console.error('      - Enable: MESSAGE CONTENT INTENT');
  console.error('      - Enable: SERVER MEMBERS INTENT');
  console.error('   3. Network connectivity issues');
  console.error('   4. Discord API is down (check https://discordstatus.com)');
  console.error('\n❌ Test FAILED\n');
  process.exit(1);
}, 30000);

client.once('ready', () => {
  clearTimeout(timeout);
  console.log('✅ Connection SUCCESSFUL!\n');
  console.log('═'.repeat(50));
  console.log('🤖 Bot Information:');
  console.log('   Username:', client.user.tag);
  console.log('   User ID:', client.user.id);
  console.log('   Servers:', client.guilds.cache.size);
  
  if (client.guilds.cache.size > 0) {
    console.log('\n🏰 Connected Servers:');
    client.guilds.cache.forEach(guild => {
      console.log(`   - ${guild.name} (ID: ${guild.id})`);
    });
  } else {
    console.log('\n⚠️  Bot is not in any servers!');
    console.log('💡 Invite your bot to a server using this URL:');
    const botId = client.user.id;
    console.log(`   https://discord.com/api/oauth2/authorize?client_id=${botId}&permissions=8&scope=bot`);
  }
  
  console.log('\n✅ Test PASSED - Bot can connect successfully!\n');
  console.log('═'.repeat(50));
  
  client.destroy();
  process.exit(0);
});

client.on('error', (error) => {
  console.error('\n❌ Discord client error:', error.message);
  clearTimeout(timeout);
  process.exit(1);
});

console.log('⏳ Logging in to Discord...');
client.login(token).catch((error) => {
  clearTimeout(timeout);
  console.error('\n❌ Login FAILED:', error.message);
  console.error('\n💡 Common causes:');
  console.error('   - Token has been regenerated in Discord Developer Portal');
  console.error('   - Token has extra spaces or quotes');
  console.error('   - Bot application was deleted');
  console.error('\n❌ Test FAILED\n');
  process.exit(1);
});
