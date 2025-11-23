import { Router } from "express";
import { auth } from "../middleware/auth";
import {
  createInvitation,
  getAllInvitations,
  getSingleInvitation,
  updateInvitation,
  deleteInvitation,
  createInvitationForAll,
  getAllInvitationsWithCount,
} from "../controller/invetationController";

const router = Router();

router.post("/create", auth, createInvitation);
router.post("/all", auth, createInvitationForAll);
router.get("/all", auth, getAllInvitations);
router.get("/get/count", auth, getAllInvitationsWithCount);
router
  .route("/:id")
  .get(auth, getSingleInvitation)
  .put(auth, updateInvitation)
  .delete(auth, deleteInvitation);

export default router;
