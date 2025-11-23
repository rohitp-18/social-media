"use client";

import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/store/store";
import {
  getKey,
  subscribeUser,
  unSubscribeUser,
} from "@/store/user/notificationSlice";

function urlBase64ToUint8Array(base64String: string) {
  const padding = "=".repeat((4 - (base64String.length % 4)) % 4);
  const base64 = (base64String + padding).replace(/-/g, "+").replace(/_/g, "/");
  const rawData = window.atob(base64);
  const outputArray = new Uint8Array(rawData.length);
  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i);
  }
  return outputArray;
}

async function setupPushSubscription(dispatch: AppDispatch) {
  if (!("serviceWorker" in navigator) || !("PushManager" in window)) {
    console.warn("Service Worker or PushManager not supported");
    return;
  }

  try {
    const registration = await navigator.serviceWorker.register("/sw.js", {
      scope: "/",
    });
    await navigator.serviceWorker.ready;

    // Reuse existing subscription if present
    let subscription = await registration.pushManager.getSubscription();

    // Ensure we have a VAPID public key from server
    const res: any = await dispatch(getKey());
    const publicKey = res?.payload?.key;
    if (!publicKey) {
      console.warn("No VAPID public key returned");
      return;
    }
    const applicationServerKey = urlBase64ToUint8Array(publicKey);

    if (!subscription) {
      subscription = await registration.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey,
      });
    } else {
    }

    // send subscription to server (ensure subscribeUser accepts { subscription })
    await dispatch(subscribeUser(subscription));
  } catch (err) {
    console.error("Failed to setup push subscription:", err);
  }
}

async function removePushSubscription(dispatch: AppDispatch) {
  if (!("serviceWorker" in navigator) || !("PushManager" in window)) {
    console.warn("Service Worker or PushManager not supported");
    return;
  }

  try {
    const registration = await navigator.serviceWorker.register("/sw.js", {
      scope: "/",
    });
    await navigator.serviceWorker.ready;

    // Reuse existing subscription if present
    let subscription = await registration.pushManager.getSubscription();

    if (subscription) {
      await subscription.unsubscribe();
      await dispatch(unSubscribeUser(subscription));
    }
  } catch (err) {}
}

export default function NotificationMiddle({
  children,
}: {
  children?: React.ReactNode;
}) {
  const { user } = useSelector((s: RootState) => s.user);
  const dispatch = useDispatch<AppDispatch>();

  useEffect(() => {
    if (!user) return;

    if (Notification.permission === "default") {
      Notification.requestPermission().then((permission) => {
        if (permission === "granted") {
          setupPushSubscription(dispatch);
        } else {
        }
      });
    } else if (Notification.permission === "granted") {
      setupPushSubscription(dispatch);
    } else {
    }
  }, [user, dispatch]);

  return <>{children}</>;
}

export { removePushSubscription };
