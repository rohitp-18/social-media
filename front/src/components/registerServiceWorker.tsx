"use client";

import { RootState } from "@/store/store";
import { useEffect } from "react";
import { useSelector } from "react-redux";

export default function RegisterServiceWorker() {
  const { user } = useSelector((state: RootState) => state.user);
  useEffect(() => {
    if (!user) return;
    if ("serviceWorker" in navigator) {
      navigator.serviceWorker
        .register("/sw.js", { scope: "/" })
        .then((reg) => {})
        .catch((err) => {});
    }
  }, [user]);

  return null;
}
