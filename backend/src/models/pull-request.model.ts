import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IPullRequest extends Document {
  _id: mongoose.Types.ObjectId;
  repositoryId: mongoose.Types.ObjectId;
  userId: mongoose.Types.ObjectId;
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
  lastReviewId?: mongoose.Types.ObjectId;
  htmlUrl: string;
  createdAt: Date;
  updatedAt: Date;
}

const pullRequestSchema = new Schema<IPullRequest>(
  {
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
    githubPrNumber: {
      type: Number,
      required: true,
    },
    githubPrId: {
      type: Number,
      required: true,
    },
    title: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      maxlength: 5000,
    },
    branch: {
      type: String,
      required: true,
    },
    baseBranch: {
      type: String,
      required: true,
    },
    author: {
      type: String,
      required: true,
    },
    authorAvatar: {
      type: String,
    },
    status: {
      type: String,
      enum: ['open', 'closed', 'merged'],
      default: 'open',
    },
    filesChanged: {
      type: Number,
      default: 0,
    },
    additions: {
      type: Number,
      default: 0,
    },
    deletions: {
      type: Number,
      default: 0,
    },
    reviewStatus: {
      type: String,
      enum: ['pending', 'in_progress', 'completed', 'failed'],
      default: 'pending',
    },
    lastReviewId: {
      type: Schema.Types.ObjectId,
      ref: 'Review',
    },
    htmlUrl: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

pullRequestSchema.index({ repositoryId: 1, githubPrNumber: 1 }, { unique: true });

export const PullRequest: Model<IPullRequest> = mongoose.model<IPullRequest>(
  'PullRequest',
  pullRequestSchema
);
