import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "../axios";
import { isAxiosError } from "axios";
import store from "../store";
import { Post, sUser } from "../user/typeUser";
import { Group } from "./typeGroup";

function handleError(error: unknown) {
  if (isAxiosError(error) && error.response) {
    throw new Error(error.response.data.message);
  }
  throw new Error((error as Error).message);
}

const searchGroupsAction = createAsyncThunk(
  "group/searchGroups",
  async (searchTerm: string, thunkAPI) => {
    try {
      const { data } = await axios.get(`/groups/search?search=${searchTerm}`);
      return data;
    } catch (error) {
      handleError(error);
    }
  }
);

const createGroup = createAsyncThunk(
  "group/createGroup",
  async (form: any, thunkAPI) => {
    try {
      const { data } = await axios.post(`/groups/create`, form, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      return data;
    } catch (error) {
      handleError(error);
    }
  }
);

const getSingleGroup = createAsyncThunk(
  "group/getSingleGroup",
  async (id: string, thunkAPI) => {
    try {
      const { data } = await axios.get(`/groups/group/${id}`);
      return data;
    } catch (error) {
      handleError(error);
    }
  }
);

const updateGroup = createAsyncThunk(
  "group/updateGroup",
  async (formData: any, thunkAPI) => {
    try {
      const { data } = await axios.put(
        `/groups/group/${formData.id}`,
        formData.form,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      return data;
    } catch (error) {
      handleError(error);
    }
  }
);

const deleteGroup = createAsyncThunk(
  "group/deleteGroup",
  async (id: string, thunkAPI) => {
    try {
      const { data } = await axios.delete(`/groups/group/${id}`);
      return data;
    } catch (error) {
      handleError(error);
    }
  }
);

const toggleJoinRequest = createAsyncThunk(
  "group/joinGroup",
  async (
    { id, type, message }: { id: string; type: string; message?: string },
    thunkAPI
  ) => {
    try {
      const { data } = await axios.put(`/groups/${type}/${id}`, { message });
      return { ...data, type, reqMessage: message };
    } catch (error) {
      handleError(error);
    }
  }
);

const updateGroupRequest = createAsyncThunk(
  "group/users",
  async (
    { id, status, userId }: { id: string; status: string; userId: string },
    thunkAPI
  ) => {
    try {
      const { data } = await axios.put(`/groups/request/update/${id}`, {
        status,
        userId,
      });
      return { ...data, status, userId };
    } catch (error) {
      handleError(error);
    }
  }
);

const removeUserFromGroup = createAsyncThunk(
  "group/removeUserFromGroup",
  async (
    { groupId, userId }: { groupId: string; userId: string },
    thunkAPI
  ) => {
    try {
      const { data } = await axios.post(`/groups/remove/member/${groupId}`, {
        userId,
      });
      return { ...data, userId };
    } catch (error) {
      handleError(error);
    }
  }
);

interface groupSliceIntra {
  groups: Group[];
  group: Group | null;
  created: boolean;
  deleted: boolean;
  updated: boolean;
  message: string | null;
  groupError: string | null;
  error: string | null;
  searchGroups: Group[];
  searchLoading: boolean;
  searchError: string | null;
  loading: boolean;
  posts: Post[];
  requested: boolean;
  users: {
    admin: sUser[];
    requests: { user: sUser; message: string }[];
    members: sUser[];
  };
}

const initialState: groupSliceIntra = {
  groups: [],
  group: null,
  created: false,
  deleted: false,
  updated: false,
  message: null,
  groupError: null,
  error: null,
  searchGroups: [],
  searchLoading: false,
  searchError: null,
  loading: false,
  posts: [],
  requested: false,
  users: {
    admin: [],
    requests: [],
    members: [],
  },
};

const groupSlice = createSlice({
  name: "group",
  initialState,
  reducers: {
    resetGroup: (state) => {
      state.created = false;
      state.deleted = false;
      state.updated = false;
      state.message = null;
      state.groupError = null;
      state.error = null;
      state.searchGroups = [];
      state.searchLoading = false;
      state.loading = false;
    },
    clearGroupError: (state) => {
      state.groupError = null;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(createGroup.pending, (state) => {
        state.loading = true;
      })
      .addCase(createGroup.fulfilled, (state, action) => {
        state.loading = false;
        state.created = true;
        state.group = action.payload.group;
        state.groups.push(action.payload.group);
      })
      .addCase(createGroup.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Failed to create group";
      })

      // get single group
      .addCase(getSingleGroup.pending, (state) => {
        state.loading = true;
      })
      .addCase(getSingleGroup.fulfilled, (state, action) => {
        state.loading = false;
        state.group = action.payload.group;
        state.users = action.payload.users;
        state.posts = action.payload.posts || [];
      })
      .addCase(getSingleGroup.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Failed to fetch group";
      })

      // update group
      .addCase(updateGroup.pending, (state) => {
        state.loading = true;
      })
      .addCase(updateGroup.fulfilled, (state, action) => {
        state.loading = false;
        state.updated = true;
        const index = state.groups.findIndex(
          (g) => g._id === action.payload._id
        );
        if (index !== -1) {
          state.groups[index] = action.payload;
        }
      })
      .addCase(updateGroup.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Failed to update group";
      })

      // delete group
      .addCase(deleteGroup.pending, (state) => {
        state.loading = true;
      })
      .addCase(deleteGroup.fulfilled, (state, action) => {
        state.loading = false;
        state.deleted = true;
        state.groups = state.groups.filter((g) => g._id !== action.payload._id);
      })
      .addCase(deleteGroup.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Failed to delete group";
      })

      // request for the join the group
      .addCase(toggleJoinRequest.pending, (state) => {
        state.loading = true;
      })
      .addCase(toggleJoinRequest.fulfilled, (state, action) => {
        state.loading = false;
        state.requested = action.payload.requested;
        state.message = action.payload.message;
        const userId = action.payload.user._id;
        if (action.payload.type === "leave") {
          state.users.members = state.users.members.filter(
            (member) => member !== userId
          );
        } else {
          if (!action.payload.requested) {
            state.users.requests = state.users.requests.filter(
              (member) => member.user._id.toString() !== userId.toString()
            );
          } else {
            state.users.requests.push({
              user: action.payload.user,
              message: action.payload.reqMessage,
            });
          }
        }
      })
      .addCase(toggleJoinRequest.rejected, (state, action) => {
        state.loading = false;
        state.error =
          action.error.message || "Failed to toggle join request status";
      })

      // search group
      .addCase(searchGroupsAction.pending, (state) => {
        state.searchLoading = true;
        state.searchError = null;
      })
      .addCase(searchGroupsAction.fulfilled, (state, action) => {
        state.searchLoading = false;
        state.searchGroups = action.payload;
      })
      .addCase(searchGroupsAction.rejected, (state, action) => {
        state.searchLoading = false;
        state.searchError = action.error.message || "Failed to search groups";
      })

      // update group request
      .addCase(updateGroupRequest.pending, (state) => {
        state.loading = true;
      })
      .addCase(updateGroupRequest.fulfilled, (state, action) => {
        state.loading = false;
        state.message = action.payload.message;
        state.users.requests = state.users.requests.filter(
          (request) => request.user._id !== action.payload.userId
        );
      })
      .addCase(updateGroupRequest.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "failed to update request";
      })

      // remove user from group
      .addCase(removeUserFromGroup.pending, (state) => {
        state.loading = true;
      })
      .addCase(removeUserFromGroup.fulfilled, (state, action) => {
        state.loading = false;
        state.message = action.payload.message;
        state.users.members = state.users.members.filter(
          (member) => member._id !== action.payload.userId
        );
      })
      .addCase(removeUserFromGroup.rejected, (state, action) => {
        state.loading = false;
        state.error =
          action.error.message || "Failed to remove user from group";
      });
  },
});

const { resetGroup, clearGroupError } = groupSlice.actions;
export {
  resetGroup,
  clearGroupError,
  searchGroupsAction,
  createGroup,
  updateGroup,
  deleteGroup,
  getSingleGroup,
  toggleJoinRequest,
  updateGroupRequest,
  removeUserFromGroup,
};

export default groupSlice.reducer;
