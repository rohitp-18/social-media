import { Router } from "express";
import {
  getAllSearch,
  getPeopleSearch,
  getCompaniesSearch,
  getPostsSearch,
  getProjectsSearch,
  getGroupsSearch,
  getJobsSearch,
  searchInConnections,
} from "../controller/searchController";
import checkAuth from "../middleware/checkAuth";

const router = Router();

router.use(checkAuth);

router.get("/all", getAllSearch);
router.get("/people", getPeopleSearch);
router.get("/companies", getCompaniesSearch);
router.get("/posts", getPostsSearch);
router.get("/projects", getProjectsSearch);
router.get("/groups", getGroupsSearch);
router.get("/jobs", getJobsSearch);
router.get("/connections", searchInConnections);

export default router;
