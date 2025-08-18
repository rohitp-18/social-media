import { Router } from "express";
import { auth } from "../middleware/auth";
import {
  addSkill,
  getAllSkills,
  getSkillById,
  updateSkill,
  deleteSkill,
  removeSkillUser,
  getUserSkills,
  updateSkillUser,
  searchSkills,
  addUserSkill,
} from "../controller/skillController";

const router = Router();

router.get("/all", auth, getAllSkills);
router.post("/new", auth, addSkill);
router
  .route("/skill/:id")
  .get(auth, getSkillById)
  .put(auth, updateSkill)
  .delete(auth, deleteSkill);
router.post("/user/new", auth, addUserSkill);
router
  .route("/user/:id")
  .delete(auth, removeSkillUser)
  .put(auth, updateSkillUser);
router.get("/search", searchSkills);
router.get("/user/:id/skills", auth, getUserSkills);

export default router;
