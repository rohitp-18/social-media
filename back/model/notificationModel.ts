import mongoose, { Schema, Document } from "mongoose";

// Define the notification types
enum NotificationType {
  JOB = "job",
  NEWSLETTER = "newsletter",
  POST = "post",
  INVITATION = "invitation",
  GROUP = "group",
  FOLLOWING = "following",
  FOLLOWER = "follower",
  COMMENT = "comment",
  COMPANY = "company",
  CHAT = "chat",
  APPLICATION = "application",
}

// Define the notification interface
export interface INotification extends Document {
  recipient: mongoose.Types.ObjectId;
  sender: mongoose.Types.ObjectId;
  type: NotificationType;
  message: string;
  read: boolean;
  url: string;
  relatedId?: mongoose.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

// Create the notification schema
const NotificationSchema: Schema = new Schema(
  {
    recipient: {
      type: Schema.Types.ObjectId,
      ref: "user",
      required: true,
    },
    sender: {
      type: Schema.Types.ObjectId,
      ref: "user",
      required: true,
    },
    type: {
      type: String,
      enum: Object.values(NotificationType),
      required: true,
    },
    message: {
      type: String,
      required: true,
    },
    read: {
      type: Boolean,
      default: false,
    },

    refModel: {
      type: String,
      enum: [
        "applyJob",
        "post",
        "groups",
        "users",
        "newsletter",
        "Invitation",
        "company",
        "chats",
      ],
    },
    relatedId: {
      type: Schema.Types.ObjectId,
      refPath: "refModel",
    },
    url: {
      type: String,
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);

// Create and export the model
const Notification = mongoose.model<INotification>(
  "Notification",
  NotificationSchema
);

export default Notification;
