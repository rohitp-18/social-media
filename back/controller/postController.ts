import expressAsyncHandler from "express-async-handler";
import { NextFunction, Request, Response } from "express";
import { v2 as cloudinary } from "cloudinary";

import User from "../model/userModel";
import ErrorHandler from "../utils/errorHandler";
import sendToken from "../utils/sendToken";
import Post from "../model/postModel";

const createPost = expressAsyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const {
      name,
      description,
      tags,
      location,
      externalLinks,
      postType,
      postControl,
    } = req.body;

    if (!name) {
      return next(new ErrorHandler("please fill all required fields", 400));
    }

    const postData: any = {
      name,
      description,
      tags,
      location,
      externalLinks,
      postType,
      postControl,
      images: [],
    };

    if (req.files) {
      Promise.all(
        req.files.map(async (val: any, i: number) => {
          const b64 = Buffer.from(val.buffer).toString("base64");
          let dataURI = "data:" + val.mimetype + ";base64," + b64;
          try {
            const data = await cloudinary.uploader.upload(dataURI, {
              folder: `post/${req.user.name}/${name}`,
              height: 200,
              crop: "pad",
            });
            postData.images = {
              public_id: data.public_id,
              url: data.secure_url,
              order: i,
            };
          } catch (error: any | unknown) {
            return next(new ErrorHandler(error, 501));
          }
        })
      );
    }

    const post = await Post.create(postData);

    if (!post) {
      return next(new ErrorHandler("Internal error", 500));
    }

    res.status(200).json({
      success: true,
      post,
      message: "post created successfully",
    });
  }
);
