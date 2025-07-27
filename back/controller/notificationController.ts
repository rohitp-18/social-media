import expressAsyncHandler from "express-async-handler";
import { NextFunction, Request, Response } from "express";
import Notification from "../model/notificationModel";
import ErrorHandler from "../utils/errorHandler";

const getAllNotifications = expressAsyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const notifications = await Notification.find({ recipient: req.user._id })
      .populate("sender", "name email avatar headline username")
      .populate(
        "relatedId",
        "title avatar name username email headline content"
      )
      .sort({ createdAt: -1 });
    if (!notifications) {
      return next(new ErrorHandler("Notifications not found", 404));
    }

    res.status(200).json({
      success: true,
      notifications,
      message: "Notifications fetched successfully",
    });
  }
);

const deleteNotification = expressAsyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const notificationId = req.params.id;
    const notification = await Notification.findByIdAndDelete(notificationId);
    if (!notification) {
      return next(new ErrorHandler("Notification not found", 404));
    }

    res.status(200).json({
      success: true,
      message: "Notification deleted successfully",
      notificationId: notification._id,
    });
  }
);

const getUpdatesNotifications = expressAsyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const notifications = await Notification.find({
      recipient: req.user._id,
      unread: true,
    })
      .populate("sender", "name email")
      .populate("relatedId", "title content")
      .sort({ createdAt: -1 });

    if (!notifications) {
      return next(new ErrorHandler("No unread notifications found", 404));
    }

    // Mark notifications as read
    await Promise.all(
      notifications.map(async (notification) => {
        notification.read = true;
        await notification.save();
      })
    );

    res.status(200).json({
      success: true,
      notifications,
      message: "Unread notifications fetched successfully",
    });
  }
);

export { getAllNotifications, deleteNotification };
