"use client";

import React, { useEffect } from "react";
import { Card, CardContent } from "../ui/card";
import { Button } from "../ui/button";
import Link from "next/link";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/store/store";
import { useParams, usePathname } from "next/navigation";
import { getSingleGroup } from "@/store/group/groupSlice";

function GroupPeopleTab() {
  const { group, users } = useSelector((state: RootState) => state.group);
  const { user } = useSelector((state: RootState) => state.user);
  const pathname = usePathname();
  const dispatch = useDispatch<AppDispatch>();
  const { id } = useParams();

  useEffect(() => {
    if (!group || group._id !== id) {
      dispatch(getSingleGroup(id as string));
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
          <Link href={`/group/${id}/peoples/admin`}>Admins</Link>
        </Button>
        <Button
          variant={pathname.includes("followers") ? "default" : "outline"}
          className="rounded-lg"
          value="meet"
        >
          <Link href={`/group/${id}/peoples/members`}>Members</Link>
        </Button>
        {group &&
          user &&
          group.admin.some((admin: any) => admin._id === user._id) && (
            <Button
              variant={pathname.includes("connections") ? "default" : "outline"}
              className="rounded-lg"
              value="meet"
            >
              <Link href={`/group/${id}/peoples/requests`}>Requests</Link>
            </Button>
          )}
      </div>
    </Card>
  );
}

export default GroupPeopleTab;
