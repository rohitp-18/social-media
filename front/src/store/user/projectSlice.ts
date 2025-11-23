import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "../axios";
import { AxiosError, isAxiosError } from "axios";
import { project } from "./typeUser";

const getProfileProjects = createAsyncThunk(
  "project/getProfileProjects",
  async (username: string, thunkAPI) => {
    try {
      if (username.length < 4) return;
      const { data } = await axios.get(`/projects/profile/${username}`);
      return data;
    } catch (error: unknown | AxiosError) {
      if (isAxiosError(error) && error.response) {
        return thunkAPI.rejectWithValue(error.response.data.message);
      }
      throw (error as Error).message;
    }
  }
);

const deleteProject = createAsyncThunk(
  "project/deleteProject",
  async (projectId: string, thunkAPI) => {
    try {
      const { data } = await axios.delete(`/projects/user/${projectId}`);
      return data;
    } catch (error: unknown | AxiosError) {
      if (isAxiosError(error) && error.response) {
        return thunkAPI.rejectWithValue(error.response.data.message);
      }
      throw (error as Error).message;
    }
  }
);

const updateProject = createAsyncThunk(
  "project/updateProject",
  async (project: { projectId: string; data: any }, thunkAPI) => {
    try {
      const { data } = await axios.put(
        `/projects/user/${project.projectId}`,
        project.data,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      return data;
    } catch (error: unknown | AxiosError) {
      if (isAxiosError(error) && error.response) {
        return thunkAPI.rejectWithValue(error.response.data.message);
      }
      throw (error as Error).message;
    }
  }
);

const createProject = createAsyncThunk(
  "project/createProject",
  async (project: any, thunkAPI) => {
    try {
      const { data } = await axios.post(`/projects/create`, project, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      return data;
    } catch (error: unknown | AxiosError) {
      if (isAxiosError(error) && error.response) {
        return thunkAPI.rejectWithValue(error.response.data.message);
      }
      throw (error as Error).message;
    }
  }
);

interface ProjectState {
  projects: project[];
  loading: boolean;
  error: string | null;
  message: string | null;
  updated: boolean;
  deleted: boolean;
  created: boolean;
}

const initialState: ProjectState = {
  projects: [],
  loading: false,
  error: null,
  message: null,
  updated: false,
  deleted: false,
  created: false,
};

const projectSlice = createSlice({
  name: "project",
  initialState,
  reducers: {
    resetProject: (state) => {
      state.loading = false;
      state.error = null;
      state.message = null;
      state.updated = false;
      state.deleted = false;
      state.created = false;
    },
    clearError: (state) => {
      state.error = null;
      state.loading = false;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getProfileProjects.pending, (state) => {
        state.loading = true;
      })
      .addCase(getProfileProjects.fulfilled, (state, action) => {
        state.loading = false;
        state.projects = action.payload.projects;
      })
      .addCase(getProfileProjects.rejected, (state, action) => {
        state.loading = false;
        if (action.payload) {
          state.error = action.payload as string;
        }
      })

      // delete project
      .addCase(deleteProject.pending, (state) => {
        state.loading = true;
      })
      .addCase(deleteProject.fulfilled, (state, action) => {
        state.loading = false;
        state.deleted = true;
        state.message = action.payload.message;
        state.projects = state.projects.filter(
          (project) => project._id !== action.payload._id
        );
      })
      .addCase(deleteProject.rejected, (state, action) => {
        state.loading = false;
        if (action.payload) {
          state.error = action.payload as string;
        }
      })

      // update project
      .addCase(updateProject.pending, (state) => {
        state.loading = true;
      })
      .addCase(updateProject.fulfilled, (state, action) => {
        state.loading = false;
        state.updated = true;
        state.message = action.payload.message;
        state.projects = state.projects.map((project) =>
          project._id === action.payload._id ? action.payload : project
        );
      })
      .addCase(updateProject.rejected, (state, action) => {
        state.loading = false;
        if (action.payload) {
          state.error = action.payload as string;
        }
      })

      // create project
      .addCase(createProject.pending, (state) => {
        state.loading = true;
      })
      .addCase(createProject.fulfilled, (state, action) => {
        state.loading = false;
        state.created = true;
        state.message = action.payload.message;
        state.projects = [...state.projects, action.payload.project];
      })
      .addCase(createProject.rejected, (state, action) => {
        state.loading = false;
        if (action.payload) {
          state.error = action.payload as string;
        }
      });
  },
});

const { resetProject, clearError } = projectSlice.actions;
export {
  getProfileProjects,
  deleteProject,
  updateProject,
  createProject,
  resetProject,
  clearError,
};
export default projectSlice.reducer;
