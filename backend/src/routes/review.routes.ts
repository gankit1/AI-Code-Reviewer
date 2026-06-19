import { Router } from 'express';
import { reviewController } from '../controllers/review.controller';
import { authenticate } from '../middleware/auth.middleware';
import { aiRateLimiter } from '../middleware/rate-limit.middleware';

const router = Router();

router.use(authenticate);

// Reviews
router.get('/', reviewController.listReviews);
router.get('/:id', reviewController.getReview);
router.post('/pull/:id/analyze', reviewController.triggerReview);

// AI features
router.post('/ai/explain', aiRateLimiter, reviewController.explainCode);
router.post('/ai/refactor', aiRateLimiter, reviewController.suggestRefactoring);
router.post('/ai/generate-tests', aiRateLimiter, reviewController.generateTests);

export default router;
