import mongoose from "mongoose";

const postSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user",
      required: true,
    },
    privacyControl: {
      type: String,
      enum: ["public", "friends", "private"],
      default: "public",
    },
    content: {
      type: String,
      require: true,
    },
    video: {
      public_id: { type: String },
      url: String,
    },
    externalLinks: [
      {
        url: String,
        text: String,
      },
    ],
    reactions: [
      {
        userId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "user",
          required: true,
        },
        reaction: {
          type: String,
          enum: ["like", "love", "angry", "sad"],
          default: "like",
        },
        createdAt: {
          type: Date,
          default: new Date(Date.now()),
        },
      },
    ],
    location: {
      type: String,
      default: null,
    },
    tags: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "user",
      },
    ],
    hashtags: [
      {
        type: String,
      },
    ],
    viewCount: {
      type: Number,
      default: 0,
    },
    shareCount: {
      type: Number,
      default: 0,
    },
    repostCount: {
      type: Number,
      default: 0,
    },
    savedCount: {
      type: Number,
      default: 0,
    },
    likeCount: {
      type: Number,
      default: 0,
    },
    savedBy: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "user",
      },
    ],
    edited: {
      type: Boolean,
      default: false,
    },
    editedAt: {
      type: Date,
      default: null,
    },
    repost: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "post",
    },
    likes: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "user",
        required: true,
      },
    ],
    comment: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "comment",
        required: true,
      },
    ],
    images: [
      { public_id: { type: String }, url: String, order: { type: Number } },
    ],
    isDeleted: {
      type: Boolean,
      default: false,
    },
    deletedAt: { type: Date },
    deletedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user",
    },
    postType: {
      type: String,
      // check post is group post, comapny post or user post
      enum: ["group", "company", "user"],
      default: "user",
    },
    origin: {
      type: mongoose.Schema.Types.ObjectId,
      refPath: "postType",
    },
    createdAt: { type: Date, default: new Date(Date.now()) },
    updatedAt: [{ type: Date, default: new Date(Date.now()) }],
  },
  { timestamps: true }
);

const Post = mongoose.model("post", postSchema);

export default Post;
