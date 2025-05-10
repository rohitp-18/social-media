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

    const newComment = await Comment.create({
      user: userId,
      content: comment,
      post: postId,
      type,
    });

    if (!newComment) {
      return next(new ErrorHandler("Comment not created", 500));
    }

    res.status(200).json({
      success: true,
      comment,
      message: "comment created successfully",
    });
  }
);

const getAllComments = expressAsyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const { postId } = req.params;
    const post = await Post.findById(postId)
      .populate("reply.id", "content user")
      .populate("user", "name email")
      .populate("comment._id", "content user");
    if (!post || post.isDeleted) {
      return next(new ErrorHandler("Post not found", 404));
    }

    const comments = post.comment.map((comment) => comment._id);
    const allComments = await Comment.find({ _id: { $in: comments } })
      .populate("user", "name email")
      .populate("post", "title content");

    if (!allComments) {
      return next(new ErrorHandler("Comments not found", 404));
    }

    res.status(200).json({
      success: true,
      comments: allComments,
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
      comment.likes.pull(userId);
    } else {
      comment.likes.push(userId);
    }

    await comment.save();

    res.status(200).json({
      success: true,
      message: isLiked ? "Comment unliked" : "Comment liked",
      comment,
    });
  }
);

export {
  createComment,
  getAllComments,
  deleteComment,
  getUserCommentedPosts,
  toggleLikeComment,
};
