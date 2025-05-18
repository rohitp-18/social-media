"use client";

import React from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
} from "./ui/card";
import {
  Heart,
  MessageCircleMoreIcon,
  MoreVerticalIcon,
  Repeat,
  Share2Icon,
  User,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { DropdownMenuItem } from "@radix-ui/react-dropdown-menu";
import { cn } from "@/lib/utils";
import { Button } from "./ui/button";
import { useSelector } from "react-redux";
import { RootState } from "@/store/store";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { usePathname, useRouter } from "next/navigation";

function Post({ cardClass, post, isFollowing, setEdit, setSelect }: any) {
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
                    src={post.userId?.avatar.url}
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
          <hr className="pt-3 pb-1" />
          <CardFooter className="pb-3">
            <div className="flex w-full justify-between">
              <div className="flex-col gap-1 items-center flex">
                <Heart className="h-5 w-5" />
                <h4 className="text-sm opacity-80">Like</h4>
              </div>
              <div className="flex-col gap-1 items-center flex">
                <MessageCircleMoreIcon className="h-5 w-5" />
                <h4 className="text-sm opacity-80">Comment</h4>
              </div>
              <div className="flex-col gap-1 items-center flex">
                <Share2Icon className="h-5 w-5" />
                <h4 className="text-sm opacity-80">Share</h4>
              </div>
              {/* <div className="flex-col gap-1 items-center flex">
                <Repeat className="h-5 w-5" />
                <h4 className="text-sm opacity-80">Repost</h4>
              </div> */}
              <div className="flex-col gap-1 items-center flex">
                <svg
                  className="h-5 w-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-5-7 5V5z"
                  />
                </svg>
                <h4 className="text-sm opacity-80">Save</h4>
              </div>
            </div>
          </CardFooter>
        </Card>
      )}
    </>
  );
}

export default Post;
