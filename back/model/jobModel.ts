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
      required: true,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user",
      required: true,
    },
    location: [
      {
        type: String,
        require: true,
      },
    ],
    workType: {
      type: String,
      enum: ["onsite", "remote", "hybrid"],
      default: "onsite",
    },
    type: {
      type: String,
      enum: ["full-time", "part-time", "internship"],
      default: "full-time",
    },
    salary: {
      type: String,
      require: true,
    },
    experience: {
      type: String,
      require: true,
    },
    category: {
      type: String,
      enum: [
        "software",
        "marketing",
        "design",
        "finance",
        "human-resources",
        "sales",
        "operations",
        "customer-service",
        "legal",
        "healthcare",
        "education",
        "engineering",
        "it",
        "other",
      ],
      require: true,
    },
    preferredSkills: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "skill",
      },
    ],
    essentialSkills: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "skill",
      },
    ],
    noOfOpening: {
      type: Number,
      require: true,
    },
    applications: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "applyJob",
      },
    ],
    questions: [
      {
        ques: { type: String, require: true },
        type: { type: String },
        options: [{ type: String }],
      },
    ],
    savedBy: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "user",
      },
    ],
    applyBy: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "user",
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
