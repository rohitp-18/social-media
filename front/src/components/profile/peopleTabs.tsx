"use client";

import React, { useEffect } from "react";
import { Card, CardContent } from "../ui/card";
import { Button } from "../ui/button";
import Link from "next/link";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/store/store";
import { useParams, usePathname } from "next/navigation";
import { userProfile } from "@/store/user/userSlice";

function PeopleTabs() {
  const { profile } = useSelector((state: RootState) => state.user);
  const pathname = usePathname();
  const dispatch = useDispatch<AppDispatch>();
  const { name } = useParams();

  useEffect(() => {
    if (!profile) {
      dispatch(userProfile(name as string));
    }
  }, []);
  return (
    <Card className="w-full">
      <div className="bg-background rounded-xl border text-card-foreground shadow-sm w-full flex justify-start items-center py-4 px-2 gap-10">
        <Button
          variant={pathname.includes("following") ? "default" : "outline"}
          className="rounded-lg"
          value="updates"
        >
          <Link href={`/u/${profile?.user.username}/peoples/following`}>
            Following
          </Link>
        </Button>
        <Button
          variant={pathname.includes("followers") ? "default" : "outline"}
          className="rounded-lg"
          value="meet"
        >
          <Link href={`/u/${profile?.user.username}/peoples/followers`}>
            Followers
          </Link>
        </Button>
        <Button
          variant={pathname.includes("connections") ? "default" : "outline"}
          className="rounded-lg"
          value="meet"
        >
          <Link href={`/u/${profile?.user.username}/peoples/connections`}>
            Connections
          </Link>
        </Button>
      </div>
    </Card>
  );
}

export default PeopleTabs;
