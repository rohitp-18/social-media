import { Router } from "express";
import { auth } from "../middleware/auth";
import {
  createJobApplication,
  userJobApplications,
  deleteJobApplication,
  allJobApplications,
  updateJobApplication,
  getJobApplication,
} from "../controller/applyJobController";

const router = Router();

router.use(auth);

router.post("/create", createJobApplication);
router.get("/user", userJobApplications);
router.get("/all", allJobApplications);
router
  .route("/:id")
  .delete(deleteJobApplication)
  .get(getJobApplication)
  .put(updateJobApplication);

export default router;
