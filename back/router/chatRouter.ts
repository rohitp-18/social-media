import {
  createChat,
  fetchChats,
  fetchChat,
  deleteChat,
  createMessage,
  readMessage,
  createReplyMessage,
} from "../controller/chatController";
import { auth } from "../middleware/auth";
import { Router } from "express";

const router = Router();

router.use(auth);

router.post("/create", createChat);
router.post("/create/message", createMessage);
router.post("/create/reply", createReplyMessage);
router.get("/fetch", fetchChats);
router.get("/fetch/:id", fetchChat);
router.delete("/delete/:id", deleteChat);
router.post("/read", readMessage);

export default router;
