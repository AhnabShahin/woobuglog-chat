const { Client, GatewayIntentBits, ChannelType } = require('discord.js');
const config = require('../config/config');

class DiscordService {
  constructor() {
    this.client = null;
    this.isReady = false;
  }

  _ensureReady() {
    if (!this.client || !this.isReady) {
      throw new Error('Discord bot is not ready. Please try again in a moment.');
    }
  }

  async initialize() {
    return new Promise((resolve, reject) => {
      console.log('🔧 Starting Discord bot initialization...');
      console.log('📍 Environment:', process.env.NODE_ENV || 'development');
      console.log('🔑 Token present:', config.discord.token ? 'YES' : 'NO');
      console.log('🏰 Guild ID present:', config.discord.guildId ? 'YES' : 'NO');
      
      if (!config.discord.token) {
        const error = new Error('DISCORD_BOT_TOKEN is not configured');
        console.error('❌ Cannot initialize Discord bot: Missing token');
        return reject(error);
      }

      const timeout = setTimeout(() => {
        console.error('⚠️  Discord initialization timeout after 30 seconds');
        console.error('⚠️  Bot failed to connect. Check token and network connectivity.');
        this.isReady = false;
        // Don't reject - allow server to start anyway
        resolve();
      }, 30000);

      this.client = new Client({
        intents: [
          GatewayIntentBits.Guilds,
          GatewayIntentBits.GuildMessages,
          GatewayIntentBits.MessageContent,
          GatewayIntentBits.GuildMembers,
        ],
      });

      this.client.once('ready', () => {
        clearTimeout(timeout);
        console.log(`✅ Discord bot logged in as ${this.client.user.tag}`);
        console.log(`🏰 Connected to ${this.client.guilds.cache.size} guild(s)`);
        this.isReady = true;
        resolve();
      });

      this.client.on('error', (error) => {
        console.error('❌ Discord client error:', error);
      });

      this.client.on('disconnect', () => {
        console.warn('⚠️  Discord bot disconnected');
        this.isReady = false;
      });

      this.client.on('reconnecting', () => {
        console.log('🔄 Discord bot reconnecting...');
      });

      console.log('🔐 Attempting to login to Discord...');
      this.client.login(config.discord.token).catch((error) => {
        clearTimeout(timeout);
        console.error('❌ Failed to login to Discord:', error.message);
        console.error('💡 Possible reasons:');
        console.error('   - Invalid or expired bot token');
        console.error('   - Network connectivity issues');
        console.error('   - Discord API is down');
        this.isReady = false;
        reject(error);
      });
    });
  }

  // Thread Operations
  async createThread(channelId, options) {
    this._ensureReady();
    const channel = await this.client.channels.fetch(channelId);
    if (!channel) throw new Error('Channel not found');

    const thread = await channel.threads.create({
      name: options.name,
      autoArchiveDuration: options.autoArchiveDuration || 60,
      type: options.type || ChannelType.PublicThread,
    });

    if (options.message) {
      await thread.send(options.message);
    }

    return this._formatThread(thread);
  }

  async getThread(threadId) {
    this._ensureReady();
    const thread = await this.client.channels.fetch(threadId);
    if (!thread || !thread.isThread()) {
      throw new Error('Thread not found');
    }
    return this._formatThread(thread);
  }

  async getThreadsByChannel(channelId, includeArchived = false) {
    const channel = await this.client.channels.fetch(channelId);
    if (!channel) throw new Error('Channel not found');

    const threads = await channel.threads.fetch({ archived: includeArchived });
    return threads.threads.map(thread => this._formatThread(thread));
  }

  async archiveThread(threadId, locked = false) {
    const thread = await this.client.channels.fetch(threadId);
    if (!thread || !thread.isThread()) {
      throw new Error('Thread not found');
    }

    await thread.setArchived(true);
    if (locked) await thread.setLocked(true);

    return this._formatThread(thread);
  }

  async unarchiveThread(threadId) {
    const thread = await this.client.channels.fetch(threadId);
    if (!thread || !thread.isThread()) {
      throw new Error('Thread not found');
    }

    await thread.setArchived(false);
    return this._formatThread(thread);
  }

  // Message Operations
  async sendMessage(channelId, content, options = {}) {
    this._ensureReady();
    const channel = await this.client.channels.fetch(channelId);
    if (!channel) throw new Error('Channel or thread not found');

    // Check if it's a thread
    const channelType = channel.isThread ? channel.isThread() : false;
    
    console.log(`📤 Sending message to ${channelType ? 'thread' : 'channel'}: ${channel.name || channelId}`);

    const message = await channel.send({
      content,
      embeds: options.embeds,
      reply: options.reply ? { messageReference: options.reply } : undefined,
    });

    return this._formatMessage(message);
  }

  async getMessage(channelId, messageId) {
    this._ensureReady();
    const channel = await this.client.channels.fetch(channelId);
    if (!channel) throw new Error('Channel not found');

    const message = await channel.messages.fetch(messageId);
    if (!message) throw new Error('Message not found');

    return this._formatMessage(message);
  }

  async getMessages(channelId, options = {}) {
    this._ensureReady();
    const channel = await this.client.channels.fetch(channelId);
    if (!channel) throw new Error('Channel not found');

    const messages = await channel.messages.fetch({
      limit: options.limit || 50,
      before: options.before,
      after: options.after,
    });

    return messages.map(msg => this._formatMessage(msg));
  }

  async editMessage(channelId, messageId, newContent) {
    const channel = await this.client.channels.fetch(channelId);
    if (!channel) throw new Error('Channel not found');

    const message = await channel.messages.fetch(messageId);
    if (!message) throw new Error('Message not found');

    const edited = await message.edit(newContent);
    return this._formatMessage(edited);
  }

  async deleteMessage(channelId, messageId) {
    const channel = await this.client.channels.fetch(channelId);
    if (!channel) throw new Error('Channel not found');

    const message = await channel.messages.fetch(messageId);
    if (!message) throw new Error('Message not found');

    await message.delete();
    return { messageId, channelId };
  }

  // Helper Methods
  _formatThread(thread) {
    return {
      threadId: thread.id,
      name: thread.name,
      channelId: thread.parentId,
      ownerId: thread.ownerId,
      memberCount: thread.memberCount,
      messageCount: thread.messageCount,
      archived: thread.archived,
      locked: thread.locked,
      autoArchiveDuration: thread.autoArchiveDuration,
      createdAt: thread.createdAt,
    };
  }

  _formatMessage(message) {
    return {
      messageId: message.id,
      content: message.content,
      authorId: message.author.id,
      authorUsername: message.author.username,
      channelId: message.channelId,
      timestamp: message.createdAt,
      edited: message.edited,
      editedTimestamp: message.editedAt,
      attachments: message.attachments.map(a => ({
        id: a.id,
        url: a.url,
        filename: a.name,
        size: a.size,
      })),
      embeds: message.embeds.length,
      reactions: message.reactions.cache.map(r => ({
        emoji: r.emoji.name,
        count: r.count,
      })),
      reference: message.reference ? message.reference.messageId : null,
      url: message.url,
    };
  }

  getStatus() {
    return {
      connected: this.isReady,
      user: this.client?.user?.tag || 'Not connected',
      uptime: this.client?.uptime || 0,
    };
  }
}

// Singleton instance
const discordService = new DiscordService();
module.exports = discordService;
