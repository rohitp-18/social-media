"use client";

import React, { useEffect, useState } from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { AppDispatch, RootState } from "@/store/store";
import { useDispatch, useSelector } from "react-redux";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import Link from "next/link";
import GroupWrapper from "@/components/group/groupWrapper";
import GroupPeopleTab from "@/components/group/groupPeopleTab";
import { Button } from "@/components/ui/button";
import { updateGroupRequest } from "@/store/group/groupSlice";
import { useParams, useRouter } from "next/navigation";
import { PrimaryLoader } from "@/components/loader";

function Page() {
  const [isAdmin, setIsAdmin] = useState(false);

  const dispatch = useDispatch<AppDispatch>();
  const { id } = useParams();
  const router = useRouter();
  const { users, group } = useSelector((state: RootState) => state.group);
  const { user } = useSelector((state: RootState) => state.user);

  useEffect(() => {
    if (group && user) {
      if (group.admin.some((admin) => admin._id === user._id)) {
        setIsAdmin(true);
      } else {
        router.push(`/group/${id}`);
      }
    }
  }, [group, user]);

  if (isAdmin === false) return <PrimaryLoader />;

  return (
    <GroupWrapper>
      <GroupPeopleTab />
      {users.requests && (
        <Card className="w-full mt-4">
          <CardHeader className="flex flex-col items-start py-2">
            <h2 className="text-lg font-semibold -mb-2">Requests</h2>
            <p className="text-sm text-muted-foreground">
              {users.requests.length} Requests
            </p>
          </CardHeader>
          <Separator className="mb-2" />
          <CardContent className="flex flex-col gap-4">
            {users.requests.length > 0 ? (
              users.requests.map((request) => (
                <div key={request._id} className="flex flex-col gap-2">
                  <div className="flex justify-between items-center">
                    <Link
                      href={`/u/${request.user.username}`}
                      key={request.user._id}
                      className="flex items-center gap-4 hover:bg-gray-50 p-2 rounded-md"
                    >
                      <Avatar>
                        <AvatarImage
                          src={
                            request.user.avatar?.url || "/default-avatar.png"
                          }
                          alt={request.user.name}
                        />
                        <AvatarFallback>
                          {request.user.name.charAt(0).toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <h3 className="text-base font-medium">
                          {request.user.name}
                        </h3>
                        <p className="text-sm text-muted-foreground">
                          {request.user.headline}
                        </p>
                      </div>
                    </Link>
                    <div className="flex flex-col gap-2">
                      <Button
                        onClick={() =>
                          dispatch(
                            updateGroupRequest({
                              id: id as string,
                              userId: request.user._id,
                              status: "accepted",
                            })
                          )
                        }
                        size={"sm"}
                        variant={"secondary"}
                      >
                        Accepted
                      </Button>
                      <Button
                        onClick={() =>
                          dispatch(
                            updateGroupRequest({
                              id: id as string,
                              userId: request.user._id,
                              status: "rejected",
                            })
                          )
                        }
                        size={"sm"}
                        variant={"destructive"}
                      >
                        Rejected
                      </Button>
                    </div>
                  </div>
                  <p className="text-gray-600 font-sm">{request.message}</p>
                </div>
              ))
            ) : (
              <div className="flex flex-col min-h-20 justify-center items-center gap-2 p-4">
                <p className="text-sm text-muted-foreground text-center">
                  No Requests yet. Start connecting with people!
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
