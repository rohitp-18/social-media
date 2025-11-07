"use client";

import React from "react";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { User2 } from "lucide-react";
import Image from "next/image";
import back from "@/assets/back.png";
import { useSelector } from "react-redux";
import { RootState } from "@/store/store";
import Link from "next/link";

function ProfileCard() {
  const { user } = useSelector((state: RootState) => state.user);
  if (!user) return null;
  return (
    <>
      {user && (
        <Link href={`/u/${user.username}`}>
          <Card>
            <CardHeader className="p-0 rounded-2xl pb-3 flex flex-row justify-between items-center gap-2">
              <div className="flex flex-col relative w-full">
                {user.bannerImage ? (
                  <img
                    loading="lazy"
                    src={user.bannerImage.url}
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
                  <AvatarImage src={user.avatar?.url} />
                  <AvatarFallback>
                    <User2 className="w-20 opacity-70 h-20 p-5" />
                  </AvatarFallback>
                </Avatar>
              </div>
            </CardHeader>
            <CardContent className="flex flex-col gap-1 px-4 pt-0 pb-3">
              <h3 className="text-lg pb-2 font-semibold">{user.name}</h3>
              <span className="text-xs opacity-70 -mt-2">{user.headline}</span>
              <h3 className="text-opacity-50 text-xs opacity-50">
                {`${user.location?.city ? user.location.city + ", " : ""}${
                  user.location?.state ? user.location.state + ", " : ""
                }${user.location?.country ? user.location.country : ""}`}
              </h3>
            </CardContent>
          </Card>
        </Link>
      )}
    </>
  );
}

export default ProfileCard;
