import { Router } from "express";
import {
  createComment,
  createReply,
  deleteComment,
  getAllComments,
  getUserCommentedPosts,
  toggleLikeComment,
} from "../controller/commentController";
import { auth } from "../middleware/auth";

const router = Router();

router.post("/create", auth, createComment);
router.post("/reply", auth, createReply);
router.get("/all/:postId", getAllComments);
router.get("/user/", auth, getUserCommentedPosts);
router.get("/like/:id", auth, toggleLikeComment);
router.delete("/:id", auth, deleteComment);

export default router;
