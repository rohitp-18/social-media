import mongoose from "mongoose";

const experienceSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user",
      required: true,
    },
    companyName: {
      type: String,
      required: true,
    },
    company: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "company",
    },
    title: {
      type: String,
      required: true,
    },
    working: {
      type: Boolean,
      default: true,
    },
    startDate: {
      type: Date,
      required: true,
    },
    jobType: {
      type: String,
      enum: ["full-time", "part-time", "internship"],
      default: "full-time",
    },
    skills: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "skill",
      },
    ],
    workType: {
      type: String,
      enum: ["remote", "onsite", "hybrid"],
      default: "onsite",
    },
    endDate: {
      type: Date,
    },
    location: {
      type: String,
    },
    description: {
      type: String,
    },
    isDeleted: {
      type: Boolean,
      default: false,
    },
    deletedAt: {
      type: Date,
    },
    deletedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user",
    },
  },
  { timestamps: true }
);

const Experience = mongoose.model("experience", experienceSchema);

export default Experience;
