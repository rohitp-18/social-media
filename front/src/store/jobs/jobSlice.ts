import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { isAxiosError } from "axios";
import axios from "../axios";
import { stat } from "fs";
import { Job } from "./typeJob";

const recommendedJobsAction = createAsyncThunk(
  "job/recommendedJobs",
  async (company: string | undefined, thunkAPI) => {
    try {
      const response = await axios.get(
        `/jobs/recommended${company ? `?company=${company}` : ""}`
      );
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        isAxiosError(error)
          ? error.response?.data.message
          : "Something went wrong"
      );
    }
  }
);

const getJobAction = createAsyncThunk(
  "job/getJob",
  async (jobId: string, thunkAPI) => {
    try {
      const response = await axios.get(`/jobs/job/${jobId}`);
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        isAxiosError(error)
          ? error.response?.data.message
          : "Something went wrong"
      );
    }
  }
);

const createJobAction = createAsyncThunk(
  "job/createJob",
  async (jobData: any, thunkAPI) => {
    try {
      const response = await axios.post("/jobs/create", jobData);
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        isAxiosError(error)
          ? error.response?.data.message
          : "Something went wrong"
      );
    }
  }
);

const updateJobAction = createAsyncThunk(
  "job/updateJob",
  async ({ jobId, jobData }: { jobId: string; jobData: any }, thunkAPI) => {
    try {
      const response = await axios.put(`/jobs/job/${jobId}`, jobData);
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        isAxiosError(error)
          ? error.response?.data.message
          : "Something went wrong"
      );
    }
  }
);

const deleteJobAction = createAsyncThunk(
  "job/deleteJob",
  async (jobId: string, thunkAPI) => {
    try {
      const response = await axios.delete(`/jobs/job/${jobId}`);
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        isAxiosError(error)
          ? error.response?.data.message
          : "Something went wrong"
      );
    }
  }
);

const toggleSaveJobAction = createAsyncThunk(
  "job/saveJob",
  async ({ save, jobId }: { save: boolean; jobId: string }, thunkAPI) => {
    try {
      const response = await axios.put(`/jobs/save/${jobId}`, { save });
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        isAxiosError(error)
          ? error.response?.data.message
          : "Something went wrong"
      );
    }
  }
);

interface jobInterface {
  jobs: Job[];
  loading: boolean;
  error: string | null;
  created: boolean;
  saved: string | null;
  updated: boolean;
  deleted: boolean;
  job: Job | null;
  message: string | null;
  recommendedJobs: Job[];
}

const initialState: jobInterface = {
  jobs: [],
  loading: false,
  error: null,
  created: false,
  updated: false,
  message: null,
  saved: null,
  deleted: false,
  job: null,
  recommendedJobs: [],
};

const jobSlice = createSlice({
  name: "job",
  initialState,
  reducers: {
    resetJob: (state) => {
      state.created = false;
      state.updated = false;
      state.saved = null;
      state.deleted = false;
      state.message = null;
      state.error = null;
      state.loading = false;
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(recommendedJobsAction.pending, (state) => {
        state.loading = true;
      })
      .addCase(recommendedJobsAction.fulfilled, (state, action) => {
        state.loading = false;
        state.recommendedJobs = action.payload.jobs;
      })
      .addCase(recommendedJobsAction.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Something went wrong";
      })

      .addCase(getJobAction.pending, (state) => {
        state.loading = true;
      })
      .addCase(getJobAction.fulfilled, (state, action) => {
        state.loading = false;
        state.job = action.payload.job;
      })
      .addCase(getJobAction.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Something went wrong";
      })

      .addCase(createJobAction.pending, (state) => {
        state.loading = true;
      })
      .addCase(createJobAction.fulfilled, (state, action) => {
        state.loading = false;
        state.created = true;
        state.job = action.payload;
      })
      .addCase(createJobAction.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Something went wrong";
      })

      .addCase(updateJobAction.pending, (state) => {
        state.loading = true;
      })
      .addCase(updateJobAction.fulfilled, (state, action) => {
        state.loading = false;
        state.updated = true;
        state.job = action.payload.job;
      })
      .addCase(updateJobAction.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Something went wrong";
      })

      .addCase(deleteJobAction.pending, (state) => {
        state.loading = true;
      })
      .addCase(deleteJobAction.fulfilled, (state, action) => {
        state.loading = false;
        state.deleted = true;
        state.jobs = state.jobs.filter((job) => job._id !== action.payload._id);
      })
      .addCase(deleteJobAction.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Something went wrong";
      })

      .addCase(toggleSaveJobAction.pending, (state) => {
        state.loading = true;
      })
      .addCase(toggleSaveJobAction.fulfilled, (state, action) => {
        state.loading = false;
        state.saved = action.payload.jobId;
        state.message =
          action.payload.message ||
          (action.payload.save
            ? "Job saved successfully"
            : "Job unsaved successfully") ||
          "";
      })
      .addCase(toggleSaveJobAction.rejected, (state, action) => {
        state.loading = false;
        console.log("Error in toggleSaveJobAction:", action.error);
        state.error = action.error.message || "Something went wrong";
      });
  },
});

const { resetJob, clearError } = jobSlice.actions;
export {
  resetJob,
  clearError,
  recommendedJobsAction,
  getJobAction,
  createJobAction,
  updateJobAction,
  deleteJobAction,
  toggleSaveJobAction,
};
export default jobSlice.reducer;
