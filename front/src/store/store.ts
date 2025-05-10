"use client";

import { configureStore } from "@reduxjs/toolkit";
import userReducer from "./user/userSlice";
import locationReducer from "./utils/locationSlice";

const store = configureStore({
  reducer: {
    user: userReducer,
    location: locationReducer,
  },
});

export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;

export default store;
