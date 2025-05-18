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

router.use(auth);

router.get("/all", getAllSkills);
router.post("/new", addSkill);
router
  .route("/skill/:id")
  .get(getSkillById)
  .put(updateSkill)
  .delete(deleteSkill);
router.post("/user/new", auth, addUserSkill);
router.route("/user/:id").delete(removeSkillUser).put(updateSkillUser);
router.get("/search", searchSkills);
router.get("/user/:id/skills", getUserSkills);

export default router;
