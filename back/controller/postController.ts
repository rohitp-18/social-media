import expressAsyncHandler from "express-async-handler";
import { NextFunction, Request, Response } from "express";
import { v2 as cloudinary } from "cloudinary";

import ErrorHandler from "../utils/errorHandler";
import Post from "../model/postModel";
import User from "../model/userModel";
import Notification from "../model/notificationModel";
import Group from "../model/groupModel";
import Company from "../model/companyModel";
import Media from "../model/mediaModel";
import { isArray, isNullOrUndefined } from "util";

const createPost = expressAsyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const {
      location,
      postType,
      content,
      tags,
      privacyControl,
      externalLinks,
      origin,
    } = req.body;

    // Check if all required fields are present
    if (!location || !postType || !content) {
      return next(new ErrorHandler("please fill all required fields", 400));
    }

    if (req.files.length > 5) {
      return next(new ErrorHandler("You can only upload 5 images", 400));
    }

    if (postType === "group") {
      let group = await Group.findOne({ _id: origin, isDeleted: false });
      if (!group || group.isDeleted) {
        return next(new ErrorHandler("Group not found", 404));
      }
      if (
        group.members.some(
          (member: any) => member._id.toString() === req.user._id.toString()
        ) === false ||
        group.admin.some(
          (admin: any) => admin._id.toString() === req.user._id.toString()
        ) === false
      )
        return next(new ErrorHandler("Group not found", 404));
    } else if (postType === "company") {
      let company = await Company.findOne({ _id: origin, isDeleted: false });
      if (!company || company.isDeleted) {
        return next(new ErrorHandler("Company not found", 404));
      }
      if (
        company.admin.some(
          (admin: any) => admin._id.toString() === req.user._id.toString()
        ) === false
      ) {
        return next(new ErrorHandler("Company not found", 404));
      }
    }

    // Initialize postData object with fields from request body
    const postData: any = {
      location,
      postType,
      userId: req.user._id,
      privacyControl,
      externalLinks: await JSON.parse(externalLinks),
      content,
      tags,
      origin,
      images: [],
      video: null,
    };
    // Handle image uploads if files are present in the request
    if (req.files) {
      await Promise.all(
        await req.files.map(async (val: any, i: number) => {
          // Convert file buffer to base64 string
          const b64 = Buffer.from(val.buffer).toString("base64");
          // Create data URI for Cloudinary upload
          let dataURI = "data:" + val.mimetype + ";base64," + b64;

          console.log(val.mimetype);
          // Upload image to Cloudinary
          if (val.mimetype.startsWith("image/")) {
            try {
              const data = await cloudinary.uploader.upload(dataURI, {
                folder: `post/${req.user.username}`, // Organize uploads by user and post name
                height: 200,
                crop: "pad",
              });
              postData.images.push({
                public_id: data.public_id,
                url: data.secure_url,
                order: i, // Maintain original file order
              });
            } catch (error: any | unknown) {
              return next(new ErrorHandler(error, 501));
            }
          } else if (val.mimetype.startsWith("video/")) {
            const b64 = Buffer.from(val.buffer).toString("base64");
            let dataURI = "data:" + val.mimetype + ";base64," + b64;
            try {
              const data = await cloudinary.uploader.upload(dataURI, {
                folder: `post/${req.user.username}`,
                resource_type: "video",
              });
              postData.video = {
                public_id: data.public_id,
                url: data.secure_url,
              };
            } catch (error: any | unknown) {
              return next(new ErrorHandler(error.message, 501));
            }
          } else {
            return next(new ErrorHandler("Unsupported file type", 400));
          }
        })
      );
    }

    const post = await Post.create(postData);
    if (!post) {
      return next(new ErrorHandler("Failed to create post", 500));
    }

    // send notification to following users and if its a group post then send to all group members if its a company post then send to all company members
    try {
      const company =
        postType === "company"
          ? await Company.findOne({ _id: origin, isDeleted: false })
          : null;
      const group =
        postType === "group"
          ? await Group.findOne({ _id: origin, isDeleted: false })
          : null;

      if (postType === "group" && group === null) {
        return next(new ErrorHandler("Group not found", 404));
      }
      if (postType === "company" && company === null) {
        return next(new ErrorHandler("Company not found", 404));
      }
      const combinedUsers = [
        ...req.user.followers,
        ...req.user.connections,
        ...(postType === "group" && group
          ? [...group.members, ...group.admin]
          : []),
        ...(postType === "company" && company
          ? [...company.members, ...company.admin, ...company.followers]
          : []),
        ...post.tags,
      ];
      const listOfUsers = combinedUsers
        .filter((u) => u.toString() !== req.user._id.toString())
        .filter(
          (u, index, self) =>
            index === self.findIndex((item) => item.toString() === u.toString())
        );

      if (company !== null && postType === "company") {
        company.posts.push({ post: post._id, user: req.user._id });
        await company.save();
      }

      if (group !== null && postType === "group") {
        group.posts.push({ post: post._id, user: req.user._id });
        await group.save();
      }

      await Notification.create(
        listOfUsers.map((u: any) => ({
          recipient: u,
          sender: req.user._id,
          post: post._id,
          type: "post",
          message:
            postType === "user"
              ? `${req.user.name} has created a new post`
              : `${req.user.name} has created a new ${postType} post of ${
                  postType === "group" ? group?.name : company?.name
                }`,
          link: `/post/${post._id}`,
          relatedId: post._id,
          refModel: "post",
        }))
      );
    } catch (error) {
      await post.save();
      console.log(error);
      return next(new ErrorHandler("Failed to send notifications", 500));
    }

    try {
      if (post.video?.url) {
        await Media.create({
          user: req.user._id,
          type: "video",
          url: post.video.url,
          thumbnail: post.video,
          post: post._id,
        });
      } else {
        await Media.create(
          post.images.map((img: any) => ({
            user: req.user._id,
            type: "image",
            url: img.url,
            thumbnail: img.url,
            post: post._id,
          }))
        );
      }
    } catch (error) {
      await post.save();
      return next(new ErrorHandler("Failed to save media", 500));
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
 * GET /api/v1/posts
 */
const getAllPosts = expressAsyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    // Retrieve all posts and populate with user details

    let posts = await Post.find({ isDeleted: false }).populate(
      "userId",
      "name email avatar headline"
    );

    // Handle case when posts retrieval fails
    if (!posts) {
      return next(new ErrorHandler("Internal error", 500));
    }

    // check is liked by user or not
    const postsWithIsLike = posts.map((post: any) => {
      const isLike = post.likes.includes(req.user?._id);
      return { ...post.toObject(), isLike };
    });

    // Return success response with all posts
    res.status(200).json({
      success: true,
      posts: postsWithIsLike,
      message: "posts fetched successfully",
    });
  }
);

