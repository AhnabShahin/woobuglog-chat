class AppError extends Error {
  constructor(message, statusCode, code) {
    super(message);
    this.statusCode = statusCode;
    this.code = code;
    Error.captureStackTrace(this, this.constructor);
  }
}

const errorHandler = (err, req, res, next) => {
  let error = { ...err };
  error.message = err.message;

  // Log error for debugging
  if (process.env.NODE_ENV === 'development') {
    console.error('❌ Error:', err);
  }

  // Discord API errors
  if (err.code === 10003 || err.code === 10008) {
    error = new AppError('Channel not found', 404, 'CHANNEL_NOT_FOUND');
  }

  if (err.code === 50001) {
    error = new AppError('Missing permissions', 403, 'PERMISSION_DENIED');
  }

  if (err.code === 50035) {
    error = new AppError('Invalid form body', 400, 'VALIDATION_ERROR');
  }

  // Default to 500 server error
  const statusCode = error.statusCode || 500;
  const code = error.code || 'INTERNAL_ERROR';

  res.status(statusCode).json({
    success: false,
    error: {
      code,
      message: error.message || 'Internal server error',
      details: process.env.NODE_ENV === 'development' ? err.stack : undefined,
    },
  });
};

module.exports = { AppError, errorHandler };
