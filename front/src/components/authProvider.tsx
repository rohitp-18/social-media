import { RootState } from "@/store/store";
import React, { useEffect, ComponentProps } from "react";
import { useSelector } from "react-redux";

interface propsInter {
  children?: RootState;
}

function AuthProvider({ children }: propsInter) {
  const { loading, user } = useSelector((state: RootState) => state.user);

  useEffect(() => {
    if (!loading && !user) {
    }
  }, [user, loading]);
  return <>{user && children}</>;
}

export default AuthProvider;
