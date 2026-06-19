import Redis from 'ioredis';
import { env } from './env';
import { logger } from '../utils/logger';

export const redisConnection = new Redis(env.REDIS_URL, {
  maxRetriesPerRequest: null, // Required for BullMQ
  enableOfflineQueue: false,
  retryStrategy(times: number) {
    const delay = Math.min(times * 200, 5000);
    logger.warn(`🔄 Redis reconnecting in ${delay}ms (attempt ${times})`);
    return delay;
  },
});

redisConnection.on('connect', () => {
  logger.info('🔴 Redis connected successfully');
});

redisConnection.on('error', (err) => {
  logger.error('❌ Redis connection error:', err.message);
});

export function getRedisConnection(): Redis {
  return redisConnection;
}
