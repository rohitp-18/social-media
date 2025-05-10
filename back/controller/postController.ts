import expressAsyncHandler from "express-async-handler";
import { NextFunction, Request, Response } from "express";
import { v2 as cloudinary } from "cloudinary";

import ErrorHandler from "../utils/errorHandler";
import Post from "../model/postModel";
import User from "../model/userModel";
import Notification from "../model/notificationModel";
import Group from "../model/groupModel";
import Company from "../model/companyModel";

const createPost = expressAsyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const {
      name,
      description,
      location,
      externalLinks,
      postType,
      postControl,
      content,
      tags,
    } = req.body;

    // Check if all required fields are present
    if (
      !name ||
      !description ||
      !tags ||
      !location ||
      !externalLinks ||
      !postType ||
      !content
    ) {
      return next(new ErrorHandler("please fill all required fields", 400));
    }

    // Initialize postData object with fields from request body
    const postData: any = {
      name,
      description,
      tags,
      location,
      externalLinks,
      postType,
      userId: req.user._id,
      postControl,
      content,
      reactions: [], // Initialize empty reactions array
      images: [], // Initialize empty images array
    };

    // Handle image uploads if files are present in the request
    if (req.files) {
      Promise.all(
        req.files.map(async (val: any, i: number) => {
          // Convert file buffer to base64 string
          const b64 = Buffer.from(val.buffer).toString("base64");
          // Create data URI for Cloudinary upload
          let dataURI = "data:" + val.mimetype + ";base64," + b64;
          try {
            // Upload image to Cloudinary
            const data = await cloudinary.uploader.upload(dataURI, {
              folder: `post/${req.user.name}/${name}`, // Organize uploads by user and post name
              height: 200,
              crop: "pad",
            });
            // Add uploaded image info to postData
            postData.images = {
              public_id: data.public_id,
              url: data.secure_url,
              order: i, // Maintain original file order
            };
          } catch (error: any | unknown) {
            // Handle upload errors
            return next(new ErrorHandler(error, 501));
          }
        })
      );
    }
    // Create the post in the database using the prepared postData
    const post = await Post.create(postData);

    // If post creation fails, return an error
    if (!post) {
      return next(new ErrorHandler("Internal error", 500));
    }

    // send notification to following users and if its a group post then send to all group members if its a comapny post then send to all company members
    try {
      const user = await User.findById(req.user._id).populate(
        "following",
        "name email"
      );
      if (!user) throw new ErrorHandler("User not found", 404);
      const followers = user.followers.map(async (follower: any) => {
        const notification = await Notification.create({
          recipient: follower._id,
          sender: user._id,
          type: "post",
          message: `${user.name} has created a new post`,
          post: post._id,
          url: `/post/${post._id}`,
        });
      });
    } catch (error) {
      // dont send any errors to the user
    }

    // Return success response with created post object
    res.status(200).json({
      success: true,
      post,
      message: "post created successfully",
    });
  }
);

// create group or company post
const createGroupPost = expressAsyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const { name, description, location, externalLinks, postType, content } =
      req.body;

    // Check if all required fields are present
    if (!name || !description || !location || !externalLinks || !postType) {
      return next(new ErrorHandler("please fill all required fields", 400));
    }

    // Initialize postData object with fields from request body
    const postData: any = {
      name,
      description,
      location,
      externalLinks,
      postType,
      userId: req.user._id,
      content,
    };

    // Handle image uploads if files are present in the request
    if (req.files) {
      Promise.all(
        req.files.map(async (val: any, i: number) => {
          // Convert file buffer to base64 string
          const b64 = Buffer.from(val.buffer).toString("base64");
          // Create data URI for Cloudinary upload
          let dataURI = "data:" + val.mimetype + ";base64," + b64;
          try {
            // Upload image to Cloudinary
            const data = await cloudinary.uploader.upload(dataURI, {
              folder: `post/${req.user.name}/${name}`, // Organize uploads by user and post name
              height: 200,
              crop: "pad",
            });
            // Add uploaded image info to postData
            postData.images = {
              public_id: data.public_id,
              url: data.secure_url,
              order: i, // Maintain original file order
            };
          } catch (error: any | unknown) {
            // Handle upload errors
            return next(new ErrorHandler(error, 501));
          }
        })
      );
    }

    const group = await Group.findById(req.params.id).populate("members", [
      "name email",
    ]);

    if (!group) {
      return next(new ErrorHandler("Group not found", 404));
    }

    const isAdmin = group.admin.some(
      (admin) => admin._id.toString() === req.user._id.toString()
    );

    if (!isAdmin) {
      return next(
        new ErrorHandler("You are not authorized to create a post", 401)
      );
    }

    // Add group ID to postData
    postData.groupId = group._id;
    postData.postType = "group"; // Set post type to group

    // Create the post in the database using the prepared postData
    const post = await Post.create(postData);

    try {
      group.members.forEach(async (member: any) => {
        // Send notification to each group member
        const notification = await Notification.create({
          recipient: member._id,
          sender: req.user._id,
          type: "post",
          message: `${req.user.name} has created a new post in ${group.name}`,
          post: post._id,
          url: `/post/${post._id}`,
        });
      });
      group.admin.forEach(async (admin: any) => {
        // Send notification to each group member
        if (admin._id.toString() !== req.user._id.toString()) return;
        const notification = await Notification.create({
          recipient: admin._id,
          sender: req.user._id,
          type: "post",
          message: `${req.user.name} has created a new post in ${group.name}`,
          post: post._id,
          url: `/post/${post._id}`,
        });
      });
    } catch (error) {}

    // If post creation fails, return an error
    if (!post) {
      return next(new ErrorHandler("Internal error", 500));
    }

    // Return success response with created post object
    res.status(200).json({
      success: true,
      post,
      message: "post created successfully",
    });
  }
);

