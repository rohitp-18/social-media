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
    interview: {
      type: Date,
      default: null,
    },
    status: {
      type: String,
      enum: ["applied", "interview", "rejected", "hired"],
      default: "applied",
    },
    resume: {
      url: { type: String },
      public_id: { type: String },
      name: { type: String },
    },
    coverLetter: {
      type: String,
    },
    company: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "company",
      required: true,
    },
    reschedule: {
      newInterviewDate: [{ type: Date }],
      explanation: {
        type: String,
        default: "",
      },
    },
    questions: [
      {
        question: {
          type: String,
        },
        answer: {
          type: String,
        },
      },
    ],
    isDeleted: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

const ApplyJob = mongoose.model("applyJob", applyJobModel);

export default ApplyJob;
