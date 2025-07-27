import { Router } from "express";
import {
  deleteNotification,
  getAllNotifications,
} from "../controller/notificationController";
import { auth } from "../middleware/auth";

const router = Router();

router.use(auth);

router.get("/all", getAllNotifications);
router.get("/meet");
router.delete("/delete/:id", deleteNotification);

export default router;
