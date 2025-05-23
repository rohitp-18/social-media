import { Router } from "express";
import {
  createExperience,
  getUserExperiences,
  getExperienceById,
  updateExperience,
  deleteExperience,
  profileExperience,
} from "../controller/experienceController";
import { auth } from "../middleware/auth";

const router = Router();

router.post("/create", auth, createExperience);
router.get("/user", auth, getUserExperiences);
router.get("/user/:id", profileExperience);
router
  .route("/exp/:id")
  .get(auth, getExperienceById)
  .put(auth, updateExperience)
  .delete(auth, deleteExperience);

export default router;
