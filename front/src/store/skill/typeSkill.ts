interface skill {
  _id: string;
  name: string;
  description: string;
  proficiency: "beginner" | "intermediate" | "advanced";
  createdAt: Date;
  updatedAt: Date;
}

interface skillsState {
  skills: skill[];
  searchSkills: skill[];
  searchLoading: boolean;
  searchError: string | null;
  loading: boolean;
  error: string | null;
  message: string | null;
  created: boolean;
  updated: boolean;
  deleted: boolean;
}

export type { skill, skillsState };
