"use client";

import { AppDispatch, RootState } from "@/store/store";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Card, CardContent, CardFooter, CardHeader } from "../ui/card";
import Image from "next/image";
import { Avatar, AvatarImage, AvatarFallback } from "../ui/avatar";
import { User2 } from "lucide-react";
import back from "@/assets/back.png";
import { Button } from "../ui/button";
import { toast } from "sonner";
import Link from "next/link";
import { toggleJoinRequest } from "@/store/group/groupSlice";

function GroupCard() {
  const [isMember, setIsMember] = useState(false);
  const [isRequested, setIsRequested] = useState(false);

  const dispatch = useDispatch<AppDispatch>();
  const { group, users } = useSelector((state: RootState) => state.group);
  const { user } = useSelector((state: RootState) => state.user);

  useEffect(() => {
    if (group) {
      setIsMember(
        users.members.some((member: any) => member._id === user?._id)
      );
      setIsRequested(
        users.requests.some((request: any) => request._id === user?._id)
      );
    }
  }, [group, user]);

  if (!group) return null;
  return (
    <Card className="w-full flex p-0 flex-col gap-3 bg-white dark:bg-[#1a1a1a] border border-gray-200 dark:border-gray-700 rounded-lg shadow-sm">
      <CardHeader className="p-0">
        <Link
          href={`/group/${group._id}`}
          className="w-full flex flex-col gap-2"
        >
          <div className="flex flex-col relative w-full">
            {group.bannerImage ? (
              <img
                loading="lazy"
                src={group.bannerImage.url}
                alt="background"
                className="w-full aspect-[4/1] flex-shrink-0 rounded-t-lg"
              />
            ) : (
              <Image
                src={back}
                alt="background"
                className="w-full aspect-[4/1] flex-shrink-0 rounded-t-lg"
              />
            )}
            <Avatar className="w-24 h-24 ml-5 -mt-10">
              <AvatarImage src={group.avatar?.url} />
              <AvatarFallback>
                <User2 className="w-20 opacity-70 h-20 p-5" />
              </AvatarFallback>
            </Avatar>
          </div>
        </Link>
      </CardHeader>
      <CardContent>
        <Link href={`/group/${group._id}`} className="w-full flex flex-col">
          <h1 className="text-lg pb-2 font-semibold">{group.name}</h1>
          <p className="text-xs opacity-70 -mt-2">
            {group.headline || "No headline available"}
          </p>
          <p className="text-opacity-50 text-xs opacity-50">
            {group.location.join(", ")}
          </p>
        </Link>
        <p className="text-sm text-gray-600 mt-2">
          <span className="font-semibold ml-2">
            {group.members?.length || 0}{" "}
          </span>
          Members
        </p>
      </CardContent>
      <CardFooter className="flex flex-row justify-between items-center gap-2">
        <Link href={`/group/${group._id}`} className="flex-1">
          <Button
            variant="outline"
            className="w-full flex items-center justify-center rounded-full"
            aria-label="View Group Profile"
            size={"sm"}
          >
            View Profile
          </Button>
        </Link>
        {!isMember && (
          <Button
            className={`flex items-center rounded-full ${
              isRequested
                ? "bg-white text-black border border-gray-300 hover:bg-gray-100"
                : "bg-blue-500 text-white border border-blue-500 hover:bg-blue-600"
            }`}
            variant={"default"}
            size={"sm"}
            onClick={() =>
              dispatch(
                toggleJoinRequest({
                  id: group._id,
                  type: isRequested ? "cancel" : "join",
                })
              )
            }
          >
            {isRequested ? "Cancel Request" : "Join Group"}
          </Button>
        )}
        {isMember && (
          <Button
            className="flex items-center rounded-full"
            variant={"outline"}
            onClick={() =>
              dispatch(toggleJoinRequest({ id: group._id, type: "leave" }))
            }
          >
            Leave
          </Button>
        )}
      </CardFooter>
    </Card>
  );
}

export default GroupCard;
