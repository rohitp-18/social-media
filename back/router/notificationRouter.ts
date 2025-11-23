import { Router } from "express";
import {
  deleteNotification,
  getAllNotifications,
  subscribeUser,
  getKey,
  readNotification,
  getUpdatesNotifications,
  unsubscribeUser,
} from "../controller/notificationController";
import { auth } from "../middleware/auth";

const router = Router();

router.use(auth);

router.get("/all", getAllNotifications);
// router.get("/meet");
router.delete("/delete/:id", deleteNotification);
router.get("/read/all", getUpdatesNotifications);
router.get("/read/:id", readNotification);
router.post("/subscribe", subscribeUser);
router.post("/unsubscribe", unsubscribeUser);
router.get("/key", getKey);

export default router;
