"use client";

import React, { Fragment, useCallback, useEffect, useState } from "react";
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
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/store/store";
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
import Link from "next/link";
import { toggleFollow } from "@/store/user/userSlice";
import { SaveIcon } from "@/assets/icons";

function Post({
  cardClass,
  post,
  isFollowing,
  setEdit,
  setSelect,
  comment,
}: any) {
  const [isLike, setIsLike] = useState(false);
  const [likeCount, setLikeCount] = useState(0);
  const [share, setShare] = useState(false);
  const [isSaved, setIsSaved] = useState<boolean>(false);

  const dispatch = useDispatch<AppDispatch>();
  const { user } = useSelector((state: RootState) => state.user);
  const router = useRouter();

  const editHandler = () => {
    if (setEdit && !setSelect) {
      setEdit(true);
      setSelect(post);
    } else if (post && post.type === "user") {
      router.push(
        `/u/${user?.username}/details/activity?edit=true&post=${post._id}`
      );
    } else {
      router.push(`/post/${post._id}/update`);
    }
  };

  async function toggleSavePost(postId: string) {
    if (!user) {
      toast.error("You must be logged in to save a post", {
        position: "top-center",
      });
      return;
    }
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

  async function toggleLike() {
    if (!user) {
      toast.error("You must be logged in to like a post", {
        position: "top-center",
      });
      return;
    }

    try {
      const { data } = await axios.put(`/posts/post/${post._id}/like`, {}, {});
      setIsLike(data.isLiked);
      setLikeCount(data.likeCount);
    } catch (error) {
      toast.error("Internal Error", { position: "top-center" });
    }
  }

  async function copyLink(postId: string) {
    try {
      await navigator.clipboard.writeText(
        `${window.location.origin}/post/${postId}`
      );
      toast.success("Link copied to clipboard", { position: "top-center" });
    } catch (error) {
      toast.error("Failed to copy link", { position: "top-center" });
    }
  }

  const handleShare = useCallback(() => {
    if (!user) {
      toast.error("You must be logged in to share a post", {
        position: "top-center",
      });
      return;
    }
    setShare(true);
  }, [user]);

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

  if (!post) {
    return null; // Handle case where post is not available
  }

  const CommentPreview = ({ comment }: any) => {
    <div className="flex items-center gap-2 mb-3">
      <Avatar className="h-8 w-8">
        <AvatarImage
          src={comment.user.avatar?.url}
          alt={comment.user.name || "User"}
        />
        <AvatarFallback>
          {comment.user.name?.charAt(0).toUpperCase() || (
            <User className="w-3 h-3" />
          )}
        </AvatarFallback>
      </Avatar>
      <div className="flex flex-col">
        <span className="text-sm font-semibold">{comment.user.name}</span>
        <span className="text-xs text-gray-600">
          {timeAgo(comment.createdAt)}
        </span>
      </div>
      {comment.content}
    </div>;
  };
  return (
    <Card className={cn("w-[500px] max-w-full", cardClass)}>
      {post.postType !== "user" && post.origin && (
        <>
          <CardHeader className="flex flex-col md:flex-row justify-between items-start gap-2 md:p-2 p-1 pb-1">
            <Link
              href={`/${post.postType}/${post.origin._id}`}
              className="flex items-center gap-3 hover:underline"
            >
              <Avatar className="h-8 w-8">
                <AvatarImage
                  src={post.origin.avatar?.url}
                  alt={post.origin.name || "User"}
                />
                <AvatarFallback>
                  {post.origin.name?.charAt(0).toUpperCase() || (
                    <User className="w-3 h-3" />
                  )}
                </AvatarFallback>
              </Avatar>
              <div>
                <h2 className="font-semibold text-sm">{post.origin.name}</h2>
                <p className="text-xs text-gray-600">{post.origin.headline}</p>
              </div>
            </Link>
          </CardHeader>
          <Separator className="my-2" />
        </>
      )}
      <CardHeader className="flex flex-row justify-between items-start gap-2 py-3 md:px-6 px-3">
        <div className="flex flex-row items-start gap-3">
          <Link
            href={`/u/${post.userId.username}`}
            className="flex items-start gap-3"
          >
            <Avatar className="h-12 w-12">
              <AvatarImage
                src={post.userId?.avatar?.url}
                alt={post.userId?.name || "User"}
              />
              <AvatarFallback>
                <User className="w-6 h-6" />
              </AvatarFallback>
            </Avatar>
          </Link>
          <div>
            <Link href={`/u/${post.userId.username}`}>
              <h2 className="font-semibold text-lg">{post.userId.name}</h2>
              <p className="text-sm opacity-90 -mt-1">{post.userId.headline}</p>
              <div className="text-xs opacity-70 leading-none flex items-center gap-1">
                <span>{timeAgo(post.createdAt)}</span>
                <span className="text-xs flex items-center">
                  <Earth className="w-3 h-3" />
                </span>
              </div>
            </Link>

            {(!user || (isFollowing && user?._id !== post.userId._id)) && (
              <Button
                className="w-min mt-2.5 flex md:hidden px-7 py-2 border-primary text-primary hover:text-white hover:bg-primary rounded-full"
                variant={"outline"}
                size={"sm"}
                onClick={(e) => {
                  if (!user) {
                    toast.error("You must be logged in to follow users", {
                      position: "top-center",
                    });
                    return;
                  }
                  dispatch(toggleFollow(post.userId._id));
                }}
              >
                Follow
              </Button>
            )}
          </div>
        </div>
        <div className="flex items-center gap-3">
          {(!user || (isFollowing && user?._id !== post.userId._id)) && (
            <Button
              className="w-min md:ml-8 hidden md:flex px-7 py-2 border-primary text-primary hover:text-white hover:bg-primary rounded-full"
              variant={"outline"}
              size={"sm"}
              onClick={(e) => {
                if (!user) {
                  toast.error("You must be logged in to follow users", {
                    position: "top-center",
                  });
                  return;
                }
                dispatch(toggleFollow(post.userId._id));
              }}
            >
              Follow
            </Button>
          )}
          <DropdownMenu>
            <DropdownMenuTrigger>
              <MoreVerticalIcon className="h-5 w-5" />
            </DropdownMenuTrigger>
            <DropdownMenuContent className="mt-2 p-2 bg-background rounded-lg shadow-lg">
              <DropdownMenuItem
                onClick={() => toggleSavePost(post._id)}
                className="cursor-pointer focus-visible:outline-none py-1.5 px-1 text-sm"
              >
                Save post
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => copyLink(post._id)}
                className="cursor-pointer focus-visible:outline-none py-1.5 px-1 text-sm"
              >
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
      <hr />
      <CardContent className="py-6">
        <CardDescription className="text-opacity-90">
          {post.content}
        </CardDescription>
        <div className="flex flex-wrap gap-2 mt-4">
          {post.images && post.images.length > 0 && (
            <div className="flex flex-wrap gap-2 mt-4">
              {post.images.map((image: any, index: number) => (
                <img
                  loading="lazy"
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
              className="w-full min-h-[200px] max-h-96 rounded-lg mt-4"
              controls
              src={post.video.url}
            >
              Your browser does not support the video tag.
            </video>
          )}
        </div>
      </CardContent>
      <hr className="pt-3 pb-1" />

      <CardFooter className="pb-3">
        <div className="flex w-full justify-between">
          <div
            onClick={() => toggleLike()}
            className="flex-col hover:cursor-pointer hover:scale-105 gap-1 items-center flex w-14"
          >
            <Heart
              className={`h-5 w-5 ${
                isLike ? "fill-red-600 stroke-red-600 border-none" : "fill-none"
              }`}
            />
            <h4 className="text-sm opacity-80">
              {likeCount > 0 ? likeCount : "Likes"}
            </h4>
          </div>
          <Comments postId={post._id} />
          <div
            onClick={() => handleShare()}
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
            <SaveIcon isSaved={isSaved} />
            <h4 className="text-sm opacity-80">{isSaved ? "Saved" : "Save"}</h4>
          </div>
        </div>
      </CardFooter>
      {comment && (
        <CardContent className="border-t pt-4">
          <div className="flex items-start gap-3">
            <Avatar className="h-10 w-10">
              <AvatarImage
                src={comment.user.avatar?.url}
                alt={comment.user.name || "User"}
              />
              <AvatarFallback>
                {comment.user.name?.charAt(0).toUpperCase() || (
                  <User className="w-4 h-4" />
                )}
              </AvatarFallback>
            </Avatar>
            <div className="flex flex-col w-full">
              <div className="flex justify-between items-center">
                <div className="flex flex-col">
                  <span className="text-md font-semibold text-gray-900">
                    {comment.user.name}
                  </span>
                  <span className="text-xs text-gray-500">
                    {comment.user.headline} • {timeAgo(comment.createdAt)}
                  </span>
                </div>
              </div>
              <p className="mt-2 text-sm text-gray-800 leading-relaxed">
                {comment.content}
              </p>
            </div>
          </div>
        </CardContent>
      )}
    </Card>
  );
}

export default Post;
