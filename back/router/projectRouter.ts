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
} from "../controller/projectController";
import { auth } from "../middleware/auth";

const router = Router();

router.get("/user", auth, getUserProjects);
router.post("/create", auth, createProject);
router.get("/search", auth, searchProjects);
router.route("/like/:id").put(auth, toggleLikeProject).get(auth, getAllLikes);

router.get("/user/liked", auth, getUserLikedProjects);
router
  .route("/comments/:id")
  .post(auth, addCommentToProject)
  .get(auth, getProjectComments);
router
  .route("/:id")
  .get(auth, getProjectById)
  .put(auth, updateProject)
  .delete(auth, deleteProject);
router.get("/", auth, getAllProjects);

export default router;
