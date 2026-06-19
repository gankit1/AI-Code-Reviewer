import rateLimit from 'express-rate-limit';

export function rateLimiter(windowMs: number = 15 * 60 * 1000, max: number = 100) {
  return rateLimit({
    windowMs,
    max,
    standardHeaders: true,
    legacyHeaders: false,
    message: {
      success: false,
      error: {
        message: 'Too many requests, please try again later',
      },
    },
  });
}

// Strict rate limit for auth endpoints
export const authRateLimiter = rateLimiter(15 * 60 * 1000, 20); // 20 req per 15 min

// Standard API rate limiter
export const apiRateLimiter = rateLimiter(15 * 60 * 1000, 100); // 100 req per 15 min

// AI endpoint rate limiter
export const aiRateLimiter = rateLimiter(60 * 1000, 10); // 10 req per minute
