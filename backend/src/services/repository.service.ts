import { Repository, IRepository } from '../models/repository.model';
import { PullRequest } from '../models/pull-request.model';
import { Review } from '../models/review.model';
import { githubService } from './github.service';
import { ApiError } from '../utils/api-error';
import { logger } from '../utils/logger';

export class RepositoryService {
  /**
   * Import a repository from GitHub
   */
  async importRepository(userId: string, githubRepoData: {
    githubId: number;
    name: string;
    fullName: string;
    description?: string;
    visibility: 'public' | 'private';
    language?: string;
    stars: number;
    forks: number;
    defaultBranch: string;
    htmlUrl: string;
  }): Promise<IRepository> {
    // Check if already imported
    const existing = await Repository.findOne({
      userId,
      githubId: githubRepoData.githubId,
    });

    if (existing) {
      throw ApiError.conflict('Repository already imported');
    }

    const repository = await Repository.create({
      userId,
      ...githubRepoData,
      lastSyncAt: new Date(),
    });

    logger.info(`Repository imported: ${githubRepoData.fullName} by user ${userId}`);
    return repository;
  }

  /**
   * Get user's imported repositories
   */
  async getUserRepositories(userId: string, options: {
    page?: number;
    limit?: number;
    search?: string;
  } = {}) {
    const { page = 1, limit = 20, search } = options;

    const query: Record<string, unknown> = { userId };
    if (search) {
      query.name = { $regex: search, $options: 'i' };
    }

    const [repositories, total] = await Promise.all([
      Repository.find(query)
        .sort({ updatedAt: -1 })
        .skip((page - 1) * limit)
        .limit(limit)
        .lean(),
      Repository.countDocuments(query),
    ]);

    return {
      repositories,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    };
  }

  /**
   * Get repository by ID
   */
  async getRepository(repositoryId: string, userId: string): Promise<IRepository> {
    const repository = await Repository.findOne({
      _id: repositoryId,
      userId,
    });

    if (!repository) {
      throw ApiError.notFound('Repository not found');
    }

    return repository;
  }

  /**
   * Delete an imported repository
   */
  async deleteRepository(repositoryId: string, userId: string): Promise<void> {
    const repository = await Repository.findOneAndDelete({
      _id: repositoryId,
      userId,
    });

    if (!repository) {
      throw ApiError.notFound('Repository not found');
    }

    // Clean up related data
    await Promise.all([
      PullRequest.deleteMany({ repositoryId }),
      Review.deleteMany({ repositoryId }),
    ]);

    logger.info(`Repository deleted: ${repository.fullName}`);
  }

  /**
   * Sync repository with GitHub
   */
  async syncRepository(repositoryId: string, userId: string): Promise<IRepository> {
    const repository = await this.getRepository(repositoryId, userId);
    const [owner, repo] = repository.fullName.split('/');

    // Fetch latest PRs
    const prs = await githubService.getRepositoryPullRequests(userId, owner, repo, 'all');

    // Upsert PRs
    for (const pr of prs) {
      await PullRequest.findOneAndUpdate(
        { repositoryId, githubPrNumber: pr.githubPrNumber },
        { ...pr, repositoryId, userId },
        { upsert: true, new: true }
      );
    }

    repository.lastSyncAt = new Date();
    await repository.save();

    logger.info(`Repository synced: ${repository.fullName}, ${prs.length} PRs`);
    return repository;
  }
}

export const repositoryService = new RepositoryService();
