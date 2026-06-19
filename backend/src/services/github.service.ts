import { Octokit } from '@octokit/rest';
import { User } from '../models/user.model';
import { ApiError } from '../utils/api-error';
import { logger } from '../utils/logger';

export class GitHubService {
  /**
   * Create an Octokit instance for a user
   */
  private async getOctokit(userId: string): Promise<Octokit> {
    const user = await User.findById(userId).select('+githubAccessToken');
    if (!user || !user.githubAccessToken) {
      throw ApiError.unauthorized('GitHub account not connected');
    }

    return new Octokit({ auth: user.githubAccessToken });
  }

  /**
   * Fetch user's repositories from GitHub
   */
  async getUserRepositories(userId: string) {
    const octokit = await this.getOctokit(userId);

    try {
      const repos = await octokit.paginate(octokit.repos.listForAuthenticatedUser, {
        sort: 'updated',
        direction: 'desc',
        per_page: 100,
        type: 'all',
      });

      return repos.map((repo) => ({
        githubId: repo.id,
        name: repo.name,
        fullName: repo.full_name,
        description: repo.description || '',
        visibility: repo.private ? 'private' : 'public',
        language: repo.language || 'Unknown',
        stars: repo.stargazers_count || 0,
        forks: repo.forks_count || 0,
        defaultBranch: repo.default_branch || 'main',
        htmlUrl: repo.html_url,
        updatedAt: repo.updated_at,
      }));
    } catch (error: unknown) {
      logger.error('Failed to fetch GitHub repos:', error);
      throw ApiError.badRequest('Failed to fetch repositories from GitHub');
    }
  }

  /**
   * Fetch pull requests for a repository
   */
  async getRepositoryPullRequests(
    userId: string,
    owner: string,
    repo: string,
    state: 'open' | 'closed' | 'all' = 'open'
  ) {
    const octokit = await this.getOctokit(userId);

    try {
      const prs = await octokit.pulls.list({
        owner,
        repo,
        state,
        sort: 'updated',
        direction: 'desc',
        per_page: 50,
      });

      return prs.data.map((pr) => ({
        githubPrNumber: pr.number,
        githubPrId: pr.id,
        title: pr.title,
        description: pr.body || '',
        branch: pr.head.ref,
        baseBranch: pr.base.ref,
        author: pr.user?.login || 'unknown',
        authorAvatar: pr.user?.avatar_url || '',
        status: pr.merged_at ? 'merged' : (pr.state as 'open' | 'closed'),
        filesChanged: (pr as any).changed_files || 0,
        additions: (pr as any).additions || 0,
        deletions: (pr as any).deletions || 0,
        htmlUrl: pr.html_url,
        createdAt: pr.created_at,
        updatedAt: pr.updated_at,
      }));
    } catch (error: unknown) {
      logger.error('Failed to fetch PRs:', error);
      throw ApiError.badRequest('Failed to fetch pull requests from GitHub');
    }
  }

  /**
   * Fetch PR diff/changed files
   */
  async getPullRequestFiles(
    userId: string,
    owner: string,
    repo: string,
    prNumber: number
  ) {
    const octokit = await this.getOctokit(userId);

    try {
      const files = await octokit.pulls.listFiles({
        owner,
        repo,
        pull_number: prNumber,
        per_page: 100,
      });

      return files.data.map((file) => ({
        filename: file.filename,
        status: file.status,
        additions: file.additions,
        deletions: file.deletions,
        changes: file.changes,
        patch: file.patch || '',
        contentsUrl: file.contents_url,
        rawUrl: file.raw_url,
      }));
    } catch (error: unknown) {
      logger.error('Failed to fetch PR files:', error);
      throw ApiError.badRequest('Failed to fetch pull request files');
    }
  }

  /**
   * Get a single PR details
   */
  async getPullRequest(
    userId: string,
    owner: string,
    repo: string,
    prNumber: number
  ) {
    const octokit = await this.getOctokit(userId);

    try {
      const { data: pr } = await octokit.pulls.get({
        owner,
        repo,
        pull_number: prNumber,
      });

      return {
        githubPrNumber: pr.number,
        githubPrId: pr.id,
        title: pr.title,
        description: pr.body || '',
        branch: pr.head.ref,
        baseBranch: pr.base.ref,
        author: pr.user?.login || 'unknown',
        authorAvatar: pr.user?.avatar_url || '',
        status: pr.merged_at ? 'merged' : (pr.state as 'open' | 'closed'),
        filesChanged: pr.changed_files || 0,
        additions: pr.additions || 0,
        deletions: pr.deletions || 0,
        htmlUrl: pr.html_url,
      };
    } catch (error: unknown) {
      logger.error('Failed to fetch PR:', error);
      throw ApiError.badRequest('Failed to fetch pull request details');
    }
  }
}

export const githubService = new GitHubService();
