import mongoose from "mongoose";

const groupSchema = new mongoose.Schema(
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
    memberCount: {
      type: Number,
      default: 0,
    },
    adminCount: {
      type: Number,
      default: 0,
    },
    postCount: {
      type: Number,
      default: 0,
    },
    requestsCount: {
      type: Number,
      default: 0,
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

groupSchema.pre("save", function (next) {
  this.memberCount = this.members.length;
  this.adminCount = this.admin.length;
  this.postCount = this.posts.length;
  this.requestsCount = this.requests.length;
  next();
});

groupSchema.pre(/^find/, function (next) {
  (this as mongoose.Query<any, any>).where({ isDeleted: false });
  next();
});

const Group = mongoose.model("group", groupSchema);

export default Group;
