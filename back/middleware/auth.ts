import { NextFunction, Request, Response } from "express";
import expressAsyncHandler from "express-async-handler";
import ErrorHandler from "../utils/errorHandler";
import jwt from "jsonwebtoken";
import User from "../model/userModel";

declare global {
  namespace Express {
    interface Request {
      user: any;
      files?: any;
      file?: any;
    }
  }
}

const auth = expressAsyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const { token } = req.cookies;

    if (!token) {
      return next(new ErrorHandler("Please Login first", 403));
    }

    let _id: any;
    try {
      _id = await jwt.verify(token, process.env.JWT_SECRET || "");
    } catch (error: any) {
      res.clearCookie("token");
      return next(new ErrorHandler(error.message, 403));
    }

    if (!_id) {
      res.clearCookie("token");
      return next(new ErrorHandler("Please Login first", 403));
    }

    const user = await User.findById(_id);

    if (!user) {
      res.clearCookie("token");
      return next(new ErrorHandler("Please Login first", 403));
    }

    req.user = user;

    next();
  }
);

const authorizeRole = (...roles: any) => {
  return (req: Request, next: NextFunction) => {
    if (!roles.includes(req.user.role)) {
      return next(new ErrorHandler("Unothorized user", 404));
    }
    next();
  };
};

export { auth, authorizeRole };
