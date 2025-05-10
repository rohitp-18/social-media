import {
  createChat,
  fetchChats,
  fetchChat,
  deleteChat,
  createMessage,
} from "../controller/chatController";
import { auth } from "../middleware/auth";
import { Router } from "express";

const router = Router();

router.use(auth);

router.post("/create", createChat);
router.post("/create/message", createMessage);
router.get("/fetch", fetchChats);
router.get("/fetch/:id", fetchChat);
router.delete("/delete/:id", deleteChat);

export default router;
