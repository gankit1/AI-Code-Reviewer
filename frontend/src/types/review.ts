export type Severity = 'critical' | 'high' | 'medium' | 'low' | 'info';
export type FindingCategory = 'bug' | 'security' | 'performance' | 'best-practice' | 'style' | 'typescript';

export interface Finding {
  id: string;
  severity: Severity;
  category: FindingCategory;
  file: string;
  line?: number;
  endLine?: number;
  issue: string;
  suggestion: string;
  codeSnippet?: string;
  fixedCode?: string;
}

export interface Scores {
  security: number;
  performance: number;
  maintainability: number;
  readability: number;
  overall: number;
}

export interface Review {
  _id: string;
  pullRequestId: string | { _id: string; title: string; githubPrNumber: number; branch: string; author: string };
  repositoryId: string | { _id: string; name: string; fullName: string; language: string };
  userId: string;
  status: 'pending' | 'analyzing' | 'completed' | 'failed';
  findings: Finding[];
  summary: string;
  scores: Scores;
  filesAnalyzed: number;
  totalFindings: number;
  criticalCount: number;
  highCount: number;
  mediumCount: number;
  lowCount: number;
  aiProvider: 'openai' | 'anthropic';
  aiModel: string;
  tokensUsed: number;
  processingTime: number;
  errorMessage?: string;
  createdAt: string;
  updatedAt: string;
}
