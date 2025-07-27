"use client";

import React from "react";
import Wrapper from "../../details/_wrapper";
import PeopleTabs from "@/components/profile/peopleTabs";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { RootState } from "@/store/store";
import { useSelector } from "react-redux";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import Link from "next/link";

function Page() {
  const { profile } = useSelector((state: RootState) => state.user);
  return (
    <Wrapper>
      <PeopleTabs />
      {profile && (
        <Card className="w-full mt-4">
          <CardHeader className="flex flex-col items-start py-2">
            <h2 className="text-lg font-semibold -mb-2">Following</h2>
            <p className="text-sm text-muted-foreground">
              {profile.user.totalFollowing} following
            </p>
          </CardHeader>
          <Separator className="mb-2" />
          <CardContent className="flex flex-col gap-2">
            {profile.user.following.length > 0 ? (
              profile.user.following.map((follower: any) => (
                <Link
                  href={`/u/${follower.username}`}
                  key={follower._id}
                  className="flex items-center gap-4 hover:bg-gray-50 p-2 rounded-md"
                >
                  <Avatar>
                    <AvatarImage
                      src={follower.avatar?.url || "/default-avatar.png"}
                      alt={follower.name}
                    />
                    <AvatarFallback>
                      {follower.name.charAt(0).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <h3 className="text-base font-medium">{follower.name}</h3>
                    <p className="text-sm text-muted-foreground">
                      {follower.headline}
                    </p>
                  </div>
                </Link>
              ))
            ) : (
              <div className="flex flex-col min-h-20 justify-center items-center gap-2 p-4">
                <p className="text-sm text-muted-foreground text-center">
                  No following yet. Start connecting with people!
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </Wrapper>
  );
}

export default Page;
