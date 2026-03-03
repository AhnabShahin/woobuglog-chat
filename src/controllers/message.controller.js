const discordService = require('../services/discord.service');
const { validateMessageContent, validateSnowflake } = require('../utils/validator');

exports.sendMessage = async (req, res, next) => {
  try {
    const { channelId, threadId, content } = req.body;

    // Prioritize threadId if provided, otherwise use channelId
    let targetId;
    if (threadId) {
      targetId = threadId;
      validateSnowflake(targetId, 'threadId');
    } else if (channelId) {
      targetId = channelId;
      validateSnowflake(targetId, 'channelId');
    } else {
      throw new Error('Either channelId or threadId is required');
    }

    validateMessageContent(content);

    const message = await discordService.sendMessage(targetId, content);

    res.status(201).json({
      success: true,
      data: message,
    });
  } catch (error) {
    next(error);
  }
};

exports.sendEmbed = async (req, res, next) => {
  try {
    const { channelId, threadId, embed } = req.body;

    // Prioritize threadId if provided, otherwise use channelId
    let targetId;
    if (threadId) {
      targetId = threadId;
      validateSnowflake(targetId, 'threadId');
    } else if (channelId) {
      targetId = channelId;
      validateSnowflake(targetId, 'channelId');
    } else {
      throw new Error('Either channelId or threadId is required');
    }

    if (!embed || typeof embed !== 'object') {
      throw new Error('Embed object is required');
    }

    const message = await discordService.sendMessage(targetId, '', {
      embeds: [embed],
    });

    res.status(201).json({
      success: true,
      data: message,
    });
  } catch (error) {
    next(error);
  }
};

exports.replyToMessage = async (req, res, next) => {
  try {
    const { channelId, messageId, content, mention } = req.body;

    validateSnowflake(channelId, 'channelId');
    validateSnowflake(messageId, 'messageId');
    validateMessageContent(content);

    const message = await discordService.sendMessage(channelId, content, {
      reply: { messageReference: messageId, failIfNotExists: false },
    });

    res.status(201).json({
      success: true,
      data: message,
    });
  } catch (error) {
    next(error);
  }
};

exports.getMessages = async (req, res, next) => {
  try {
    const { channelId } = req.params;
    const { limit, before, after } = req.query;

    validateSnowflake(channelId, 'channelId');

    const messages = await discordService.getMessages(channelId, {
      limit: parseInt(limit) || 50,
      before,
      after,
    });

    res.json({
      success: true,
      data: {
        messages,
        count: messages.length,
        hasMore: messages.length === (parseInt(limit) || 50),
      },
    });
  } catch (error) {
    next(error);
  }
};

exports.getLatestMessages = async (req, res, next) => {
  try {
    const { channelId } = req.params;
    const { count } = req.query;

    validateSnowflake(channelId, 'channelId');

    const messages = await discordService.getMessages(channelId, {
      limit: Math.min(parseInt(count) || 10, 50),
    });

    res.json({
      success: true,
      data: {
        messages,
        count: messages.length,
      },
    });
  } catch (error) {
    next(error);
  }
};

exports.getMessage = async (req, res, next) => {
  try {
    const { channelId, messageId } = req.params;

    validateSnowflake(channelId, 'channelId');
    validateSnowflake(messageId, 'messageId');

    const message = await discordService.getMessage(channelId, messageId);

    res.json({
      success: true,
      data: message,
    });
  } catch (error) {
    next(error);
  }
};

exports.editMessage = async (req, res, next) => {
  try {
    const { channelId, messageId } = req.params;
    const { content } = req.body;

    validateSnowflake(channelId, 'channelId');
    validateSnowflake(messageId, 'messageId');
    validateMessageContent(content);

    const message = await discordService.editMessage(channelId, messageId, content);

    res.json({
      success: true,
      message: 'Message updated successfully',
      data: message,
    });
  } catch (error) {
    next(error);
  }
};

exports.deleteMessage = async (req, res, next) => {
  try {
    const { channelId, messageId } = req.params;

    validateSnowflake(channelId, 'channelId');
    validateSnowflake(messageId, 'messageId');

    const result = await discordService.deleteMessage(channelId, messageId);

    res.json({
      success: true,
      message: 'Message deleted successfully',
      data: result,
    });
  } catch (error) {
    next(error);
  }
};
