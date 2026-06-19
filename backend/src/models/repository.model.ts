import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IRepository extends Document {
  _id: mongoose.Types.ObjectId;
  userId: mongoose.Types.ObjectId;
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
  lastSyncAt?: Date;
  isActive: boolean;
  autoReview: boolean;
  reviewCount: number;
  healthScore?: number;
  lastReviewAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

const repositorySchema = new Schema<IRepository>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    githubId: {
      type: Number,
      required: true,
    },
    name: {
      type: String,
      required: true,
      trim: true,
    },
    fullName: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      maxlength: 500,
    },
    visibility: {
      type: String,
      enum: ['public', 'private'],
      default: 'public',
    },
    language: {
      type: String,
    },
    stars: {
      type: Number,
      default: 0,
    },
    forks: {
      type: Number,
      default: 0,
    },
    defaultBranch: {
      type: String,
      default: 'main',
    },
    htmlUrl: {
      type: String,
      required: true,
    },
    lastSyncAt: {
      type: Date,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    autoReview: {
      type: Boolean,
      default: false,
    },
    reviewCount: {
      type: Number,
      default: 0,
    },
    healthScore: {
      type: Number,
      min: 0,
      max: 100,
    },
    lastReviewAt: {
      type: Date,
    },
  },
  {
    timestamps: true,
  }
);

// Compound index for unique repo per user
repositorySchema.index({ userId: 1, githubId: 1 }, { unique: true });

export const Repository: Model<IRepository> = mongoose.model<IRepository>(
  'Repository',
  repositorySchema
);
