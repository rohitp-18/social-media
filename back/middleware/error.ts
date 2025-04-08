import { NextFunction, Request, Response } from "express";
import ErrorHandler from "../utils/errorHandler";

const error = (
  err: ErrorHandler,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  res.status(err.status).json({
    success: false,
    message: err.message,
    stack: err.stack,
  });
};

export default error;
