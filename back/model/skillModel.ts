import { model, Schema } from "mongoose";

const skillSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true,
    },
    user: {
      type: Schema.Types.ObjectId,
      ref: "user",
      required: true,
    },
    description: {
      type: String,
    },
    icon: {
      public_id: { type: String },
      url: { type: String },
    },
    createdAt: { type: Date, default: new Date(Date.now()) },
    updatedAt: { type: Date, default: new Date(Date.now()) },
  },
  { timestamps: true }
);

const Skill = model("skill", skillSchema);

export default Skill;
