import { Router } from "express";
import {
  createPost,
  deletePost,
  getAllPosts,
  getSinglePost,
  toggleLike,
  updatePost,
} from "../controller/postController";
import { auth } from "../middleware/auth";
import upload from "../config/multer";

const router = Router();

router.get("/", getAllPosts);
router.get("/:id", getSinglePost);
router.post("/", auth, upload.array("images"), createPost);
router
  .route("/:id")
  .delete(auth, deletePost)
  .put(auth, upload.array("images"), updatePost);
router.put("/:id/like", auth, toggleLike);

export default router;
