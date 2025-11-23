import { sCompany } from "../company/typeCompany";
import { sUser } from "../user/typeUser";

interface Job {
  _id: string;
  title: string;
  description: string;
  company: sCompany;
  location: string[];
  workType: "onsite" | "remote" | "hybrid";
  type: "full-time" | "part-time" | "internship";
  experience: string;
  category: string;
  preferredSkills: { _id: string; name: string }[];
  essentialSkills: { _id: string; name: string }[];
  noOfOpenings: number;
  applications: string[];
  questions: { _id: string; ques: string; type: string; options: string[] }[];
  savedBy: string[];
  applyBy: string[];
  noOfApplied: number;
  isActive: boolean;
  salary: number;
  user: sUser;
  deletedAt: Date | null;
  createdAt: Date;
  updatedAt: Date;
}

interface application {
  _id: string;
  user: sUser;
  jobCreator: sUser;
  job: Job;
  interview: Date | null;
  status: string;
  resume?: { url?: string; public_id?: string; name?: string };
  coverLetter?: string;
  company: sCompany;
  reschedule?: { newInterviewDate: Date[]; explanation: string };
  questions: { _id: string; ques: string; answer: string; type: string }[];
  createdAt: Date;
  updatedAt: Date;
}

export type { Job, application };
