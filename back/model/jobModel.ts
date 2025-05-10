import mongoose from "mongoose";

const jobSchema = new mongoose.Schema(
  {
    title: { type: String, require: true },
    description: {
      type: String,
      require: true,
    },
    company: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "company",
      unique: true,
      required: true,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user",
      required: true,
    },
    location: {
      type: String,
      require: true,
    },
    type: {
      type: String,
      enum: ["full-time", "part-time", "internship"],
      default: "full-time",
    },
    salary: {
      type: Number,
      require: true,
    },
    experience: {
      type: String,
      require: true,
    },
    skills: [
      {
        type: String,
      },
    ],
    category: {
      type: String,
      require: true,
    },
    preferredSkills: [
      {
        type: String,
      },
    ],
    essentialSkills: [
      {
        type: String,
      },
    ],
    noOfOpening: {
      type: Number,
      require: true,
    },
    questions: [
      {
        ques: { type: String, require: true },
        type: { type: String },
        options: [{ ans: String }],
      },
    ],
    isDeleted: {
      type: Boolean,
      default: false,
    },
    noOfApplied: {
      type: Number,
      default: 0,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    deletedAt: { type: Date },
    createdAt: { type: Date, default: new Date(Date.now()) },
    updatedAt: [{ type: Date, default: new Date(Date.now()) }],
  },
  { timestamps: true }
);

const Job = mongoose.model("job", jobSchema);

export default Job;
