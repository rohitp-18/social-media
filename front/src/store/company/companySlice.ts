import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { isAxiosError } from "axios";
import axios from "../axios";

const searchCompaniesAction = createAsyncThunk(
  "company/searchCompanies",
  async (searchTerm, thunkAPI) => {
    try {
      const { data } = await axios.get(
        `/companies/search?search=${searchTerm}`
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

interface companyInterface {
  companies: any[];
  loading: boolean;
  error: string | null;
  company: any;
  created: boolean;
  updated: boolean;
  deleted: boolean;
  searchCompanies: any[];
  searchLoading: boolean;
}

const initialState: companyInterface = {
  companies: [],
  loading: false,
  error: null,
  company: null,
  created: false,
  updated: false,
  deleted: false,
  searchCompanies: [],
  searchLoading: false,
};

const companySlice = createSlice({
  name: "company",
  initialState,
  reducers: {
    resetcompany: (state) => {
      state.created = false;
      state.updated = false;
      state.deleted = false;
      state.error = null;
      state.company = null;
      state.searchCompanies = [];
      state.searchLoading = false;
      state.loading = false;
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(searchCompaniesAction.pending, (state) => {
        state.searchLoading = true;
      })
      .addCase(searchCompaniesAction.fulfilled, (state, action) => {
        state.searchLoading = false;
        state.searchCompanies = action.payload;
      })
      .addCase(searchCompaniesAction.rejected, (state, action) => {
        state.searchLoading = false;
        state.error = action.error.message || "Something went wrong";
      });
  },
});

const { resetcompany, clearError } = companySlice.actions;
export { resetcompany, clearError, searchCompaniesAction };
export default companySlice.reducer;
