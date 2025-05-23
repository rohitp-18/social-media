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
import Media from "../model/mediaModel";
import Experience from "../model/experienceModel";
import Education from "../model/educationModel";

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
    const { name, website, headline, location, pronouns } = req.body;

    if (!name) {
      return next(new ErrorHandler("Please fill all required fields", 403));
    }

    let user = await User.findById(req.user._id);

    if (!user) {
      return next(new ErrorHandler("User not found", 404));
    }

    let form: any = {
      website: JSON.parse(website),
      name,
      headline,
      location: JSON.parse(location),
      pronouns,
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
    const { remove } = req.body;

    let user = await User.findById(req.user._id);

    if (!user) {
      return next(new ErrorHandler("User not found", 404));
    }

    if (remove === "true") {
      if (user.bannerImage && user.bannerImage.public_id) {
        await cloudinary.uploader.destroy(user.bannerImage.public_id);
      }
      user = await User.findByIdAndUpdate(
        req.user._id,
        { bannerImage: { public_id: "", url: "" } },
        {
          new: true,
          runValidators: true,
          useFindAndModify: false,
        }
      );

      return next(
        res.status(200).json({
          success: true,
          message: "Banner removed successfully",
          user,
        })
      );
    }

    if (!req.file) {
      return next(new ErrorHandler("Please upload a banner image", 403));
    }

    if (user.bannerImage && user.bannerImage.public_id) {
      await cloudinary.uploader.destroy(user.bannerImage.public_id);
    }

    let form: any = {
      bannerImage: { public_id: "", url: "" },
    };

    if (req.file) {
      const b64 = Buffer.from(req.file.buffer).toString("base64");
      let dataURI = "data:" + req.file.mimetype + ";base64," + b64;
      try {
        const data = await cloudinary.uploader.upload(dataURI, {
          folder: `vip/user/${user.name}`,
          height: 200,
          crop: "pad",
        });
        form.bannerImage = { public_id: data.public_id, url: data.secure_url };
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
      .populate("skills.skill", "name")
      .populate("groups", "name")
      .populate("companies", "name")
      .populate("followers", "name avatar headline username")
      .populate("following", "name avatar headline username");

    if (!user) {
      return next(new ErrorHandler("User not found", 404));
    }
    const posts = await Post.find({ userId: user._id }).populate(
      "userId",
      "name headline bannerImage avatar"
    );

    const comments = await Comment.find({ user: user._id });

    const experiences = await Experience.find({
      user: user._id,
      isDeleted: false,
    })
      .populate("skills")
      .limit(2);

    const projects = await Project.find({ user: user._id, isDeleted: false })
      .populate("skills")
      .limit(2);

    const educations = await Education.find({
      user: user._id,
      isDeleted: false,
    })
      .populate("skills")
      .limit(2);

    const media = await Media.find({ user: user._id, isDeleted: false }).limit(
      10
    );

    res.status(200).json({
      success: true,
      user,
      posts,
      comments,
      projects,
      media,
      experiences,
      educations,
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

const updateUserAbout = expressAsyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const { about } = req.body;

    if (!about) {
      return next(new ErrorHandler("Please fill all required fields", 403));
    }

    const user = await User.findByIdAndUpdate(
      req.user._id,
      { about },
      {
        new: true,
        runValidators: true,
        useFindAndModify: false,
      }
    );

    res.status(200).json({
      success: true,
      message: "About updated successfully",
      user,
    });
  }
);

const changeLanguage = expressAsyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const { language } = req.body;

    if (!language) {
      return next(new ErrorHandler("Please fill all required fields", 403));
    }

    const user = await User.findByIdAndUpdate(
      req.user._id,
      { language },
      {
        new: true,
        runValidators: true,
        useFindAndModify: false,
      }
    );

    res.status(200).json({
      success: true,
      message: "Language updated successfully",
      user,
      language,
    });
  }
);

const checkUsernameAvailable = expressAsyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const { username } = req.body;

    if (!username) {
      return next(new ErrorHandler("Please fill all required fields", 403));
    }

    const user = await User.findOne({
      username,
    });

    if (user) {
      return next(new ErrorHandler("Username already exists", 403));
    }

    res.status(200).json({
      success: true,
      message: "Username available",
    });
  }
);

