import express from "express";
import {
  createSearchHistory,
  getSearchHistory,
  clearSearchHistory,
  deleteOneHistory,
} from "../controller/searchHistoryController";
import { auth } from "../middleware/auth"; // Middleware to checkAuth routes
import checkAuth from "../middleware/checkAuth";

const router = express.Router();

router.post("/", auth, createSearchHistory);
router.get("/", checkAuth, getSearchHistory);
router.delete("/clear", auth, clearSearchHistory);
router.delete("/search/:id", auth, deleteOneHistory);

export default router;
