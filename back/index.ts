import express, { Request, Response } from "express";
import dotenv from "dotenv";
import cors from "cors";
import cookieParser from "cookie-parser";
import { v2 as cloudinary } from "cloudinary";
import morgan from "morgan";
import http from "http";

import mongodb from "./config/mongodb";
import path from "path";
import bodyParser from "body-parser";
import error from "./middleware/error";

import userRouter from "./router/userRouter";
import jobRouter from "./router/jobRouter";
import notificationRouter from "./router/notificationRouter";
import commentRouter from "./router/commentRouter";
import comapanyRouter from "./router/companyRouter";
import groupRouter from "./router/groupRouter";
import postRouter from "./router/postRouter";
import chatRouter from "./router/chatRouter";
import invitationRouter from "./router/invitationRouter";
import experienceRouter from "./router/experienceRouter";
import skillRouter from "./router/skillRouter";
import applyJobRouter from "./router/applyJobRouter";
import projectRouter from "./router/projectRouter";
import educationRouter from "./router/educationRouter";
import searchRouter from "./router/searchRouter";
import setupSocket from "./utils/socket";

dotenv.config({ path: path.resolve(path.join(__dirname, "./config/.env")) });
mongodb();

const app = express();

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_NAME,
  api_key: process.env.CLOUDINARY_KEY,
  api_secret: process.env.CLOUDINARY_SECRET,
});

const server = http.createServer(app);

app.use(cors<Request>({ origin: "http://localhost:3000", credentials: true }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(morgan("dev"));

app.use("/api/v1/user", userRouter);
app.use("/api/v1/jobs", jobRouter);
app.use("/api/v1/comments", commentRouter);
app.use("/api/v1/company", comapanyRouter);
app.use("/api/v1/groups", groupRouter);
app.use("/api/v1/posts", postRouter);
app.use("/api/v1/chat", chatRouter);
app.use("/api/v1/invitations", invitationRouter);
app.use("/api/v1/experiences", experienceRouter);
app.use("/api/v1/skills", skillRouter);
app.use("/api/v1/applyJobs", applyJobRouter);
app.use("/api/v1/projects", projectRouter);
app.use("/api/v1/notifications", notificationRouter);
app.use("/api/v1/educations", educationRouter);
app.use("/api/v1/search", searchRouter);

app.use(error);

setupSocket(server);

server.listen(process.env.PORT, () => {
  console.log(`Server is running on http://localhost:${process.env.PORT}`);
});
