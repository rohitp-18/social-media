import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "../axios";
import { isAxiosError } from "axios";

const getProfileActivity = createAsyncThunk(
  "userPost/getProfileActivity",
  async (username: string, thunkAPI) => {
    try {
      if (username.length < 4) return;
      const { data } = await axios.get(`/user/profile/activity/${username}`);
      return data;
    } catch (error: any) {
      if (isAxiosError(error) && error.response) {
        throw error.response.data.message;
      }
      throw error.message;
    }
  }
);

const getSinglePost = createAsyncThunk(
  "userPost/getSinglePost",
  async (userPostId: string, thunkAPI) => {
    try {
      const { data } = await axios.get(`/posts/user/${userPostId}`);
      return data;
    } catch (error: any) {
      if (isAxiosError(error) && error.response) {
        throw error.response.data.message;
      }
      throw error.message;
    }
  }
);

const deletePost = createAsyncThunk(
  "userPost/deletePost",
  async (userPostId: string, thunkAPI) => {
    try {
      const { data } = await axios.delete(`/posts/user/${userPostId}`);
      return data;
    } catch (error: any) {
      if (isAxiosError(error) && error.response) {
        throw error.response.data.message;
      }
      throw error.message;
    }
  }
);

const updatePost = createAsyncThunk(
  "userPost/updatePost",
  async (userPost: { userPostId: string; data: any }, thunkAPI) => {
    try {
      const { data } = await axios.put(
        `/posts/user/${userPost.userPostId}`,
        userPost.data,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      return data;
    } catch (error: any) {
      if (isAxiosError(error) && error.response) {
        throw error.response.data.message;
      }
      throw error.message;
    }
  }
);

const createPost = createAsyncThunk(
  "userPost/createPost",
  async (userPost: any, thunkAPI) => {
    try {
      const { data } = await axios.post(`/posts/create`, userPost, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      return data;
    } catch (error: any) {
      if (isAxiosError(error) && error.response) {
        throw error.response.data.message;
      }
      throw error.message;
    }
  }
);

interface PostState {
  userPosts: any[];
  loading: boolean;
  singlePost: any | null;
  error: string | null;
  message: string | null;
  updated: boolean;
  deleted: boolean;
  comments: any[];
  images: any[];
  videos: any[];
  created: boolean;
  isFollowing: boolean;
}

const initialState: PostState = {
  userPosts: [],
  loading: false,
  error: null,
  message: null,
  comments: [],
  singlePost: null,
  images: [],
  videos: [],
  updated: false,
  deleted: false,
  created: false,
  isFollowing: false,
};

const userPostSlice = createSlice({
  name: "userPost",
  initialState,
  reducers: {
    resetPost: (state) => {
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
      .addCase(getProfileActivity.pending, (state) => {
        state.loading = true;
      })
      .addCase(getProfileActivity.fulfilled, (state, action) => {
        state.loading = false;
        state.userPosts = action.payload.activities.posts;
        state.images = action.payload.activities.images;
        state.videos = action.payload.activities.videos;
        state.comments = action.payload.activities.comments;
        state.isFollowing = action.payload.isFollowing;
      })
      .addCase(getProfileActivity.rejected, (state, action) => {
        state.loading = false;
        if (action.payload) {
          state.error = action.error.message as string;
        }
      })

      // delete userPost
      .addCase(deletePost.pending, (state) => {
        state.loading = true;
      })
      .addCase(deletePost.fulfilled, (state, action) => {
        state.loading = false;
        state.deleted = true;
        state.message = action.payload.message;
        state.userPosts = state.userPosts.filter(
          (userPost) => userPost._id !== action.payload._id
        );
      })
      .addCase(deletePost.rejected, (state, action) => {
        state.loading = false;
        if (action.payload) {
          state.error = action.error.message as string;
        }
      })

      // update userPost
      .addCase(updatePost.pending, (state) => {
        state.loading = true;
      })
      .addCase(updatePost.fulfilled, (state, action) => {
        state.loading = false;
        state.updated = true;
        state.message = action.payload.message;
        state.userPosts = state.userPosts.map((userPost) =>
          userPost._id === action.payload._id ? action.payload : userPost
        );
      })
      .addCase(updatePost.rejected, (state, action) => {
        state.loading = false;
        if (action.payload) {
          state.error = action.error.message as string;
        }
      })

      // create userPost
      .addCase(createPost.pending, (state) => {
        state.loading = true;
      })
      .addCase(createPost.fulfilled, (state, action) => {
        state.loading = false;
        state.created = true;
        state.message = action.payload.message;
        state.userPosts = [...state.userPosts, action.payload.userPost];
      })
      .addCase(createPost.rejected, (state, action) => {
        state.loading = false;
        if (action.payload) {
          state.error = action.error.message as string;
        }
      })

      // get single userPost
      .addCase(getSinglePost.pending, (state) => {
        state.loading = true;
      })
      .addCase(getSinglePost.fulfilled, (state, action) => {
        state.loading = false;
        state.singlePost = action.payload.post;
      })
      .addCase(getSinglePost.rejected, (state, action) => {
        state.loading = false;
        if (action.payload) {
          state.error = action.error.message as string;
        }
      });
  },
});

const { resetPost, clearError } = userPostSlice.actions;
export {
  getProfileActivity,
  deletePost,
  updatePost,
  createPost,
  resetPost,
  clearError,
  getSinglePost,
};
export default userPostSlice.reducer;
