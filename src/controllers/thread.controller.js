const discordService = require('../services/discord.service');
const { validateThreadName, validateSnowflake } = require('../utils/validator');
const { AppError } = require('../utils/errorHandler');

exports.createThread = async (req, res, next) => {
  try {
    const { channelId, name, autoArchiveDuration, type, message } = req.body;

    validateSnowflake(channelId, 'channelId');
    validateThreadName(name);

    const thread = await discordService.createThread(channelId, {
      name,
      autoArchiveDuration,
      type,
      message,
    });

    res.status(201).json({
      success: true,
      data: thread,
    });
  } catch (error) {
    next(error);
  }
};

exports.getThread = async (req, res, next) => {
  try {
    const { threadId } = req.params;
    validateSnowflake(threadId, 'threadId');

    const thread = await discordService.getThread(threadId);

    res.json({
      success: true,
      data: thread,
    });
  } catch (error) {
    next(error);
  }
};

exports.getThreadsByChannel = async (req, res, next) => {
  try {
    const { channelId } = req.params;
    const { archived } = req.query;

    validateSnowflake(channelId, 'channelId');

    const threads = await discordService.getThreadsByChannel(
      channelId,
      archived === 'true'
    );

    res.json({
      success: true,
      data: {
        threads,
        total: threads.length,
      },
    });
  } catch (error) {
    next(error);
  }
};

exports.archiveThread = async (req, res, next) => {
  try {
    const { threadId } = req.params;
    const { locked } = req.body;

    validateSnowflake(threadId, 'threadId');

    const thread = await discordService.archiveThread(threadId, locked);

    res.json({
      success: true,
      message: 'Thread archived successfully',
      data: thread,
    });
  } catch (error) {
    next(error);
  }
};

exports.unarchiveThread = async (req, res, next) => {
  try {
    const { threadId } = req.params;
    validateSnowflake(threadId, 'threadId');

    const thread = await discordService.unarchiveThread(threadId);

    res.json({
      success: true,
      message: 'Thread unarchived successfully',
      data: thread,
    });
  } catch (error) {
    next(error);
  }
};
