import React, { useEffect, useState, useCallback, Fragment } from "react";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog";
import { Separator } from "../ui/separator";
import { Input } from "../ui/input";
import axios from "@/store/axios";
import { toast } from "sonner";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import {
  MessageCircleMoreIcon,
  Send,
  User,
  ThumbsUp,
  Reply,
  X,
  MoreHorizontal,
  Copy,
  Instagram,
  Linkedin,
  Facebook,
} from "lucide-react";
import { useSelector } from "react-redux";
import { RootState } from "@/store/store";
import { Button } from "../ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { Email, Thread, Whatsapp } from "@/assets/icons";

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
      const response = await axios.post("/post/share", {
        postId: post?._id,
        users: selectedUsers,
        message,
      });

      if (response.status === 200) {
        toast.success("Post shared successfully!");
        setOpen(false);
        setSelectedUsers([]);
        setMessage("");
      } else {
        toast.error("Failed to share the post.");
      }
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

    try {
      const response = await axios.get("/users/search", {
        params: { query: searchText },
      });

      if (response.status === 200) {
        // Assuming response.data is an array of user objects
        return response.data;
      } else {
        toast.error("Failed to fetch users.");
      }
    } catch (error) {
      console.error("Error fetching users:", error);
      toast.error("An error occurred while fetching users.");
    }
  }, [searchText]);

  function RenderUser({ user, index }: { user: any; index: number }) {
    return (
      <label
        key={index}
        className={`flex items-center justify-between p-2 rounded-lg cursor-pointer transition-colors gap-3 ${
          selectedUsers.includes(index)
            ? "bg-primary/10 border border-primary"
            : "hover:bg-accent"
        }`}
      >
        <div className="flex-shrink-0 flex items-center gap-2">
          <Avatar className="mr-2 shadow">
            <AvatarImage />
            <AvatarFallback>
              <User className="w-6 h-6 text-primary" />
            </AvatarFallback>
          </Avatar>
          <div className="flex flex-col min-w-0">
            <span className="font-semibold text-foreground truncate">
              {`User ${index + 1}`}
            </span>
            <span className="text-xs text-muted-foreground truncate max-w-xs">
              {`user${index + 1}`}
            </span>
          </div>
        </div>
        <Input
          type="checkbox"
          checked={selectedUsers.includes(index)}
          aria-label={`Select ${index + 1}`}
          onChange={() => {
            setSelectedUsers((prev) =>
              selectedUsers.includes(index)
                ? prev.filter((id) => id !== index)
                : [...prev, index]
            );
          }}
          className="ml-auto h-4 w-4 cursor-pointer rounded border-gray-300 focus:ring-2 focus:ring-primary transition-colors disabled:cursor-not-allowed disabled:bg-gray-100 disabled:border-gray-300 disabled:opacity-50"
        />
      </label>
    );
  }

  return (
    <Dialog open={open} onOpenChange={(val) => setOpen(val)}>
      <DialogContent className="sm:max-w-lg sm:w-full p-0">
        <DialogHeader className="fixed top-0 left-0 w-full bg-background z-10 px-6 pt-6 pb-3">
          <DialogTitle>Share Post</DialogTitle>
          <div className="flex flex-col gap-4">
            <div className="flex items-center gap-2">
              <Input
                value={searchText}
                onChange={(e) => setSearchText(e.target.value)}
                placeholder="Search for users"
                className="flex-1"
                autoFocus
                spellCheck={false}
                type="search"
              />
              <Button
                variant="outline"
                className="h-9 px-3"
                type="button"
                disabled={!searchText.trim()}
                onClick={() => {
                  console.log(`Searching for users with text: ${searchText}`);
                }}
              >
                Search
              </Button>
            </div>
          </div>
        </DialogHeader>
        <DialogClose className="absolute top-2 z-[100] right-2">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setOpen(false)}
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </Button>
        </DialogClose>
        <div className="my-20 overflow-y-auto" style={{ maxHeight: "400px" }}>
          <div className="flex flex-col gap-2">
            <div className="flex h-full flex-col gap-2 w-full p-6">
              {searchText.trim()
                ? Array.from({ length: 10 }, (_: any, index: any) => (
                    <RenderUser user={{}} index={index} key={index} />
                  ))
                : Array.from({ length: 5 }, (_, index) => (
                    <RenderUser user={{}} index={index} key={index} />
                  ))}
            </div>
          </div>
        </div>

        <DialogFooter className="fixed bottom-0 px-3 bg-background left-0 w-full pt-1 flex-col sm:flex-col">
          <Separator className="my-1" />
          {selectedUsers.length <= 0 ? (
            <div
              style={{ scrollbarWidth: "none" }}
              className="flex items-center justify-between overflow-auto pb-3 gap-2"
            >
              {footerShare.map((foot) => (
                <div
                  key={foot.label}
                  className="flex flex-col items-center mx-2"
                >
                  <Button
                    variant="outline"
                    size="icon"
                    className="w-12 h-12 rounded-full shadow hover:bg-accent transition"
                    onClick={foot.action}
                    aria-label={foot.label}
                  >
                    <foot.icon className="w-6 h-6" />
                  </Button>
                  {foot.label === "Copy Link" ? (
                    <span className="mt-2 text-xs text-muted-foreground font-medium text-center whitespace-nowrap">
                      {foot.label}
                    </span>
                  ) : (
                    <span className="mt-2 text-xs text-muted-foreground font-medium text-center">
                      {foot.label}
                    </span>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <div className="flex flex-col w-full gap-2 pb-3">
              <Input
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Add a message (optional)"
                className="w-full"
                spellCheck={false}
              />
              <Button
                className="w-full"
                variant={"default"}
                type="button"
                onClick={sendToUsersHandler}
              >
                Send
              </Button>
            </div>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export default ShareDialog;
