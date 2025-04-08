import mongoose from "mongoose";

const jobSchema = new mongoose.Schema(
  {
    name: { type: String, require: true },
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
    createdAt: { type: Date, default: new Date(Date.now()) },
    updatedAt: [{ type: Date, default: new Date(Date.now()) }],
  },
  { timestamps: true }
);

const Job = mongoose.model("job", jobSchema);

export default Job;
