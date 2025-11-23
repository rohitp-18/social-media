import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "../axios";
import { isAxiosError } from "axios";
import { IAllSearch } from "./typeSearch";

function handleError(error: unknown) {
  if (isAxiosError(error) && error.response) {
    throw new Error(error.response.data.message);
  }
  throw new Error((error as Error).message);
}

const getAllSearch = createAsyncThunk(
  "allSearch/getAllSearch",
  async (query: string) => {
    try {
      const { data } = await axios.get("/search/all", {
        params: {
          q: query,
        },
      });
      return data;
    } catch (error) {
      handleError(error);
    }
  }
);

const searchInConnections = createAsyncThunk(
  "allSearch/searchInConnections",
  async (query: string) => {
    try {
      const { data } = await axios.get("/search/connections", {
        params: {
          q: query,
        },
      });
      return data;
    } catch (error) {
      handleError(error);
    }
  }
);

const searchProjects = createAsyncThunk(
  "allSearch/searchProjects",
  async (params: any) => {
    try {
      const { data } = await axios.get("/search/projects", {
        params,
      });
      return data;
    } catch (error) {
      handleError(error);
    }
  }
);

const searchPeoples = createAsyncThunk(
  "allSearch/searchPeoples",
  async (query: any, thunkAPI) => {
    try {
      const { data } = await axios.get("/search/people", {
        params: query,
      });
      return data;
    } catch (error) {
      handleError(error);
    }
  }
);

const searchPosts = createAsyncThunk(
  "allSearch/searchPosts",
  async (query: any, thunkAPI) => {
    try {
      const { data } = await axios.get("/search/posts", {
        params: query,
      });
      return data;
    } catch (error) {
      handleError(error);
    }
  }
);

const searchGroups = createAsyncThunk(
  "allSearch/searchGroups",
  async (query: any, thunkAPI) => {
    try {
      const { data } = await axios.get("/search/groups", {
        params: query,
      });
      return data;
    } catch (error) {
      handleError(error);
    }
  }
);

const searchJobs = createAsyncThunk(
  "allSearch/searchJobs",
  async (query: any, thunkAPI) => {
    try {
      const { data } = await axios.get("/search/jobs", {
        params: query,
      });
      return data;
    } catch (error) {
      handleError(error);
    }
  }
);

const searchCompany = createAsyncThunk(
  "allSearch/searchCompany",
  async (query: any, thunkAPI) => {
    try {
      const { data } = await axios.get("/search/companies", {
        params: query,
      });
      return data;
    } catch (error) {
      handleError(error);
    }
  }
);

const initialState: IAllSearch = {
  peoples: [],
  companies: [],
  posts: [],
  projects: [],
  groups: [],
  connections: [],
  jobs: [],
  skills: [],
  total: 0,
  loading: false,
  error: null,
  page: 1,
};

const getAllSearchSlice = createSlice({
  name: "allSearch",
  initialState,
  reducers: {
    clearAllSearch: (state) => {
      state.peoples = [];
      state.companies = [];
      state.posts = [];
      state.projects = [];
      state.groups = [];
      state.jobs = [];
      state.total = 0;
      state.page = 1;
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getAllSearch.pending, (state) => {
        state.peoples = [];
        state.companies = [];
        state.posts = [];
        state.projects = [];
        state.groups = [];
        state.jobs = [];
        state.total = 0;
        state.page = 1;
      })
      .addCase(getAllSearch.fulfilled, (state, action) => {
        const { peoples, companies, posts, projects, groups, jobs } =
          action.payload;
        state.peoples = peoples;
        state.companies = companies;
        state.posts = posts;
        state.projects = projects;
        state.groups = groups;
        state.jobs = jobs;
        state.skills = action.payload.skills;
      })
      .addCase(getAllSearch.rejected, (state) => {
        state.peoples = [];
        state.companies = [];
        state.posts = [];
        state.projects = [];
        state.groups = [];
        state.jobs = [];
      })

      // Connections
      .addCase(searchInConnections.pending, (state) => {
        state.connections = [];
      })
      .addCase(searchInConnections.fulfilled, (state, action) => {
        const { connections } = action.payload;
        state.connections = connections;
      })
      .addCase(searchInConnections.rejected, (state) => {
        state.connections = [];
      })

      // projects
      .addCase(searchProjects.pending, (state) => {
        state.projects = [];
      })
      .addCase(searchProjects.fulfilled, (state, action) => {
        state.projects = action.payload.projects;
      })
      .addCase(searchProjects.rejected, (state, action) => {
        state.error = action.error.message || "";
      })

      // peoples
      .addCase(searchPeoples.pending, (state) => {
        state.peoples = [];
      })
      .addCase(searchPeoples.fulfilled, (state, action) => {
        state.peoples = action.payload.peoples;
      })
      .addCase(searchPeoples.rejected, (state) => {
        state.peoples = [];
      })

      // posts
      .addCase(searchPosts.pending, (state) => {
        state.posts = [];
      })
      .addCase(searchPosts.fulfilled, (state, action) => {
        state.posts = action.payload.posts;
      })
      .addCase(searchPosts.rejected, (state, action) => {
        state.error = action.error.message || "";
        state.posts = [];
      })

      .addCase(searchGroups.pending, (state) => {
        state.groups = [];
      })
      .addCase(searchGroups.fulfilled, (state, action) => {
        state.groups = action.payload.groups;
      })
      .addCase(searchGroups.rejected, (state) => {
        state.groups = [];
      })

      .addCase(searchJobs.pending, (state) => {
        state.jobs = [];
      })
      .addCase(searchJobs.fulfilled, (state, action) => {
        state.jobs = action.payload.jobs;
      })
      .addCase(searchJobs.rejected, (state) => {
        state.jobs = [];
      })

      .addCase(searchCompany.pending, (state) => {
        state.companies = [];
      })
      .addCase(searchCompany.fulfilled, (state, action) => {
        state.companies = action.payload.companies;
      })
      .addCase(searchCompany.rejected, (state) => {
        state.companies = [];
      });
  },
});

const { clearAllSearch, clearError } = getAllSearchSlice.actions;

export {
  clearAllSearch,
  clearError,
  getAllSearch,
  searchInConnections,
  searchProjects,
  searchPeoples,
  searchPosts,
  searchGroups,
  searchJobs,
  searchCompany,
};

export default getAllSearchSlice.reducer;
