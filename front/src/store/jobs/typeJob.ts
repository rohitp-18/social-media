import { sCompany } from "../company/typeCompany";
import { sUser } from "../user/typeUser";

interface Job {
  _id: string;
  title: string;
  description: string;
  company: sCompany;
  location: string;
  salary: number;
  createdAt: Date;
  user: sUser;
  updatedAt: Date;
}

export type { Job };
