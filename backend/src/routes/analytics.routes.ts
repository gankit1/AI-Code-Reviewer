import { Router } from 'express';
import { analyticsController } from '../controllers/analytics.controller';
import { authenticate } from '../middleware/auth.middleware';

const router = Router();

router.use(authenticate);

router.get('/overview', analyticsController.getOverview);
router.get('/trends', analyticsController.getTrends);
router.get('/repositories', analyticsController.getRepositoryHealth);
router.get('/issues', analyticsController.getIssueDistribution);

export default router;
