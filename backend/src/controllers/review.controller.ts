import { Request, Response, NextFunction } from 'express';
import { reviewService } from '../services/review.service';
import { aiReviewService } from '../services/ai-review.service';

export class ReviewController {
  /**
   * Trigger a review for a pull request
   */
  async triggerReview(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const review = await reviewService.triggerReview(req.params.id as string, req.user!._id);
      res.status(201).json({ success: true, data: { review } });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Get review details
   */
  async getReview(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const review = await reviewService.getReview(req.params.id as string, req.user!._id);
      res.json({ success: true, data: { review } });
    } catch (error) {
      next(error);
    }
  }

  /**
   * List user's reviews
   */
  async listReviews(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { page, limit, status, repositoryId } = req.query;
      const result = await reviewService.getUserReviews(req.user!._id, {
        page: page ? Number(page) : undefined,
        limit: limit ? Number(limit) : undefined,
        status: status as string | undefined,
        repositoryId: repositoryId as string | undefined,
      });
      res.json({ success: true, data: result });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Explain code using AI
   */
  async explainCode(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { code, filename } = req.body;
      const explanation = await aiReviewService.explainCode(code, filename);
      res.json({ success: true, data: { explanation } });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Suggest refactoring using AI
   */
  async suggestRefactoring(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { code, filename } = req.body;
      const suggestions = await aiReviewService.suggestRefactoring(code, filename);
      res.json({ success: true, data: { suggestions } });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Generate unit tests using AI
   */
  async generateTests(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { code, filename } = req.body;
      const tests = await aiReviewService.generateTests(code, filename);
      res.json({ success: true, data: { tests } });
    } catch (error) {
      next(error);
    }
  }
}

export const reviewController = new ReviewController();
