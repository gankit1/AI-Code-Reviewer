import { Request, Response, NextFunction } from 'express';
import { githubService } from '../services/github.service';
import { repositoryService } from '../services/repository.service';
import { PullRequest } from '../models/pull-request.model';

export class RepositoryController {
  /**
   * List user's GitHub repos (not imported)
   */
  async listGitHubRepos(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const repos = await githubService.getUserRepositories(req.user!._id);
      res.json({ success: true, data: { repositories: repos } });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Import a repository
   */
  async importRepository(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const repository = await repositoryService.importRepository(req.user!._id, req.body);
      res.status(201).json({ success: true, data: { repository } });
    } catch (error) {
      next(error);
    }
  }

  /**
   * List imported repositories
   */
  async listRepositories(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { page, limit, search } = req.query;
      const result = await repositoryService.getUserRepositories(req.user!._id, {
        page: page ? Number(page) : undefined,
        limit: limit ? Number(limit) : undefined,
        search: search as string | undefined,
      });
      res.json({ success: true, data: result });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Get repository details
   */
  async getRepository(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const repository = await repositoryService.getRepository(req.params.id as string, req.user!._id);
      res.json({ success: true, data: { repository } });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Delete repository
   */
  async deleteRepository(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      await repositoryService.deleteRepository(req.params.id as string, req.user!._id);
      res.json({ success: true, message: 'Repository deleted' });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Sync repository with GitHub
   */
  async syncRepository(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const repository = await repositoryService.syncRepository(req.params.id as string, req.user!._id);
      res.json({ success: true, data: { repository } });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Get pull requests for a repository
   */
  async getPullRequests(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { page = 1, limit = 20 } = req.query;
      const pullRequests = await PullRequest.find({
        repositoryId: req.params.id,
        userId: req.user!._id,
      })
        .sort({ updatedAt: -1 })
        .skip((Number(page) - 1) * Number(limit))
        .limit(Number(limit))
        .lean();

      const total = await PullRequest.countDocuments({
        repositoryId: req.params.id,
        userId: req.user!._id,
      });

      res.json({
        success: true,
        data: {
          pullRequests,
          pagination: {
            page: Number(page),
            limit: Number(limit),
            total,
            pages: Math.ceil(total / Number(limit)),
          },
        },
      });
    } catch (error) {
      next(error);
    }
  }
}

export const repositoryController = new RepositoryController();
