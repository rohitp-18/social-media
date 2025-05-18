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
    totalFollowers: { type: Number, default: 0 },
    posts: [
      {
        post: {
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
    postsCount: { type: Number, default: 0 },
    membersCount: { type: Number, default: 0 },
    followers: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "user",
        unique: true,
      },
    ],
    address: [
      {
        city: { type: String, required: true },
        state: { type: String, required: true },
        country: { type: String, required: true },
        pincode: { type: Number, required: true },
        address: { type: String, required: true },
      },
    ],
    admin: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "user",
        unique: true,
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
        _id: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "user",
          unique: true,
          required: true,
        },
      },
    ],
    jobs: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "job",
        unique: true,
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
