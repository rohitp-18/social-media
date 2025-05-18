import { Router } from "express";
import {
  getUsers,
  loginUser,
  registerUser,
  updateProfile,
  logoutUser,
  updateBanner,
  getUserProfile,
  updateUserAbout,
  changeLanguage,
  checkUsernameAvailable,
  changeUsername,
  userActivities,
} from "../controller/userController";
import { auth } from "../middleware/auth";
import upload from "../config/multer";
import checkAuth from "../middleware/checkAuth";

const router = Router();

router.get("/", auth, getUsers);
router.post("/login", loginUser);
router.post("/register", registerUser);
router.put("/update", auth, upload.single("image"), updateProfile);
router.put("/update/banner", auth, upload.single("image"), updateBanner);
router.get("/logout", auth, logoutUser);
router.get("/profile/activity/:id", checkAuth, userActivities);
router.get("/profile/:id", getUserProfile);
router.put("/update/about", auth, updateUserAbout);
router.put("/update/language", auth, changeLanguage);
router.put("/check/username", auth, checkUsernameAvailable);
router.put("/update/username", auth, changeUsername);

export default router;
