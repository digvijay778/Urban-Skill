const app = require('./src/app');
const logger = require('./src/config/logger');
const { envConfig } = require('./src/config/env');
const { connectDatabase } = require('./src/config/database');

const startServer = async () => {
  try {
    // Optional database connection
    try {
      await connectDatabase();
    } catch (dbError) {
      logger.warn('Database connection optional - server will run without it');
    }

    const PORT = envConfig.port;
    const server = app.listen(PORT, () => {
      logger.info(`Server is running on port ${PORT}`);
      logger.info(`Environment: ${envConfig.nodeEnv}`);
      logger.info(`Health check: http://localhost:${PORT}/health`);
    });

    // Graceful shutdown
    process.on('SIGTERM', () => {
      logger.info('SIGTERM received, closing server...');
      server.close(() => {
        logger.info('Server closed');
        process.exit(0);
      });
    });

    process.on('SIGINT', () => {
      logger.info('SIGINT received, closing server...');
      server.close(() => {
        logger.info('Server closed');
        process.exit(0);
      });
    });
  } catch (error) {
    logger.error('Failed to start server:', error);
    process.exit(1);
  }
};

startServer();
