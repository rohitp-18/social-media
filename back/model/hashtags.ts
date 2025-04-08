import mongoose from "mongoose";

const hashtagSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    createdAt: { type: Date, default: new Date(Date.now()) },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user",
      required: true,
    },
  },
  { timestamps: true }
);

const Hashtag = mongoose.model("hashtag", hashtagSchema);
export default Hashtag;
