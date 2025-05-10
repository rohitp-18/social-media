import { Router } from "express";
import { auth } from "../middleware/auth";
import {
  createInvitation,
  getAllInvitations,
  getSingleInvitation,
  updateInvitation,
  deleteInvitation,
} from "../controller/invetationController";

const router = Router();

router.post("/create", auth, createInvitation);
router.get("/all", auth, getAllInvitations);
router
  .route("/:id")
  .get(auth, getSingleInvitation)
  .put(auth, updateInvitation)
  .delete(auth, deleteInvitation);

export default router;
