import { Request, Response, NextFunction } from 'express';
import { analyticsService } from '../services/analytics.service';

export class AnalyticsController {
  async getOverview(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const data = await analyticsService.getOverview(req.user!._id);
      res.json({ success: true, data });
    } catch (error) {
      next(error);
    }
  }

  async getTrends(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const days = Number(req.query.days) || 30;
      const data = await analyticsService.getReviewTrends(req.user!._id, days);
      res.json({ success: true, data: { trends: data } });
    } catch (error) {
      next(error);
    }
  }

  async getRepositoryHealth(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const data = await analyticsService.getRepositoryHealth(req.user!._id);
      res.json({ success: true, data: { repositories: data } });
    } catch (error) {
      next(error);
    }
  }

  async getIssueDistribution(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const data = await analyticsService.getIssueDistribution(req.user!._id);
      res.json({ success: true, data: { distribution: data } });
    } catch (error) {
      next(error);
    }
  }
}

export const analyticsController = new AnalyticsController();
