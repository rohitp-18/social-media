"use client";

import React, { useEffect, useState } from "react";
import PeopleTabs from "@/components/profile/peopleTabs";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { AppDispatch, RootState } from "@/store/store";
import { useDispatch, useSelector } from "react-redux";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import Link from "next/link";
import GroupWrapper from "@/components/group/groupWrapper";
import GroupPeopleTab from "@/components/group/groupPeopleTab";
import { useParams } from "next/navigation";
import {
  getSingleGroup,
  removeUserFromGroup,
  resetGroup,
} from "@/store/group/groupSlice";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

function Page() {
  const [isAdmin, setIsAdmin] = useState(false);

  const { id } = useParams();
  const dispatch = useDispatch<AppDispatch>();
  const { user } = useSelector((state: RootState) => state.user);
  const { users, group, message, error } = useSelector(
    (state: RootState) => state.group
  );

  useEffect(() => {
    if (user && users.members) {
      setIsAdmin(users.admin.some((member) => member._id === user._id));
    }
  }, [user, users.members]);

  useEffect(() => {
    if (!group || group._id !== id) {
      dispatch(getSingleGroup(id as string));
    }
  }, [id, dispatch, group]);

  useEffect(() => {
    if (message) {
      toast.success(message, { position: "top-center" });
      dispatch(resetGroup());
    }
    if (error) {
      toast.error(error, { position: "top-center" });
      dispatch(resetGroup());
    }
  }, [message, error, dispatch]);

  return (
    <GroupWrapper>
      <GroupPeopleTab />
      {users.members && (
        <Card className="w-full mt-4">
          <CardHeader className="flex flex-col items-start py-2">
            <h2 className="text-lg font-semibold -mb-2">Members</h2>
            <p className="text-sm text-muted-foreground">
              {users.members.length} Members
            </p>
          </CardHeader>
          <Separator className="mb-2" />
          <CardContent className="flex flex-col gap-4">
            {users.members.length > 0 ? (
              users.members.map((member) => (
                <div key={member._id} className="flex flex-col gap-2">
                  <div className="flex justify-between items-center">
                    <Link
                      href={`/u/${member.username}`}
                      className="flex items-center gap-4 hover:bg-gray-50 p-2 rounded-md"
                    >
                      <Avatar>
                        <AvatarImage
                          src={member.avatar?.url || "/default-avatar.png"}
                          alt={member.name}
                        />
                        <AvatarFallback>
                          {member.name.charAt(0).toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <h3 className="text-base font-medium">{member.name}</h3>
                        <p className="text-sm text-muted-foreground">
                          {member.headline}
                        </p>
                      </div>
                    </Link>
                    <div className="flex flex-col gap-2">
                      {isAdmin && (
                        <Button
                          onClick={() =>
                            dispatch(
                              removeUserFromGroup({
                                groupId: id as string,
                                userId: member._id,
                              })
                            )
                          }
                          size={"sm"}
                          variant="destructive"
                        >
                          Remove
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="flex flex-col min-h-20 justify-center items-center gap-2 p-4">
                <p className="text-sm text-muted-foreground text-center">
                  No Members yet. Start connecting with people!
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
