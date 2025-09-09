import mongoose from "mongoose";

const chatSchema = new mongoose.Schema(
  {
    members: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "user",
      },
    ],
    lastMessage: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "message",
    },
    isGroupChat: {
      type: Boolean,
      default: false,
    },
    group: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "group",
    },
    createdAt: {
      type: Date,
      default: new Date(Date.now()),
    },
    isDeleted: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

// Creating a model for the chat schema
// The model is used to interact with the MongoDB database

chatSchema.pre(/^find/, function (this: mongoose.Query<any, any>, next) {
  this.where({ isDeleted: false });
  next();
});

// interface for the chat model
export interface IChat extends mongoose.Document {
  members: Array<{ _id: mongoose.Schema.Types.ObjectId }>;
  lastMessage: mongoose.Schema.Types.ObjectId;
  isGroupChat: boolean;
  group: mongoose.Schema.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date[];
  isDeleted: boolean;
}

const Chat = mongoose.model<IChat>("chat", chatSchema);

export default Chat;
