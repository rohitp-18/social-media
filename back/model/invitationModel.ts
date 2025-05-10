import mongoose, { Schema, Document } from "mongoose";

// Define the invitation status options
export enum InvitationStatus {
  PENDING = "pending",
  ACCEPTED = "accepted",
  REJECTED = "rejected",
  EXPIRED = "expired",
}

// Define the invitation type options
export enum InvitationType {
  GROUP = "group",
  COMPANY = "company",
}

// Interface for the Invitation document
export interface IInvitation extends Document {
  sender: mongoose.Schema.Types.ObjectId;
  recipientEmail: string;
  recipientUser?: mongoose.Schema.Types.ObjectId;
  type: InvitationType;
  status: InvitationStatus;
  message?: string;
  createdAt: Date;
  expiresAt?: Date;
}

// Create the invitation schema
const InvitationSchema: Schema = new Schema({
  sender: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  recipientEmail: {
    type: String,
    required: true,
    trim: true,
    lowercase: true,
  },
  recipientUser: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
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

// Create indexes for faster queries
InvitationSchema.index(
  { recipientEmail: 1, targetId: 1, type: 1 },
  { unique: true }
);
InvitationSchema.index({ status: 1 });
InvitationSchema.index({ expiresAt: 1 });

// Export the model
const Invitation = mongoose.model<IInvitation>("Invitation", InvitationSchema);

export default Invitation;
