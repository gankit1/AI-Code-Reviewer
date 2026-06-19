import { Router } from 'express';
import authRoutes from './auth.routes';
import repositoryRoutes from './repository.routes';
import reviewRoutes from './review.routes';
import analyticsRoutes from './analytics.routes';

const router = Router();

router.use('/auth', authRoutes);
router.use('/repositories', repositoryRoutes);
router.use('/reviews', reviewRoutes);
router.use('/analytics', analyticsRoutes);

// Health check
router.get('/health', (_req, res) => {
  res.json({
    success: true,
    data: {
      status: 'healthy',
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
    },
  });
});

export default router;
