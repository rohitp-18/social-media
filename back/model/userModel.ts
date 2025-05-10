import mongoose, { Document, Schema } from "mongoose";
import bcrypt from "bcrypt";

interface IUser extends Document {
  _id: mongoose.Types.ObjectId;
  name: string;
  usernmae: string; // Note: This appears to be misspelled in schema
  deactivated: boolean;
  deleted: boolean;
  about: string;
  about2: string;
  gender: string;
  location: {
    country: {
      type: String;
    };
    state: {
      type: String;
    };
    city: {
      type: String;
    };
  };
  followers: Array<{ _id: mongoose.Types.ObjectId }>;
  following: Array<{ _id: mongoose.Types.ObjectId }>;
  skills: Array<{
    _id: mongoose.Types.ObjectId;
    from: "user" | "company" | "school";
    accessedFrom: mongoose.Types.ObjectId;
  }>;
  email: string;
  password: string;
  projects: Array<{ _id: mongoose.Types.ObjectId }>;
  experience: Array<{ _id: mongoose.Types.ObjectId }>;
  topVoice: Array<{ _id: mongoose.Types.ObjectId }>;
  companies: Array<{ _id: mongoose.Types.ObjectId }>;
  groups: Array<{ _id: mongoose.Types.ObjectId }>;
  newsLetter: Array<{ _id: mongoose.Types.ObjectId }>;
  eduction: Array<{ _id: mongoose.Types.ObjectId }>;
  totalFollowers: number;
  totalFollowing: number;
  avatar: { public_id: string; url: string };
  bannerImage: { public_id: string; url: string };
  createdAt: Date;
  updatedAt: Date[];
  website: { link: string; text: string };
  comparePassword(password: string): Promise<boolean>;
}

const UserSchema: Schema = new Schema(
  {
    name: { type: String, required: true },
    username: { type: String, required: true, unique: true },
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
    followers: [
      {
        _id: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "user",
        },
      },
    ],
    following: [
      {
        _id: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "user",
        },
      },
    ],
    skills: [
      {
        _id: {
          type: mongoose.Schema.Types.ObjectId,
          require: true,
          ref: "skill",
        },
        from: {
          type: String,
          enum: ["user", "company", "school"],
          required: true,
        },
        accessedFrom: {
          type: mongoose.Schema.Types.ObjectId,
          required: true,
          refPath: "skills.from",
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
        _id: {
          type: mongoose.Schema.Types.ObjectId,
          required: true,
          ref: "experience",
        },
      },
    ],
    projects: [
      {
        _id: {
          type: mongoose.Schema.Types.ObjectId,
          required: true,
          ref: "project",
        },
      },
    ],
    topVoice: [
      {
        _id: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "user",
        },
      },
    ],
    companies: [
      {
        _id: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "company",
        },
      },
    ],
    groups: [
      {
        _id: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "group",
        },
      },
    ],
    newsLetter: [
      {
        _id: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "newsLetter",
        },
      },
    ],
    eduction: [{ type: String }],
    website: {
      link: {
        type: String,
      },
      text: {
        type: String,
      },
    },
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
