import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "../axios";
import { isAxiosError } from "axios";
import { skill } from "../skill/typeSkill";

function handleError(error: unknown) {
  if (isAxiosError(error) && error.response) {
    throw new Error(error.response.data.message);
  }
  throw new Error((error as Error).message);
}

const getProfileEducations = createAsyncThunk(
  "education/getProfileEducations",
  async (userId: string, thunkAPI) => {
    try {
      const { data } = await axios.get(`/educations/profile/${userId}`);
      return data;
    } catch (error) {
      handleError(error);
    }
  }
);

const getEducationById = createAsyncThunk(
  "education/getEducationById",
  async (educationId: string, thunkAPI) => {
    try {
      const { data } = await axios.get(`/educations/user/${educationId}`);
      return data;
    } catch (error) {
      handleError(error);
    }
  }
);

const updateEducation = createAsyncThunk(
  "education/updateEducation",
  async (
    {
      educationId,
      form,
    }: {
      educationId: string;
      form: any;
    },
    thunkAPI
  ) => {
    try {
      const { data } = await axios.put(`/educations/user/${educationId}`, form);
      return data;
    } catch (error) {
      handleError(error);
    }
  }
);

const deleteEducation = createAsyncThunk(
  "education/deleteEducation",
  async (educationId: string, thunkAPI) => {
    try {
      await axios.delete(`/educations/user/${educationId}`);
      return educationId;
    } catch (error) {
      handleError(error);
    }
  }
);

const createEducation = createAsyncThunk(
  "education/createEducation",
  async (form: any, thunkAPI) => {
    try {
      const { data } = await axios.post(`/educations/create`, form);
      return data;
    } catch (error) {
      handleError(error);
    }
  }
);

interface education {
  _id: string;
  school: string;
  degree: string;
  fieldOfStudy: string;
  startDate: Date;
  currentlyStudying: boolean;
  endDate?: Date;
  grade?: string;
  description?: string;
  skills: skill[];
  user: string;
  createdAt: Date;
  updatedAt: Date;
  isDeleted: boolean;
}

interface InitialState {
  educations: education[];
  loading: boolean;
  error: string | null;
  created: boolean;
  updated: boolean;
  deleted: boolean;
  message: string | null;
}

const initialState: InitialState = {
  educations: [],
  loading: false,
  error: null,
  created: false,
  updated: false,
  deleted: false,
  message: null,
};

const educationSlice = createSlice({
  name: "education",
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    resetEducation: (state) => {
      state.created = false;
      state.updated = false;
      state.deleted = false;
      state.message = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getProfileEducations.pending, (state) => {
        state.loading = true;
      })
      .addCase(getProfileEducations.fulfilled, (state, action) => {
        state.loading = false;
        state.educations = action.payload.educations;
        state.message = action.payload.message;
      })
      .addCase(getProfileEducations.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Failed to fetch educations";
      })

      .addCase(getEducationById.pending, (state) => {
        state.loading = true;
      })
      .addCase(getEducationById.fulfilled, (state, action) => {
        state.loading = false;
        state.educations = state.educations.map((education) =>
          education._id === action.payload.education._id
            ? action.payload.education
            : education
        );
        state.message = action.payload.message;
      })
      .addCase(getEducationById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Failed to fetch education";
      })

      .addCase(updateEducation.pending, (state) => {
        state.loading = true;
      })
      .addCase(updateEducation.fulfilled, (state, action) => {
        state.loading = false;
        state.educations = state.educations.map((education) =>
          education._id === action.payload.education._id
            ? action.payload.education
            : education
        );
        state.updated = true;
        state.message = action.payload.message;
      })
      .addCase(updateEducation.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Failed to update education";
      })

      .addCase(deleteEducation.pending, (state) => {
        state.loading = true;
      })
      .addCase(deleteEducation.fulfilled, (state, action) => {
        state.loading = false;
        state.educations = state.educations.filter(
          (education) => education._id !== action.payload
        );
        state.deleted = true;
        state.message = "Education deleted successfully";
      })
      .addCase(deleteEducation.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Failed to delete education";
      })

      .addCase(createEducation.pending, (state) => {
        state.loading = true;
      })
      .addCase(createEducation.fulfilled, (state, action) => {
        state.loading = false;
        state.educations.push(action.payload.education);
        state.created = true;
        state.message = action.payload.message;
      })
      .addCase(createEducation.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Failed to create education";
      });
  },
});

const { clearError, resetEducation } = educationSlice.actions;
export {
  clearError,
  resetEducation,
  getProfileEducations,
  createEducation,
  getEducationById,
  updateEducation,
  deleteEducation,
};
export type { education };
export default educationSlice.reducer;
