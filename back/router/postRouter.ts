import { Router } from "express";
import {
  createPost,
  deletePost,
  getAllPosts,
  getProfilePosts,
  getSinglePost,
  toggleLike,
  updatePost,
} from "../controller/postController";
import { auth } from "../middleware/auth";
import upload from "../config/multer";
import checkAuth from "../middleware/checkAuth";

const router = Router();

router.get("/", getAllPosts);
router.post("/create", auth, upload.array("images"), createPost);
router.get("/profile/:id", checkAuth, getProfilePosts);
router
  .route("/user/:id")
  .delete(auth, deletePost)
  .put(auth, upload.array("newImages"), updatePost);
router.get("/post/:id", getSinglePost);
router.put("/post/:id/like", auth, toggleLike);

export default router;
