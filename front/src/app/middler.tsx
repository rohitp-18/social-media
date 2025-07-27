"use client";

import store from "@/store/store";
import { useEffect, useState } from "react";
import { Provider } from "react-redux";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { Toaster } from "@/components/ui/sonner";
import { getUser } from "@/store/user/userSlice";
import Navbar from "@/components/userNavbar";
import IntroNavbar from "@/components/introNavbar";
import { io } from "socket.io-client";
import type { Socket } from "socket.io-client";
import { SocketProvider, useSocket } from "@/store/utils/socketContext";

interface MiddlewareProps {
  children: React.ReactNode;
}

const Middleware: React.FC<MiddlewareProps> = ({ children }) => {
  const { user } = store.getState().user;
  const { socket, disconnectSocket, connectSocket, error } = useSocket();

  useEffect(() => {
    store.dispatch(getUser());
    return () => {};
  }, []); // Empty dependency array to run only once

  useEffect(() => {
    if (!user) return;
    if (socket) return;
    let newSocket = io("ws://localhost:5000", {
      query: { selectedUser: user._id },
      transports: ["websocket"],
    });
    newSocket.on("connect", () => {});
    connectSocket(newSocket);

    newSocket.on("disconnect", () => {});
  }, [user]);
  useEffect(() => {
    if (!user) return;
    if (!socket) return;

    (socket as Socket).on("disconnect", () => {
      console.log("Socket disconnected");
      disconnectSocket();
    });
  }, [socket, user]);

  return (
    <Provider store={store}>
      <SocketProvider>
        <Toaster />
        {children}
      </SocketProvider>
    </Provider>
  );
};

export default Middleware;
