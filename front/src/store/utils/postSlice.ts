import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import axios from "../axios";
import { isAxiosError } from "axios";

const createPost = createAsyncThunk<any, any, { rejectValue: string }>(
  "post/createPost",
  async (postData: any, { rejectWithValue }) => {
    try {
      const { data } = await axios.post("/posts/create", postData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      return data;
    } catch (error) {
      if (isAxiosError(error)) {
        return rejectWithValue(
          error.response?.data.message || "Failed to create post"
        );
      }
      return rejectWithValue("Failed to create post");
    }
  }
);

const updatePost = createAsyncThunk<any, any, { rejectValue: string }>(
  "post/updatePost",
  async ({ postId, postData }, { rejectWithValue }) => {
    try {
      const { data } = await axios.put(`/posts/${postId}`, postData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      return data;
    } catch (error) {
      if (isAxiosError(error)) {
        return rejectWithValue(
          error.response?.data.message || "Failed to update post"
        );
      }
      return rejectWithValue("Failed to update post");
    }
  }
);

const getPost = createAsyncThunk<any, string, { rejectValue: string }>(
  "post/getPost",
  async (postId, { rejectWithValue }) => {
    try {
      const { data } = await axios.get(`/posts/post/${postId}`);
      return data;
    } catch (error) {
      if (isAxiosError(error)) {
        return rejectWithValue(
          error.response?.data.message || "Failed to fetch post"
        );
      }
      return rejectWithValue("Failed to fetch post");
    }
  }
);

interface PostState {
  posts: any[];
  post: any;
  loading: boolean;
  error: string | null;
  created: boolean;
  updated: boolean;
  deleted: boolean;
  saved: boolean;
  shared: boolean;
  reposted: boolean;
  liked: boolean;
  message: string | null;
  savedPosts: any[];
}

const initialState: PostState = {
  posts: [],
  post: null,
  loading: false,
  error: null,
  created: false,
  updated: false,
  deleted: false,
  saved: false,
  shared: false,
  reposted: false,
  liked: false,
  message: null,
  savedPosts: [],
};

const postSlice = createSlice({
  name: "post",
  initialState,
  reducers: {
    resetPosts: (state) => {
      state.loading = false;
      state.created = false;
      state.updated = false;
      state.deleted = false;
      state.saved = false;
      state.shared = false;
      state.reposted = false;
      state.message = null;
      state.liked = false;
      state.savedPosts = [];
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(createPost.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createPost.fulfilled, (state, action: PayloadAction<any>) => {
        state.loading = false;
        state.created = true;
        state.post = action.payload.post;
        state.message = action.payload.message;
        state.error = null;
      })
      .addCase(createPost.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Failed to create post";
      })

      .addCase(updatePost.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updatePost.fulfilled, (state, action: PayloadAction<any>) => {
        state.loading = false;
        state.updated = true;
        state.post = action.payload.post;
        state.message = action.payload.message;
        state.error = null;
      })
      .addCase(updatePost.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Failed to update post";
      })

      .addCase(getPost.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getPost.fulfilled, (state, action: PayloadAction<any>) => {
        state.loading = false;
        state.post = action.payload;
        state.error = null;
      })
      .addCase(getPost.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Failed to fetch post";
      });
  },
});

const { resetPosts, clearError } = postSlice.actions;
export { createPost, updatePost, resetPosts, clearError };
export default postSlice.reducer;