/**
 * Fetches a single post by ID
 * GET /api/v1/posts/:id
 */
const getSinglePost = expressAsyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const postId = req.params.id;

    // Find post by ID and include user details
    const post = await Post.findById(postId)
      .populate("userId", "name email avatar headline")
      .populate("origin", "name avatar headline username isDeleted ");

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
 * GET /api/v1/posts/user/:id
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
 * DELETE /api/v1/posts/:id
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
 * PUT /api/v1/posts/:id
 */
const updatePost = expressAsyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const postId = req.params.id;
    const {
      location,
      postType,
      content,
      tags,
      privacyControl,
      externalLinks,
      images,
      video,
    } = req.body;

    // Check if all required fields are present
    if (!location || !postType || !content) {
      return next(new ErrorHandler("please fill all required fields", 400));
    }

    if (req.files.length > 5) {
      return next(new ErrorHandler("You can only upload 5 images", 400));
    }

    // Initialize postData object with fields from request body
    const postData: any = {
      location,
      postType,
      images: (images && JSON.parse(images)) || [],
      privacyControl,
      externalLinks: (externalLinks && JSON.parse(externalLinks)) || [],
      content,
      tags,
    };

    if (req.files) {
      await Promise.all(
        req.files.map(async (val: any, i: number) => {
          if (val.mimepostType === "video/*") {
            const b64 = Buffer.from(val.buffer).toString("base64");
            let dataURI = "data:" + val.mimetype + ";base64," + b64;
            const data = await cloudinary.uploader.upload(dataURI, {
              folder: `post/${req.user.username}/${postId}`,
              resource_type: "video",
            });
            postData.video = {
              public_id: data.public_id,
              url: data.secure_url,
            };
            await Media.create({
              user: req.user._id,
              type: "video",
              url: data.secure_url,
              thumbnail: data.secure_url,
              post: postId,
            });
          } else {
            // Convert file buffer to base64 string
            const b64 = Buffer.from(val.buffer).toString("base64");
            // Create data URI for Cloudinary upload
            let dataURI = "data:" + val.mimetype + ";base64," + b64;
            // Upload image to Cloudinary
            const data = await cloudinary.uploader.upload(dataURI, {
              folder: `post/${req.user.username}/${postId}`, // Organize uploads by user and post name
              height: 200,
              crop: "pad",
            });
            // Add uploaded image info to postData
            postData.images.push({
              public_id: data.public_id,
              url: data.secure_url,
              order: i, // Maintain original file order
            });
            await Media.create({
              user: req.user._id,
              type: "image",
              url: data.secure_url,
              thumbnail: data.secure_url,
              post: postId,
            });
          }
        })
      );
    }

    // Find the post to be updated
    const post = await Post.findOne({ _id: postId, isDeleted: false });

    // Check if post exists
    if (!post) {
      return next(new ErrorHandler("Post not found", 404));
    }

    // Verify post ownership before update
    if (post.userId.toString() !== req.user._id.toString()) {
      return next(new ErrorHandler("Not authorized", 401));
    }

    // Update the post with new data
    const updatedPost = await Post.findByIdAndUpdate(postId, postData, {
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
 * POST /api/v1/posts/like
 */
const toggleLike = expressAsyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    // Extract post ID from request body
    const postId = req.params.id;
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
      post.likes = post.likes.filter(
        (like) => like._id.toString() !== userId.toString()
      );
      // Decrement like count
      post.likeCount = post.likeCount - 1;
    } else {
      // Add user's ID to likes array
      post.likes.push(userId);
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
      isLiked: !isLiked,
      likeCount: post.likeCount,
    });
  }
);

