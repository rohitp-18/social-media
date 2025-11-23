"use client";

import React from "react";
import PeopleTabs from "@/components/profile/peopleTabs";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { RootState } from "@/store/store";
import { useSelector } from "react-redux";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import Link from "next/link";
import GroupWrapper from "@/components/group/groupWrapper";
import GroupPeopleTab from "@/components/group/groupPeopleTab";

function Page() {
  const { users } = useSelector((state: RootState) => state.group);
  return (
    <GroupWrapper>
      <GroupPeopleTab />
      {users.admin && (
        <Card className="w-full mt-4">
          <CardHeader className="flex flex-col items-start py-2">
            <h2 className="text-lg font-semibold -mb-2">Admin</h2>
            <p className="text-sm text-muted-foreground">
              {users.admin.length} Admin
            </p>
          </CardHeader>
          <Separator className="mb-2" />
          <CardContent className="flex flex-col gap-4">
            {users.admin.length > 0 ? (
              users.admin.map((admin) => (
                <Link
                  href={`/u/${admin.username}`}
                  key={admin._id}
                  className="flex items-center gap-4 hover:bg-gray-50 p-2 rounded-md"
                >
                  <Avatar>
                    <AvatarImage
                      src={admin.avatar?.url || "/default-avatar.png"}
                      alt={admin.name}
                    />
                    <AvatarFallback>
                      {admin.name.charAt(0).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <h3 className="text-base font-medium">{admin.name}</h3>
                    <p className="text-sm text-muted-foreground">
                      {admin.headline}
                    </p>
                  </div>
                </Link>
              ))
            ) : (
              <div className="flex flex-col min-h-20 justify-center items-center gap-2 p-4">
                <p className="text-sm text-muted-foreground text-center">
                  No Admin yet. Start connecting with people!
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </GroupWrapper>
  );
}

export default Page;
