import mongoose from "mongoose";

const schoolSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      require: true,
    },
    email: {
      type: String,
      require: true,
    },
    totalAlumnai: { type: Number, default: 0 },
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
    alumnai: [
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

const School = mongoose.model("school", schoolSchema);

export default School;
