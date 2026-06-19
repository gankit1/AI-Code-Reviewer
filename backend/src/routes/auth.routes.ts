import { Router } from 'express';
import { z } from 'zod';
import { authController } from '../controllers/auth.controller';
import { authenticate } from '../middleware/auth.middleware';
import { validate } from '../middleware/validate.middleware';
import { authRateLimiter } from '../middleware/rate-limit.middleware';

const router = Router();

const registerSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
  name: z.string().min(2, 'Name must be at least 2 characters').max(100),
});

const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(1, 'Password is required'),
});

// Public routes
router.post('/register', authRateLimiter, validate(registerSchema), authController.register);
router.post('/login', authRateLimiter, validate(loginSchema), authController.login);
router.get('/github', authController.githubAuth);
router.get('/github/callback', authController.githubCallback);

// Protected routes
router.get('/me', authenticate, authController.getMe);

export default router;
