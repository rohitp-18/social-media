import { Router } from "express";
import { auth } from "../middleware/auth";
import {
  createJobApplication,
  userJobApplications,
  deleteJobApplication,
  allJobApplications,
  updateJobApplication,
  getJobApplication,
  rescheduleInterview,
  acceptReschedule,
} from "../controller/applyJobController";
import upload from "../config/multer";

const router = Router();

router.use(auth);

router.post("/create", upload.single("resume"), createJobApplication);
router.get("/user", userJobApplications);
router.get("/job/:id", allJobApplications);
router.put("/reschedule/:id", rescheduleInterview);
router.put("/accept/:id", acceptReschedule);
router
  .route("/:id")
  .delete(deleteJobApplication)
  .get(getJobApplication)
  .put(updateJobApplication);

export default router;
