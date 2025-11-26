import { chat } from "../chat/typeChat";
import { Post, user } from "../user/typeUser";

interface Group {
  _id: string;
  name: string;
  headline: string;
  about: string;
  email: string;
  posts: { post: Post; user: user }[];
  chat: chat;
  deletedInfo: {
    deletedAt?: Date;
    deletedBy?: user;
    reason?: string;
  };
  location?: string[];
  admin: user[];
  members: user[];
  requests: { user: user; message: string; _id: string }[];
  website?: string;
  memberCount?: number;
  adminCount?: number;
  postCount?: number;
  requestCount?: number;
  avatar?: { public_id: string; url: string } | null;
  bannerImage?: { public_id: string; url: string } | null;
  isDeleted?: boolean;
  createdAt: Date;
  notification: Notification[];
  updatedAt: Date;
}

interface sGroup {
  _id: string;
  name: string;
  headline: string;
  about: string;
  email: string;
  chat: chat;
  location?: string[];
  members: string[];
  admin: string[];
  website?: string;
  memberCount?: number;
  adminCount?: number;
  postCount?: number;
  requestCount?: number;
  avatar?: { public_id: string; url: string } | null;
  bannerImage?: { public_id: string; url: string } | null;
  isDeleted?: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export type { Group, sGroup };
