import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "../axios";
import { isAxiosError } from "axios";

const getAllNotifications = createAsyncThunk(
  "notification/getallnotification",
  async () => {
    try {
      const { data } = await axios.get("/notifications/all");

      return data;
    } catch (error: any) {
      if (isAxiosError(error) && error.response) {
        throw error.response.data.message;
      }
      throw error.message;
    }
  }
);

const deleteNotification = createAsyncThunk(
  "notification/deleteNotification",
  async (id) => {
    try {
      const { data } = await axios.delete(`/notifications/user/${id}`);

      return data;
    } catch (error: any) {
      if (isAxiosError(error) && error.response) {
        throw error.response.data.message;
      }
      throw error.message;
    }
  }
);

interface notificationState {
  notifications: any[];
  loading: boolean;
  error: string | null;
  message: string | null;
  deleted: boolean;
}

const initialState: notificationState = {
  notifications: [],
  loading: false,
  error: null,
  message: null,
  deleted: false,
};

const notificationSlice = createSlice({
  name: "notification",
  initialState,
  reducers: {
    resetNotification: (state) => {
      state.loading = false;
      state.error = null;
      state.message = null;
      state.deleted = false;
    },
    clearError: (state) => {
      state.loading = false;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getAllNotifications.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.message = null;
      })
      .addCase(getAllNotifications.fulfilled, (state, action) => {
        state.loading = false;
        state.notifications = action.payload.notifications || [];
        state.message = action.payload.message || null;
        state.error = null;
      })
      .addCase(getAllNotifications.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Failed to fetch notifications";
      })

      // delete notification
      .addCase(deleteNotification.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.message = null;
        state.deleted = false;
      })
      .addCase(deleteNotification.fulfilled, (state, action) => {
        state.loading = false;
        state.deleted = true;
        state.message = action.payload.message || "Notification deleted";
        state.error = null;
        state.notifications = state.notifications.filter(
          (n) => n._id !== action.payload.notificationId
        );
      })
      .addCase(deleteNotification.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Failed to delete notification";
        state.deleted = false;
      });
  },
});

const { resetNotification, clearError } = notificationSlice.actions;

export {
  resetNotification,
  clearError,
  getAllNotifications,
  deleteNotification,
};

export default notificationSlice.reducer;
