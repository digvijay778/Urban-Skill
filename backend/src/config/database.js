const mongoose = require('mongoose');
const logger = require('./logger');

const connectDatabase = async () => {
  try {
    const mongoUri = process.env.MONGODB_URI || 'mongodb://localhost:27017/freelance_platform';
    
    logger.info('Attempting to connect to MongoDB...');
    logger.info(`Connection string: ${mongoUri.replace(/:[^:@]+@/, ':****@')}`);
    
    await mongoose.connect(mongoUri);

    logger.info('MongoDB connected successfully');
    logger.info(`Database: ${mongoose.connection.name}`);
    return mongoose.connection;
  } catch (error) {
    logger.error('MongoDB connection failed:', error.message);
    logger.error('Full error:', error);
    logger.warn('Server starting without database connection. Please ensure MongoDB is running.');
    // Don't exit, allow server to start
    return null;
  }
};

const disconnectDatabase = async () => {
  try {
    await mongoose.disconnect();
    logger.info('MongoDB disconnected');
  } catch (error) {
    logger.error('MongoDB disconnection failed:', error);
  }
};

module.exports = {
  connectDatabase,
  disconnectDatabase,
};
