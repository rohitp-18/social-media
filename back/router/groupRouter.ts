import { Router } from "express";
import {
  createGroup,
  fetchGroups,
  fetchGroup,
  deleteGroup,
  updateGroup,
  addMember,
  removeMember,
  leaveGroup,
  deleteGroupImage,
  deleteBannerImage,
  addGroupBannerImage,
  addGroupImage,
  requestToJoinGroup,
  acceptGroupRequest,
  rejectGroupRequest,
  getAllRequests,
} from "../controller/groupController";
import { auth } from "../middleware/auth";

const router = Router();

router.get("/all", auth, fetchGroups);
router.get("/:id", auth, fetchGroup);
router.post("/create", auth, createGroup);
router.delete("/delete/:id", auth, deleteGroup);
router.put("/update/:id", auth, updateGroup);
router.post("/add/member/:id", auth, addMember);
router.post("/remove/member/:id", auth, removeMember);
router.post("/leave/:id", auth, leaveGroup);
router.delete("/delete/image/:id", auth, deleteGroupImage);
router.delete("/delete/banner/:id", auth, deleteBannerImage);
router.post("/add/image/:id", auth, addGroupImage);
router.post("/add/banner/:id", auth, addGroupBannerImage);

router.post("/request/:id", auth, requestToJoinGroup);
router.post("/accept/:id", auth, acceptGroupRequest);
router.post("/reject/:id", auth, rejectGroupRequest);
router.get("/requests/:id", auth, getAllRequests);

export default router;
