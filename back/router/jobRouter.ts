import { Router } from "express";
import { auth } from "../middleware/auth";
import {
  createJob,
  getAllJobs,
  deleteJob,
  updateJob,
  getJob,
  getMyJobs,
  searchJob,
  getCompanyJobs,
  introductionJobs,
  recommendedJobs,
  toggleSaveJob,
  toggleActiveJob,
} from "../controller/jobController";
import checkAuth from "../middleware/checkAuth";

const router = Router();

router.post("/create", auth, createJob);
router.get("/all", getAllJobs);
router.get("/intro", introductionJobs);
router.get("/search", searchJob);
router.get("/recommended", checkAuth, recommendedJobs);
router
  .route("/job/:id")
  .get(getJob)
  .put(auth, updateJob)
  .delete(auth, deleteJob);
router.get("/myjobs", auth, getMyJobs);
router.get("/company/:id", auth, getCompanyJobs);
router.put("/save/:jobId", auth, toggleSaveJob);
router.put("/active/:jobId", auth, toggleActiveJob);

export default router;
