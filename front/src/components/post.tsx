"use client";

import React, { Fragment, useEffect, useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
} from "./ui/card";
import {
  Earth,
  Heart,
  MessageCircleMoreIcon,
  MoreVerticalIcon,
  Repeat,
  Send,
  Share2Icon,
  User,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
  DropdownMenuItem,
} from "./ui/dropdown-menu";
import { cn } from "@/lib/utils";
import { Button } from "./ui/button";
import { useSelector } from "react-redux";
import { RootState } from "@/store/store";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { usePathname, useRouter } from "next/navigation";
import { toast } from "sonner";
import axios from "@/store/axios";
import { Drawer } from "./ui/drawer";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogTitle,
  DialogTrigger,
} from "./ui/dialog";
import { Separator } from "./ui/separator";
import { Input } from "./ui/input";
import Comments from "./postComponents/comments";
import ShareDialog from "./postComponents/shareDialog";
import { timeAgo } from "@/lib/functions";

function Post({ cardClass, post, isFollowing, setEdit, setSelect }: any) {
  const [isLike, setIsLike] = useState(false);
  const [likeCount, setLikeCount] = useState(0);
  const [share, setShare] = useState(false);
  const [isSaved, setIsSaved] = useState(false);

  const { user } = useSelector((state: RootState) => state.user);
  const router = useRouter();

  const editHandler = () => {
    if (setEdit && setSelect) {
      setEdit(true);
      setSelect(post);
    } else {
      router.push(
        `/u/${user?.username}/details/activity?edit=true&post=${post._id}`
      );
    }
  };

  async function toggleSavePost(postId: string) {
    try {
      const { data } = await axios.put(`/posts/post/${postId}/save`, {});
      toast.success(data.message, { position: "top-center" });
      setIsSaved(data.isSaved);
    } catch (error: any) {
      toast.error(error.response?.data.message || "Internal Error", {
        position: "top-center",
      });
    }
  }

  async function toggleLike(e: any) {
    e.preventDefault();

    try {
      const { data } = await axios.put(`/posts/post/${post._id}/like`, {}, {});
      setIsLike(data.isLiked);
      setLikeCount(data.likeCount);
    } catch (error) {
      toast.error("Internal Error", { position: "top-center" });
    }
  }

  useEffect(() => {
    if (post && user) {
      if (post.likes) {
        setIsLike(post.likes.includes(user?._id));
        setLikeCount(post.likeCount || 0);
        setIsSaved(post.savedBy.includes(user?._id));
      }
    }

    return;
  }, [post, user]);

  return (
    // <Card className="card max-w-[500px] border border-1 border-zinc-800 justify-center items-center bg-card text-card-foreground">
    <>
      {post && (
        <Card className={cn("w-[500px]", cardClass)}>
          {post.userId && (
            <CardHeader className="flex flex-row justify-between items-start gap-2 py-4">
              <div className="flex items-start gap-3">
                <Avatar className="h-12 w-12">
                  <AvatarImage
                    src={post.userId?.avatar?.url}
                    alt={post.userId?.name || "User"}
                  />
                  <AvatarFallback>
                    <User className="w-6 h-6" />
                  </AvatarFallback>
                </Avatar>
                <div>
                  <h2 className="font-semibold text-lg">{post.userId?.name}</h2>
                  <p className="text-sm opacity-90 -mt-1">
                    {post.userId?.headline}
                  </p>
                  <div className="text-xs opacity-70 leading-none flex items-center gap-1">
                    <span>{post.createdAt ? timeAgo(post.createdAt) : ""}</span>
                    <span className="text-xs flex items-center">
                      <Earth className="w-3 h-3" />
                    </span>
                  </div>

                  <Button
                    className="w-min mt-2.5 flex md:hidden px-7 py-2 border-primary text-primary hover:text-white hover:bg-primary rounded-full"
                    variant={"outline"}
                    size={"sm"}
                  >
                    Follow
                  </Button>
                </div>
              </div>
              <div className="flex items-center gap-3">
                {isFollowing && user?._id !== post.userId?._id && (
                  <Button
                    className="w-min md:ml-8 hidden md:flex px-7 py-2 border-primary text-primary hover:text-white hover:bg-primary rounded-full"
                    variant={"outline"}
                    size={"sm"}
                  >
                    Follow
                  </Button>
                )}
                <DropdownMenu>
                  <DropdownMenuTrigger>
                    <MoreVerticalIcon className="h-5 w-5" />
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="mt-2 p-2 bg-background rounded-lg shadow-lg">
                    <DropdownMenuItem className="cursor-pointer focus-visible:outline-none py-1.5 px-1 text-sm">
                      Save post
                    </DropdownMenuItem>
                    <DropdownMenuItem className="cursor-pointer focus-visible:outline-none py-1.5 px-1 text-sm">
                      Copy link
                    </DropdownMenuItem>
                    <DropdownMenuItem className="cursor-pointer focus-visible:outline-none py-1.5 px-1 text-sm">
                      Report post
                    </DropdownMenuItem>
                    {user?._id === post.userId?._id && (
                      <>
                        <DropdownMenuItem
                          onClick={editHandler}
                          className="cursor-pointer focus-visible:outline-none py-1.5 px-1 text-sm text-blue-500"
                        >
                          Edit post
                        </DropdownMenuItem>
                        <DropdownMenuItem className="cursor-pointer focus-visible:outline-none py-1.5 px-1 text-sm text-red-500">
                          Delete post
                        </DropdownMenuItem>
                      </>
                    )}
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </CardHeader>
          )}
          <hr />
          <CardContent className="py-6">
            <CardDescription className="text-opacity-90">
              {post?.content}
            </CardDescription>
            <div className="flex flex-wrap gap-2 mt-4">
              {post.images && post.images.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-4">
                  {post.images.map((image: any, index: number) => (
                    <img
                      key={index}
                      src={image.url}
                      alt={`Post image ${index + 1}`}
                      className="w-full h-auto rounded-lg"
                    />
                  ))}
                </div>
              )}
              {post.video && (
                <video
                  className="w-full h-auto rounded-lg mt-4"
                  controls
                  src={post.video.url}
                >
                  Your browser does not support the video tag.
                </video>
              )}
            </div>
          </CardContent>
          {/* <hr className="pb-1" /> */}
          {/* <CardContent className="flex justify-between py-1 pt-0 items-center gap-4">
            <div className="flex gap-2">
              <div className="flex items-center gap-1 text-xs">
                <span>{likeCount}</span>
                <span className="font-semibold">Likes</span>
              </div>
            </div>
            <div></div>
          </CardContent> */}
          <hr className="pt-3 pb-1" />

          <CardFooter className="pb-3">
            <div className="flex w-full justify-between">
              <div
                onClick={(e) => toggleLike(e)}
                className="flex-col hover:cursor-pointer hover:scale-105 gap-1 items-center flex w-14"
              >
                <Heart
                  className={`h-5 w-5 ${
                    isLike
                      ? "fill-red-600 stroke-red-600 border-none"
                      : "fill-none"
                  }`}
                />
                <h4 className="text-sm opacity-80">
                  {likeCount > 0 ? likeCount : "Likes"}
                </h4>
              </div>
              <Comments postId={post._id} />
              <div
                onClick={() => setShare(!share)}
                className="flex-col hover:cursor-pointer hover:scale-105 gap-1 items-center flex w-14"
              >
                <Send className="h-5 w-5" />
                <h4 className="text-sm opacity-80">Share</h4>
              </div>
              {share && (
                <ShareDialog
                  post={post}
                  open={share}
                  setOpen={(val: boolean) => setShare(val)}
                />
              )}
              <div
                onClick={() => toggleSavePost(post._id)}
                className="flex-col hover:cursor-pointer hover:scale-105 gap-1 items-center flex w-14"
              >
                <svg
                  className={`w-5 h-5 ${
                    isSaved ? "fill-foreground" : "fill-background"
                  }`}
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  fill="none"
                  strokeWidth={2}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-5-7 5V5z"
                  />
                </svg>
                <h4 className="text-sm opacity-80">
                  {isSaved ? "Saved" : "Save"}
                </h4>
              </div>
            </div>
          </CardFooter>
        </Card>
      )}
    </>
  );
}

export default Post;
