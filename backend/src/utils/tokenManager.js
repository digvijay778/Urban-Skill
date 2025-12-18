const jwt = require('jsonwebtoken');
const { envConfig } = require('../config/env');

const generateToken = (userId, role) => {
  const token = jwt.sign(
    { userId, role },
    envConfig.jwtSecret,
    { expiresIn: envConfig.jwtExpiry }
  );

  return token;
};

const verifyToken = (token) => {
  try {
    const decoded = jwt.verify(token, envConfig.jwtSecret);
    return decoded;
  } catch (error) {
    return null;
  }
};

const refreshToken = (userId, role) => {
  return generateToken(userId, role);
};

module.exports = {
  generateToken,
  verifyToken,
  refreshToken,
};