const companyPost = expressAsyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const { name, description, location, externalLinks, postType, content } =
      req.body;

    // Check if all required fields are present
    if (!name || !description || !location || !externalLinks || !postType) {
      return next(new ErrorHandler("please fill all required fields", 400));
    }

    // Initialize postData object with fields from request body
    const postData: any = {
      name,
      description,
      location,
      externalLinks,
      postType,
      userId: req.user._id,
      content,
    };

    // Handle image uploads if files are present in the request
    if (req.files) {
      Promise.all(
        req.files.map(async (val: any, i: number) => {
          // Convert file buffer to base64 string
          const b64 = Buffer.from(val.buffer).toString("base64");
          // Create data URI for Cloudinary upload
          let dataURI = "data:" + val.mimetype + ";base64," + b64;
          try {
            // Upload image to Cloudinary
            const data = await cloudinary.uploader.upload(dataURI, {
              folder: `post/${req.user.name}/${name}`, // Organize uploads by user and post name
              height: 200,
              crop: "pad",
            });
            // Add uploaded image info to postData
            postData.images = {
              public_id: data.public_id,
              url: data.secure_url,
              order: i, // Maintain original file order
            };
          } catch (error: any | unknown) {
            // Handle upload errors
            return next(new ErrorHandler(error, 501));
          }
        })
      );
    }

    const company = await Company.findById(req.params.id).populate("members", [
      "name email",
    ]);

    if (!company || company.isDeleted) {
      return next(new ErrorHandler("Group not found", 404));
    }

    const isAdmin = company.admin.some(
      (admin) => admin._id.toString() === req.user._id.toString()
    );

    if (!isAdmin) {
      return next(
        new ErrorHandler("You are not authorized to create a post", 401)
      );
    }

    // Add group ID to postData
    postData.groupId = company._id;
    postData.postType = "company"; // Set post type to group

    // Create the post in the database using the prepared postData
    const post = await Post.create(postData);

    try {
      company.members.forEach(async (member: any) => {
        // Send notification to each group member
        const notification = await Notification.create({
          recipient: member._id,
          sender: req.user._id,
          type: "post",
          message: `${req.user.name} has created a new post in ${company.name}`,
          post: post._id,
          url: `/post/${post._id}`,
        });
      });
      company.admin.forEach(async (admin: any) => {
        // Send notification to each group member
        if (admin._id.toString() !== req.user._id.toString()) return;
        const notification = await Notification.create({
          recipient: admin._id,
          sender: req.user._id,
          type: "post",
          message: `${req.user.name} has created a new post in ${company.name}`,
          post: post._id,
          url: `/post/${post._id}`,
        });
      });
    } catch (error) {}
    // Handle notification errors silently

    // If post creation fails, return an error

    if (!post) {
      return next(new ErrorHandler("Internal error", 500));
    }

    // Return success response with created post object
    res.status(200).json({
      success: true,
      post,
      message: "post created successfully",
    });
  }
);

/**
 * Fetches all posts with user information
 * GET /api/posts
 */
const getAllPosts = expressAsyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    // Retrieve all posts and populate with user details
    const posts = await Post.find({ isDeleted: false }).populate(
      "userId",
      "name email"
    );

    // Handle case when posts retrieval fails
    if (!posts) {
      return next(new ErrorHandler("Internal error", 500));
    }

    // Return success response with all posts
    res.status(200).json({
      success: true,
      posts,
      message: "posts fetched successfully",
    });
  }
);

