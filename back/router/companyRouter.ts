import { Router } from "express";
import {
  createComapany,
  getAllCompanies,
  getSingleCompany,
  updatePrimaryCompany,
  deleteCompany,
  getCompanyJobs,
  getCompanyPosts,
  getCompanyFollowers,
  followCompany,
  unfollowCompany,
} from "../controller/companyController";
import { auth } from "../middleware/auth";

const router = Router();

router.post("/create", auth, createComapany);
router.get("/all", getAllCompanies);
router.get("/:id", getSingleCompany);
router.put("/update/:id", auth, updatePrimaryCompany);
router.delete("/delete/:id", auth, deleteCompany);
router.get("/jobs/:id", auth, getCompanyJobs);
router.get("/posts/:id", auth, getCompanyPosts);
router.get("/followers/:id", auth, getCompanyFollowers);
router.post("/follow/:id", auth, followCompany);
router.post("/unfollow/:id", auth, unfollowCompany);

export default router;
