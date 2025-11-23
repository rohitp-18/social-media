import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "../axios";
import { AxiosError, isAxiosError } from "axios";
import { chatState } from "./typeChat";

const fetchChats = createAsyncThunk("chat/fetchChats", async () => {
  try {
    const { data } = await axios.get("/chat/fetch");
    return data;
  } catch (error: unknown | AxiosError) {
    if (isAxiosError(error) && error.response) {
      throw error.response.data.message;
    }
    throw (error as Error).message;
  }
});

const readMessage = createAsyncThunk(
  "chat/readMessage",
  async ({ chatId, messageId }: { chatId: string; messageId: string }) => {
    try {
      const { data } = await axios.post("/chat/read", { chatId, messageId });
      return data;
    } catch (error: unknown | AxiosError) {
      if (isAxiosError(error) && error.response) {
        throw error.response.data.message;
      }
      throw (error as Error).message;
    }
  }
);

const createChat = createAsyncThunk(
  "chat/createChat",
  async (userId: string) => {
    try {
      const { data } = await axios.post("/chat/create", { userId });
      return data;
    } catch (error: unknown | AxiosError) {
      if (isAxiosError(error) && error.response) {
        throw error.response.data.message;
      }
      throw (error as Error).message;
    }
  }
);

const initialState: chatState = {
  chats: [],
  loading: false,
  error: null,
  message: null,
  newChat: null,
  deleted: false,
};

const chatSlice = createSlice({
  name: "chat",
  initialState,
  reducers: {
    resetChat: (state) => {
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
      .addCase(fetchChats.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchChats.fulfilled, (state, action) => {
        state.loading = false;
        state.chats = action.payload.chats;
        state.message = action.payload.message;
      })
      .addCase(fetchChats.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Failed to fetch chats";
      })

      // Handle readMessage
      .addCase(readMessage.rejected, (state, action) => {
        state.error = action.error.message || "Failed to read message";
      })

      // Handle createChat
      .addCase(createChat.fulfilled, (state, action) => {
        state.chats.push(action.payload.chat);
      })
      .addCase(createChat.rejected, (state, action) => {
        state.error = action.error.message || "Failed to create chat";
      });
  },
});

const { resetChat, clearError } = chatSlice.actions;

export { resetChat, clearError, fetchChats, readMessage, createChat };

export default chatSlice.reducer;
