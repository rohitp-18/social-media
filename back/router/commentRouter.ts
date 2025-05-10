import { Router } from "express";
import {
  createComment,
  deleteComment,
  getAllComments,
  getUserCommentedPosts,
} from "../controller/commentController";
import { auth } from "../middleware/auth";

const router = Router();

router.post("/create", auth, createComment);
router.get("/all/:postId", auth, getAllComments);
router.get("/user/", auth, getUserCommentedPosts);
router.get("/:id", auth, deleteComment);

export default router;
