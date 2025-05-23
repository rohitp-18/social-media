"use client";

import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "../axios";
import { isAxiosError } from "axios";

interface UserState {
  user: any;
  loading: boolean;
  error: string | null;
  login: boolean;
  profile?: any;
  logout?: boolean;
  updated?: boolean;
  message?: string;
  changeFollow: boolean;
}

const initialState: UserState = {
  user: null,
  loading: false,
  error: null,
  login: false,
  updated: false,
  changeFollow: false,
};

const loginUser = createAsyncThunk(
  "user/login",
  async (credentials: { email: string; password: string }, thunkAPI) => {
    try {
      const response = await axios.post("/user/login", credentials, {
        withCredentials: true,
      });
      return response.data.user;
    } catch (error) {
      if (isAxiosError(error) && error.response) {
        throw new Error(error.response.data.message);
      }
      throw error;
    }
  }
);

const registerUser = createAsyncThunk(
  "user/register",
  async (
    userData: { name: string; email: string; password: string },
    thunkAPI
  ) => {
    try {
      const response = await axios.post("/user/register", userData);
      return response.data.user;
    } catch (error) {
      if (isAxiosError(error) && error.response) {
        throw new Error(error.response.data.message);
      }
      throw error;
    }
  }
);

const getUser = createAsyncThunk("user/getUser", async (_, thunkAPI) => {
  try {
    const response = await axios.get("/user");
    return response.data.user;
  } catch (error) {
    if (isAxiosError(error) && error.response) {
      throw new Error(error.response.data.message);
    }
    throw error;
  }
});

const logout = createAsyncThunk("user/logout", async (_, thunkAPI) => {
  try {
    const response = await axios.get("/user/logout");
    return response.data || { message: "Logout successful" };
  } catch (error) {
    if (isAxiosError(error) && error.response) {
      throw new Error(error.response.data.message);
    }
    throw error;
  }
});

const userProfile = createAsyncThunk(
  "user/profile",
  async (url: string, thunkAPI) => {
    try {
      const { data } = await axios.get(`/user/profile/${url}`);

      return data;
    } catch (error) {
      if (isAxiosError(error) && error.response) {
        throw new Error(error.response.data.message);
      }
      throw error;
    }
  }
);

const changeLanguage = createAsyncThunk(
  "user/changeLanguage",
  async (language: string, thunkAPI) => {
    try {
      const { data } = await axios.put("/user/update/language", {
        language,
      });

      return data;
    } catch (error) {
      if (isAxiosError(error) && error.response) {
        throw new Error(error.response.data.message);
      }
      throw error;
    }
  }
);

const changeUsername = createAsyncThunk(
  "user/changeUsername",
  async (username: string, thunkAPI) => {
    try {
      const { data } = await axios.put("/user/update/username", {
        username,
      });

      return data;
    } catch (error) {
      if (isAxiosError(error) && error.response) {
        throw new Error(error.response.data.message);
      }
      throw error;
    }
  }
);

const toggleFollow = createAsyncThunk(
  "user/toggleFollow",
  async (username: string, thunkAPI) => {
    try {
      const { data } = await axios.get("/user/follow/" + username, {});

      return data;
    } catch (error) {
      if (isAxiosError(error) && error.response) {
        throw new Error(error.response.data.message);
      }
      throw error;
    }
  }
);

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    resetUser: (state) => {
      state.login = false;
      state.logout = false;
      state.changeFollow = false;
      state.updated = false;
      state.message = undefined;
    },
    clearError: (state) => {
      state.error = null;
      state.loading = false;
    },
  },
  extraReducers: (builder) => {
    // login user
    builder
      .addCase(loginUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.user = action.payload;
        state.loading = false;
        state.login = true;
        state.message = action.payload?.message || "Login successful";
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message as string;
      })

      // register user
      .addCase(registerUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.user = action.payload;
        state.loading = false;
        state.login = false;
        state.message = action.payload?.message || "Registration successful";
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message as string;
      })

      // getUser reducers
      .addCase(getUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getUser.fulfilled, (state, action) => {
        state.user = action.payload;
        state.loading = false;
      })
      .addCase(getUser.rejected, (state, action: any) => {
        state.loading = false;
      })

      .addCase(userProfile.pending, (state, action) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(userProfile.fulfilled, (state, action) => {
        state.profile = action.payload;
        state.loading = false;
      })
      .addCase(userProfile.rejected, (state, action) => {
        state.error = action.error.message as string;
        state.loading = false;
      })

      .addCase(logout.pending, (state, action) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(logout.fulfilled, (state, action) => {
        state.loading = false;
        state.logout = true;
        state.user = null;
        state.message = "Logout successful";
      })
      .addCase(logout.rejected, (state, action) => {
        state.error = action.error.message as string;
        state.loading = false;
      })

      .addCase(changeLanguage.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(changeLanguage.fulfilled, (state, action) => {
        state.loading = false;
        state.user.language = action.payload.language;
        if (state.profile) {
          state.profile.user.language = action.payload.language;
        }
        state.updated = true;
        state.message =
          action.payload?.message || "Language changed successfully";
      })
      .addCase(changeLanguage.rejected, (state, action) => {
        state.error = action.error.message as string;
        state.loading = false;
      })

      .addCase(changeUsername.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(changeUsername.fulfilled, (state, action) => {
        state.loading = false;
        state.user.username = action.payload.username;
        if (state.profile) {
          state.profile.user.username = action.payload.username;
        }
        state.updated = true;
        state.message =
          action.payload?.message || "Username changed successfully";
      })
      .addCase(changeUsername.rejected, (state, action) => {
        state.error = action.error.message as string;
        state.loading = false;
      })

      .addCase(toggleFollow.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(toggleFollow.fulfilled, (state, action) => {
        state.loading = false;
        state.changeFollow = true;
        if (action.payload.follow) {
          state.user.following.push(action.payload.userId);
          if (state.profile?.user?._id === action.payload.userId) {
            state.profile.user.followers.push(state.user._id);
            state.profile.user.totalFollowers =
              state.profile.user.followers.length;
          }
        } else {
          state.user.following = state.user.following.filter(
            (user: any) => user !== action.payload.userId
          );
          if (state.profile?.user?._id === action.payload.userId) {
            state.profile.user.followers = state.profile.user.followers.filter(
              (user: any) => user !== state.user._id
            );
            state.profile.user.totalFollowers =
              state.profile.user.followers.length;
          }
        }
        state.message = action.payload?.message || "you are following now";
      })
      .addCase(toggleFollow.rejected, (state, action) => {
        state.error = action.error.message as string;
        state.loading = false;
      });
  },
});

const { resetUser, clearError } = userSlice.actions;
export {
  loginUser,
  registerUser,
  getUser,
  logout,
  resetUser,
  userProfile,
  clearError,
  changeLanguage,
  changeUsername,
  toggleFollow,
};
export default userSlice.reducer;
