"use client";

import { configureStore } from "@reduxjs/toolkit";
import userReducer from "./user/userSlice";
import locationReducer from "./utils/locationSlice";
import projectReducer from "./user/projectSlice";
import SkillReducer from "./skill/skillSlice";
import experienceReducer from "./user/experienceSlice";
import companyReducer from "./company/companySlice";
import educationReducer from "./user/educationSlice";
import searchReducer from "./search/allSearchSlice";
import userPostsReducer from "./user/userPostSlice";

const store = configureStore({
  reducer: {
    user: userReducer,
    location: locationReducer,
    project: projectReducer,
    skill: SkillReducer,
    experience: experienceReducer,
    company: companyReducer,
    education: educationReducer,
    search: searchReducer,
    userPosts: userPostsReducer,
  },
});

export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;

export default store;
