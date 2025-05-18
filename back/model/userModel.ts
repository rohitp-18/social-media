import mongoose, { Document, Schema } from "mongoose";
import bcrypt from "bcrypt";

interface IUser extends Document {
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
  newsLetter: mongoose.Schema.Types.ObjectId[];
  education: mongoose.Schema.Types.ObjectId[];
  website: {
    link: string;
    text: string;
  };
  totalFollowers: number;
  totalFollowing: number;
  avatar: { public_id: string; url: string };
  bannerImage: { public_id: string; url: string };
  createdAt: Date;
  updatedAt: Date;
  comparePassword: (password: string) => Promise<boolean>;
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
    newsLetter: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "newsLetter",
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
    images: [{ public_id: { type: String }, url: { type: String } }],
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
    this.password = await bcrypt.hash(this.password, 10);
  }
});

UserSchema.methods.comparePassword = async function (password: any) {
  return await bcrypt.compare(password, this.password);
};

const User = mongoose.model<IUser>("user", UserSchema);

export type { IUser };
export default User;
