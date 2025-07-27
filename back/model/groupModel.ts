import mongoose from "mongoose";

const comapnySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      require: true,
    },
    headline: {
      type: String,
    },
    about: {
      type: String,
    },
    email: {
      type: String,
      require: true,
    },
    posts: [
      {
        post: {
          type: mongoose.Schema.Types.ObjectId,
          required: true,
          ref: "post",
        },
        user: {
          type: mongoose.Schema.Types.ObjectId,
          required: true,
          ref: "user",
        },
      },
    ],
    chat: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "chat",
    },
    deletedInfo: {
      deletedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "user",
      },
      deletedAt: {
        type: Date,
        default: new Date(Date.now()),
      },
      reason: {
        type: String,
      },
    },
    location: [
      {
        type: String,
      },
    ],
    admin: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "user",
        required: true,
      },
    ],
    members: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "user",
        required: true,
      },
    ],
    requests: [
      {
        user: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "user",
          required: true,
        },
        message: {
          type: String,
          default: "",
        },
      },
    ],
    website: {
      type: String,
    },
    avatar: { public_id: { type: String }, url: { type: String } },
    bannerImage: { public_id: { type: String }, url: { type: String } },
    isDeleted: {
      type: Boolean,
      default: false,
    },
    createdAt: { type: Date, default: new Date(Date.now()) },
    updatedAt: [{ type: Date, default: new Date(Date.now()) }],
  },
  { timestamps: true }
);

const Group = mongoose.model("group", comapnySchema);

export default Group;
