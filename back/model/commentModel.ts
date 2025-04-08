import mongoose from "mongoose";

const commentSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user",
      required: true,
    },
    content: {
      type: String,
      require: true,
    },
    reply: [
      {
        _id: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "comment",
          required: true,
        },
      },
    ],
    likes: [
      {
        _id: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "user",
          required: true,
        },
      },
    ],
    createdAt: { type: Date, default: new Date(Date.now()) },
    updatedAt: [{ type: Date, default: new Date(Date.now()) }],
  },
  { timestamps: true }
);

const Comment = mongoose.model("comment", commentSchema);

export default Comment;