/**
 * Fetches all posts liked by a specific user
 * GET /api/v1/posts/liked/:id
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

const getProfilePosts = expressAsyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const username = req.params.id;
    const tempUser = await User.findOne({ username, deleted: false });

    if (!tempUser) {
      return next(new ErrorHandler("User not found", 404));
    }

    const posts = await Post.find({
      userId: tempUser._id,
      isDeleted: false,
    }).populate("userId", "_id name headline avatar");

    if (!posts) {
      return next(new ErrorHandler("posts not found", 404));
    }
    let isFollowing;

    if (req.user) {
      req.user.following.forEach((u: any) => {
        if (u === tempUser._id) {
          isFollowing = true;
        }
      });

      if (!isFollowing) {
        if (req.user._id.toString() === (tempUser._id as string).toString()) {
          isFollowing = true;
        }
      }
    }

    // return with is liked or not
    const postsWithIsLike = posts.map((post) => {
      const isLike = post.likes.includes(req.user?._id);
      return { ...post.toObject(), isLike };
    });

    res.status(200).json({
      success: true,
      posts: postsWithIsLike,
      isFollowing,
    });
  }
);

const toggleSavePost = expressAsyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const postId = req.params.id;
    const userId = req.user._id;

    // Find the target post in database
    const post = await Post.findById(postId);
    // Check if post exists and is not deleted
    if (!post || post.isDeleted) {
      return next(new ErrorHandler("Post not found", 404));
    }

    // Check if user has already saved this post
    const isSaved = post.savedBy.includes(userId);

    // Toggle save status: unsave if already saved, save if not already saved
    if (isSaved) {
      // Remove user's ID from savedBy array
      post.savedBy = post.savedBy.filter(
        (savedUser) => savedUser.toString() !== userId.toString()
      );
      // Decrement saved count
      post.savedCount -= 1;
    } else {
      // Add user's ID to savedBy array
      post.savedBy.push(userId);
      // Increment saved count
      post.savedCount += 1;
    }

    // Save the updated post to database
    await post.save();

    // Return success response
    res.status(200).json({
      success: true,
      message: isSaved
        ? "Post unsaved successfully"
        : "Post saved successfully",
      isSaved: !isSaved,
      savedCount: post.savedCount,
    });
  }
);

const getFeedPosts = expressAsyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const userId = req.user._id;

    // Find all posts from users the current user is following
    const userIds = [
      ...req.user.following,
      ...req.user.connections,
      req.user._id,
    ];

    const posts = await Post.find({
      userId: { $in: userIds },
      isDeleted: false,
    })
      .populate("userId", "_id name headline avatar")
      .sort({ createdAt: -1 });

    const postsWithIsLike = posts.map((post: any) => {
      const isLike = post.likes.includes(req.user?._id);
      return { ...post.toObject(), isLike };
    });

    if (!postsWithIsLike || postsWithIsLike.length === 0) {
      return next(new ErrorHandler("No posts found", 404));
    }

    // Return success response
    res.status(200).json({
      success: true,
      posts: postsWithIsLike,
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
  // profile
  getProfilePosts,
  toggleSavePost,
  getFeedPosts,
};
