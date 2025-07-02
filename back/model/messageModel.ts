import mongoose from "mongoose";

const messageModel = new mongoose.Schema(
  {
    sender: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user",
      required: true,
    },
    chat: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "chat",
      required: true,
    },
    readBy: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "user",
        required: true,
      },
    ],
    content: {
      type: String,
    },
    image: {
      type: String,
    },
    video: {
      type: String,
    },
    audio: {
      type: String,
    },
    document: {
      type: String,
    },
    replyTo: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "message",
    },
  },
  {
    timestamps: true,
  }
);

// Define the interface for the message document
interface IMessage extends mongoose.Document {
  sender: mongoose.Schema.Types.ObjectId;
  chat: mongoose.Schema.Types.ObjectId;
  readBy: Array<{ _id: mongoose.Schema.Types.ObjectId }>;
  content?: string;
  image?: string;
  video?: string;
  audio?: string;
  document?: string;
  createdAt: Date;
  updatedAt: Date;
}

const Message = mongoose.model<IMessage>("message", messageModel);

export default Message;
