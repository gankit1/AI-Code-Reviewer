import mongoose, { Schema, Document, Model } from 'mongoose';
import bcrypt from 'bcryptjs';

export interface IUser extends Document {
  _id: mongoose.Types.ObjectId;
  email: string;
  password?: string;
  name: string;
  avatar?: string;
  githubId?: string;
  githubAccessToken?: string;
  githubUsername?: string;
  role: 'owner' | 'admin' | 'developer' | 'viewer';
  plan: 'free' | 'pro' | 'enterprise';
  aiTokensUsed: number;
  aiTokensLimit: number;
  isEmailVerified: boolean;
  lastLoginAt?: Date;
  createdAt: Date;
  updatedAt: Date;
  comparePassword(candidatePassword: string): Promise<boolean>;
  toPublicJSON(): Record<string, unknown>;
}

const userSchema = new Schema<IUser>(
  {
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      index: true,
    },
    password: {
      type: String,
      select: false, // Never return password by default
    },
    name: {
      type: String,
      required: true,
      trim: true,
      maxlength: 100,
    },
    avatar: {
      type: String,
    },
    githubId: {
      type: String,
      sparse: true,
      unique: true,
    },
    githubAccessToken: {
      type: String,
      select: false,
    },
    githubUsername: {
      type: String,
    },
    role: {
      type: String,
      enum: ['owner', 'admin', 'developer', 'viewer'],
      default: 'developer',
    },
    plan: {
      type: String,
      enum: ['free', 'pro', 'enterprise'],
      default: 'free',
    },
    aiTokensUsed: {
      type: Number,
      default: 0,
    },
    aiTokensLimit: {
      type: Number,
      default: 50000, // Free tier limit
    },
    isEmailVerified: {
      type: Boolean,
      default: false,
    },
    lastLoginAt: {
      type: Date,
    },
  },
  {
    timestamps: true,
    toJSON: {
      transform(_doc, ret) {
        delete (ret as any).password;
        delete (ret as any).githubAccessToken;
        delete (ret as any).__v;
        return ret;
      },
    },
  }
);

// Hash password before saving
userSchema.pre('save', async function (next) {
  if (!this.isModified('password') || !this.password) return next();
  const salt = await bcrypt.genSalt(12);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// Compare password method
userSchema.methods.comparePassword = async function (
  candidatePassword: string
): Promise<boolean> {
  if (!this.password) return false;
  return bcrypt.compare(candidatePassword, this.password);
};

// Return safe user data
userSchema.methods.toPublicJSON = function (): Record<string, unknown> {
  return {
    id: this._id,
    email: this.email,
    name: this.name,
    avatar: this.avatar,
    githubUsername: this.githubUsername,
    role: this.role,
    plan: this.plan,
    aiTokensUsed: this.aiTokensUsed,
    aiTokensLimit: this.aiTokensLimit,
    isEmailVerified: this.isEmailVerified,
    createdAt: this.createdAt,
  };
};

export const User: Model<IUser> = mongoose.model<IUser>('User', userSchema);
