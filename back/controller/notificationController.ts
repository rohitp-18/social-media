import expressAsyncHandler from "express-async-handler";
import { NextFunction, Request, Response } from "express";
import Notification from "../model/notificationModel";
import ErrorHandler from "../utils/errorHandler";
import User from "../model/userModel";
import { sendNotification } from "web-push";

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

const subscribeUser = expressAsyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const { subscription } = req.body;

    if (!subscription) {
      return next(new ErrorHandler("Subscription object is required", 400));
    }

    if (req.cookies.testPush) {
      return next(
        res.status(200).json({
          success: true,
        })
      );
    }

    const user = await User.findById(req.user._id);
    if (!user) {
      return next(new ErrorHandler("User not found", 404));
    }

    user.pushSubscription = [...user.pushSubscription, subscription];

    sendNotification(
      subscription,
      JSON.stringify({
        title: "Test",
        body: "This is a test push",
        data: { url: "/" },
      })
    )
      .then(() => {})
      .catch((err: any) => {
        console.error(err);
      });

    await user.save();

    res
      .status(200)
      .json({
        success: true,
        message: "User subscribed to notifications successfully",
      })
      .cookie("testPush", JSON.stringify(subscription), { httpOnly: true });
  }
);

const unsubscribeUser = expressAsyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const { subscription } = req.body;

    if (!subscription) {
      return next(new ErrorHandler("Subscription object is required", 400));
    }

    if (!req.cookies.testPush) {
      return next(
        res.status(200).json({
          success: true,
        })
      );
    }

    const user = await User.findById(req.user._id);
    if (!user) {
      return next(new ErrorHandler("User not found", 404));
    }

    user.pushSubscription = user.pushSubscription.filter(
      (sub: any) => (sub.endpoint || "") !== subscription.endpoint
    );

    await user.save();

    res
      .status(200)
      .json({
        success: true,
        message: "User unsubscribed to notifications successfully",
      })
      .cookie("testPush", null, {
        httpOnly: true,
        expires: new Date(Date.now()),
      });
  }
);

const getKey = expressAsyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const publicVapidKey = process.env.VAPID_PUBLIC_KEY;

    if (!publicVapidKey) {
      return next(new ErrorHandler("VAPID public key not found", 500));
    }
    res.status(200).json({
      success: true,
      key: publicVapidKey,
      message: "Public VAPID key fetched successfully",
    });
  }
);

const readNotification = expressAsyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;

    const updateNotification = await Notification.findOne({
      _id: id,
      user: req.user._id,
    });

    if (!updateNotification) {
      return next(new ErrorHandler("Notification not found", 404));
    }

    updateNotification.read = true;
    updateNotification.save();

    res.status(200).json({
      success: true,
      notification: updateNotification,
    });
  }
);

export {
  getAllNotifications,
  deleteNotification,
  subscribeUser,
  unsubscribeUser,
  getKey,
  getUpdatesNotifications,
  readNotification,
};
