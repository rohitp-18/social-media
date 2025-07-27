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
    headline: {
      type: String,
    },
    about: {
      type: String,
    },
    totalFollowers: { type: Number, default: 0 },
    totalEmployees: { type: Number, default: 0 },
    totalMembers: { type: Number, default: 0 },
    posts: [
      {
        post: {
          type: mongoose.Schema.Types.ObjectId,
          required: true,
          ref: "posts",
        },
        user: {
          type: mongoose.Schema.Types.ObjectId,
          required: true,
          ref: "user",
        },
      },
    ],
    postsCount: { type: Number, default: 0 },
    membersCount: { type: Number, default: 0 },
    followers: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "user",
      },
    ],
    address: [
      {
        city: { type: String, required: true },
        state: { type: String, required: true },
        country: { type: String, required: true },
        address: { type: String, required: true },
      },
    ],
    admin: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "user",
      },
    ],
    phone: {
      type: String,
      require: true,
    },
    website: {
      type: String,
    },
    description: {
      type: String,
    },
    members: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "user",
        required: true,
      },
    ],
    jobs: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "job",
        required: true,
      },
    ],
    isDeleted: { type: Boolean, default: false },
    isVerified: { type: Boolean, default: false },
    avatar: { public_id: { type: String }, url: { type: String } },
    bannerImage: { public_id: { type: String }, url: { type: String } },
    createdAt: { type: Date, default: new Date(Date.now()) },
    updatedAt: [{ type: Date, default: new Date(Date.now()) }],
  },
  { timestamps: true }
);

const Company = mongoose.model("company", comapnySchema);

export default Company;
