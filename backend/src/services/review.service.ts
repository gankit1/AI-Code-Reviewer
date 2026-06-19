import { Review, IReview } from '../models/review.model';
import { PullRequest } from '../models/pull-request.model';
import { Repository } from '../models/repository.model';
import { User } from '../models/user.model';
import { githubService } from './github.service';
import { aiReviewService } from './ai-review.service';
import { ApiError } from '../utils/api-error';
import { logger } from '../utils/logger';

export class ReviewService {
  /**
   * Trigger a review for a pull request
   */
  async triggerReview(
    pullRequestId: string,
    userId: string
  ): Promise<IReview> {
    const pullRequest = await PullRequest.findById(pullRequestId);
    if (!pullRequest) {
      throw ApiError.notFound('Pull request not found');
    }

    const repository = await Repository.findById(pullRequest.repositoryId);
    if (!repository) {
      throw ApiError.notFound('Repository not found');
    }

    // Check if already reviewing
    if (pullRequest.reviewStatus === 'in_progress') {
      throw ApiError.conflict('Review already in progress');
    }

    // Create review record
    const review = await Review.create({
      pullRequestId: pullRequest._id,
      repositoryId: repository._id,
      userId,
      status: 'analyzing',
    });

    // Update PR status
    pullRequest.reviewStatus = 'in_progress';
    await pullRequest.save();

    // Start async review
    this.processReview(review._id.toString(), userId, repository.fullName, pullRequest.githubPrNumber)
      .catch((err) => logger.error('Review processing error:', err));

    return review;
  }

  /**
   * Process the actual review (called async)
   */
  private async processReview(
    reviewId: string,
    userId: string,
    repoFullName: string,
    prNumber: number
  ): Promise<void> {
    const startTime = Date.now();
    const [owner, repo] = repoFullName.split('/');

    try {
      // Fetch PR files from GitHub
      const files = await githubService.getPullRequestFiles(userId, owner, repo, prNumber);

      // Send to AI for review
      const aiResult = await aiReviewService.reviewFiles(files);

      // Count findings by severity
      const criticalCount = aiResult.findings.filter((f) => f.severity === 'critical').length;
      const highCount = aiResult.findings.filter((f) => f.severity === 'high').length;
      const mediumCount = aiResult.findings.filter((f) => f.severity === 'medium').length;
      const lowCount = aiResult.findings.filter((f) => f.severity === 'low').length;

      // Update review
      await Review.findByIdAndUpdate(reviewId, {
        status: 'completed',
        findings: aiResult.findings,
        summary: aiResult.summary,
        scores: aiResult.scores,
        filesAnalyzed: files.length,
        totalFindings: aiResult.findings.length,
        criticalCount,
        highCount,
        mediumCount,
        lowCount,
        aiProvider: 'openai',
        aiModel: 'gpt-4o',
        tokensUsed: aiResult.tokensUsed,
        processingTime: Date.now() - startTime,
      });

      // Update PR status
      const review = await Review.findById(reviewId);
      if (review) {
        await PullRequest.findByIdAndUpdate(review.pullRequestId, {
          reviewStatus: 'completed',
          lastReviewId: reviewId,
        });

        // Update repository review count and health score
        await Repository.findByIdAndUpdate(review.repositoryId, {
          $inc: { reviewCount: 1 },
          healthScore: aiResult.scores.overall,
          lastReviewAt: new Date(),
        });

        // Update user token usage
        await User.findByIdAndUpdate(userId, {
          $inc: { aiTokensUsed: aiResult.tokensUsed },
        });
      }

      logger.info(
        `Review completed: ${repoFullName}#${prNumber} - ` +
        `${aiResult.findings.length} findings, score: ${aiResult.scores.overall}/100`
      );
    } catch (error: unknown) {
      logger.error(`Review failed for ${repoFullName}#${prNumber}:`, error);

      await Review.findByIdAndUpdate(reviewId, {
        status: 'failed',
        errorMessage: error instanceof Error ? error.message : 'Unknown error',
        processingTime: Date.now() - startTime,
      });

      // Find the review to get the PR ID
      const review = await Review.findById(reviewId);
      if (review) {
        await PullRequest.findByIdAndUpdate(review.pullRequestId, {
          reviewStatus: 'failed',
        });
      }
    }
  }

  /**
   * Get review by ID
   */
  async getReview(reviewId: string, userId: string): Promise<IReview> {
    const review = await Review.findOne({ _id: reviewId, userId })
      .populate('pullRequestId')
      .populate('repositoryId');

    if (!review) {
      throw ApiError.notFound('Review not found');
    }

    return review;
  }

  /**
   * Get user's reviews
   */
  async getUserReviews(userId: string, options: {
    page?: number;
    limit?: number;
    status?: string;
    repositoryId?: string;
  } = {}) {
    const { page = 1, limit = 20, status, repositoryId } = options;

    const query: Record<string, unknown> = { userId };
    if (status) query.status = status;
    if (repositoryId) query.repositoryId = repositoryId;

    const [reviews, total] = await Promise.all([
      Review.find(query)
        .populate('pullRequestId', 'title githubPrNumber branch author')
        .populate('repositoryId', 'name fullName language')
        .sort({ createdAt: -1 })
        .skip((page - 1) * limit)
        .limit(limit)
        .lean(),
      Review.countDocuments(query),
    ]);

    return {
      reviews,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    };
  }
}

export const reviewService = new ReviewService();
