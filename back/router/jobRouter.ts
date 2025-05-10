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
} from "../controller/jobController";

const router = Router();

router.post("/create", auth, createJob);
router.get("/all", getAllJobs);
router.get("/search", searchJob);
router.get("/:id", getJob);
router.delete("/delete/:id", auth, deleteJob);
router.put("/update/:id", auth, updateJob);
router.get("/myjobs", auth, getMyJobs);
router.get("/company/:id", auth, getCompanyJobs);

export default router;
