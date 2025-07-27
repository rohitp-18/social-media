import {
  fetchChats,
  fetchChat,
  deleteChat,
  readMessage,
  createReplyMessage,
  sendMessage,
} from "../controller/chatController";
import { auth } from "../middleware/auth";
import { Router } from "express";

const router = Router();

router.use(auth);

router.post("/create/message", sendMessage);
router.post("/create/reply", createReplyMessage);
router.get("/fetch", fetchChats);
router.get("/fetch/:id", fetchChat);
router.delete("/delete/:id", deleteChat);
router.post("/read", readMessage);

export default router;
