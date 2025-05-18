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
}

const initialState: IAllSearch = {
  peoples: [],
  companies: [],
  posts: [],
  projects: [],
  groups: [],
  connections: [],
  jobs: [],
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
      });
  },
});

const { clearAllSearch, clearError } = getAllSearchSlice.actions;

export { clearAllSearch, clearError, getAllSearch, searchInConnections };

export default getAllSearchSlice.reducer;
