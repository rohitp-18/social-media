import { company } from "../company/typeCompany";
import { skill } from "../skill/typeSkill";
import { education } from "./educationSlice";

interface experience {
  _id: string;
  title: string;
  company: string;
  years: number;
  startDate: Date;
  endDate?: Date;
  description: string;
  skills: skill[];
  working: boolean;
  jobType: string;
  location: string;
  workType: string;
  companyName: string;
}

interface user {
  _id: string;
  name: string;
  email: string;
  password: string;
  avatar: { url: string; public_id: string } | null;
  skills: { skill: string; proficiency?: string; description?: string }[];
  following: string[];
  followers: string[];
  connections: string[];
  about?: string | null;
  username: string;
  language: string;
  deactivated: boolean;
  deleted: boolean;
  pronouns: string;
  headline: string;
  location: { city: string; country: string; state: string } | null;
  experience: experience[];
  projects: project[];
  topVoice: sUser[];
  companies: string[];
  groups: string[];
  education: string[];
  website: { link: string; text: string };
  totalFollowers: number;
  totalFollowing: number;
  totalConnections: number;
  bannerImage: { public_id: string; url: string } | null;
  resume?: { public_id: string; url: string } | null;
  createdAt: Date;
  updatedAt: Date;
}

interface media {
  _id: string;
  user: string;
  thumbnail?: string;
  post?: string;
  project?: string;
  url: string;
  type: string;
  createdAt: Date;
  updatedAt: Date;
  deletedAt?: Date;
  deletedBy?: string;
  isDeleted: boolean;
}

interface UserState {
  user: user | null;
  loading: boolean;
  error: string | null;
  login: boolean;
  profile?: {
    user: user & {
      following: sUser[];
      followers: sUser[];
      connections: sUser[];
      companies: company[];
    };
    posts: Post[];
    media: media[];
    comments: Comment[];
    educations: education[];
    projects: project[];
    experiences: experience[];
  } | null;
  logout?: boolean;
  updated?: boolean;
  message?: string;
  changeFollow: boolean;
}

interface Post {
  _id: string;
  userId: user;
  privacyConfig: "public" | "private" | "restricted";
  content: string;
  video: { public_id: string; url: string } | null;
  images: { public_id: string; url: string; _id: string; order: number }[];
  externalLinks: { _id: string; text: string; url: string }[];
  reactions:
    | {
        user: user;
        type: "like" | "love" | "laugh" | "wow" | "sad" | "angry";
        createdAt: Date;
      }[]
    | null;
  location?: string;
  tags: sUser[] | [];
  hashtags: string[];
  viewCount: number;
  shareCount: number;
  savedCount: number;
  likeCount: number;
  commentCount: number;
  savedBy: string[] | null;
  likes: string[] | null;
  comments: string[] | null;
  postType: "user" | "group" | "company";
  origin: unknown;
  edited: boolean;
  createdAt: Date;
  updatedAt: Date;
  privacyControl: string;
}

interface InheritUser {
  _id: string;
  name: string;
  email: string;
  avatar: { url: string; public_id: string } | null;
  skills?: { skill: string; proficiency?: string; description?: string }[];
  following: string[];
  followers: string[];
  connections: string[];
  about: string | null;
  username: string;
  language: string;
  pronouns: string;
  headline: string;
  location: { city: string; country: string; state: string } | null;
  createdAt: Date;
  updatedAt: Date;
  bannerImage?: { public_id: string; url: string } | null;
  resume?: { public_id: string; url: string } | null;
}

interface sUser {
  _id: string;
  name: string;
  headline: string;
  avatar: { url: string; public_id: string } | null;
  username: string;
  location: { city: string; country: string; state: string } | null;
  isFollowing: boolean;
  followers: string[];
  following: string[];
}

interface project {
  _id: string;
  user: sUser;
  title: string;
  description: string;
  startDate: Date;
  endDate?: Date;
  current: boolean;
  skills: skill[];
  githubLink?: string;
  liveLink?: string;
  likes: { _id: string }[];
  comments: { _id: string }[];
  media: {
    url: string;
    public_id: string;
    type: string;
    order: number;
    _id: string;
  }[];
  likedCount: number;
  commentCount: number;
  shareCount: number;
  repostCount: number;
  repost: string;
  edited: boolean;
  editedAt?: Date;
  isDeleted: boolean;
  deletedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

interface Comment {
  _id: string;
  user: InheritUser;
  content: string;
  post: string;
  type: "comment" | "reply";
  edited: boolean;
  editedAt?: Date;
  parent?: (Comment & { user: string }) | null;
  reply: { _id: string }[];
  likes: string[];
  isDeleted: boolean;
  createdAt: Date;
  updatedAt: Date[];
}

export type {
  experience,
  user,
  UserState,
  Post,
  InheritUser,
  sUser,
  project,
  Comment,
  media,
};
