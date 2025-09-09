import { Request, Response, NextFunction } from "express";
import SearchHistory from "../model/searchHistoryModel";
import expressAsyncHandler from "express-async-handler";
import ErrorHandler from "../utils/errorHandler";

// Create a new search history entry
const createSearchHistory = expressAsyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const { query } = req.body;

    if (!query) {
      res.status(400);
      throw new Error("Search query is required");
    }

    const temp = await SearchHistory.findOne({
      user: req.user._id,
      query,
    });

    if (temp) {
      return next(new ErrorHandler("already exist", 200));
    }

    const searchHistory = await SearchHistory.create({
      user: req.user._id,
      query,
    });

    res.status(201).json({
      success: true,
      history: searchHistory,
    });
  }
);

// Get all search history for a user
const getSearchHistory = expressAsyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const { q } = req.query;
    const filter: any = {};

    if (req.user) {
      filter.user = req.user._id;
    }

    if (q) {
      filter.query = { $regex: q, $options: "i" };
      filter.suggest = false;
    }

    const searchHistory = await SearchHistory.find(filter)
      .sort({ createdAt: -1 })
      .limit(10);

    let additionalHistory;
    if (searchHistory.length < 10) {
      additionalHistory = await SearchHistory.find({
        suggest: true,
        query: { $regex: q, $options: "i" },
      }).limit(10 - searchHistory.length);
    }

    res.status(200).json({
      success: true,
      history: [...searchHistory, ...(additionalHistory || [])].slice(0, 10),
    });
  }
);

// Clear all search history for a user
const clearSearchHistory = expressAsyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    await SearchHistory.deleteMany({ user: req.user._id });

    res
      .status(200)
      .json({ success: true, message: "Search history cleared successfully" });
  }
);

const deleteOneHistory = expressAsyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;

    const historyItem = await SearchHistory.findById(id);

    if (!historyItem) {
      return next(new ErrorHandler("History item not found", 404));
    }

    if (historyItem.user.toString() !== req.user._id.toString()) {
      return next(new ErrorHandler("Not authorized to delete this item", 403));
    }

    await SearchHistory.deleteOne({ _id: historyItem._id });

    res.status(200).json({
      success: true,
      id,
      message: "History item deleted successfully",
    });
  }
);

export {
  createSearchHistory,
  getSearchHistory,
  clearSearchHistory,
  deleteOneHistory,
};