/**
 * Fetches a single post by ID
 * GET /api/posts/:id
 */
const getSinglePost = expressAsyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const postId = req.params.id;

    // Find post by ID and include user details
    const post = await Post.findById(postId).populate("userId", "name email");

    // Handle case when post is not found
    if (!post || post.isDeleted) {
      return next(new ErrorHandler("Internal error", 500));
    }

    // Return success response with post data
    res.status(200).json({
      success: true,
      post,
      message: "post fetched successfully",
    });
  }
);

/**
 * Fetches all posts by a specific user
 * GET /api/posts/user/:id
 */
const getUserPosts = expressAsyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const userId = req.params.id;

    // Find all posts by user ID and include user details
    const posts = await Post.find({ userId }).populate("userId", "name email");

    // Handle case when posts retrieval fails
    if (!posts) {
      return next(new ErrorHandler("Internal error", 500));
    }

    // Return success response with user's posts
    res.status(200).json({
      success: true,
      posts,
      message: "posts fetched successfully",
    });
  }
);

/**
 * Deletes a post by ID
 * DELETE /api/posts/:id
 */
const deletePost = expressAsyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const postId = req.params.id;

    // Find the post to be deleted
    const post = await Post.findById(postId);

    // Check if post exists
    if (!post || post.isDeleted) {
      return next(new ErrorHandler("Post not found", 404));
    }

    // Verify post ownership before deletion
    if (post.userId.toString() !== req.user._id.toString()) {
      return next(new ErrorHandler("Not authorized", 401));
    }

    // Delete the post
    post.isDeleted = true;

    // Return success response
    res.status(200).json({
      success: true,
      message: "post deleted successfully",
    });
  }
);

/**
 * Updates a post by ID
 * PUT /api/posts/:id
 */
const updatePost = expressAsyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const postId = req.params.id;

    // Find the post to be updated
    const post = await Post.findById(postId);

    // Check if post exists
    if (!post || post.isDeleted) {
      return next(new ErrorHandler("Post not found", 404));
    }

    // Verify post ownership before update
    if (post.userId.toString() !== req.user._id.toString()) {
      return next(new ErrorHandler("Not authorized", 401));
    }

    // Update the post with new data
    const updatedPost = await Post.findByIdAndUpdate(postId, req.body, {
      new: true, // Return updated document
      runValidators: true, // Run validators on update
    });

    // Return success response with updated post
    res.status(200).json({
      success: true,
      updatedPost,
      message: "post updated successfully",
    });
  }
);

/**
 * Toggles like status on a post
 * POST /api/posts/like
 */
const toggleLike = expressAsyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    // Extract post ID from request body
    const { postId } = req.body;
    // Get current user's ID from auth middleware
    const userId = req.user._id;

    // Find the target post in database
    const post = await Post.findById(postId);
    // Check if post exists and is not deleted
    if (!post || post.isDeleted) {
      return next(new ErrorHandler("Post not found", 404));
    }

    // Check if user has already liked this post
    const isLiked = post.likes.find(
      (like) => like._id.toString() === userId.toString()
    );

    // Toggle like status: unlike if already liked, like if not already liked
    if (isLiked) {
      // Remove user's ID from likes array
      post.likes.pull({ _id: userId });
      // Decrement like count
      post.likeCount = post.likeCount - 1;
    } else {
      // Add user's ID to likes array
      post.likes.push({ _id: userId });
      // Increment like count
      post.likeCount = post.likeCount + 1;
    }

    // Save the updated post to database
    await post.save();

    // Return success response
    res.status(200).json({
      success: true,
      message: isLiked
        ? "Post unliked successfully"
        : "Post liked successfully",
      likeCount: post.likeCount,
    });
  }
);

/**
 * Fetches all posts liked by a specific user
 * GET /api/posts/liked/:id
 */
const getLikedPosts = expressAsyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const userId = req.params.id;

    // Find all posts liked by the user
    const posts = await Post.find({ likes: { $in: [userId] } }).populate(
      "userId",
      "name email"
    );

    // Handle case when posts retrieval fails
    if (!posts) {
      return next(new ErrorHandler("Internal error", 500));
    }

    // Return success response with liked posts
    res.status(200).json({
      success: true,
      posts,
      message: "posts fetched successfully",
    });
  }
);

// Exporting all the functions to be used in the routes
export {
  createPost,
  getAllPosts,
  getSinglePost,
  getUserPosts,
  deletePost,
  updatePost,
  // likes
  toggleLike,
  getLikedPosts,
};
