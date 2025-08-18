import { Router } from "express";
import {
  createGroup,
  fetchGroups,
  fetchGroup,
  deleteGroup,
  updateGroup,
  removeMember,
  leaveGroup,
  requestToJoinGroup,
  updateGroupRequest,
  fetchRecommendedGroups,
} from "../controller/groupController";
import { auth } from "../middleware/auth";
import upload from "../config/multer";
import checkAuth from "../middleware/checkAuth";

const router = Router();

router.get("/all", auth, fetchGroups);
router
  .route("/group/:id")
  .get(fetchGroup)
  .put(
    auth,
    upload.fields([
      { name: "logo", maxCount: 1 },
      { name: "banner", maxCount: 1 },
    ]),
    updateGroup
  )
  .delete(auth, deleteGroup);
router.post(
  "/create",
  auth,
  upload.fields([
    { name: "logo", maxCount: 1 },
    { name: "banner", maxCount: 1 },
  ]),
  createGroup
);
router.post("/remove/member/:id", auth, removeMember);
router.post("/leave/:id", auth, leaveGroup);

router.put("/request/:id", auth, requestToJoinGroup);
router.put("/request/update/:id", auth, updateGroupRequest);

router.get("/recommended", checkAuth, fetchRecommendedGroups);

export default router;
