import { Router } from "express";
import {
  createEducation,
  updateEducation,
  getProfileEducation,
  getSingleEducation,
  deleteEducation,
} from "../controller/educationController";
import { auth } from "../middleware/auth";

const router = Router();

router.post("/create", auth, createEducation);
router
  .route("/user/:id")
  .get(getSingleEducation)
  .delete(auth, deleteEducation)
  .put(auth, updateEducation);
router.get("/profile/:id", getProfileEducation);

export default router;
