import mongoose from "mongoose";

const educationModel = new mongoose.Schema(
  {
    school: {
      type: String,
      required: true,
    },
    degree: {
      type: String,
      required: true,
    },
    fieldOfStudy: {
      type: String,
      required: true,
    },
    startDate: {
      type: Date,
      required: true,
    },
    currentlyStudying: {
      type: Boolean,
      default: false,
    },
    endDate: {
      type: Date,
    },
    grade: {
      type: String,
    },
    description: {
      type: String,
    },
    skills: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "skill",
      },
    ],
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user",
      required: true,
    },
    createdAt: {
      type: Date,
      default: new Date(Date.now()),
    },
    updatedAt: {
      type: Date,
      default: new Date(Date.now()),
    },
    isDeleted: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

const Education = mongoose.model("education", educationModel);
export default Education;
