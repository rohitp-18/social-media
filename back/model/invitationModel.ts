import mongoose, { Schema, Document } from "mongoose";

// Define the invitation status options
export enum InvitationStatus {
  PENDING = "pending",
  ACCEPTED = "accepted",
  REJECTED = "rejected",
}

// Define the invitation type options
export enum InvitationType {
  GROUP = "group",
  COMPANY = "company",
  EVENT = "event",
  JOB = "job",
  CONNECTION = "connection",
}

// Interface for the Invitation document
export interface IInvitation extends Document {
  sender: mongoose.Schema.Types.ObjectId;
  recipientEmail: string;
  recipientUser?: mongoose.Schema.Types.ObjectId;
  type: InvitationType;
  status: InvitationStatus;
  message?: string;
  link?: string;
  targetId?: mongoose.Schema.Types.ObjectId;
  refModel?: string;
  createdAt: Date;
  expiresAt?: Date;
  unread?: boolean;
}

// Create the invitation schema
const InvitationSchema: Schema = new Schema({
  sender: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "user",
    required: true,
  },
  recipientUser: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "user",
  },
  type: {
    type: String,
    enum: Object.values(InvitationType),
    required: true,
  },
  status: {
    type: String,
    enum: Object.values(InvitationStatus),
    default: InvitationStatus.PENDING,
  },
  link: {
    type: String,
    trim: true,
  },
  refModel: {
    type: String,
    trim: true,
  },
  targetId: {
    type: mongoose.Schema.Types.ObjectId,
    refPath: "refModel",
  },
  message: {
    type: String,
    trim: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  expiresAt: {
    type: Date,
  },
});

// Export the model
const Invitation = mongoose.model<IInvitation>("Invitation", InvitationSchema);

export default Invitation;
