import mongoose, { Document, Mongoose, Schema } from "mongoose";
import bcrypt from "bcrypt";
import crypto from "crypto";

interface IUser extends Document {
  _id: string;
  name: string;
  username: string;
  deactivated: boolean;
  deleted: boolean;
  pronouns: string;
  language: string;
  headline: string;
  about: string;
  images: { public_id: string; url: string }[];
  followers: mongoose.Schema.Types.ObjectId[];
  following: mongoose.Schema.Types.ObjectId[];
  connections: mongoose.Schema.Types.ObjectId[];
  skills: {
    skill: mongoose.Schema.Types.ObjectId;
    proficiency: string;
    description: string;
  }[];
  email: string;
  password: string;
  location: {
    country: string;
    state: string;
    city: string;
  };
  experience: mongoose.Schema.Types.ObjectId[];
  projects: mongoose.Schema.Types.ObjectId[];
  topVoice: mongoose.Schema.Types.ObjectId[];
  companies: mongoose.Schema.Types.ObjectId[];
  groups: mongoose.Schema.Types.ObjectId[];
  education: mongoose.Schema.Types.ObjectId[];
  website: {
    link: string;
    text: string;
  };
  pushSubscription: Object[];
  totalFollowers: number;
  totalFollowing: number;
  totalConnections: number;
  avatar: { public_id: string; url: string };
  bannerImage: { public_id: string; url: string };
  createdAt: Date;
  updatedAt: Date;
  comparePassword: (password: string) => Promise<boolean>;
  getResetPasswordToken: () => Promise<string>;
  resetPasswordToken?: string;
  resetPasswordExpire?: Date;
}

const UserSchema: Schema = new Schema(
  {
    name: { type: String, required: true },
    username: { type: String, required: true, unique: true },
    deactivated: { type: Boolean, default: false },
    deleted: { type: Boolean, default: false },
    pronouns: { type: String },
    language: { type: String, default: "english" },
    headline: {
      type: String,
    },
    about: {
      type: String,
    },
    gender: {
      type: String,
    },
    followers: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "user",
      },
    ],
    following: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "user",
      },
    ],
    connections: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "user",
      },
    ],
    skills: [
      {
        skill: {
          type: mongoose.Schema.Types.ObjectId,
          require: true,
          ref: "skill",
        },
        proficiency: {
          type: String,
          enum: ["beginner", "intermediate", "advanced", "expert"],
          default: "beginner",
        },
        description: {
          type: String,
        },
      },
    ],
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    location: {
      country: {
        type: String,
      },
      state: {
        type: String,
      },
      city: {
        type: String,
      },
    },
    experience: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "experience",
      },
    ],
    projects: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "project",
      },
    ],
    topVoice: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "user",
      },
    ],
    companies: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "company",
      },
    ],
    groups: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "group",
      },
    ],
    education: [{ type: mongoose.Schema.Types.ObjectId, ref: "education" }],
    website: {
      link: {
        type: String,
      },
      text: {
        type: String,
      },
    },
    pushSubscription: [{ type: Object }],
    images: [{ public_id: { type: String }, url: { type: String } }],
    totalFollowers: { type: Number, default: 0 },
    totalFollowing: { type: Number, default: 0 },
    totalConnections: { type: Number, default: 0 },
    avatar: { public_id: { type: String }, url: { type: String } },
    bannerImage: { public_id: { type: String }, url: { type: String } },
    createdAt: { type: Date, default: new Date(Date.now()) },
    updatedAt: [{ type: Date, default: new Date(Date.now()) }],
    resetPasswordToken: { type: String },
    resetPasswordExpire: { type: Date },
  },
  {
    timestamps: true,
  }
);

// Keep totalFollowers, totalFollowing, totalConnections in sync on save/update

UserSchema.set("toJSON", { virtuals: true });
UserSchema.set("toObject", { virtuals: true });

UserSchema.pre("save", async function (this: IUser) {
  if (this.isModified("password")) {
    this.password = await bcrypt.hash(this.password, 10);
  }
  this.totalFollowers = this.followers ? this.followers.length : 0;
  this.totalFollowing = this.following ? this.following.length : 0;
  this.totalConnections = this.connections ? this.connections.length : 0;
});

UserSchema.methods.comparePassword = async function (password: any) {
  return await bcrypt.compare(password, this.password);
};

UserSchema.methods.getResetPasswordToken = async function () {
  const resetToken = crypto.randomBytes(20).toString("hex");

  this.resetPasswordToken = resetToken;
  this.resetPasswordExpire = Date.now() + 25 * 60 * 1000; // 25 minutes

  await this.save();
  return resetToken;
};

const User = mongoose.model<IUser>("user", UserSchema);

export type { IUser };
export default User;
