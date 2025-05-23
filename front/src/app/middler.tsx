"use client";

import store from "@/store/store";
import { useEffect, useState } from "react";
import { Provider } from "react-redux";
import { usePathname, useRouter } from "next/navigation";
import { Toaster } from "@/components/ui/sonner";
import { getUser } from "@/store/user/userSlice";

interface MiddlewareProps {
  children: React.ReactNode;
}

const Middleware: React.FC<MiddlewareProps> = ({ children }) => {
  useEffect(() => {
    store.dispatch(getUser());
    return () => {};
  }, []); // Empty dependency array to run only once

  return (
    <Provider store={store}>
      <Toaster />
      {children}
    </Provider>
  );
};

export default Middleware;