const changeUsername = expressAsyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const { username } = req.body;

    if (!username) {
      return next(new ErrorHandler("Please fill all required fields", 403));
    }

    const tempUser = await User.findOne({
      username,
    });

    if (tempUser) {
      return next(new ErrorHandler("Username already exists", 403));
    }

    const user = await User.findByIdAndUpdate(
      req.user._id,
      { username },
      {
        new: true,
        runValidators: true,
        useFindAndModify: false,
      }
    );

    res.status(200).json({
      success: true,
      message: "Username updated successfully",
      user,
    });
  }
);

const userActivities = expressAsyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const userId = req.params.id || req.user?._id;
    if (!userId) {
      return next(new ErrorHandler("User ID is required", 400));
    }

    const user = await User.findOne({ username: userId, deleted: false });

    if (!user) {
      return next(new ErrorHandler("User not found", 404));
    }

    // Fetch recent posts, comments, and projects by the user
    const posts = await Post.find({ userId: user._id, isDeleted: false })
      .sort({
        createdAt: -1,
      })
      .populate("userId", "name headline bannerImage avatar");

    const comments = await Comment.find({
      user: user._id,
      isDeleted: false,
    })
      .sort({
        createdAt: -1,
      })
      .populate("user", "name headline bannerImage avatar");

    const images = await Media.find({
      user: user._id,
      isDeleted: false,
      type: "image",
    }).sort({
      createdAt: -1,
    });

    const videos = await Media.find({
      user: user._id,
      isDeleted: false,
      type: "video",
    }).sort({
      createdAt: -1,
    });

    let isFollowing;

    if (req.user) {
      req.user.following.forEach((u: any) => {
        if (u.toString() === (user._id as string).toString()) {
          isFollowing = true;
        }
      });

      if (!isFollowing) {
        if (req.user._id.toString() === (user._id as string).toString()) {
          isFollowing = true;
        }
      }
    }

    res.status(200).json({
      success: true,
      activities: {
        posts,
        comments,
        images,
        videos,
      },
      isFollowing,
    });
  }
);

const recommendationsUser = expressAsyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const user = await User.findById(req.user._id);

    if (!user) {
      return next(new ErrorHandler("User not found", 404));
    }

    const users = await User.find({
      _id: { $ne: user._id, $nin: user.following }, // Exclude self and already-followed users
      $or: [
        {
          skills: { $in: user.skills },
        },
        {
          headline: {
            $regex: user.headline ? user.headline.split(/\s+/).join("|") : "",
            $options: "i",
          }, // Contain headline words/phrases
        },
        {
          about: {
            $regex: user.about ? user.about.split(/\s+/).join("|") : "",
            $options: "i",
          }, // Contain about words/phrases
        },
      ], // Find users with similar skills
      deleted: false,
      isDeleted: false,
    })
      .populate("followers", "name avatar headline username")
      .populate("following", "name avatar headline username")
      .limit(10);

    res.status(200).json({
      success: true,
      users,
    });
  }
);

const followUser = expressAsyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;

    const tempUser = await User.findOne({ _id: id, deleted: false });

    if (!tempUser) {
      return next(new ErrorHandler("User not found", 404));
    }

    if (req.user?._id.toString() === (tempUser._id as string).toString()) {
      return next(new ErrorHandler("You cannot follow yourself", 400));
    }

    const user = await req.user?.following.find(
      (user: any) => user._id.toString() === (tempUser._id as string).toString()
    );

    const loginUser = await User.findById(req.user._id);

    if (!loginUser) {
      return next(new ErrorHandler("User not found", 404));
    }

    if (user) {
      loginUser.following = loginUser.following.filter(
        (user: any) => user.toString() !== (tempUser._id as string).toString()
      );
      tempUser.followers = tempUser.followers.filter(
        (user: any) => user.toString() !== (loginUser._id as string).toString()
      );
      tempUser.totalFollowers = tempUser.followers.length;
      loginUser.totalFollowing = loginUser.following.length;

      await loginUser.save();
      await tempUser.save();

      res.status(200).json({
        success: true,
        follow: false,
        userId: tempUser._id,
        message: "Unfollowed successfully",
      });
    } else {
      loginUser.following.push(tempUser._id as any);
      tempUser.followers.push(loginUser._id as any);

      tempUser.totalFollowers = tempUser.followers.length;
      loginUser.totalFollowing = loginUser.following.length;

      await loginUser.save();
      await tempUser.save();

      res.status(200).json({
        success: true,
        follow: true,
        userId: tempUser._id,
        message: "Followed successfully",
      });
    }
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
  updateUserAbout,
  changeLanguage,
  checkUsernameAvailable,
  changeUsername,
  getFollowers,
  userActivities,
  recommendationsUser,
  followUser,
};
