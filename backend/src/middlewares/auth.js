const jwt = require('jsonwebtoken');
const { envConfig } = require('../config/env');
const ApiError = require('../utils/ApiError');
const { RESPONSE_MESSAGES } = require('../constants/responseMessages');

const authMiddleware = async (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];

    if (!token) {
      throw new ApiError(401, RESPONSE_MESSAGES.AUTH_UNAUTHORIZED);
    }

    const decoded = jwt.verify(token, envConfig.jwtSecret);
    req.user = decoded;
    next();
  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      next(new ApiError(401, RESPONSE_MESSAGES.AUTH_TOKEN_EXPIRED));
    } else if (error.name === 'JsonWebTokenError') {
      next(new ApiError(401, RESPONSE_MESSAGES.AUTH_UNAUTHORIZED));
    } else {
      next(error);
    }
  }
};

module.exports = authMiddleware;
