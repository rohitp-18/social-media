import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "../axios";
import { AxiosError, isAxiosError } from "axios";
import { InheritUser } from "./typeUser";

const getAllNotifications = createAsyncThunk(
  "notification/getallnotification",
  async () => {
    try {
      const { data } = await axios.get("/notifications/all");

      return data;
    } catch (error: unknown | AxiosError) {
      if (isAxiosError(error) && error.response) {
        throw error.response.data.message;
      }
      throw (error as Error).message;
    }
  }
);

const getAllInvitations = createAsyncThunk(
  "notification/getallinvitations",
  async () => {
    try {
      const { data } = await axios.get("/invitations/all");
      return data;
    } catch (error: unknown | AxiosError) {
      if (isAxiosError(error) && error.response) {
        throw error.response.data.message;
      }
      throw (error as Error).message;
    }
  }
);

const getAllInvitationsCount = createAsyncThunk(
  "notification/getallinvitationscount",
  async () => {
    try {
      const { data } = await axios.get("/invitations/get/count");

      return data;
    } catch (error: unknown | AxiosError) {
      if (isAxiosError(error) && error.response) {
        throw error.response.data.message;
      }
      throw (error as Error).message;
    }
  }
);

const readNotification = createAsyncThunk(
  "notification/readNotification",
  async (id) => {
    try {
      const { data } = await axios.get(`/notifications/read/${id}`);

      return data;
    } catch (error: unknown | AxiosError) {
      if (isAxiosError(error) && error.response) {
        throw error.response.data.message;
      }
      throw (error as Error).message;
    }
  }
);
const readAllNotification = createAsyncThunk(
  "notification/readAllNotification",
  async (id) => {
    try {
      const { data } = await axios.get("/notifications/read/all");

      return data;
    } catch (error: unknown | AxiosError) {
      if (isAxiosError(error) && error.response) {
        throw error.response.data.message;
      }
      throw (error as Error).message;
    }
  }
);

const deleteNotification = createAsyncThunk(
  "notification/deleteNotification",
  async (id) => {
    try {
      const { data } = await axios.delete(`/notifications/user/${id}`);

      return data;
    } catch (error: unknown | AxiosError) {
      if (isAxiosError(error) && error.response) {
        throw error.response.data.message;
      }
      throw (error as Error).message;
    }
  }
);

const getKey = createAsyncThunk("notification/getKey", async () => {
  try {
    const { data } = await axios.get("/notifications/key");
    return data;
  } catch (error: unknown | AxiosError) {
    if (isAxiosError(error) && error.response) {
      throw error.response.data.message;
    }
    throw (error as Error).message;
  }
});

const subscribeUser = createAsyncThunk(
  "notification/subscribeUser",
  async (subscription: PushSubscription) => {
    try {
      const { data } = await axios.post("/notifications/subscribe", {
        subscription,
      });
      return data;
    } catch (error: unknown | AxiosError) {
      if (isAxiosError(error) && error.response) {
        throw error.response.data.message;
      }
      throw (error as Error).message;
    }
  }
);

const unSubscribeUser = createAsyncThunk(
  "notification/unSubscribeUser",
  async (subscription: PushSubscription) => {
    try {
      const { data } = await axios.post("/notifications/unsubscribe", {
        subscription,
      });
      return data;
    } catch (error: unknown | AxiosError) {
      if (isAxiosError(error) && error.response) {
        throw error.response.data.message;
      }
      throw (error as Error).message;
    }
  }
);

interface notificationT {
  _id: string;
  recipient: string;
  sender: InheritUser;
  type: string;
  message: string;
  read: boolean;
  url: string;
  relatedId?: { avatar: { url: string }; name: string };
  createdAt: Date;
  updatedAt: Date;
}

interface invitationT {
  _id: string;
  sender: string;
  recipientEmail: string;
  type: string;
  status: string;
  message?: string;
  link?: string;
  targetId?: string;
  refModel?: string;
  createdAt: Date;
  expiresAt?: Date;
  unread?: boolean;
}

interface notificationState {
  notifications: notificationT[];
  loading: boolean;
  error: string | null;
  message: string | null;
  deleted: boolean;
  key?: string;
  totalInvitations: number;
  invitations: invitationT[];
  totalNotifications: number;
  totalChats: number;
}

const initialState: notificationState = {
  notifications: [],
  loading: false,
  error: null,
  message: null,
  deleted: false,
  invitations: [],
  totalInvitations: 0,
  totalNotifications: 0,
  totalChats: 0,
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
    updateInvitations: (state, action) => {
      state.invitations = action.payload;
    },
    updateChatNotifications: (state, action) => {
      state.totalChats = action.payload;
    },
    updateNotificationCount: (state, action) => {
      state.totalNotifications = action.payload;
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
      })

      .addCase(getKey.fulfilled, (state, action) => {
        state.key = action.payload.key;
      })

      .addCase(getAllInvitations.fulfilled, (state, action) => {
        state.invitations = action.payload.invitations || [];
        state.totalInvitations = 0;
      })
      .addCase(getAllInvitations.rejected, (state, action) => {
        state.error = action.error.message || "Failed to fetch invitations";
      })
      .addCase(getAllInvitationsCount.fulfilled, (state, action) => {
        state.totalInvitations = action.payload.count || 0;
        state.totalNotifications = action.payload.totalNotifications || 0;
        state.totalChats = action.payload.totalChats || 0;
      })

      .addCase(readNotification.fulfilled, (state, action) => {
        state.totalNotifications = state.totalNotifications - 1;
        state.notifications = state.notifications.map((notify) => {
          if (notify._id != action.payload.notification._id) {
            notify.read = true;
          }
          return notify;
        });
      })
      .addCase(readAllNotification.fulfilled, (state, action) => {
        state.totalNotifications = 0;
        state.notifications = state.notifications.map((notify) => {
          notify.read = true;
          return notify;
        });
      });
  },
});

const {
  resetNotification,
  clearError,
  updateInvitations,
  updateChatNotifications,
  updateNotificationCount,
} = notificationSlice.actions;

export {
  resetNotification,
  clearError,
  getAllNotifications,
  deleteNotification,
  getKey,
  subscribeUser,
  getAllInvitations,
  getAllInvitationsCount,
  updateInvitations,
  updateChatNotifications,
  updateNotificationCount,
  unSubscribeUser,
};
export type { notificationT };
export default notificationSlice.reducer;
