"use client";

import React, { useCallback, useEffect, useMemo, useState } from "react";
import { Card, CardContent, CardFooter, CardHeader } from "../ui/card";
import { TabsList, Tabs, TabsTrigger } from "../ui/tabs";
import { Button } from "../ui/button";
import { Edit2, MoreHorizontal, Plus } from "lucide-react";
import Link from "next/link";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
} from "../ui/dropdown-menu";
import { Separator } from "../ui/separator";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/store/store";
import { toast } from "sonner";
import {
  clearGroupError,
  resetGroup,
  toggleJoinRequest,
} from "@/store/group/groupSlice";
import Image from "next/image";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import back from "@/assets/back.png";
import { useParams } from "next/navigation";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../ui/dialog";
import { Textarea } from "../ui/textarea";
import { Label } from "../ui/label";

function GroupProfile() {
  const [isAdmin, setIsAdmin] = useState(false);
  const [isRequested, setIsRequested] = useState(false);
  const [isMember, setIsMember] = useState(false);
  const [open, setOpen] = useState(false);
  const [requestMessage, setRequestMessage] = useState("");

  const { id } = useParams();
  const dispatch = useDispatch<AppDispatch>();
  const { group, users, error, message } = useSelector(
    (state: RootState) => state.group
  );
  const { user } = useSelector((state: RootState) => state.user);

  const toggleJoin = useCallback(() => {
    if (isRequested) {
      dispatch(
        toggleJoinRequest({
          id: group._id,
          type: "request",
        })
      );
    } else {
      setOpen(!open);
    }
  }, [isRequested, group, open, dispatch]);

  useEffect(() => {
    if (group && group.admin && user) {
      setIsAdmin(group.admin.some((admin: any) => admin._id === user._id));
      setIsMember(group.members.some((member: any) => member._id === user._id));
      setIsRequested(
        group.requests.some(
          (request: any) => request.user._id.toString() === user._id.toString()
        )
      );
    }
  }, [group, user]);

  useEffect(() => {
    if (message) {
      toast.success(message, { position: "top-center" });
      setIsRequested(!isRequested);
      dispatch(resetGroup());
    }
    if (error) {
      toast.error(error, { position: "top-center" });
      dispatch(clearGroupError());
    }
  }, [message, isRequested, dispatch]);

  if (!group) return null;

  return (
    <Card>
      {/* group header with banner image and avatar */}
      <CardHeader className="p-0 rounded-2xl pb-3 flex flex-row justify-between items-center gap-2">
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
              loading="lazy"
              alt="background"
              className="w-full aspect-[4/1] flex-shrink-0 rounded-t-lg"
            />
          )}
          <Avatar className="w-24 h-24 md:w-36 p-2 bg-background border-3 border-background md:-mt-16 md:h-36 ml-5 -mt-12">
            <AvatarImage src={group.avatar?.url} />
            <AvatarFallback>
              {group.name.charAt(0).toUpperCase() || "G"}
            </AvatarFallback>
          </Avatar>
        </div>
      </CardHeader>
      {/* Dialog for joining group */}
      {open && (
        <Dialog
          open={open}
          onOpenChange={(val) => {
            !val && setRequestMessage("");
            setOpen(val);
          }}
        >
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Join Group</DialogTitle>
              <DialogDescription>
                Are you sure you want to join this group? You can leave anytime.
              </DialogDescription>
            </DialogHeader>
            <div className="flex flex-col justify-end gap-2">
              <div className="flex flex-col gap-2 mb-4">
                <Label className="text-sm">Message (optional)</Label>
                <Textarea
                  value={requestMessage}
                  onChange={(e) => setRequestMessage(e.target.value)}
                  placeholder="Write a message..."
                />
              </div>
            </div>
            <DialogFooter>
              <Button
                variant="default"
                onClick={() => {
                  setOpen(false);
                  dispatch(
                    toggleJoinRequest({
                      id: group._id,
                      type: "request",
                      message: requestMessage,
                    })
                  );
                }}
              >
                Yes, Join
              </Button>
              <DialogClose asChild>
                <Button variant="outline" onClick={() => setOpen(false)}>
                  Cancel
                </Button>
              </DialogClose>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
      <CardContent className="flex justify-between items-start gap-3">
        <div className="flex flex-col gap-1 md:px-4 pt-0 pb-3">
          <h3 className="md:text-2xl text-xl pb-2 font-semibold">
            {group.name || "Group Name"}
          </h3>
          <span className="text-sm">{group.headline || "Group Headline"}</span>
          {/* locations list */}
          <div className="flex justify-start items-center gap-2">
            <h3 className="text-opacity-50 text-sm -mt-1 opacity-50">
              {group.location.join(", ")}
            </h3>
          </div>
          {/* members, admin, requests count */}
          <div className="flex opacity-60 items-center gap-2">
            <Link
              href={`/group/${id}/peoples/admin`}
              className="block hover:underline"
            >
              <span className="text-sm pr-1 font-semibold">
                {users.admin.length || 0}
              </span>
              <span className="text-sm">admin</span>
            </Link>
            <Link
              href={`/group/${id}/peoples/members`}
              className="block hover:underline"
            >
              <span className="text-sm pr-1 font-semibold">
                {users.members.length || 0}
              </span>
              <span className="text-sm">Members</span>
            </Link>
            {isAdmin && (
              <Link
                href={`/group/${id}/peoples/requests`}
                className="block hover:underline"
              >
                <span className="text-sm pr-1 font-semibold">
                  {users.requests.length || 0}
                </span>
                <span className="text-sm">Requests</span>
              </Link>
            )}
          </div>
          <div className="flex justify-start items-center gap-3 mt-5">
            {!isMember && (
              <Button
                className={`flex items-center rounded-full ${
                  isRequested
                    ? "bg-white text-black border border-gray-300 hover:bg-gray-100"
                    : "bg-blue-500 text-white border border-blue-500 hover:bg-blue-600"
                }`}
                variant={"default"}
                onClick={toggleJoin}
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
                Leave Group
              </Button>
            )}
            <Button
              className="flex items-center rounded-full"
              variant={"default"}
            >
              <Link target="_blank" href={group.website || ""}>
                Visit website
              </Link>
            </Button>
            {isAdmin && (
              <Button
                className="flex items-center rounded-full"
                variant={"outline"}
              >
                <Link href={`/group/${group._id}/peoples/requests`}>
                  Requests
                </Link>
              </Button>
            )}
            <Button
              className="flex items-center border-primary text-primary rounded-full hover:text-white hover:bg-primary"
              variant={"outline"}
            >
              Message
            </Button>
            <DropdownMenu>
              <DropdownMenuTrigger className="flex justify-center items-center gap-2 p-2 border-foreground rounded-full border">
                <MoreHorizontal className="w-5 h-5" />
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuGroup>
                  <DropdownMenuItem>
                    <Link className="flex gap-2" href={"/group/create"}>
                      <Plus className="w-4 h-4" />
                      <div className="">Create Group</div>
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <Link href={`/group/${group._id}/invitation`}>
                      <div className="">Send Invitation</div>
                    </Link>
                  </DropdownMenuItem>
                </DropdownMenuGroup>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
        <div className="flex justify-start items-start">
          {isAdmin && (
            <Link href={`/group/${group._id}/update`} className="p-2">
              <Edit2 className="w-5 h-5 opacity-90" />
            </Link>
          )}
        </div>
      </CardContent>
      <Separator />
    </Card>
  );
}

export default GroupProfile;
