"use client";

import GroupWrapper from "@/components/group/groupWrapper";
import { PrimaryLoader } from "@/components/loader";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Navbar from "@/components/userNavbar";
import axios from "@/store/axios";
import { getSingleGroup } from "@/store/group/groupSlice";
import { searchPeoples } from "@/store/search/allSearchSlice";
import { AppDispatch, RootState } from "@/store/store";
import { isAxiosError } from "axios";
import { X } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "sonner";

function Page() {
  const [inviteuserId, setInviteuserId] = useState<string[]>([]);
  const [name, setName] = useState("");
  const [selectedUsers, setSelectedUsers] = useState<any[]>([]);
  const [foundPeoples, setFoundPeoples] = useState<any[]>([]);
  const [inviteLoading, setInviteLoading] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);

  const { peoples } = useSelector((state: RootState) => state.search);
  const { group, users } = useSelector((state: RootState) => state.group);
  const { user } = useSelector((state: RootState) => state.user);
  const dispatch = useDispatch<AppDispatch>();
  const router = useRouter();
  const { id } = useParams();

  const handleInviteSubmit = async () => {
    if (inviteuserId.length === 0) {
      toast.error("Please select at least one user to invite.", {
        position: "top-center",
      });
      return;
    }

    if (!group) {
      toast.error("Company data is not available", {
        position: "top-center",
      });
      return;
    }

    const invitationData = {
      groupId: group._id,
      recipientId: inviteuserId,
      type: "group",
      status: "pending",
      message: `You have a new invitation from ${group.name} to connect.`,
      link: `/group/${group._id}`,
      targetId: group._id,
      refModel: "groups",
    };

    try {
      setInviteLoading(true);

      const { data } = await axios.post("/invitations/all", invitationData);

      toast.success("Invitation sent successfully!", {
        position: "top-center",
      });

      router.push(`/group/${group._id}`);
    } catch (error) {
      toast.error(
        (isAxiosError(error) && error.response?.data?.message) ||
          "Failed to send invitation.",
        {
          position: "top-center",
        }
      );
    } finally {
      setInviteLoading(false);
    }
  };

  const handleKeyUp = (e: React.KeyboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    if (e.key === "Enter") {
      dispatch(searchPeoples({ q: name }));
    }
  };

  useEffect(() => {
    if (peoples) {
      let tempPeoples: any[] = [];
      peoples.forEach((person: any) => {
        if (!inviteuserId.includes(person._id)) {
          tempPeoples.push(person);
        }
      });

      setFoundPeoples(
        tempPeoples.filter((us: any) => {
          console.log(users.admin, us);
          if (users.admin.some((u: any) => u._id === us._id)) {
            return false;
          }
          if (users.members.some((u: any) => u._id === us._id)) {
            return false;
          }
          return true;
        })
      );
    }
  }, [peoples, inviteuserId]);

  useEffect(() => {
    if (group && user) {
      if (users.admin.some((u: any) => u._id === user._id)) {
        setIsAdmin(true);
      } else {
        router.push(`/group/${group._id}`);
      }
    }
  }, [user, group]);
  useEffect(() => {
    if (id?.toString() !== group?._id?.toString() || !group) {
      dispatch(getSingleGroup(id as string));
    }
  }, [dispatch, id]);

  if (!group) return <PrimaryLoader />;

  if (!isAdmin)
    return (
      <>
        <Navbar />
        <PrimaryLoader />
      </>
    );

  return (
    <GroupWrapper>
      <section className="flex flex-col justify-center items-center gap-10">
        <div className="text-2xl font-extralight">Send Invitations</div>
        <form onSubmit={(e) => e.preventDefault()} className="w-full max-w-md">
          <Card className="w-full max-w-lg pt-2">
            <CardHeader className="text-lg font-semibold pb-2">
              Invite Users to {group?.name}
            </CardHeader>
            <CardContent className="pb-3 flex flex-col gap-4 sm:p-6 p-2">
              <div className="flex overflow-auto my-2">
                {selectedUsers.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {selectedUsers.map((user) => (
                      <div
                        key={user._id}
                        className="relative flex flex-col items-center gap-1 pt-1 pr-2"
                      >
                        <Avatar>
                          <AvatarImage
                            src={user.avatar?.url || ""}
                            alt={user.name}
                          />
                          <AvatarFallback>
                            {user.name?.charAt(0)?.toUpperCase() || "?"}
                          </AvatarFallback>
                        </Avatar>
                        <span className="text-sm">{user.name}</span>
                        <X
                          role="button"
                          aria-label={`Remove ${user.name}`}
                          className="absolute -top-0.5 -right-0.5 w-5 h-5 cursor-pointer rounded bg-white p-0.5 text-red-500 shadow-sm hover:bg-gray-100 transition-all"
                          onClick={() => {
                            setSelectedUsers((prev) =>
                              prev.filter((u) => u._id !== user._id)
                            );
                            setInviteuserId((prev) =>
                              prev.filter((id) => id !== user._id)
                            );
                          }}
                        />
                      </div>
                    ))}
                  </div>
                )}
              </div>
              <div className="grid w-full mb-4 max-w-sm items-center gap-2">
                <Label htmlFor="inviteUserId">User Name</Label>
                <div className="flex flex-wrap gap-2 mb-2">
                  <Input
                    className="p-1"
                    id="inviteUserId"
                    placeholder="Enter user name..."
                    value={name}
                    onKeyUp={handleKeyUp}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                      setName(e.target.value)
                    }
                  />
                  <Button
                    type="button"
                    onClick={() => dispatch(searchPeoples({ q: name }))}
                  >
                    search
                  </Button>
                </div>
                {foundPeoples.length > 0 ? (
                  <div className="border border-gray-300 rounded p-2 mt-2 max-h-40 overflow-auto flex flex-col gap-2">
                    {foundPeoples.map((person: any) => (
                      <div
                        className="flex items-center justify-between p-1 hover:bg-gray-100 cursor-pointer transition-all rounded-sm max-w-full overflow-hidden"
                        key={person._id}
                      >
                        <div className="min-w-[calc(100%-250px)] overflow-hidden flex items-center gap-2">
                          <Avatar className="hover:shadow-md transition-all">
                            <AvatarImage
                              src={person.avatar?.url || ""}
                              alt={person.name}
                            />
                            <AvatarFallback>
                              {person.name?.charAt(0)?.toUpperCase() || "?"}
                            </AvatarFallback>
                          </Avatar>
                          <div className="flex flex-col">
                            <span className="text-sm font-medium text-ellipsis overflow-hidden whitespace-nowrap">
                              {person.name}
                            </span>
                            <span className="text-xs text-gray-500 text-ellipsis overflow-hidden whitespace-nowrap">
                              {person.headline || "No headline available"}
                            </span>
                          </div>
                        </div>
                        <Button
                          type="button"
                          onClick={() => {
                            setSelectedUsers((prev) => [...prev, person]);
                            setInviteuserId((prev) => [...prev, person._id]);
                          }}
                        >
                          Invite
                        </Button>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-sm text-gray-500 mt-2">
                    No users found. Please enter a valid name.
                  </div>
                )}
              </div>

              <Button
                type="button"
                onClick={handleInviteSubmit}
                className="mt-4"
              >
                Send Invitation
              </Button>
            </CardContent>
          </Card>
        </form>
      </section>
    </GroupWrapper>
  );
}

export default Page;
