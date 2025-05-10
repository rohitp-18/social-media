import expressAsyncHandler from "express-async-handler";
import { NextFunction, Request, Response } from "express";
import { v2 as cloudinary } from "cloudinary";

import User from "../model/userModel";
import ErrorHandler from "../utils/errorHandler";
import sendToken from "../utils/sendToken";
import Company from "../model/companyModel";
import Post from "../model/postModel";
import Project from "../model/projectModel";
import Comment from "../model/commentModel";

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

    // generate username using name and email
    let username = `${name.split(" ")[0]}${email.split("@")[0]}`;
    const tempUser2 = await User.findOne({ username });

    // username already exist or not
    // if username already exist then generate new username using name and email
    if (tempUser2) {
      const randomNumber = Math.floor(Math.random() * 1000);
      const newUsername = `${name.split(" ")[0]}${
        email.split("@")[0]
      }${randomNumber}`;
      let tempUser3 = await User.findOne({ username: newUsername });
      while (tempUser3) {
        const randomNumber = Math.floor(Math.random() * 1000);
        const newUsername = `${name.split(" ")[0]}${
          email.split("@")[0]
        }${randomNumber}`;
        tempUser3 = await User.findOne({ username: newUsername });
      }
      username = newUsername;
    }

    if (tempUser2) {
      return next(new ErrorHandler("Username already exists", 403));
    }

    const user = await User.create({ name, email, password, username });

    // check user is created or not
    if (!user) {
      return next(new ErrorHandler("Internal Error", 500));
    }

    next(sendToken(res, user));
  }
);

const updateProfile = expressAsyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const { name, website } = req.body;

    if (!name) {
      return next(new ErrorHandler("Please fill all required fields", 403));
    }

    let user = await User.findById(req.user._id);

    if (!user) {
      return next(new ErrorHandler("User not found", 404));
    }

    let form: any = {
      website,
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

const updateBanner = expressAsyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const { name } = req.body;

    if (!name) {
      return next(new ErrorHandler("Please fill all required fields", 403));
    }

    let user = await User.findById(req.user._id);

    if (!user) {
      return next(new ErrorHandler("User not found", 404));
    }

    let form: { name: string; banner?: { public_id: string; url: string } } = {
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
          banner: { public_id: data.public_id, url: data.secure_url },
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
      message: "Banner updated successfully",
      user,
    });
  }
);

const getUserProfile = expressAsyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const tempUser = await User.findOne({ username: req.params.id });

    if (!tempUser) {
      return next(new ErrorHandler("User not found", 404));
    }

    const user = await User.findOne({ username: req.params.id })
      .populate("skills._id", "name")
      .populate("groups", "name")
      .populate("companies", "name")
      .populate("newsLetter", "name")
      .populate("projects")
      .populate("experience._id")
      .populate("followers._id", "name avatar headline username")
      .populate("following._id", "name avatar headline username");

    if (!user) {
      return next(new ErrorHandler("User not found", 404));
    }
    const posts = await Post.find({ userId: user._id });

    const comments = await Comment.find({ user: user._id });

    res.status(200).json({
      success: true,
      user,
      posts,
      comments,
    });
  }
);

const getUserPosts = expressAsyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const user = await User.findById(req.params.id);

    if (!user) {
      return next(new ErrorHandler("User not found", 404));
    }

    const posts = await Post.find({ user: req.params.id })
      .populate("user", "name avatar headline username")
      .populate("likes._id", "name avatar headline username")
      .populate("comments._id", "text user")
      .sort("-createdAt");

    res.status(200).json({
      success: true,
      posts,
    });
  }
);

const getUserProjects = expressAsyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const user = await User.findById(req.params.id);

    if (!user) {
      return next(new ErrorHandler("User not found", 404));
    }

    const projects = await Project.find({ user: req.params.id })
      .populate("user", "name avatar headline username")
      .populate("likes._id", "name avatar headline username")
      .populate("comments._id", "text user")
      .sort("-createdAt");

    res.status(200).json({
      success: true,
      projects,
    });
  }
);

const getUserComments = expressAsyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const user = await User.findById(req.params.id);

    if (!user) {
      return next(new ErrorHandler("User not found", 404));
    }

    const comments = await Comment.find({ user: req.params.id })
      .populate("user", "name avatar headline username")
      .populate("likes._id", "name avatar headline username")
      .populate("comments._id", "text user")
      .sort("-createdAt");

    res.status(200).json({
      success: true,
      comments,
    });
  }
);

// construct the user controller find users of followers followers like linkedIn 2nd, 3rd users
const getFollowers = expressAsyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const user = await User.findById(req.params.id);

    if (!user) {
      return next(new ErrorHandler("User not found", 404));
    }

    const followers = await User.find({ _id: { $in: user.followers } })
      .populate("followers._id", "name avatar headline username")
      .populate("following._id", "name avatar headline username")
      .sort("-createdAt");

    res.status(200).json({
      success: true,
      followers,
    });
  }
);

export {
  getUsers,
  loginUser,
  registerUser,
  updateProfile,
  logoutUser,
  updateBanner,
  getUserProfile,
  getUserPosts,
  getUserProjects,
  getUserComments,
};
