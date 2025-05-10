import { NextFunction, Request, Response } from "express";
import ErrorHandler from "../utils/errorHandler";

const error = (
  err: ErrorHandler,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  let status = err.status || 500;
  let message = err.message || "Internal Server Error";
  res.status(status).json({
    success: false,
    message,
    stack: err.stack,
  });
};

export default error;
