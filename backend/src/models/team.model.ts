import mongoose, { Schema, Document, Model } from 'mongoose';

export interface ITeamMember {
  userId: mongoose.Types.ObjectId;
  role: 'owner' | 'admin' | 'developer' | 'viewer';
  joinedAt: Date;
}

export interface ITeam extends Document {
  _id: mongoose.Types.ObjectId;
  name: string;
  slug: string;
  ownerId: mongoose.Types.ObjectId;
  members: ITeamMember[];
  plan: 'free' | 'pro' | 'enterprise';
  createdAt: Date;
  updatedAt: Date;
}

const teamMemberSchema = new Schema<ITeamMember>(
  {
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    role: {
      type: String,
      enum: ['owner', 'admin', 'developer', 'viewer'],
      default: 'developer',
    },
    joinedAt: { type: Date, default: Date.now },
  },
  { _id: false }
);

const teamSchema = new Schema<ITeam>(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      maxlength: 100,
    },
    slug: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
    },
    ownerId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    members: [teamMemberSchema],
    plan: {
      type: String,
      enum: ['free', 'pro', 'enterprise'],
      default: 'free',
    },
  },
  {
    timestamps: true,
  }
);

export const Team: Model<ITeam> = mongoose.model<ITeam>('Team', teamSchema);
