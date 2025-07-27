import { Router } from "express";
import {
  createPost,
  deletePost,
  getAllPosts,
  getFeedPosts,
  getProfilePosts,
  getSinglePost,
  toggleLike,
  toggleSavePost,
  updatePost,
} from "../controller/postController";
import { auth } from "../middleware/auth";
import upload from "../config/multer";
import checkAuth from "../middleware/checkAuth";

const router = Router();

router.get("/", checkAuth, getAllPosts);
router.get("/feed", checkAuth, getFeedPosts);
router.post("/create", auth, upload.array("images"), createPost);
router.get("/profile/:id", checkAuth, getProfilePosts);
router
  .route("/user/:id")
  .delete(auth, deletePost)
  .get(checkAuth, getSinglePost)
  .put(auth, upload.array("newImages"), updatePost);
router.get("/post/:id", checkAuth, getSinglePost);
router.put("/post/:id/like", auth, toggleLike);
router.put("/post/:id/save", auth, toggleSavePost);

export default router;
