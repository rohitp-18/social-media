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
import chatSlice from "./chat/chatSlice";
import jobsSlice from "./jobs/jobSlice";
import applyJobsSlice from "./jobs/applyJobsSlice";
import postSlice from "./utils/postSlice";
import groupSlice from "./group/groupSlice";
import searchHistorySlice from "./history/searchHistory";

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
    posts: postSlice,
    chats: chatSlice,
    jobs: jobsSlice,
    applyJobs: applyJobsSlice,
    group: groupSlice,
    searchHistory: searchHistorySlice,
  },
});

export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;

export default store;
