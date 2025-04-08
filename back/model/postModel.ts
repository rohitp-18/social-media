import mongoose from "mongoose";

const postSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user",
      required: true,
    },
    privacyControl: {
      type: String,
      enum: ["public", "friends", "private"],
      default: "public",
    },
    postType: {
      type: String,
      enum: ["regular", "story"],
      default: "regular",
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
        url: { type: String },
        previewData: { type: String },
        about: { type: String },
      },
    ],
    reactions: [
      {
        type: String,
        enum: ["like", "love", "angry", "sad"],
        default: "like",
      },
    ],
    location: {
      type: { type: String, enum: ["Point"] },
      coordinates: { type: [Number], index: "2dsphere" },
    },
    tags: [
      {
        userId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "user",
        },
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
    savedBy: [
      {
        userId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "user",
        },
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
    editedContent: {
      type: String,
    },
    editedImages: [{ public_id: { type: String }, url: String }],
    editedVideo: {
      public_id: { type: String },
      url: String,
    },
    editedExternalLinks: [
      {
        url: { type: String },
        previewData: { type: String },
      },
    ],
    editedTags: [
      {
        userId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "user",
        },
      },
    ],
    editedHashtags: [
      {
        type: String,
      },
    ],
    editedLocation: {
      type: { type: String, enum: ["Point"] },
      coordinates: { type: [Number], index: "2dsphere" },
    },
    editedReactions: [
      {
        type: String,
        enum: ["like", "love", "angry", "sad"],
        default: "like",
      },
    ],
    editedSavedBy: [
      {
        userId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "user",
        },
      },
    ],
    repost: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "post",
    },
    likes: [
      {
        _id: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "user",
          required: true,
        },
      },
    ],
    comment: [
      {
        _id: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "comment",
          required: true,
        },
      },
    ],
    images: [
      { public_id: { type: String }, url: String, order: { type: Number } },
    ],
    createdAt: { type: Date, default: new Date(Date.now()) },
    updatedAt: [{ type: Date, default: new Date(Date.now()) }],
  },
  { timestamps: true }
);

const Post = mongoose.model("post", postSchema);

export default Post;
