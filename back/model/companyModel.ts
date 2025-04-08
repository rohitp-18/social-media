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
    followers: [
      {
        _id: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "user",
          unique: true,
          required: true,
        },
      },
    ],
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
    jobs: [
      {
        _id: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "job",
          unique: true,
          required: true,
        },
      },
    ],
    avatar: { public_id: { type: String }, url: { type: String } },
    bannerImage: { public_id: { type: String }, url: { type: String } },
    createdAt: { type: Date, default: new Date(Date.now()) },
    updatedAt: [{ type: Date, default: new Date(Date.now()) }],
  },
  { timestamps: true }
);

const Company = mongoose.model("company", comapnySchema);

export default Company;
