import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "../axios";
import { isAxiosError } from "axios";

const getProfileExperiences = createAsyncThunk(
  "experience/getProfileExperiences",
  async (userId: string, thunkAPI) => {
    try {
      const { data } = await axios.get(`/experiences/user/${userId}`);
      return data;
    } catch (error: any) {
      if (isAxiosError(error) && error.response) {
        throw new Error(error.response.data.message);
      }
      throw new Error(error.message);
    }
  }
);

const getExperienceById = createAsyncThunk(
  "experience/getExperienceById",
  async (experienceId: string, thunkAPI) => {
    try {
      const { data } = await axios.get(`/experiences/exp/${experienceId}`);
      return data;
    } catch (error: any) {
      if (isAxiosError(error) && error.response) {
        throw new Error(error.response.data.message);
      }
      throw new Error(error.message);
    }
  }
);

const updateExperience = createAsyncThunk(
  "experience/updateExperience",
  async (
    {
      experienceId,
      experienceData,
    }: {
      experienceId: string;
      experienceData: any;
    },
    thunkAPI
  ) => {
    try {
      const { data } = await axios.put(
        `/experiences/exp/${experienceId}`,
        experienceData
      );
      return data;
    } catch (error: any) {
      if (isAxiosError(error) && error.response) {
        throw new Error(error.response.data.message);
      }
      throw new Error(error.message);
    }
  }
);

const deleteExperience = createAsyncThunk(
  "experience/deleteExperience",
  async (experienceId: string, thunkAPI) => {
    try {
      await axios.delete(`/experiences/exp/${experienceId}`);
      return experienceId;
    } catch (error: any) {
      if (isAxiosError(error) && error.response) {
        throw new Error(error.response.data.message);
      }
      throw new Error(error.message);
    }
  }
);

const createExperience = createAsyncThunk(
  "experience/createExperience",
  async (experienceData: any, thunkAPI) => {
    try {
      const { data } = await axios.post(`/experiences/create`, experienceData);
      return data;
    } catch (error: any) {
      if (isAxiosError(error) && error.response) {
        throw new Error(error.response.data.message);
      }
      throw new Error(error.message);
    }
  }
);

interface InitialState {
  experiences: any[];
  loading: boolean;
  error: string | null;
  created: boolean;
  updated: boolean;
  deleted: boolean;
  message: string | null;
}

const initialState: InitialState = {
  experiences: [],
  loading: false,
  error: null,
  created: false,
  updated: false,
  deleted: false,
  message: null,
};

const experienceSlice = createSlice({
  name: "experience",
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    resetExperience: (state) => {
      state.created = false;
      state.updated = false;
      state.deleted = false;
      state.message = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getProfileExperiences.pending, (state) => {
        state.loading = true;
      })
      .addCase(getProfileExperiences.fulfilled, (state, action) => {
        state.loading = false;
        state.experiences = action.payload.experiences;
        state.message = action.payload.message;
      })
      .addCase(getProfileExperiences.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Failed to fetch experiences";
      })

      .addCase(getExperienceById.pending, (state) => {
        state.loading = true;
      })
      .addCase(getExperienceById.fulfilled, (state, action) => {
        state.loading = false;
        state.experiences = state.experiences.map((experience) =>
          experience._id === action.payload.experience._id
            ? action.payload.experience
            : experience
        );
        state.message = action.payload.message;
      })
      .addCase(getExperienceById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Failed to fetch experience";
      })

      .addCase(updateExperience.pending, (state) => {
        state.loading = true;
      })
      .addCase(updateExperience.fulfilled, (state, action) => {
        state.loading = false;
        state.experiences = state.experiences.map((experience) =>
          experience._id === action.payload.experience._id
            ? action.payload.experience
            : experience
        );
        state.updated = true;
        state.message = action.payload.message;
      })
      .addCase(updateExperience.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Failed to update experience";
      })

      .addCase(deleteExperience.pending, (state) => {
        state.loading = true;
      })
      .addCase(deleteExperience.fulfilled, (state, action) => {
        state.loading = false;
        state.experiences = state.experiences.filter(
          (experience) => experience._id !== action.payload
        );
        state.deleted = true;
        state.message = "Experience deleted successfully";
      })
      .addCase(deleteExperience.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Failed to delete experience";
      })

      .addCase(createExperience.pending, (state) => {
        state.loading = true;
      })
      .addCase(createExperience.fulfilled, (state, action) => {
        state.loading = false;
        state.experiences.push(action.payload.experience);
        state.created = true;
        state.message = action.payload.message;
      })
      .addCase(createExperience.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Failed to create experience";
      });
  },
});

const { clearError, resetExperience } = experienceSlice.actions;
export {
  clearError,
  resetExperience,
  getProfileExperiences,
  createExperience,
  getExperienceById,
  updateExperience,
  deleteExperience,
};
export default experienceSlice.reducer;
