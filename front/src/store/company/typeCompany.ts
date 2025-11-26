import { sUser } from "../user/typeUser";

interface company {
  _id: string;
  name: string;
  email: string;
  headline: string;
  about: string;
  totalFollowers: number;
  totalMembers: number;
  posts: {
    post: string;
    user: sUser;
  }[];
  postsCount: number;
  followers: string[];
  address: {
    city: string;
    state: string;
    country: string;
    address: string;
  }[];
  admin: sUser[];
  phone: string;
  website: string;
  description: string;
  members: (sUser & { position?: string })[] | string[];
  jobs: string[];
  avatar: { public_id: string; url: string } | null;
  isDeleted: boolean;
  isVerified: boolean;
  bannerImage: { public_id: string; url: string } | null;
  createdAt: Date;
  updatedAt: Date;
}

interface sCompany {
  _id: string;
  name: string;
  headline: string;
  address: string;
  avatar: { url: string } | null;
  admin: string[];
  isDeleted: boolean;
  followers: string[];
}

export type { sCompany, company };
