const config = require('../config/config');

const authMiddleware = (req, res, next) => {
  // If authentication is disabled, skip checks
  if (!config.auth.enabled) {
    return next();
  }

  // Check for Authorization header
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return res.status(401).json({
      success: false,
      error: {
        code: 'AUTH_REQUIRED',
        message: 'Authentication required. Please provide an API token.',
      },
    });
  }

  // Extract token from "Bearer <token>"
  const token = authHeader.split(' ')[1];

  if (!token || token !== config.auth.token) {
    return res.status(401).json({
      success: false,
      error: {
        code: 'INVALID_TOKEN',
        message: 'Invalid or expired API token.',
      },
    });
  }

  next();
};

module.exports = authMiddleware;
