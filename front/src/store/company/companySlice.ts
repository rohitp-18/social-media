import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { isAxiosError } from "axios";
import axios from "../axios";

const searchCompaniesAction = createAsyncThunk(
  "company/searchCompanies",
  async (searchTerm, thunkAPI) => {
    try {
      const { data } = await axios.get(`/company/search?search=${searchTerm}`);
      return data;
    } catch (error: any) {
      if (isAxiosError(error) && error.response) {
        throw new Error(error.response.data.message);
      }
      throw new Error(error.message);
    }
  }
);

const getSingleCompany = createAsyncThunk(
  "company/getSingleCompany",
  async (id: string, thunkAPI) => {
    try {
      const { data } = await axios.get(`/company/one/${id}`);
      return data;
    } catch (error: any) {
      if (isAxiosError(error) && error.response) {
        throw new Error(error.response.data.message);
      }
      throw new Error(error.message);
    }
  }
);

const createCompany = createAsyncThunk(
  "company/createCompany",
  async (form: any, thunkAPI) => {
    try {
      const { data } = await axios.post(`/company/create`, form, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      return data;
    } catch (error: any) {
      if (isAxiosError(error) && error.response) {
        throw new Error(error.response.data.message);
      }
      throw new Error(error.message);
    }
  }
);
const updateCompany = createAsyncThunk(
  "company/updateCompany",
  async (formData: any, thunkAPI) => {
    try {
      const { data } = await axios.put(
        `/company/update/${formData.id}`,
        formData.form,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
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

const updateCompanyBanner = createAsyncThunk(
  "company/updateCompanyBanner",
  async (formData: any, thunkAPI) => {
    try {
      const { data } = await axios.put(
        `/company/update/banner/${formData.id}`,
        formData.form,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
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

const toggleFollowCompany = createAsyncThunk(
  "company/toggleFollowCompany",
  async (
    { companyId, follow }: { companyId: string; follow: boolean },
    thunkAPI
  ) => {
    try {
      const { data } = await axios.put(
        `/company/${follow ? "follow" : "unfollow"}/${companyId}`
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
  followed: boolean;
  posts: any[];
  jobs: any[];
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
  followed: false,
  posts: [],
  jobs: [],
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
      state.searchCompanies = [];
      state.searchLoading = false;
      state.loading = false;
      state.followed = false;
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
      })

      .addCase(getSingleCompany.pending, (state) => {
        state.loading = true;
      })
      .addCase(getSingleCompany.fulfilled, (state, action) => {
        state.loading = false;
        state.company = action.payload.company;
        state.posts = action.payload.posts;
        state.jobs = action.payload.jobs;
      })
      .addCase(getSingleCompany.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Something went wrong";
      })

      .addCase(createCompany.pending, (state) => {
        state.loading = true;
        state.created = false;
      })
      .addCase(createCompany.fulfilled, (state, action) => {
        state.loading = false;
        state.company = action.payload.company;
        state.created = true;
      })
      .addCase(createCompany.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Something went wrong";
      })

      .addCase(updateCompany.pending, (state) => {
        state.loading = true;
        state.updated = false;
      })
      .addCase(updateCompany.fulfilled, (state, action) => {
        state.loading = false;
        state.company = action.payload.company;
        state.updated = true;
      })
      .addCase(updateCompany.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Something went wrong";
      })

      .addCase(updateCompanyBanner.pending, (state) => {
        state.loading = true;
        state.updated = false;
      })
      .addCase(updateCompanyBanner.fulfilled, (state, action) => {
        state.loading = false;
        state.company = action.payload.company;
        state.updated = true;
      })
      .addCase(updateCompanyBanner.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Something went wrong";
      })

      .addCase(toggleFollowCompany.fulfilled, (state, action) => {
        state.loading = false;
        state.followed = true;
      })
      .addCase(toggleFollowCompany.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Something went wrong";
      });
  },
});

const { resetcompany, clearError } = companySlice.actions;
export {
  resetcompany,
  clearError,
  searchCompaniesAction,
  getSingleCompany,
  createCompany,
  updateCompany,
  updateCompanyBanner,
  toggleFollowCompany,
};

export default companySlice.reducer;
