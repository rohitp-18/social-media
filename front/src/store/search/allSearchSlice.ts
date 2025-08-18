import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "../axios";
import { isAxiosError } from "axios";

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
      if (isAxiosError(error)) {
        throw new Error(error.response?.data.message);
      }
      throw new Error("Something went wrong");
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
      if (isAxiosError(error)) {
        throw new Error(error.response?.data.message);
      }
      throw new Error("Something went wrong");
    }
  }
);

const searchProjects = createAsyncThunk(
  "allSearch/searchProjects",
  async (params: any) => {
    try {
      const { data } = await axios.get("/search/project", {
        params,
      });
      return data;
    } catch (error) {
      if (isAxiosError(error)) {
        throw new Error(error.response?.data.message);
      }
      throw new Error("Something went wrong");
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
      if (isAxiosError(error)) {
        throw new Error(error.response?.data.message);
      }
      throw new Error("Something went wrong");
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
      if (isAxiosError(error)) {
        throw new Error(error.response?.data.message);
      }
      throw new Error("Something went wrong");
    }
  }
);

interface IAllSearch {
  peoples: any[];
  companies: any[];
  posts: any[];
  projects: any[];
  groups: any[];
  connections: any[];
  jobs: any[];
  total: number;
  page: number;
  loading: boolean;
  error: string | null;
  skills: any[];
}

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
      .addCase(getAllSearch.fulfilled, (state, action: any) => {
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
      .addCase(searchInConnections.fulfilled, (state, action: any) => {
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
      .addCase(searchProjects.fulfilled, (state, action: any) => {
        state.projects = action.payload.projects;
      })
      .addCase(searchProjects.rejected, (state, action) => {
        state.error = action.error.message || "";
      })

      // peoples
      .addCase(searchPeoples.pending, (state) => {
        state.peoples = [];
      })
      .addCase(searchPeoples.fulfilled, (state, action: any) => {
        state.peoples = action.payload.peoples;
      })
      .addCase(searchPeoples.rejected, (state) => {
        state.peoples = [];
      })

      // posts
      .addCase(searchPosts.pending, (state) => {
        state.posts = [];
      })
      .addCase(searchPosts.fulfilled, (state, action: any) => {
        state.posts = action.payload.posts;
      })
      .addCase(searchPosts.rejected, (state, action) => {
        state.error = action.error.message || "";
        state.posts = [];
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
};

export default getAllSearchSlice.reducer;
