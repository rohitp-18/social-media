import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "../axios";
import { AxiosError, isAxiosError } from "axios";
import { skillsState } from "./typeSkill";

const searchSkill = createAsyncThunk(
  "skill/searchSkill",
  async (query: string, thunkAPI) => {
    try {
      const { data } = await axios.get(`/skills/search?query=${query}`);
      return data;
    } catch (error: unknown | AxiosError) {
      if (isAxiosError(error) && error.response) {
        return thunkAPI.rejectWithValue(error.response.data.message);
      }
      throw (error as Error).message;
    }
  }
);

const initialState: skillsState = {
  skills: [],
  searchSkills: [],
  searchLoading: false,
  searchError: null,
  loading: false,
  error: null,
  message: null,
  created: false,
  updated: false,
  deleted: false,
};

const skillSlice = createSlice({
  name: "skill",
  initialState,
  reducers: {
    resetSkill: (state: skillsState) => {
      state.loading = false;
      state.error = null;
      state.message = null;
      state.created = false;
      state.updated = false;
      state.deleted = false;
      state.searchSkills = [];
    },
    clearError: (state: skillsState) => {
      state.error = null;
      state.message = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(searchSkill.pending, (state) => {
        state.loading = true;
      })
      .addCase(searchSkill.fulfilled, (state, action) => {
        state.loading = false;
        state.searchSkills = action.payload.skills;
      })
      .addCase(searchSkill.rejected, (state, action) => {
        state.loading = false;
        state.searchError = action.payload as string;
      });
  },
});

const { clearError, resetSkill } = skillSlice.actions;

export { searchSkill, clearError, resetSkill };
export default skillSlice.reducer;
