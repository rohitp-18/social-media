import mongoose from "mongoose";

const comapnySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      require: true,
    },
    email: {
      type: String,
      require: true,
    },
    posts: [
      {
        _id: {
          type: mongoose.Schema.Types.ObjectId,
          required: true,
          unique: true,
          ref: "post",
        },
        type: {
          type: String,
        },
      },
    ],
    chat: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "chat",
    },
    deleted: {
      type: Boolean,

      default: false,
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
    location: {
      type: String,
    },
    admin: [
      {
        _id: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "user",
          unique: true,
          required: true,
        },
      },
    ],
    members: [
      {
        _id: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "user",
          unique: true,
          required: true,
        },
      },
    ],
    requests: [
      {
        _id: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "user",
          unique: true,
          required: true,
        },
        message: {
          type: String,
        },
      },
    ],
    url: {
      type: String,
    },
    avatar: { public_id: { type: String }, url: { type: String } },
    bannerImage: { public_id: { type: String }, url: { type: String } },
    createdAt: { type: Date, default: new Date(Date.now()) },
    updatedAt: [{ type: Date, default: new Date(Date.now()) }],
  },
  { timestamps: true }
);

const Group = mongoose.model("group", comapnySchema);

export default Group;
