import { company } from "../company/typeCompany";
import { Group } from "../group/typeGroup";
import { Job } from "../jobs/typeJob";
import { skill } from "../skill/typeSkill";
import { InheritUser, Post, project } from "../user/typeUser";

interface IAllSearch {
  peoples: (InheritUser & { isFollowing?: boolean })[];
  companies: company[];
  posts: Post[];
  projects: project[];
  groups: Group[];
  connections: InheritUser[];
  jobs: Job[];
  total: number;
  page: number;
  loading: boolean;
  error: string | null;
  skills: skill[];
}

export type { IAllSearch };
