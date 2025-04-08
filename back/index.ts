import express, { Request, Response } from "express";
import dotenv from "dotenv";
import cors from "cors";
import cookieParser from "cookie-parser";

import mongodb from "./config/mongodb";
import userRouter from "./router/userRouter";
import path from "path";
import bodyParser from "body-parser";
import error from "./middleware/error";

dotenv.config({ path: path.resolve(path.join(__dirname, "./config/.env")) });
mongodb();

const app = express();

app.use(cors<Request>({ origin: "http://localhost:3000", credentials: true }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());

app.use("/api/v1/user", userRouter);
// app.use("/api/v1/code");

app.use(error);

app.listen(process.env.PORT, () => {
  console.log(`Server is running on http://localhost:${process.env.PORT}`);
});
