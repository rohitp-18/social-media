import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "../axios";
import { isAxiosError } from "axios";
import { application, Job } from "./typeJob";
import { handleError } from "../handleError";

const createJobApplicationAction = createAsyncThunk(
  "applyJob/createJobApplication",
  async (applicationData: any, thunkAPI) => {
    try {
      const response = await axios.post("/applyjobs/create", applicationData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      return response.data;
    } catch (error) {
      handleError(error);
    }
  }
);

const getUserJobApplicationsAction = createAsyncThunk(
  "applyJob/getUserJobApplications",
  async (_, thunkAPI) => {
    try {
      const response = await axios.get("/applyjobs/user");
      return response.data;
    } catch (error) {
      handleError(error);
    }
  }
);

const deleteJobApplicationAction = createAsyncThunk(
  "applyJob/deleteJobApplication",
  async (jobId: string, thunkAPI) => {
    try {
      const response = await axios.delete(`/applyjobs/${jobId}`);
      return response.data;
    } catch (error) {
      handleError(error);
    }
  }
);

const getJobApplicationAction = createAsyncThunk(
  "applyJob/getJobApplication",
  async (jobId: string, thunkAPI) => {
    try {
      const response = await axios.get(`/applyjobs/job/${jobId}`);
      return response.data;
    } catch (error) {
      handleError(error);
    }
  }
);

const updateJobApplicationAction = createAsyncThunk(
  "applyJob/updateJobApplication",
  async (
    { applicationId, updateData }: { applicationId: string; updateData: any },
    thunkAPI
  ) => {
    try {
      const response = await axios.put(
        `/applyjobs/${applicationId}`,
        updateData
      );
      return response.data;
    } catch (error) {
      handleError(error);
    }
  }
);

const getApplication = createAsyncThunk(
  "applyJob/getApplication",
  async (jobId: string, thunkAPI) => {
    try {
      const response = await axios.get(`/applyjobs/${jobId}`);
      return response.data;
    } catch (error) {
      handleError(error);
    }
  }
);

interface applyJobInterface {
  created: boolean;
  loading: boolean;
  error: string | null;
  applications: application[];
  application: application | null;
  deleted: boolean;
  appliedJobs: application[] | null;
  job: Job | null;
  updated: boolean;
}

const initialState: applyJobInterface = {
  created: false,
  loading: false,
  error: null,
  applications: [],
  application: null,
  appliedJobs: null,
  deleted: false,
  job: null,
  updated: false,
};

const applyJobsSlice = createSlice({
  name: "applyJobs",
  initialState,
  reducers: {
    resetApplyJobState: (state) => {
      state.created = false;
      state.loading = false;
      state.error = null;
      state.deleted = false;
      state.updated = false;
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder

      .addCase(createJobApplicationAction.pending, (state) => {
        state.loading = true;
        state.created = false;
        state.error = null;
      })
      .addCase(createJobApplicationAction.fulfilled, (state, action) => {
        state.loading = false;
        state.created = true;
        state.application = action.payload.application;
        state.error = null;
      })
      .addCase(createJobApplicationAction.rejected, (state, action) => {
        state.loading = false;
        state.created = false;
        state.error = action.error as string;
      })
      .addCase(getUserJobApplicationsAction.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getUserJobApplicationsAction.fulfilled, (state, action) => {
        state.loading = false;
        state.appliedJobs = action.payload.applications;
        state.error = null;
      })
      .addCase(getUserJobApplicationsAction.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error as string;
      })
      .addCase(deleteJobApplicationAction.pending, (state) => {
        state.loading = true;
        state.deleted = false;
        state.error = null;
      })
      .addCase(deleteJobApplicationAction.fulfilled, (state) => {
        state.loading = false;
        state.deleted = true;
        state.error = null;
      })
      .addCase(deleteJobApplicationAction.rejected, (state, action) => {
        state.loading = false;
        state.deleted = false;
        state.error = action.error as string;
      })
      .addCase(getJobApplicationAction.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getJobApplicationAction.fulfilled, (state, action) => {
        state.loading = false;
        state.applications = action.payload.applications;
        state.job = action.payload.job;
      })
      .addCase(getJobApplicationAction.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error as string;
      })

      .addCase(updateJobApplicationAction.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateJobApplicationAction.fulfilled, (state, action) => {
        state.loading = false;
        state.updated = true;
        state.error = null;
      })
      .addCase(updateJobApplicationAction.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error as string;
      })

      .addCase(getApplication.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getApplication.fulfilled, (state, action) => {
        state.loading = false;
        state.application = action.payload.application;
        state.error = null;
      })
      .addCase(getApplication.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error as string;
      });
  },
});

const { resetApplyJobState, clearError } = applyJobsSlice.actions;
export {
  createJobApplicationAction,
  getUserJobApplicationsAction,
  deleteJobApplicationAction,
  getJobApplicationAction,
  updateJobApplicationAction,
  getApplication,
  resetApplyJobState,
  clearError,
};
export default applyJobsSlice.reducer;
