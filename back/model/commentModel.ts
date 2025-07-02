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
    post: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "post",
      required: true,
    },
    type: {
      type: String,
      enum: ["comment", "reply"],
      default: "comment",
    },
    edited: {
      type: Boolean,
      default: false,
    },
    editedAt: {
      type: Date,
      default: null,
    },
    parent: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "comment",
      default: null,
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
        type: mongoose.Schema.Types.ObjectId,
        ref: "user",
        required: true,
      },
    ],
    isDeleted: {
      type: Boolean,
      default: false,
    },
    createdAt: { type: Date, default: new Date(Date.now()) },
    updatedAt: [{ type: Date, default: new Date(Date.now()) }],
  },
  { timestamps: true }
);

const Comment = mongoose.model("comment", commentSchema);

export default Comment;
