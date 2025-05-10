import { Router } from "express";
import {
  getUsers,
  loginUser,
  registerUser,
  updateProfile,
  logoutUser,
  updateBanner,
  getUserProfile,
  getUserPosts,
  getUserProjects,
  getUserComments,
} from "../controller/userController";
import { auth } from "../middleware/auth";
import upload from "../config/multer";

const router = Router();

router.get("/", auth, getUsers);
router.post("/login", loginUser);
router.post("/register", registerUser);
router.put("/update", auth, upload.single("image"), updateProfile);
router.post("/update/banner", auth, upload.single("image"), updateBanner);
router.get("/logout", auth, logoutUser);
router.get("/profile/:id", getUserProfile);
router.get("/posts/:id", auth, getUserPosts);
router.get("/projects/:id", auth, getUserProjects);
router.get("/comments/:id", auth, getUserComments);

export default router;
