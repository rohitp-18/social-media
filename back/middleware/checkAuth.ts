import { Request, Response, NextFunction } from "express";
import expressAsyncHandler from "express-async-handler";
import ErrorHandler from "../utils/errorHandler";
import jwt from "jsonwebtoken";
import User from "../model/userModel";

const checkAuth = expressAsyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const { token } = req.cookies;

    if (!token) {
      return next();
    }

    let _id: any;
    _id = await jwt.verify(token, process.env.JWT_SECRET || "");

    if (!_id) {
      return next();
    }

    const user = await User.findById(_id);

    if (!user) {
      return next();
    }

    req.user = user;

    next();
  }
);

export default checkAuth;
