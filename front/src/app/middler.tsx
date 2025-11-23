"use client";

import store from "@/store/store";
import { Suspense, useEffect, useState, useTransition } from "react";
import { Provider } from "react-redux";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { Toaster } from "@/components/ui/sonner";
import { getUser } from "@/store/user/userSlice";
import { io } from "socket.io-client";
import type { Socket } from "socket.io-client";
import { SocketProvider, useSocket } from "@/store/utils/socketContext";
import { PrimaryLoader, SecondaryLoader } from "@/components/loader";
import NotificationMiddle from "@/components/notificationMiddle";

interface MiddlewareProps {
  children: React.ReactNode;
}

const Middleware: React.FC<MiddlewareProps> = ({ children }) => {
  // const [loading, setLoading] = useState(false);

  const { user } = store.getState().user;
  const { socket, disconnectSocket, connectSocket, error } = useSocket();

  const [isPending, startTransition] = useTransition();
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  // useEffect(() => {
  //   setLoading(true);

  //   // Small delay to ensure loader is visible
  //   const timeout = setTimeout(() => {
  //     setLoading(false);
  //   }, 500); // adjust as needed

  //   return () => clearTimeout(timeout);
  // }, [pathname]);

  useEffect(() => {
    store.dispatch(getUser());
    return () => {};
  }, []); // Empty dependency array to run only once

  // useEffect(() => {
  //   if (!user) return;
  //   if (socket) return;
  //   let newSocket = io("ws://localhost:5000", {
  //     query: { selectedUser: user._id },
  //     transports: ["websocket"],
  //   });
  //   connectSocket(newSocket);

  //   newSocket.on("disconnect", () => {});
  // }, [user]);

  useEffect(() => {
    if (!user) return;
    if (!socket) return;

    (socket as Socket).on("disconnect", () => {
      disconnectSocket();
    });
  }, [socket, user]);

  return (
    <Provider store={store}>
      <SocketProvider>
        <Toaster />
        <NotificationMiddle>
          {/* <Suspense fallback={<SecondaryLoader />}> */}
          {children}
          {/* </Suspense> */}
        </NotificationMiddle>
      </SocketProvider>
    </Provider>
  );
};

export default Middleware;
