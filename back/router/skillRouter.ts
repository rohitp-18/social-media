import { Router } from "express";
import { auth } from "../middleware/auth";
import {
  addSkill,
  getAllSkills,
  getSkillById,
  updateSkill,
  deleteSkill,
  deleteSkillUser,
  getUserSkills,
  updateSkillUser,
} from "../controller/skillController";

const router = Router();

router.use(auth);

router.get("/all", getAllSkills);
router.get("/:id", getSkillById);
router.post("/add", addSkill);
router.route("/:id").get(updateSkill).put(updateSkill).delete(deleteSkill);
router.get("/user", getUserSkills);
router.route("/user/:id").delete(deleteSkillUser).put(updateSkillUser);

export default router;
