import { Group } from "../group/typeGroup";
import { Job } from "../jobs/typeJob";
import { InheritUser, Post } from "../user/typeUser";

interface IAllSearch {
  peoples: (InheritUser & { isFollowing?: boolean })[];
  companies: any[];
  posts: Post[];
  projects: any[];
  groups: Group[];
  connections: any[];
  jobs: Job[];
  total: number;
  page: number;
  loading: boolean;
  error: string | null;
  skills: any[];
}

export type { IAllSearch };
