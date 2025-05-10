"use client";

import { RootState } from "@/store/store";
import { useRouter, usePathname } from "next/navigation";
import React, { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

function a({
  href,
  children,
  className,
  target,
  back,
  rel,
  ...props
}: {
  href: string;
  children?: React.ReactNode;
  className?: string;
  back?: boolean;
  target?: string;
  rel?: string;
}) {
  const [path, setPath] = useState("");
  const dispatch = useDispatch();
  const router = useRouter();
  const pathname = usePathname();

  const { currentLocation, previousLocation } = useSelector(
    (state: RootState) => state.location
  );

  const goback = () => {
    if (previousLocation) {
      router.back();
      return;
    }

    router.push("/feed");
  };

  const handleClick = (e: React.MouseEvent<HTMLaElement>) => {
    if (back) return goback;
    e.preventDefault();
    dispatch({ type: "location/navigate", payload: href });

    router.push(href);
  };

  return (
    <a
      href={href}
      onClick={handleClick}
      className={className}
      target={target}
      rel={rel}
      {...props}
    >
      {children}
    </a>
  );
}

export default a;
