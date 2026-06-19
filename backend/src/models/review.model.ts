import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IFinding {
  id: string;
  severity: 'critical' | 'high' | 'medium' | 'low' | 'info';
  category: 'bug' | 'security' | 'performance' | 'best-practice' | 'style' | 'typescript';
  file: string;
  line?: number;
  endLine?: number;
  issue: string;
  suggestion: string;
  codeSnippet?: string;
  fixedCode?: string;
}

export interface IScores {
  security: number;
  performance: number;
  maintainability: number;
  readability: number;
  overall: number;
}

export interface IReview extends Document {
  _id: mongoose.Types.ObjectId;
  pullRequestId: mongoose.Types.ObjectId;
  repositoryId: mongoose.Types.ObjectId;
  userId: mongoose.Types.ObjectId;
  status: 'pending' | 'analyzing' | 'completed' | 'failed';
  findings: IFinding[];
  summary: string;
  scores: IScores;
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
  createdAt: Date;
  updatedAt: Date;
}

const findingSchema = new Schema<IFinding>(
  {
    id: { type: String, required: true },
    severity: {
      type: String,
      enum: ['critical', 'high', 'medium', 'low', 'info'],
      required: true,
    },
    category: {
      type: String,
      enum: ['bug', 'security', 'performance', 'best-practice', 'style', 'typescript'],
      required: true,
    },
    file: { type: String, required: true },
    line: { type: Number },
    endLine: { type: Number },
    issue: { type: String, required: true },
    suggestion: { type: String, required: true },
    codeSnippet: { type: String },
    fixedCode: { type: String },
  },
  { _id: false }
);

const scoresSchema = new Schema<IScores>(
  {
    security: { type: Number, min: 0, max: 100, default: 100 },
    performance: { type: Number, min: 0, max: 100, default: 100 },
    maintainability: { type: Number, min: 0, max: 100, default: 100 },
    readability: { type: Number, min: 0, max: 100, default: 100 },
    overall: { type: Number, min: 0, max: 100, default: 100 },
  },
  { _id: false }
);

const reviewSchema = new Schema<IReview>(
  {
    pullRequestId: {
      type: Schema.Types.ObjectId,
      ref: 'PullRequest',
      required: true,
      index: true,
    },
    repositoryId: {
      type: Schema.Types.ObjectId,
      ref: 'Repository',
      required: true,
      index: true,
    },
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    status: {
      type: String,
      enum: ['pending', 'analyzing', 'completed', 'failed'],
      default: 'pending',
    },
    findings: [findingSchema],
    summary: {
      type: String,
      default: '',
    },
    scores: {
      type: scoresSchema,
      default: () => ({}),
    },
    filesAnalyzed: { type: Number, default: 0 },
    totalFindings: { type: Number, default: 0 },
    criticalCount: { type: Number, default: 0 },
    highCount: { type: Number, default: 0 },
    mediumCount: { type: Number, default: 0 },
    lowCount: { type: Number, default: 0 },
    aiProvider: {
      type: String,
      enum: ['openai', 'anthropic'],
      default: 'openai',
    },
    aiModel: {
      type: String,
      default: 'gpt-4o',
    },
    tokensUsed: { type: Number, default: 0 },
    processingTime: { type: Number, default: 0 },
    errorMessage: { type: String },
  },
  {
    timestamps: true,
  }
);

reviewSchema.index({ createdAt: -1 });
reviewSchema.index({ userId: 1, createdAt: -1 });

export const Review: Model<IReview> = mongoose.model<IReview>('Review', reviewSchema);
