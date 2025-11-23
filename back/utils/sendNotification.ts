import webpush from "web-push";
import User from "../model/userModel";
import { io, onlineUsers } from "./socket";
import Notification from "../model/notificationModel";

const sendNotification = async (notification: any, userId?: string) => {
  try {
    const user = await User.findById(notification.recipient);
    if (!user) return;

    notification = await Notification.findById(notification._id)
      .populate("sender", "name email avatar headline username")
      .populate(
        "relatedId",
        "title avatar name username email headline content"
      );

    // If user is connected via socket -> send realtime
    if (onlineUsers.has(notification.recipient.toString())) {
      const socketId = onlineUsers.get(notification.recipient.toString());
      if (socketId) {
        io.to(socketId).emit("receive_notification", notification);
        return;
      }
    }

    // Otherwise send push notifications to saved subscriptions
    if (
      !Array.isArray(user.pushSubscription) ||
      user.pushSubscription.length === 0
    ) {
      return;
    }

    const payload = JSON.stringify({
      title: notification.sender?.name || "Notification",
      body: notification.message || "",
      image: notification.sender?.avatar?.url,
      data: { url: notification.url || "/" },
    });

    const remainingSubs: any[] = [];

    for (const sub of user.pushSubscription) {
      try {
        await webpush.sendNotification(
          sub as webpush.PushSubscription,
          payload,
          {
            TTL: 60 * 60,
          }
        );
        // keep subscription if succeed
        remainingSubs.push(sub);
      } catch (err: any) {
        console.error(
          "Push send error for user",
          user._id,
          err?.statusCode || err?.message || err
        );
        // remove expired/unsubscribed endpoints (410 Gone or 404 Not Found)
        if (err && (err.statusCode === 410 || err.statusCode === 404)) {
          // skip adding this subscription (effectively delete it)
          continue;
        }
        // if other transient error, keep subscription for now
        remainingSubs.push(sub);
      }
    }

    // Save cleaned subscription list if it changed
    if (remainingSubs.length !== user.pushSubscription.length) {
      user.pushSubscription = remainingSubs;
      await user.save();
    }
  } catch (error) {
    console.error("Error in sendNotification:", error);
  }
};

export default sendNotification;
