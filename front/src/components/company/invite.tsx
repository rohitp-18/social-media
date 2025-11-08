"use client";

import { AppDispatch, RootState } from "@/store/store";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { searchPeoples } from "@/store/search/allSearchSlice";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { X } from "lucide-react";
import { toast } from "sonner";
import axios from "@/store/axios";
import { useRouter } from "next/navigation";
import { isAxiosError } from "axios";

function Invite({ company }: { company: any }) {
  const [inviteuserId, setInviteuserId] = useState<string[]>([]);
  const [name, setName] = useState("");
  const [selectedUsers, setSelectedUsers] = useState<any[]>([]);
  const [foundPeoples, setFoundPeoples] = useState<any[]>([]);
  const [inviteLoading, setInviteLoading] = useState(false);

  const { peoples } = useSelector((state: RootState) => state.search);
  const dispatch = useDispatch<AppDispatch>();
  const router = useRouter();

  const handleInviteSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (inviteuserId.length === 0) {
      toast.error("Please select at least one user to invite.", {
        position: "top-center",
      });
      return;
    }

    const invitationData = {
      companyId: company._id,
      recipientId: inviteuserId,
      type: "company",
      status: "pending",
      message: `You have a new invitation from ${company.name} to connect.`,
      link: `/company/${company._id}`,
      targetId: company._id,
      refModel: "company",
    };

    try {
      setInviteLoading(true);

      const { data } = await axios.post("/invitations/all", invitationData);

      toast.success("Invitation sent successfully!", {
        position: "top-center",
      });

      router.push(`/company/${company._id}`);
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
    if (e.key === "Enter") {
      dispatch(searchPeoples({ q: name }));
    }
  };

  useEffect(() => {
    if (peoples) {
      let tempPeoples: any[] = [];
      peoples.forEach((person: any) => {
        if (
          !inviteuserId.includes(person._id) &&
          person._id !== company?.admin._id
        ) {
          tempPeoples.push(person);
        }
      });
      setFoundPeoples(tempPeoples);
    }
  }, [peoples, inviteuserId]);
  return (
    <section className="flex flex-col justify-center items-center gap-10">
      <div className="text-2xl font-extralight">Send Invitations</div>
      <form onSubmit={handleInviteSubmit} className="w-full max-w-md">
        <Card className="w-full max-w-lg pt-2">
          <CardHeader className="text-lg font-semibold pb-2">
            Invite Users to {company?.name}
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
                      <div className="w-full items-center gap-2">
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

            <Button type="submit" className="mt-4">
              Send Invitation
            </Button>
          </CardContent>
        </Card>
      </form>
    </section>
  );
}

export default Invite;
