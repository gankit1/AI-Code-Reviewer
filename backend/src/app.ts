import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import compression from 'compression';
import morgan from 'morgan';
import { connectDatabase } from './config/database';
import { env } from './config/env';
import { logger } from './utils/logger';
import { errorHandler, notFoundHandler } from './middleware/error.middleware';
import { apiRateLimiter } from './middleware/rate-limit.middleware';
import routes from './routes';

const app = express();

// CORS must be registered before helmet so preflight responses include CORS headers
app.use(cors({
  origin: [
    env.FRONTEND_URL,
    'http://localhost:3000',
    'http://127.0.0.1:3000',
    'http://localhost:3001',
    'http://127.0.0.1:3001'
  ],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));

// Security middleware – configured to not conflict with CORS
app.use(helmet({
  crossOriginResourcePolicy: { policy: 'cross-origin' },
}));

// Body parsing
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Compression
app.use(compression());

// Logging
app.use(morgan('dev', {
  stream: { write: (message: string) => logger.info(message.trim()) },
}));

// Rate limiting
app.use('/api', apiRateLimiter);

// API routes
app.use('/api', routes);

// Error handling
app.use(notFoundHandler);
app.use(errorHandler);

// Start server
async function startServer() {
  try {
    // Start HTTP server first so CORS headers are always served
    const server = app.listen(env.PORT, () => {
      logger.info(`🚀 Server running on http://localhost:${env.PORT}`);
      logger.info(`📚 API: http://localhost:${env.PORT}/api/health`);
      logger.info(`🌍 Environment: ${env.NODE_ENV}`);
    });

    // Then connect to MongoDB (server stays up even if this fails)
    await connectDatabase();

    // Graceful shutdown
    const shutdown = async (signal: string) => {
      logger.info(`\n${signal} received. Shutting down gracefully...`);
      server.close(async () => {
        const { disconnectDatabase } = await import('./config/database');
        await disconnectDatabase();
        process.exit(0);
      });

      // Force shutdown after 10 seconds
      setTimeout(() => {
        logger.error('Forced shutdown after timeout');
        process.exit(1);
      }, 10000);
    };

    process.on('SIGTERM', () => shutdown('SIGTERM'));
    process.on('SIGINT', () => shutdown('SIGINT'));
  } catch (error) {
    logger.error('Failed to start server:', error);
    process.exit(1);
  }
}

startServer();

export default app;
