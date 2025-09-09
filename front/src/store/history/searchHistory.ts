import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "../axios";

const getAllSearchHistoryAction = createAsyncThunk(
  "searchHistory/getAll",
  async (query: string, { rejectWithValue }) => {
    try {
      const { data } = await axios.get(
        `/searchHistory${query ? `?q=${query}` : ""}`
      );
      return data;
    } catch (error: any) {
      return rejectWithValue(error.response.data.message);
    }
  }
);

const createSearchHistoryAction = createAsyncThunk(
  "searchHistory/create",
  async (query: string, { rejectWithValue }) => {
    try {
      const { data } = await axios.post("/searchHistory", { query });
      return data;
    } catch (error: any) {
      return rejectWithValue(error.response.data.message);
    }
  }
);

const deleteSearchHistoryAction = createAsyncThunk(
  "searchHistory/delete",
  async (id: string, { rejectWithValue }) => {
    try {
      const { data } = await axios.delete(`/searchHistory/${id}`);
      return data;
    } catch (error: any) {
      return rejectWithValue(error.response.data.message);
    }
  }
);

const clearSearchHistoryAction = createAsyncThunk(
  "searchHistory/clear",
  async (_, { rejectWithValue }) => {
    try {
      const { data } = await axios.delete("/searchHistory/clear");
      return data;
    } catch (error: any) {
      return rejectWithValue(error.response.data.message);
    }
  }
);

interface SearchHistoryState {
  history: Array<{
    _id: string;
    user: string;
    query: string;
    suggest: boolean;
    createdAt: string;
  }>;
  loading: boolean;
  deleted: boolean;
  cleared: boolean;
  error: string | null;
}

const initialState: SearchHistoryState = {
  history: [],
  loading: false,
  deleted: false,
  cleared: false,
  error: null,
};

export const searchHistorySlice = createSlice({
  name: "searchHistory",
  initialState,
  reducers: {
    clearErrors: (state) => {
      state.error = null;
    },
    resetSearchHistoryState: (state) => {
      state.loading = false;
      state.deleted = false;
      state.cleared = false;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(createSearchHistoryAction.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createSearchHistoryAction.fulfilled, (state, action) => {
        state.loading = false;
        state.history.push(action.payload.history);
      })
      .addCase(createSearchHistoryAction.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      .addCase(getAllSearchHistoryAction.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getAllSearchHistoryAction.fulfilled, (state, action) => {
        state.loading = false;
        state.history = action.payload.history;
      })
      .addCase(getAllSearchHistoryAction.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      .addCase(deleteSearchHistoryAction.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.deleted = false;
      })
      .addCase(deleteSearchHistoryAction.fulfilled, (state, action) => {
        state.loading = false;
        state.history = state.history.filter(
          (item) => item._id !== action.payload.id
        );
        state.deleted = true;
      })
      .addCase(deleteSearchHistoryAction.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
        state.deleted = false;
      })

      .addCase(clearSearchHistoryAction.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.cleared = false;
      })
      .addCase(clearSearchHistoryAction.fulfilled, (state, action) => {
        state.loading = false;
        state.cleared = true;
        state.history = [];
      });
  },
});

const { clearErrors, resetSearchHistoryState } = searchHistorySlice.actions;
export default searchHistorySlice.reducer;
export {
  createSearchHistoryAction,
  getAllSearchHistoryAction,
  deleteSearchHistoryAction,
  clearSearchHistoryAction,
  clearErrors,
  resetSearchHistoryState,
};
