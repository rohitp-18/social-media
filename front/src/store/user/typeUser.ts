interface user {
  _id: string;
  name: string;
  email: string;
  password: string;
  avatar: { url: string; public_id: string } | null;
  skills?: { skill: string; proficiency?: string; description?: string }[];
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
  experience: { jobTitle: string; company: string; years: number }[];
  projects: { title: string; description: string; link: string }[];
  topVoices: { user: user; message: string }[];
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

interface UserState {
  user: user | null;
  loading: boolean;
  error: string | null;
  login: boolean;
  profile?: any;
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
  images: { public_id: string; url: string }[] | null;
  externalLinks: { text: string; url: string }[] | null;
  reactions:
    | {
        user: user;
        type: "like" | "love" | "laugh" | "wow" | "sad" | "angry";
        createdAt: Date;
      }[]
    | null;
  location: string | null;
  tags: string[] | null;
  hashtags: string[] | null;
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

export type { user, UserState, Post, InheritUser, sUser };
