import { Router } from "express";
import {
  createCompany,
  getAllCompanies,
  getSingleCompany,
  updatePrimaryCompany,
  deleteCompany,
  getCompanyJobs,
  getCompanyPosts,
  getCompanyFollowers,
  followCompany,
  unfollowCompany,
  updateBanner,
} from "../controller/companyController";
import { auth } from "../middleware/auth";
import multer from "multer";
import upload from "../config/multer";

const router = Router();

router.post(
  "/create",
  auth,
  upload.fields([
    { name: "logo", maxCount: 1 },
    { name: "banner", maxCount: 1 },
  ]),
  createCompany
);
router.get("/all", getAllCompanies);
router.get("/one/:id", getSingleCompany);
router.put(
  "/update/:id",
  auth,
  upload.fields([
    { name: "logo", maxCount: 1 },
    { name: "banner", maxCount: 1 },
  ]),
  updatePrimaryCompany
);
router.put("/update/:id/banner", auth, multer().single("banner"), updateBanner);
router.delete("/delete/:id", auth, deleteCompany);
router.get("/jobs/:id", auth, getCompanyJobs);
router.get("/posts/:id", auth, getCompanyPosts);
router.get("/followers/:id", auth, getCompanyFollowers);
router.put("/follow/:id", auth, followCompany);
router.put("/unfollow/:id", auth, unfollowCompany);

export default router;
