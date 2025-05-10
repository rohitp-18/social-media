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
}

const initialState: UserState = {
  user: null,
  loading: false,
  error: null,
  login: false,
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
        return thunkAPI.rejectWithValue(error.response.data);
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
        return thunkAPI.rejectWithValue(error.response.data);
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
      return thunkAPI.rejectWithValue(error.response.data);
    }
    throw error;
  }
});

const logout = createAsyncThunk("user/logout", async (_, thunkAPI) => {
  try {
    await axios.post("/user/logout");
    return null;
  } catch (error) {
    if (isAxiosError(error) && error.response) {
      return thunkAPI.rejectWithValue(error.response.data);
    }
    throw error;
  }
});

const userProfile = createAsyncThunk(
  "user/profile",
  async (url: string, thunkAPI) => {
    try {
      const { data } = await axios.get(url);

      return data;
    } catch (error) {
      if (isAxiosError(error) && error.response) {
        return thunkAPI.rejectWithValue(error.response.data);
      }
      throw error;
    }
  }
);

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    resetLogin: (state) => {
      state.login = false;
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
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
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
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
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
        state.error = action.payload.message;
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
        state.error = action.payload as string;
        state.loading = false;
      });
  },
});

const { resetLogin } = userSlice.actions;
export { loginUser, registerUser, getUser, logout, resetLogin, userProfile };
export default userSlice.reducer;
