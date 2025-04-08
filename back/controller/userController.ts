import expressAsyncHandler from "express-async-handler";
import { NextFunction, Request, Response } from "express";
import { v2 as cloudinary } from "cloudinary";

import User from "../model/userModel";
import ErrorHandler from "../utils/errorHandler";
import sendToken from "../utils/sendToken";

const getUsers = expressAsyncHandler(async (req: Request, res: Response) => {
  sendToken(res, req.user);
});

const loginUser = expressAsyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const { email, password } = req.body;

    if (!email || !password) {
      return next(new ErrorHandler("Please fill all required fields", 403));
    }

    const user: any = await User.findOne({ email }).select("+password");

    if (!user) {
      return next(new ErrorHandler("Invalid Email and Password", 403));
    }

    // check password is correct or wrong
    const isPass = await user.comparePassword(password);
    if (!isPass) {
      return next(new ErrorHandler("Invalid Email and password", 403));
    }

    const user2 = await User.findOne({ email });

    sendToken(res, user2);
  }
);

const registerUser = expressAsyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return next(new ErrorHandler("Please fill all required fields", 403));
    }

    const tempUser = await User.findOne({ email });

    // email already exist or not
    if (tempUser) {
      return next(new ErrorHandler("Email already exists", 403));
    }

    const user = await User.create({ name, email, password });

    // check user is created or not
    if (!user) {
      return next(new ErrorHandler("Internal Error", 500));
    }

    sendToken(res, user);
  }
);

const updateProfile = expressAsyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const { name } = req.body;

    if (!name) {
      return next(new ErrorHandler("Please fill all required fields", 403));
    }

    let user = await User.findById(req.user._id);

    if (!user) {
      return next(new ErrorHandler("User not found", 404));
    }

    let form: { name: string; avatar?: { public_id: string; url: string } } = {
      name,
    };

    if (req.file) {
      const b64 = Buffer.from(req.file.buffer).toString("base64");
      let dataURI = "data:" + req.file.mimetype + ";base64," + b64;
      try {
        const data = await cloudinary.uploader.upload(dataURI, {
          folder: `vip/user/${name}`,
          height: 200,
          crop: "pad",
        });
        form = {
          ...form,
          avatar: { public_id: data.public_id, url: data.secure_url },
        };
      } catch (error: any | unknown) {
        return next(new ErrorHandler(error, 501));
      }
    }

    user = await User.findByIdAndUpdate(req.user._id, form, {
      new: true,
      runValidators: true,
      useFindAndModify: false,
    });

    res.status(200).json({
      success: true,
      message: "Profile updated successfully",
      user,
    });
  }
);

const logoutUser = expressAsyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    res
      .cookie("token", null, {
        expires: new Date(Date.now()),
        httpOnly: true,
      })
      .status(200)
      .json({
        success: true,
        message: "Logged out successfully",
      });
  }
);

export { getUsers, loginUser, registerUser, updateProfile, logoutUser };
