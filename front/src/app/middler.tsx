"use client";

import store from "@/store/store";
import { useEffect } from "react";
import { Provider } from "react-redux";

interface MiddlewareProps {
  children: React.ReactNode;
}

const Middleware: React.FC<MiddlewareProps> = ({ children }) => {
  // const history = useHistory();

  // useEffect(() => {
  //   // Example middleware logic
  //   const isAuthenticated = false; // Replace with actual authentication logic

  //   if (!isAuthenticated) {
  //     history.push('/login');
  //   }
  // }, [history]);
  useEffect(() => {
    store.dispatch({ type: "user/getUser" });
  }, []);

  return <Provider store={store}>{children}</Provider>;
};

export default Middleware;
