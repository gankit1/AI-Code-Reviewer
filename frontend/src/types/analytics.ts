export interface DashboardStats {
  repositoriesConnected: number;
  totalReviews: number;
  totalPullRequests: number;
  securityIssues: number;
  performanceIssues: number;
  totalFindings: number;
  averageScore: number;
  aiTokensUsed: number;
  aiTokensLimit: number;
}

export interface TrendData {
  date: string;
  reviews: number;
  avgScore: number;
  critical: number;
  high: number;
  medium: number;
  low: number;
}

export interface RepoHealth {
  id: string;
  name: string;
  fullName: string;
  language: string;
  healthScore: number;
  reviewCount: number;
  lastReviewAt?: string;
}

export interface IssueDistribution {
  category: string;
  count: number;
}
