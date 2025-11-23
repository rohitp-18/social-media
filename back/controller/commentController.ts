import { NextFunction, Request, Response } from "express";
import expressAsyncHandler from "express-async-handler";

import Post from "../model/postModel";
import Comment from "../model/commentModel";
import ErrorHandler from "../utils/errorHandler";

const createComment = expressAsyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const { postId, comment, type } = req.body;
    const userId = req.user._id;

    const post = await Post.findById(postId);

    if (!post || post.isDeleted) {
      return next(new ErrorHandler("Post not found", 404));
    }

    await Comment.deleteOne({ post: postId, user: userId }).populate(
      "user",
      "name email avatar"
    );

    const newComment = await Comment.create({
      user: userId,
      content: comment,
      post: postId,
      type: "comment",
    });

    if (!newComment) {
      return next(new ErrorHandler("Comment not created", 500));
    }

    res.status(200).json({
      success: true,
      comment: await newComment.populate("user", "name email avatar"),
      message: "comment created successfully",
    });
  }
);

const createReply = expressAsyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const { postId, commentId, reply } = req.body;
    const userId = req.user._id;

    const post = await Post.findById(postId);
    if (!post || post.isDeleted) {
      return next(new ErrorHandler("Post not found", 404));
    }

    const comment = await Comment.findById(commentId);
    if (!comment || comment.isDeleted) {
      return next(new ErrorHandler("Comment not found", 404));
    }

    const newReply = await Comment.create({
      user: userId,
      content: reply,
      post: postId,
      parent: commentId,
      type: "reply",
    });

    if (!newReply) {
      return next(new ErrorHandler("Reply not created", 500));
    }

    res.status(200).json({
      success: true,
      reply: await newReply.populate("user", "name email avatar"),
      message: "Reply created successfully",
    });
  }
);

const getAllComments = expressAsyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const { postId } = req.params;

    // Validate post existence and not deleted
    const post = await Post.findById(postId);
    if (!post || post.isDeleted) {
      return next(new ErrorHandler("Post not found", 404));
    }

    // Fetch all top-level comments (not replies) for the post
    const comments = await Comment.find({
      post: postId,
      parent: null,
      isDeleted: false,
    })
      .populate("user", "name email avatar")
      .sort({ createdAt: -1 });

    // Optionally, fetch replies for each comment
    const commentsWithReplies = await Promise.all(
      comments.map(async (comment) => {
        const replies = await Comment.find({
          parent: comment._id,
          isDeleted: false,
        })
          .populate("user", "name email avatar")
          .sort({ createdAt: 1 });
        return {
          ...comment.toObject(),
          replies,
        };
      })
    );

    res.status(200).json({
      success: true,
      comments: commentsWithReplies,
      message: "Comments fetched successfully",
    });
  }
);

// get user commented posts with commnets
const getUserCommentedPosts = expressAsyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const userId = req.user._id;
    const comments = await Comment.find({ user: userId })
      .populate("user", "name email")
      .populate("post", "title content");

    if (!comments) {
      return next(new ErrorHandler("Comments not found", 404));
    }

    res.status(200).json({
      success: true,
      comments,
      message: "Comments fetched successfully",
    });
  }
);

const deleteComment = expressAsyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const commentId = req.params.id;

    const comment = await Comment.findById(commentId);

    if (!comment) {
      return next(new ErrorHandler("comment not found", 404));
    }

    if (req.user._id !== comment.user) {
      return next(new ErrorHandler("not authourized", 403));
    }

    await comment.deleteOne();

    res.status(200).json({
      success: true,
      comment,
      message: "comment deleted successfully",
    });
  }
);

const toggleLikeComment = expressAsyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const commentId = req.params.id;
    const userId = req.user._id;

    const comment = await Comment.findById(commentId);

    if (!comment) {
      return next(new ErrorHandler("Comment not found", 404));
    }

    const isLiked = comment.likes.includes(userId);

    if (isLiked) {
      comment.likes = comment.likes.filter(
        (likeId) => likeId.toString() !== userId.toString()
      );
    } else {
      comment.likes.push(userId);
    }

    await comment.save();

    res.status(200).json({
      success: true,
      liked: !isLiked,
      message: isLiked ? "Comment unliked" : "Comment liked",
      comment,
    });
  }
);

export {
  createComment,
  createReply,
  getAllComments,
  deleteComment,
  getUserCommentedPosts,
  toggleLikeComment,
};
