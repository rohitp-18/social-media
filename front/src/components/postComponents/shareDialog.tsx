"use client";

import React, { useEffect, useState, useCallback, Fragment, memo } from "react";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../ui/dialog";
import { Separator } from "../ui/separator";
import { Input } from "../ui/input";
import axios from "@/store/axios";
import { toast } from "sonner";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import {
  MessageCircleMoreIcon,
  User,
  X,
  Copy,
  Instagram,
  Linkedin,
  Facebook,
} from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/store/store";
import { Button } from "../ui/button";
import { Email, Thread, Whatsapp } from "@/assets/icons";
import { searchPeoples } from "@/store/search/allSearchSlice";
import { useSocket } from "@/store/utils/socketContext";

function ShareDialog({
  post,
  open,
  setOpen,
}: {
  post: any;
  open: boolean;
  setOpen: any;
}) {
  const [searchText, setSearchText] = useState("");
  const [message, setMessage] = useState("");
  const [selectedUsers, setSelectedUsers] = useState<any[]>([]);

  const dispatch = useDispatch<AppDispatch>();
  const { peoples } = useSelector((state: RootState) => state.search);
  const { socket } = useSocket();

  // callback to handle copy link action
  const handleCopyLink = useCallback(() => {
    const link = `${window.location.origin}/post/${post?._id}`;
    navigator.clipboard
      .writeText(link)
      .then(() => {
        toast.success("Link copied to clipboard!");
      })
      .catch(() => {
        toast.error("Failed to copy link.");
      });
  }, [post]);

  const sendToUsersHandler = useCallback(async () => {
    if (selectedUsers.length === 0) {
      toast.error("Please select at least one user to send the post.");
      return;
    }

    try {
      await Promise.all(
        selectedUsers.map(async (u: string) => {
          const { data } = await axios.post("/chat/create/message", {
            content: `Check out this post: ${window.location.origin}/post/${post?._id} \n${message}`,
            userId: u,
          });

          socket?.emit("send_message", data.message);
        })
      );

      toast.success("Post shared successfully!");
      setOpen(false);
      setSelectedUsers([]);
      setMessage("");
    } catch (error) {
      console.error("Error sharing post:", error);
      toast.error("An error occurred while sharing the post.");
    }
  }, [post, selectedUsers, message, setOpen]);

  const footerShare = [
    { icon: Copy, label: "Copy Link", action: handleCopyLink },
    {
      icon: Instagram,
      label: "Instagram",
      action: () =>
        window.open(
          `https://instagram.com/share?url=${window.location.origin}/post/${post?._id}`,
          "_blank"
        ),
    },
    {
      icon: X,
      label: "X",
      action: () =>
        window.open(
          `https://x.com/intent/tweet?url=${window.location.origin}/post/${post?._id}`,
          "_blank"
        ),
    },
    {
      icon: MessageCircleMoreIcon,
      label: "Message",
      action: () =>
        window.open(
          `https://www.facebook.com/dialog/send?link=${window.location.origin}/post/${post?._id}`,
          "_blank"
        ),
    },
    {
      icon: Linkedin,
      label: "LinkedIn",
      action: () =>
        window.open(
          `https://www.linkedin.com/sharing/share-offsite/?url=${window.location.origin}/post/${post?._id}`,
          "_blank"
        ),
    },
    {
      icon: Whatsapp,
      label: "WhatsApp",
      action: () =>
        window.open(
          `https://wa.me/?text=${window.location.origin}/post/${post?._id}`,
          "_blank"
        ),
    },
    {
      icon: Facebook,
      label: "Facebook",
      action: () =>
        window.open(
          `https://www.facebook.com/sharer/sharer.php?u=${window.location.origin}/post/${post?._id}`,
          "_blank"
        ),
    },
    {
      icon: Email,
      label: "Email",
      action: () =>
        window.open(
          `mailto:?subject=Check out this post&body=${window.location.origin}/post/${post?._id}`,
          "_blank"
        ),
    },
    {
      icon: Thread,
      label: "Thread",
      action: () =>
        window.open(
          `https://www.reddit.com/submit?url=${window.location.origin}/post/${post?._id}`,
          "_blank"
        ),
    },
  ];

  const fetchUsers = useCallback(async () => {
    if (!searchText.trim()) return;
    dispatch(searchPeoples({ q: searchText.trim(), limit: 10, page: 1 }));
  }, [searchText]);

  const RenderUser = memo(function RenderUser({ user }: { user: any }) {
    const userId = user?._id;
    const isSelected = selectedUsers.includes(userId);

    const toggleSelect = () => {
      setSelectedUsers((prev) =>
        isSelected ? prev.filter((id) => id !== userId) : [...prev, userId]
      );
    };

    return (
      <label
        key={userId}
        className={`flex items-center justify-between p-2 rounded-lg cursor-pointer transition-colors gap-3 ${
          isSelected ? "bg-primary/10 border border-primary" : "hover:bg-accent"
        }`}
      >
        <div className="flex-shrink-0 flex items-center gap-2">
          <Avatar className="mr-2 shadow">
            <AvatarImage src={user.avatar?.url} />
            <AvatarFallback>
              <User className="w-6 h-6 text-primary" />
            </AvatarFallback>
          </Avatar>
          <div className="flex flex-col min-w-0">
            <span className="font-semibold text-foreground truncate">
              {user.name}
            </span>
            <span className="text-xs text-muted-foreground truncate max-w-xs">
              {user.headline}
            </span>
          </div>
        </div>
        <Input
          type="checkbox"
          checked={isSelected}
          aria-label={`Select ${user.name}`}
          onChange={toggleSelect}
          className="ml-auto h-4 w-4 cursor-pointer rounded border-gray-300 focus:ring-2 focus:ring-primary transition-colors disabled:cursor-not-allowed disabled:bg-gray-100 disabled:border-gray-300 disabled:opacity-50"
        />
      </label>
    );
  });

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent
        style={{ scrollbarWidth: "thin" }}
        className="max-w-lg w-full p-0 max-h-[90vh] flex flex-col overflow-hidden"
      >
        <div className="relative flex flex-col p-2 h-full w-full max-w-lg overflow-hidden">
          <DialogHeader className="sticky top-0 left-0 w-full max-w-lg bg-background z-10">
            <div className="flex justify-between items-center w-full gap-4 p-1">
              <DialogTitle>Share Post</DialogTitle>
              <DialogClose>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setOpen(false)}
                  aria-label="Close"
                >
                  <X className="w-5 h-5" />
                </Button>
              </DialogClose>
            </div>
            <div className="flex flex-col gap-4 p-2 pt-0 w-full">
              <div className="flex items-center gap-2">
                <Input
                  value={searchText}
                  onChange={(e) => setSearchText(e.target.value)}
                  placeholder="Search for users"
                  className="flex-1"
                  autoFocus
                  onKeyDown={(e) => {
                    fetchUsers();
                  }}
                  spellCheck={false}
                  type="search"
                />
                <Button
                  variant="outline"
                  className="h-9 px-3"
                  type="button"
                  disabled={!searchText.trim()}
                  onClick={fetchUsers}
                >
                  Search
                </Button>
              </div>
            </div>
          </DialogHeader>

          <div className="flex-1 overflow-y-auto">
            <div className="flex flex-col gap-2">
              <div className="flex h-full flex-col gap-2 w-full p-6">
                {peoples.length > 0 ? (
                  peoples.map((user) => (
                    <Fragment key={user._id}>
                      <RenderUser user={user} />
                    </Fragment>
                  ))
                ) : (
                  <div className="text-center text-muted-foreground">
                    No users found
                  </div>
                )}
              </div>
            </div>
          </div>

          <Separator />
          <DialogFooter className="sticky bottom-0 left-0 z-10 p-4 pt-1 bg-background justify-normal">
            {selectedUsers.length === 0 ? (
              <div
                style={{ scrollbarWidth: "none" }}
                className="flex items-center justify-between gap-2 overflow-x-auto"
              >
                {footerShare.map(({ icon: Icon, label, action }) => (
                  <div key={label} className="flex flex-col items-center mx-2">
                    <Button
                      variant="outline"
                      size="icon"
                      className="w-12 h-12 rounded-full shadow hover:bg-accent transition"
                      onClick={action}
                      aria-label={label}
                    >
                      <Icon className="w-6 h-6" />
                    </Button>
                    <span className="mt-2 text-xs text-muted-foreground font-medium text-center">
                      {label}
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <div className="flex flex-col gap-2 w-full">
                <Input
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Add a message (optional)"
                  className="w-full"
                  spellCheck={false}
                  aria-label="Message"
                />
                <Button
                  className="w-full"
                  variant="default"
                  type="button"
                  onClick={sendToUsersHandler}
                >
                  Send
                </Button>
              </div>
            )}
          </DialogFooter>
        </div>
      </DialogContent>
    </Dialog>
  );
}

export default ShareDialog;
