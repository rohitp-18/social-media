"use client";

import React, { Fragment, useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList } from "@/components/ui/tabs";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
  DropdownMenuItem,
} from "../ui/dropdown-menu";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/store/store";
import {
  ArrowRight,
  Dot,
  Earth,
  Edit2,
  MessageCircle,
  MoreHorizontal,
  Repeat,
  Share2,
  ThumbsUp,
  User2,
} from "lucide-react";
import { toggleFollow } from "@/store/user/userSlice";
import { timeAgo } from "@/lib/functions";

function ActivityCard({ isUser }: { isUser: boolean }) {
  const [activity, setActivity] = useState("post");

  const dispatch = useDispatch<AppDispatch>();
  const { user, profile } = useSelector(
    (state: RootState) => state.user as { user: any; profile: any }
  );
  return (
    <>
      {(profile.posts.length > 0 ||
        profile.media.length > 0 ||
        profile.comments.length > 0 ||
        isUser) && (
        <Card>
          <CardHeader className="pb-3">
            <div className="flex pb-3 justify-between items-start flex-row gap-2">
              <div>
                <CardTitle className="text-lg">Activity</CardTitle>
                <div className="text-xs opacity-70 text-primary/70 font-normal -mt-1">
                  {profile.user.totalFollowers} followers
                </div>
              </div>
              {isUser &&
                ((profile.posts.length > 0 && isUser && activity === "post") ||
                  activity !== "post") && (
                  <div className="flex items-center gap-2">
                    <a
                      href={`/u/${user?.username}/details/activity?add=true&type=post`}
                    >
                      <Button
                        variant={"outline"}
                        className="flex text-primary border-primary hover:text-primary items-center rounded-full"
                      >
                        Create a Post
                      </Button>
                    </a>
                    <a
                      href={`/u/${user?.username}/details/activity?type=${activity}`}
                    >
                      <Button variant={"link"} className="hover:no-underline">
                        <Edit2 className="w-5 h-5 opacity-90 text-black" />
                      </Button>
                    </a>
                  </div>
                )}
            </div>
            <div className="flex gap-3"></div>
          </CardHeader>
          <CardContent className="-mt-4">
            <Tabs
              onValueChange={(value) => setActivity(value)}
              value={activity}
            >
              <TabsList className="flex gap-3 bg-transparent items-center justify-start">
                <Button
                  variant={activity === "post" ? "default" : "outline"}
                  onClick={() => setActivity("post")}
                  className="rounded-full"
                  value="post"
                >
                  All Posts
                </Button>
                {profile.comments?.length > 0 && (
                  <Button
                    variant={activity === "comment" ? "default" : "outline"}
                    onClick={() => setActivity("comment")}
                    className="rounded-full"
                    value="comment"
                  >
                    Comments
                  </Button>
                )}
                {profile.media.length > 0 && (
                  <Button
                    variant={activity === "image" ? "default" : "outline"}
                    onClick={() => setActivity("image")}
                    className="rounded-full"
                    value="image"
                  >
                    Images
                  </Button>
                )}
              </TabsList>
              <TabsContent value="post">
                {profile.posts.length > 0 ? (
                  <Carousel
                    className="w-full px-1"
                    opts={{
                      align: "start",
                    }}
                  >
                    <CarouselContent>
                      {profile.posts.map((post: any, index: number) => (
                        <CarouselItem
                          key={post._id}
                          className="min-w-0 w-full lg:basis-1/2 md:w-1/2"
                        >
                          <Card className="min-w-0">
                            <CardHeader className="flex p-4 justify-between flex-row items-center gap-2">
                              <div className="flex justify-between items-center gap-2">
                                <Avatar className="w-10 h-10">
                                  <AvatarImage src={post.userId.avatar?.url} />
                                  <AvatarFallback>
                                    <User2 className="w-6 h-6 opacity-80" />
                                  </AvatarFallback>
                                </Avatar>
                                <div className="flex flex-col justify-start">
                                  <div className="flex items-center">
                                    <h3 className="font-semibold text-sm leading-tight">
                                      {post.userId.name}
                                    </h3>
                                    {post.userId._id === user?._id && (
                                      <span className="flex text-xs opacity-60 items-center pl-1">
                                        <Dot className="w-4 h-4" />
                                        <span>You</span>
                                      </span>
                                    )}
                                  </div>
                                  <p className="text-xs overflow-hidden flex-grow-0 whitespace-nowrap opacity-80 max-w-40 text-ellipsis w-full">
                                    {post.userId.headline}
                                  </p>
                                  <div className="text-xs opacity-70 leading-none flex items-center gap-1">
                                    <span>
                                      {post.createdAt
                                        ? timeAgo(post.createdAt)
                                        : ""}
                                    </span>
                                    <span className="text-xs flex items-center">
                                      <Earth className="w-3 h-3" />
                                    </span>
                                  </div>
                                </div>
                              </div>
                              <div className="flex justify-end items-center gap-2">
                                {!isUser &&
                                  !user?.following.includes(
                                    post.userId._id
                                  ) && (
                                    <Button
                                      className="w-min flex px-7 py-2 border-primary text-primary hover:text-white hover:bg-primary rounded-full"
                                      variant={"outline"}
                                      size={"sm"}
                                      onClick={() =>
                                        dispatch(toggleFollow(post.userId._id))
                                      }
                                    >
                                      Follow
                                    </Button>
                                  )}
                                <DropdownMenu>
                                  <DropdownMenuTrigger>
                                    <MoreHorizontal className="w-6 h-6 opacity-70 hover:opacity-100" />
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
                                        <DropdownMenuItem className="cursor-pointer focus-visible:outline-none py-1.5 px-1 text-sm text-blue-500">
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
                            <CardContent className="p-4">
                              <CardDescription>
                                <p className="text-sm line-clamp-4 text-muted-foreground">
                                  {post.content}
                                </p>
                                {post.images && post.images.length > 0 && (
                                  <div
                                    className={`grid gap-2 mt-2 ${
                                      post.images.length === 1
                                        ? ""
                                        : "grid-cols-2"
                                    }`}
                                  >
                                    {post.images.map((img: any, i: number) => (
                                      <img
                                        loading="lazy"
                                        key={i}
                                        src={img.url}
                                        alt={img.name}
                                        className={`object-cover w-full rounded-lg ${
                                          post.images.length === 1
                                            ? ""
                                            : post.images.length === 3
                                            ? "h-32"
                                            : "h-32"
                                        }`}
                                        style={
                                          post.images.length === 1
                                            ? {
                                                height: "10rem",
                                                gridColumn: "1 / -1",
                                              }
                                            : {}
                                        }
                                      />
                                    ))}
                                  </div>
                                )}
                                {post.video && (
                                  <video
                                    className="w-full h-32 rounded-lg mt-2"
                                    controls
                                    src={post.video.url}
                                  />
                                )}
                              </CardDescription>
                            </CardContent>
                            <hr />
                            <CardFooter className="p-4 -mt-2 pb-3 flex justify-evenly items-center gap-3">
                              <Button
                                variant={"link"}
                                className="flex items-center gap-1 text-foreground"
                              >
                                <ThumbsUp className="w-5 h-5" />
                              </Button>
                              <Button
                                variant={"link"}
                                className="flex items-center gap-1 text-foreground"
                              >
                                <MessageCircle className="w-5 h-5" />
                              </Button>
                              <Button
                                variant={"link"}
                                className="flex items-center gap-1 text-foreground"
                              >
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
                              </Button>
                              <Button
                                variant={"link"}
                                className="flex items-center gap-1 text-foreground"
                              >
                                <Share2 className="w-5 h-5 rotate-180" />
                              </Button>
                            </CardFooter>
                          </Card>
                        </CarouselItem>
                      ))}
                    </CarouselContent>
                    <CarouselPrevious className="-left-7" />
                    <CarouselNext className="-right-1" />
                  </Carousel>
                ) : (
                  <div className="min-h-24 h-full w-full flex flex-col gap-1 justify-center items-center">
                    {isUser && (
                      <a
                        href={`/u/${user?.username}/details/activity?add=true&type=post`}
                      >
                        <Button
                          variant={"outline"}
                          className="flex text-primary border-primary hover:text-primary items-center rounded-full"
                        >
                          Create a Post
                        </Button>
                      </a>
                    )}
                    <span className="opacity-70 text-sm">
                      Here's not yet posted anything.
                    </span>
                  </div>
                )}
              </TabsContent>
              <TabsContent value="comment">
                <div className="flex flex-col gap-2 py-2 justify-start">
                  {profile.comments.map((_: any, i: number) => (
                    <Fragment key={i}>
                      <div className="text-xs pt-2">
                        <div className="opacity-70 flex gap-2">
                          <span className="font-normal">Your Name</span>
                          <span>commented on a post</span>
                          <span>
                            <Dot className="w-4 h-4 inline -mr-1.5" /> 3w
                          </span>
                        </div>
                        <p className="text-sm pb-2 pt-1">
                          Lorem ipsum dolor, sit amet consectetur adipisicing
                          elit. Saepe architecto quibusdam esse inventore
                          reiciendis corporis dicta dolorum natus quis
                          repudiandae?
                        </p>
                      </div>
                      <hr />
                    </Fragment>
                  ))}
                </div>
                {/* <div className="min-h-20 flex justify-center items-center">
          <span className="opacity-70 font-normal text-sm">
            No Comments Found
          </span>
        </div> */}
              </TabsContent>
              <TabsContent value="image">
                <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                  {profile.media && profile.media.length > 0 ? (
                    profile.media.map((img: any, i: number) => (
                      <div
                        key={i}
                        className="h-48 overflow-hidden rounded-lg bg-muted flex items-center justify-center border border-border"
                      >
                        <img
                          loading="lazy"
                          src={img.url}
                          alt={img.name}
                          className="object-cover w-full h-full"
                        />
                      </div>
                    ))
                  ) : (
                    <div className="col-span-full flex flex-col items-center justify-center py-8">
                      <span className="opacity-70 text-sm">
                        No images found
                      </span>
                    </div>
                  )}
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
          <CardFooter className="p-0 flex-col">
            <hr className="w-full" />
            {((profile.posts.length > 0 && activity === "post") ||
              (profile.comments.length > 0 && activity === "comment") ||
              (profile.media.length > 0 && activity === "image")) && (
              <a
                href={`/u/${user?.username}/details/activity?type=${activity}`}
              >
                <Button
                  variant={"link"}
                  className="w-full h-12 hover:no-underline hover:bg-secondary text-foreground"
                >
                  Show all{" "}
                  {activity === "post"
                    ? "Posts"
                    : activity === "comment"
                    ? "Comments"
                    : "Images"}{" "}
                  <ArrowRight className="w-10 h-10" />
                </Button>
              </a>
            )}
          </CardFooter>
        </Card>
      )}
    </>
  );
}

export default ActivityCard;
