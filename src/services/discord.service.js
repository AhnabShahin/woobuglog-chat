const { Client, GatewayIntentBits, ChannelType } = require('discord.js');
const config = require('../config/config');

class DiscordService {
  constructor() {
    this.client = null;
    this.isReady = false;
  }

  async initialize() {
    this.client = new Client({
      intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent,
        GatewayIntentBits.GuildMembers,
      ],
    });

    this.client.once('ready', () => {
      console.log(`✅ Discord bot logged in as ${this.client.user.tag}`);
      this.isReady = true;
    });

    this.client.on('error', (error) => {
      console.error('❌ Discord client error:', error);
    });

    await this.client.login(config.discord.token);
  }

  // Thread Operations
  async createThread(channelId, options) {
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
    const channel = await this.client.channels.fetch(channelId);
    if (!channel) throw new Error('Channel not found');

    const message = await channel.messages.fetch(messageId);
    if (!message) throw new Error('Message not found');

    return this._formatMessage(message);
  }

  async getMessages(channelId, options = {}) {
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
