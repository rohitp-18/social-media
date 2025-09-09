"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { Button } from "../ui/button";
import { Separator } from "../ui/separator";
import { User2 } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/store/store";
import { toast } from "sonner";
import { toggleJoinRequest } from "@/store/group/groupSlice";

function GroupSearchCard({ group, i }: { group: any; i: number }) {
  const [isMember, setIsMember] = useState(false);
  const [isRequested, setIsRequested] = useState(false);

  const dispatch = useDispatch<AppDispatch>();
  const { user } = useSelector((state: RootState) => state.user);
  const { groups } = useSelector((state: RootState) => state.search);

  useEffect(() => {
    if (user && group.members.includes(user._id)) {
      setIsMember(true);
    }
    if (
      user &&
      group.requests.length > 0 &&
      group.requests.find((req: { user: string }) => req.user === user._id)
    ) {
      setIsRequested(true);
    }
  }, [user]);

  return (
    <>
      <div className="flex justify-between my-2 items-start">
        <Link
          href={`/group/${group._id}`}
          className="flex justify-start items-start gap-3"
        >
          <Avatar className="w-10 h-10">
            <AvatarImage src={group.avatar?.url} />
            <AvatarFallback>
              <User2 className="w-8 h-8 p-1.5" />
            </AvatarFallback>
          </Avatar>
          <div className="flex flex-col max-w-96">
            <span className="font-semibold line-clamp-2 leading-tight text-ellipsis overflow-hidden">
              {group.name}
            </span>
            <span className="text-xs opacity-60 line-clamp-2 leading-tight text-ellipsis overflow-hidden">
              {group.headline}
            </span>
            <span className="opacity-90 text-sm">
              {group.members.length} Members
            </span>
          </div>
        </Link>
        {(!user || !(isMember || isRequested)) && (
          <Button
            className="flex items-center w-min md:ml-8 mt-2 px-7 py-2 border-primary text-primary hover:text-white hover:bg-primary rounded-full"
            variant={"outline"}
            size={"sm"}
            onClick={() => {
              if (!user) {
                toast.error("You must be logged in to join groups", {
                  position: "top-center",
                });
                return;
              }
              dispatch(toggleJoinRequest({ id: group._id, type: "request" }))
                .then(() => {
                  toast.success(`Join request sent to ${group.name}`, {
                    position: "top-center",
                  });
                  setIsRequested(true);
                })
                .catch(() => {
                  toast.error(`Failed to send join request to ${group.name}`, {
                    position: "top-center",
                  });
                });
            }}
          >
            Join
          </Button>
        )}
      </div>
      {i < groups.length - 1 && <Separator className="my-1" />}
    </>
  );
}

export default GroupSearchCard;
