const config = require('../config/config');

const validateMessageContent = (content) => {
  if (!content || typeof content !== 'string') {
    throw new Error('Message content is required and must be a string');
  }

  if (content.length > config.app.maxMessageLength) {
    throw new Error(`Message content exceeds maximum length of ${config.app.maxMessageLength} characters`);
  }

  return true;
};

const validateThreadName = (name) => {
  if (!name || typeof name !== 'string') {
    throw new Error('Thread name is required and must be a string');
  }

  if (name.length < 1 || name.length > 100) {
    throw new Error('Thread name must be between 1 and 100 characters');
  }

  return true;
};

const validateSnowflake = (id, fieldName = 'ID') => {
  if (!id || typeof id !== 'string') {
    throw new Error(`${fieldName} is required and must be a string`);
  }

  if (!/^\d{17,19}$/.test(id)) {
    throw new Error(`${fieldName} must be a valid Discord snowflake ID`);
  }

  return true;
};

module.exports = {
  validateMessageContent,
  validateThreadName,
  validateSnowflake,
};
