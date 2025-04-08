"use client";

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
import Navbar from "@/components/userNavbar";
import {
  ArrowRight,
  Dot,
  Earth,
  Menu,
  MessageCircle,
  MoreHorizontal,
  Plus,
  Repeat,
  Share2,
  ThumbsUp,
  User2,
  Users2,
} from "lucide-react";
import Image from "next/image";
import React, { useEffect, useState } from "react";
import back from "@/assets/back.png";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";

function Page() {
  const [activity, setActivity] = useState("post");

  return (
    <>
      <Navbar />
      <main className="bg-[#f2f6f8] dark:bg-[#151515] w-full overflow-hidden py-5">
        <div className="container max-w-[1170px] mx-auto">
          {/* <section className="flex mx-auto max-w-7xl justify-center gap-2"> */}
          <section className="md:grid md:grid-cols-[1fr_300px] mx-auto max-w-7xl min-h-screen gap-3">
            <section className="min-h-screen max-w-[860px] overflow-hidden px-2 w-full flex flex-col gap-5 flex-grow-0">
              <Card>
                <CardHeader className="p-0 rounded-2xl pb-3 flex flex-row justify-between items-center gap-2">
                  <div className="flex flex-col relative w-full">
                    <Image
                      src={back}
                      alt="background"
                      className="w-full aspect-[4/1] flex-shrink-0 rounded-t-lg"
                    />
                    <Avatar className="w-24 h-24 md:w-36 p-2 bg-background border-3 border-background md:-mt-16 md:h-36 ml-5 -mt-12">
                      <AvatarImage src="" />
                      <AvatarFallback>
                        <User2 className="w-20 opacity-70 h-20 p-5" />
                      </AvatarFallback>
                    </Avatar>
                  </div>
                </CardHeader>
                <CardContent className="flex flex-col gap-1 px-4 pt-0 pb-3">
                  <h3 className="md:text-2xl text-xl pb-2 font-semibold">
                    Professional Profile
                    <span className="text-xs pl-2 opacity-70">(He/His)</span>
                  </h3>
                  <span className="text-sm">
                    MERN FULL STACK WEB DEVELOPER || React || Node.js || MongoDB
                  </span>
                  <div className="flex justify-start items-center gap-2">
                    <h3 className="text-opacity-50 text-sm -mt-1 opacity-50">
                      Maharashtra, India
                    </h3>
                  </div>
                  <div className="flex opacity-60 items-center gap-2">
                    <div className="">
                      <span className="text-sm pr-1 font-semibold">545</span>
                      <span className="text-sm">followers</span>
                    </div>
                    <div className="">
                      <span className="text-sm pr-1 font-semibold">532</span>
                      <span className="text-sm">following</span>
                    </div>
                  </div>
                </CardContent>
                <CardFooter className="flex justify-start items-center gap-3">
                  <Button
                    className="flex items-center rounded-full"
                    variant={"default"}
                  >
                    <Plus /> Follow
                  </Button>
                  <Button
                    className="flex items-center border-primary text-primary rounded-full"
                    variant={"outline"}
                  >
                    Message
                  </Button>
                  <Button
                    className="flex items-center rounded-full"
                    variant={"outline"}
                  >
                    More
                  </Button>
                </CardFooter>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle>About</CardTitle>
                </CardHeader>
                <CardContent className="text-sm text-opacity-90">
                  Lorem ipsum dolor sit amet consectetur adipisicing elit.
                  Necessitatibus modi aperiam facere! Ad facilis quisquam
                  doloremque laborum, nisi magnam accusantium, ut cupiditate
                  iste, hic excepturi veniam nesciunt voluptatum sequi tempora?
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="pb-3">
                  <div className="flex pb-3 justify-between items-start flex-row gap-2">
                    <div>
                      <CardTitle className="text-lg">Activity</CardTitle>
                      <div className="text-sm opacity-70 -mt-1">
                        5907 followers
                      </div>
                    </div>
                    <Button
                      variant={"outline"}
                      className="flex items-center rounded-full"
                    >
                      <Plus /> Follow
                    </Button>
                  </div>
                  <div className="flex gap-3"></div>
                </CardHeader>
                <CardContent className="-mt-4">
                  <Tabs
                    onValueChange={(value) => setActivity(value)}
                    value={activity}
                  >
                    <TabsList className="flex gap-3 bg-transparent items-center justify-start">
                      <TabsTrigger style={{ boxShadow: "none" }} value="post">
                        <Button
                          variant={activity === "post" ? "default" : "outline"}
                          className="rounded-full"
                        >
                          Posts
                        </Button>
                      </TabsTrigger>
                      <TabsTrigger
                        style={{ boxShadow: "none" }}
                        value="comment"
                      >
                        <Button
                          variant={
                            activity === "comment" ? "default" : "outline"
                          }
                          className="rounded-full"
                        >
                          Comments
                        </Button>
                      </TabsTrigger>
                      <TabsTrigger style={{ boxShadow: "none" }} value="image">
                        <Button
                          variant={activity === "image" ? "default" : "outline"}
                          className="rounded-full"
                        >
                          Images
                        </Button>
                      </TabsTrigger>
                    </TabsList>
                    <TabsContent value="post">
                      <Carousel
                        className="w-full px-1"
                        opts={{
                          align: "start",
                        }}
                      >
                        <CarouselContent>
                          {[0, 1, 2].map((index) => (
                            <CarouselItem
                              key={index}
                              className="min-w-0 w-full lg:basis-1/2 md:w-1/2"
                            >
                              <Card className="min-w-0">
                                <CardHeader className="flex p-4 justify-between flex-row items-center gap-2">
                                  <div className="flex justify-between items-center gap-2">
                                    <Avatar className="w-10 h-10">
                                      <AvatarImage src="" />
                                      <AvatarFallback>
                                        <User2 className="w-6 h-6 opacity-80" />
                                      </AvatarFallback>
                                    </Avatar>
                                    <div className="flex flex-col justify-start">
                                      <div className="flex items-center">
                                        <h3 className="font-semibold text-sm leading-tight">
                                          Post Name
                                        </h3>
                                        <span className="flex text-xs opacity-60 items-center pl-1">
                                          <Dot className="w-4 h-4" />
                                          <span>You</span>
                                        </span>
                                      </div>
                                      <p className="text-xs overflow-hidden flex-grow-0 whitespace-nowrap opacity-80 max-w-40 text-ellipsis w-full">
                                        MERN STACK WEB DEVELOPER || NODE.JS ||
                                        REACT.JS
                                      </p>
                                      <div className="text-xs opacity-70 leading-none flex items-center gap-1">
                                        <span className="text-xs">1 mo</span>
                                        <span className="text-xs flex items-center">
                                          <Earth className="w-3 h-3" />
                                        </span>
                                      </div>
                                    </div>
                                  </div>
                                  <MoreHorizontal className="w-6 h-6 opacity-70 hover:opacity-100" />
                                </CardHeader>
                                <CardContent className="p-4">
                                  <CardDescription>
                                    Lorem ipsum dolor sit amet consectetur
                                    adipisicing elit. Necessitatibus modi
                                    aperiam facere! Ad facilis quisquam
                                    doloremque laborum, nisi magnam accusantium,
                                    ut cupiditate iste, hic excepturi veniam
                                    nesciunt voluptatum sequi tempora?
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
                                    <Repeat className="w-5 h-5 rotate-180" />
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
                    </TabsContent>
                    <TabsContent value="comment">
                      <div className="flex flex-col gap-2 py-2 justify-start">
                        {[0, 1, 2, 3, 4].map((_, i) => (
                          <>
                            <div className="text-xs pt-2">
                              <div className="opacity-70 flex gap-2">
                                <span className="font-medium">Your Name</span>
                                <span>commented on a post</span>
                                <span>
                                  <Dot className="w-4 h-4 inline -mr-1.5" /> 3w
                                </span>
                              </div>
                              <p className="text-sm pb-2 pt-1">
                                Lorem ipsum dolor, sit amet consectetur
                                adipisicing elit. Saepe architecto quibusdam
                                esse inventore reiciendis corporis dicta dolorum
                                natus quis repudiandae?
                              </p>
                            </div>
                            <hr />
                          </>
                        ))}
                      </div>
                      {/* <div className="min-h-20 flex justify-center items-center">
                        <span className="opacity-70 font-medium text-sm">
                          No Comments Found
                        </span>
                      </div> */}
                    </TabsContent>
                    <TabsContent value="image">
                      <div className="min-h-20 flex justify-center items-center">
                        <span className="opacity-70 font-medium text-sm">
                          No Images Found
                        </span>
                      </div>
                    </TabsContent>
                  </Tabs>
                </CardContent>
                <CardFooter className="p-0 flex-col">
                  <hr className="w-full" />
                  <Button
                    variant={"link"}
                    className="w-full h-12 hover:no-underline hover:bg-secondary text-foreground"
                  >
                    Show all{" "}
                    {activity === "post"
                      ? "Posts"
                      : activity === "comment"
                      ? "comments"
                      : "Images"}{" "}
                    <ArrowRight className="w-10 h-10" />
                  </Button>
                </CardFooter>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Experience</CardTitle>
                </CardHeader>
                <CardContent className="flex flex-col gap-3">
                  <div className="flex justify-start items-center gap-3">
                    <Avatar className="w-16 h-16">
                      <AvatarImage src="" />
                      <AvatarFallback>
                        <Users2 className="w-10 h-10 opacity-80" />
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex flex-col justify-start">
                      <h3 className="font-semibold text-base leading-tight">
                        Post Name
                      </h3>
                      <div className="text-sm opacity-70 leading-none flex items-center gap-1">
                        <span className="">Company Name</span>
                        <span className="text-sm flex items-center">
                          <Dot className="w-5 h-5 -mr-1" />
                          Remote
                        </span>
                      </div>
                      <div className="text-xs opacity-50 leading-none flex items-center gap-2">
                        <span>Mar 2025 - Present</span>
                        <span className="text-xs flex items-center">
                          <Dot className="w-5 h-5 -mr-1" />1 yr 1mo
                        </span>
                      </div>
                      <div className="text-xs opacity-70">
                        Pune, Maharashtra, India
                      </div>
                    </div>
                  </div>
                  <hr />
                  <div className="flex justify-start items-center gap-3">
                    <Avatar className="w-16 h-16">
                      <AvatarImage src="" />
                      <AvatarFallback>
                        <Users2 className="w-10 h-10 opacity-80" />
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex flex-col justify-start">
                      <h3 className="font-semibold text-base leading-tight">
                        Post Name
                      </h3>
                      <div className="text-sm opacity-70 leading-none flex items-center gap-1">
                        <span className="">Company Name</span>
                        <span className="text-sm flex items-center">
                          <Dot className="w-5 h-5 -mr-1" />
                          Remote
                        </span>
                      </div>
                      <div className="text-xs opacity-50 leading-none flex items-center gap-2">
                        <span>Mar 2025 - Present</span>
                        <span className="text-xs flex items-center">
                          <Dot className="w-5 h-5 -mr-1" />1 yr 1mo
                        </span>
                      </div>
                      <div className="text-xs opacity-70">
                        Pune, Maharashtra, India
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle>Education</CardTitle>
                </CardHeader>
                <CardContent className="flex flex-col gap-3">
                  <div className="flex justify-start items-center gap-3">
                    <Avatar className="w-16 h-16">
                      <AvatarImage src="" />
                      <AvatarFallback>
                        <Users2 className="w-10 h-10 opacity-80" />
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex flex-col justify-start">
                      <h3 className="font-semibold text-base leading-tight">
                        Post Name
                      </h3>
                      <div className="text-sm opacity-70 leading-none flex items-center gap-1">
                        <span className="">Company Name</span>
                        <span className="text-sm flex items-center">
                          - Remote
                        </span>
                      </div>
                      <div className="text-xs opacity-50 leading-none flex items-center gap-2">
                        <span>Mar 2025 - Present</span>
                      </div>
                    </div>
                  </div>
                  <hr />
                  <div className="flex justify-start items-center gap-3">
                    <Avatar className="w-16 h-16">
                      <AvatarImage src="" />
                      <AvatarFallback>
                        <Users2 className="w-10 h-10 opacity-80" />
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex flex-col justify-start">
                      <h3 className="font-semibold text-base leading-tight">
                        Post Name
                      </h3>
                      <div className="text-sm opacity-70 leading-none flex items-center gap-1">
                        <span className="">Company Name</span>
                        <span className="text-sm flex items-center">
                          - Remote
                        </span>
                      </div>
                      <div className="text-xs opacity-50 leading-none flex items-center gap-2">
                        <span>Mar 2025 - Present</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle>Skills</CardTitle>
                </CardHeader>
                <CardContent className="pb-1">
                  <div className="flex flex-col pb-1 gap-1">
                    <h3 className="font-semibold text-base">
                      Skilled muti-taker
                    </h3>
                  </div>
                  <hr />
                  <div className="flex flex-col pb-1 pt-4 gap-1">
                    <h3 className="font-semibold text-base">
                      Full Stack web Developer
                    </h3>
                  </div>
                  <hr />
                </CardContent>
                <div>
                  <Button
                    variant={"link"}
                    className="w-full h-12 hover:no-underline hover:bg-secondary text-foreground"
                  >
                    Show all 8 Skills <ArrowRight className="w-10 h-10" />
                  </Button>
                </div>
              </Card>
            </section>
            <aside className="md:flex flex-col gap-3 w-full shrink hidden h-min">
              <Card className="flex flex-col gap-3">
                <CardHeader className="pb-2">
                  <h3 className="text-base font-semibold">
                    People also viewed
                  </h3>
                </CardHeader>
                <CardContent className="flex flex-col gap-3">
                  {[1, 2, 3, 4, 5].map((_, i) => (
                    <>
                      <div className="flex justify-start items-start gap-3">
                        <Avatar className="w-10 h-10">
                          <AvatarImage src="" />
                          <AvatarFallback>
                            <User2 className="w-8 h-8 p-1.5" />
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex flex-col">
                          <span className="font-semibold">John Doe</span>
                          <span className="text-sm opacity-70 line-clamp-2 leading-tight text-ellipsis overflow-hidden">
                            Software Engineer | Microsoft | 500+ connections |
                            India | React | Node.js | MongoDB
                          </span>
                          <Button
                            className="flex items-center mt-2 px-3 rounded-full"
                            variant={"outline"}
                            size={"sm"}
                          >
                            <Plus /> Follow
                          </Button>
                        </div>
                      </div>
                      <hr />
                    </>
                  ))}
                </CardContent>
              </Card>
              <Card className="flex flex-col gap-3">
                <CardHeader className="pb-2">
                  <h3 className="text-base font-semibold">
                    People also viewed
                  </h3>
                </CardHeader>
                <CardContent className="flex flex-col gap-3">
                  {[1, 2, 3, 4, 5].map((_, i) => (
                    <>
                      <div className="flex justify-start items-start gap-3">
                        <Avatar className="w-10 h-10">
                          <AvatarImage src="" />
                          <AvatarFallback>
                            <User2 className="w-8 h-8 p-1.5" />
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex flex-col">
                          <span className="font-semibold">John Doe</span>
                          <span className="text-sm opacity-70 line-clamp-2 leading-tight text-ellipsis overflow-hidden">
                            Software Engineer | Microsoft | 500+ connections |
                            India | React | Node.js | MongoDB
                          </span>
                          <Button
                            className="flex items-center mt-2 px-3 rounded-full"
                            variant={"outline"}
                            size={"sm"}
                          >
                            <Plus /> Follow
                          </Button>
                        </div>
                      </div>
                      <hr />
                    </>
                  ))}
                </CardContent>
              </Card>
            </aside>
          </section>
        </div>
      </main>
    </>
  );
}

export default Page;
