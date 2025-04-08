import mongoose, { Document, Schema } from "mongoose";
import bcrypt from "bcrypt";

interface IUser extends Document {
  _id: string;
  name: string;
  email: string;
  password: string;
  createdAt: Date;
  updatedAt: Date[];
}

const UserSchema: Schema = new Schema(
  {
    name: { type: String, required: true },
    usernmae: { type: String, required: true },
    deactivated: { type: Boolean, default: false },
    deleted: { type: Boolean, default: false },
    about2: {
      type: String,
    },
    about: {
      type: String,
    },
    gender: {
      type: String,
    },

    location: {
      type: String,
    },
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
    following: [
      {
        _id: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "user",
          unique: true,
          required: true,
        },
      },
    ],
    skills: [
      {
        _id: {
          type: mongoose.Schema.Types.ObjectId,
          require: true,
          unique: true,
          ref: "skill",
        },
      },
    ],
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
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
    comments: [
      {
        _id: {
          type: mongoose.Schema.Types.ObjectId,
          required: true,
          unique: true,
          ref: "post",
        },
        comment: {
          type: mongoose.Schema.Types.ObjectId,
          required: true,
          unique: true,
          ref: "comment",
        },
      },
    ],
    projects: [
      {
        _id: {
          type: mongoose.Schema.Types.ObjectId,
          required: true,
          ref: "project",
          unique: true,
        },
      },
    ],
    experience: [
      {
        _id: {
          type: mongoose.Schema.Types.ObjectId,
          required: true,
          ref: "experiences",
          unique: true,
        },
      },
    ],
    topVoice: [
      {
        _id: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "user",
          unique: true,
          required: true,
        },
      },
    ],
    companies: [
      {
        _id: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "company",
          unique: true,
          required: true,
        },
      },
    ],
    groups: [
      {
        _id: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "group",
          unique: true,
          required: true,
        },
      },
    ],
    newsLetter: [
      {
        _id: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "newsLetter",
          unique: true,
          required: true,
        },
      },
    ],
    schools: [
      {
        _id: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "school",
          unique: true,
          required: true,
        },
      },
    ],
    totalFollowers: { type: Number, default: 0 },
    totalFollowing: { type: Number, default: 0 },
    avatar: { public_id: { type: String }, url: { type: String } },
    bannerImage: { public_id: { type: String }, url: { type: String } },
    createdAt: { type: Date, default: new Date(Date.now()) },
    updatedAt: [{ type: Date, default: new Date(Date.now()) }],
  },
  {
    timestamps: true,
  }
);

UserSchema.pre("save", async function (this: any) {
  if (this.isModified("password")) {
    this.password = bcrypt.hash(this.password, 10);
  }
});

UserSchema.methods.comparePassword = async function (password: any) {
  return await bcrypt.compare(password, this.password);
};

const User = mongoose.model<IUser>("user", UserSchema);

export type { IUser };
export default User;
