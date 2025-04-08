import { Router } from "express";
import {
  getUsers,
  loginUser,
  registerUser,
  updateProfile,
} from "../controller/userController";
import { auth } from "../middleware/auth";
import upload from "../config/multer";

const router = Router();

router.get("/", auth, getUsers);
router.post("/login", loginUser);
router.post("/register", registerUser);
router.put("/update", auth, upload.single("image"), updateProfile);

export default router;
