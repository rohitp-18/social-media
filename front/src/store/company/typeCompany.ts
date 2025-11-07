import { sUser } from "../user/typeUser";

interface sCompany {
  _id: string;
  name: string;
  headline: string;
  address: string;
  avatar: { url: string } | null;
  isDeleted: boolean;
  followers: string[];
}

export type { sCompany };
