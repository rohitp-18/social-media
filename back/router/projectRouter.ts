import { Router } from "express";
import {
  createProject,
  getAllProjects,
  getProjectById,
  updateProject,
  deleteProject,
  toggleLikeProject,
  addCommentToProject,
  getProjectComments,
  getAllLikes,
  getUserLikedProjects,
  getUserProjects,
  searchProjects,
  getProfileProjects,
} from "../controller/projectController";
import { auth } from "../middleware/auth";
import upload from "../config/multer";

const router = Router();

router.get("/", auth, getAllProjects);
router.get("/user", auth, getUserProjects);
router.post("/create", auth, upload.array("media"), createProject);
router.get("/search", auth, searchProjects);
router.get("/profile/:id", getProfileProjects);
router.route("/like/:id").put(auth, toggleLikeProject).get(auth, getAllLikes);
router.get("/user/liked", auth, getUserLikedProjects);
router
  .route("/comments/:id")
  .post(auth, addCommentToProject)
  .get(auth, getProjectComments);
router
  .route("/user/:id")
  .get(auth, getProjectById)
  .put(auth, upload.array("newMedia"), updateProject)
  .delete(auth, deleteProject);

export default router;
