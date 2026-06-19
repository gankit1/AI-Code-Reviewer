import { Review } from '../models/review.model';
import { Repository } from '../models/repository.model';
import { PullRequest } from '../models/pull-request.model';
import { User } from '../models/user.model';
import { ApiError } from '../utils/api-error';
import mongoose from 'mongoose';

export class AnalyticsService {
  /**
   * Get dashboard overview stats
   */
  async getOverview(userId: string) {
    const [
      totalRepos,
      totalReviews,
      totalPRs,
      user,
      severityCounts,
    ] = await Promise.all([
      Repository.countDocuments({ userId }),
      Review.countDocuments({ userId, status: 'completed' }),
      PullRequest.countDocuments({ userId }),
      User.findById(userId).lean(),
      Review.aggregate([
        { $match: { userId: new mongoose.Types.ObjectId(userId), status: 'completed' } },
        {
          $group: {
            _id: null,
            totalCritical: { $sum: '$criticalCount' },
            totalHigh: { $sum: '$highCount' },
            totalMedium: { $sum: '$mediumCount' },
            totalLow: { $sum: '$lowCount' },
            totalFindings: { $sum: '$totalFindings' },
            avgScore: { $avg: '$scores.overall' },
          },
        },
      ]),
    ]);

    const stats = severityCounts[0] || {
      totalCritical: 0,
      totalHigh: 0,
      totalMedium: 0,
      totalLow: 0,
      totalFindings: 0,
      avgScore: 0,
    };

    return {
      repositoriesConnected: totalRepos,
      totalReviews,
      totalPullRequests: totalPRs,
      securityIssues: stats.totalCritical + stats.totalHigh,
      performanceIssues: stats.totalMedium,
      totalFindings: stats.totalFindings,
      averageScore: Math.round(stats.avgScore || 0),
      aiTokensUsed: user?.aiTokensUsed || 0,
      aiTokensLimit: user?.aiTokensLimit || 50000,
    };
  }

  /**
   * Get review trends over time
   */
  async getReviewTrends(userId: string, days: number = 30) {
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);

    const trends = await Review.aggregate([
      {
        $match: {
          userId: new mongoose.Types.ObjectId(userId),
          status: 'completed',
          createdAt: { $gte: startDate },
        },
      },
      {
        $group: {
          _id: {
            $dateToString: { format: '%Y-%m-%d', date: '$createdAt' },
          },
          reviews: { $sum: 1 },
          avgScore: { $avg: '$scores.overall' },
          criticalIssues: { $sum: '$criticalCount' },
          highIssues: { $sum: '$highCount' },
          mediumIssues: { $sum: '$mediumCount' },
          lowIssues: { $sum: '$lowCount' },
        },
      },
      { $sort: { _id: 1 } },
    ]);

    return trends.map((t) => ({
      date: t._id,
      reviews: t.reviews,
      avgScore: Math.round(t.avgScore),
      critical: t.criticalIssues,
      high: t.highIssues,
      medium: t.mediumIssues,
      low: t.lowIssues,
    }));
  }

  /**
   * Get repository health scores
   */
  async getRepositoryHealth(userId: string) {
    const repos = await Repository.find({ userId })
      .select('name fullName language healthScore reviewCount lastReviewAt')
      .sort({ healthScore: -1 })
      .lean();

    return repos.map((repo) => ({
      id: repo._id,
      name: repo.name,
      fullName: repo.fullName,
      language: repo.language,
      healthScore: repo.healthScore || 0,
      reviewCount: repo.reviewCount,
      lastReviewAt: repo.lastReviewAt,
    }));
  }

  /**
   * Get issue distribution by category
   */
  async getIssueDistribution(userId: string) {
    const distribution = await Review.aggregate([
      {
        $match: {
          userId: new mongoose.Types.ObjectId(userId),
          status: 'completed',
        },
      },
      { $unwind: '$findings' },
      {
        $group: {
          _id: '$findings.category',
          count: { $sum: 1 },
        },
      },
      { $sort: { count: -1 } },
    ]);

    return distribution.map((d) => ({
      category: d._id,
      count: d.count,
    }));
  }
}

export const analyticsService = new AnalyticsService();
