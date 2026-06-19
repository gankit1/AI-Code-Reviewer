export interface Repository {
  _id: string;
  userId: string;
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
  lastSyncAt?: string;
  isActive: boolean;
  autoReview: boolean;
  reviewCount: number;
  healthScore?: number;
  lastReviewAt?: string;
  createdAt: string;
  updatedAt: string;
}

export interface GitHubRepo {
  githubId: number;
  name: string;
  fullName: string;
  description: string;
  visibility: 'public' | 'private';
  language: string;
  stars: number;
  forks: number;
  defaultBranch: string;
  htmlUrl: string;
  updatedAt: string;
}

export interface PullRequest {
  _id: string;
  repositoryId: string;
  userId: string;
  githubPrNumber: number;
  githubPrId: number;
  title: string;
  description?: string;
  branch: string;
  baseBranch: string;
  author: string;
  authorAvatar?: string;
  status: 'open' | 'closed' | 'merged';
  filesChanged: number;
  additions: number;
  deletions: number;
  reviewStatus: 'pending' | 'in_progress' | 'completed' | 'failed';
  lastReviewId?: string;
  htmlUrl: string;
  createdAt: string;
  updatedAt: string;
}
