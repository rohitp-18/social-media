import mongoose from "mongoose";

const applyJobModel = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user",
      required: true,
    },
    jobCreator: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user",
      required: true,
    },
    job: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "job",
      required: true,
    },
    status: {
      type: String,
      enum: ["applied", "interview", "rejected", "hired"],
      default: "applied",
    },
    resume: {
      type: String,
      required: true,
    },
    coverLetter: {
      type: String,
    },
    company: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "company",
      required: true,
    },
    createdAt: {
      type: Date,
      default: new Date(Date.now()),
    },
    question: [
      {
        question: {
          type: String,
          required: true,
        },
        answer: {
          type: String,
          required: true,
        },
      },
    ],
  },
  { timestamps: true }
);

const ApplyJob = mongoose.model("applyJob", applyJobModel);

export default ApplyJob;
