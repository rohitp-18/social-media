"use client";

import React, { Fragment, useState } from "react";
import Image from "next/image";
import Navbar from "@/components/userNavbar";
import Friend from "@/components/friend";
import back from "@/assets/back.png";
import {
  ArrowRight,
  BarChartBigIcon,
  Diamond,
  Dot,
  Earth,
  Edit2,
  Eye,
  Menu,
  MessageCircle,
  MoreHorizontal,
  Pencil,
  Plus,
  Repeat,
  Search,
  Share2,
  ThumbsUp,
  User2,
  Users,
  Users2,
} from "lucide-react";
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";

const ProfilePage: React.FC = () => {
  const [activity, setActivity] = useState("post");
  const [interest, setInterest] = useState("companies");
  return (
    <>
      <Navbar />
      <main className="bg-[#f2f6f8] dark:bg-[#151515] w-full overflow-hidden py-5">
        <div className="container max-w-[1170px] mx-auto">
          {/* <section className="flex mx-auto max-w-7xl justify-center gap-2"> */}
          <section className="md:grid grid-cols-[1fr_300px] hidden mx-auto max-w-7xl min-h-screen gap-3">
            <section className="min-h-screen max-w-[860px] overflow-hidden w-full flex flex-col gap-5 flex-grow-0">
              {/* profile card */}
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
                      <span className="text-sm">Followers</span>
                    </div>
                    <div className="">
                      <span className="text-sm pr-1 font-semibold">532</span>
                      <span className="text-sm">Following</span>
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
              {/* Analytics card */}
              <Card>
                <CardHeader>
                  <CardTitle>Analytics</CardTitle>
                  <div className="flex gap-1 text-sm items-center opacity-70">
                    <Eye className="w-4 h-4" />
                    <span className="-mt-0.5">Private to you</span>
                  </div>
                </CardHeader>
                <CardContent className="md:flex justify-between md:py-4 md:px-8 items-start gap-5">
                  <div className="flex gap-3 md:max-w-48">
                    <Users2 className="opacity-90 w-8 h-8" />
                    <div className="">
                      <h4 className="font-semibold text-sm">1 Profile views</h4>
                      <p className="text-xs font-normal">
                        Discover who's viewed your profile
                      </p>
                    </div>
                  </div>
                  <div className="flex gap-3 md:max-w-48">
                    <BarChartBigIcon className="opacity-90 w-8 h-8" />
                    <div className="">
                      <h4 className="font-semibold text-sm">
                        22 Post Impression
                      </h4>
                      <p className="text-xs font-normal">
                        Checkout who's engaging with your posts
                      </p>
                      <span className="opacity-80 text-xs">Past 7 days</span>
                    </div>
                  </div>
                  <div className="flex gap-3 md:max-w-48">
                    <Search className="opacity-90 w-8 h-8" />
                    <div className="">
                      <h4 className="font-semibold text-sm">
                        1 search appearance
                      </h4>
                      <p className="text-xs font-normal">
                        see how often you appear in search results
                      </p>
                    </div>
                  </div>
                </CardContent>
                <div>
                  <Button
                    variant={"link"}
                    className="w-full h-12 hover:no-underline hover:bg-secondary text-foreground"
                  >
                    Show all Analytics <ArrowRight className="w-10 h-10" />
                  </Button>
                </div>
              </Card>
              {/* About card */}
              <Card>
                <CardHeader className="flex flex-row justify-between items-start gap-2">
                  <CardTitle>About</CardTitle>
                  <Edit2 className="w-5 h-5 opacity-90" />
                </CardHeader>
                {/* <CardContent className="text-sm line-clamp-2 overflow-hidden text-ellipsis text-opacity-90"> */}
                <CardContent>
                  <div className="text-sm line-clamp-2 leading-tight text-ellipsis overflow-hidden">
                    Lorem ipsum dolor sit amet consectetur adipisicing elit.
                    Necessitatibus modi aperiam facere! Ad facilis quisquam
                    doloremque laborum, nisi magnam accusantium, ut cupiditate
                    iste, hic excepturi veniam nesciunt voluptatum sequi
                    tempora? Lorem ipsum dolor sit amet consectetur, adipisicing
                    elit. Harum id dolor neque exercitationem eos voluptatum
                    dignissimos repudiandae veritatis? Corrupti, blanditiis!
                  </div>
                </CardContent>
              </Card>
              {/* Activity card */}
              <Card>
                <CardHeader className="pb-3">
                  <div className="flex pb-3 justify-between items-start flex-row gap-2">
                    <div>
                      <CardTitle className="text-lg">Activity</CardTitle>
                      <div className="text-xs opacity-70 text-primary/70 font-normal -mt-1">
                        5907 followers
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button
                        variant={"outline"}
                        className="flex text-primary border-primary hover:text-primary items-center rounded-full"
                      >
                        Create a Post
                      </Button>
                      <Button variant={"link"} className="hover:no-underline">
                        <Edit2 className="w-5 h-5 opacity-90 text-black" />
                      </Button>
                    </div>
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
                                Lorem ipsum dolor, sit amet consectetur
                                adipisicing elit. Saepe architecto quibusdam
                                esse inventore reiciendis corporis dicta dolorum
                                natus quis repudiandae?
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
                      <div className="min-h-20 flex justify-center items-center">
                        <span className="opacity-70 font-normal text-sm">
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
              {/* Experinece Card */}
              <Card>
                <CardHeader className="flex flex-row justify-between items-start gap-2">
                  <CardTitle>Experience</CardTitle>
                  <div className="flex gap-2 md:gap-5">
                    <Plus className="w-5 h-5 opacity-90" />
                    <Pencil className="w-5 h-5 opacity-90" />
                  </div>
                </CardHeader>
                <CardContent className="flex flex-col gap-3">
                  <div className="flex justify-start items-start gap-3">
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
                          - Intership
                        </span>
                      </div>
                      <div className="text-xs opacity-50 leading-none flex items-center gap-2">
                        <span>Mar 2025 - Present</span>
                      </div>
                      <div className="text-xs opacity-60 flex items-center gap-2">
                        <span>Remote</span>
                      </div>
                      <p className="text-sm py-4 opacity-90 line-clamp-2 overflow-hidden text-ellipsis">
                        Lorem ipsum dolor sit amet consectetur adipisicing elit.
                        Nostrum doloribus placeat omnis? Excepturi, optio!
                        Maxime delectus ea facilis exercitationem officiis.
                      </p>
                      <div className="flex justify-start px-3 py-2 -mt-2 items-center gap-2">
                        <Diamond className="w-5 stroke-2 h-5" />
                        <div className="flex gap-2 text-base">
                          {[0, 1, 2].map((_, i) => (
                            <span
                              key={i}
                              className="text-sm font-semibold opacity-80"
                            >
                              skill
                              {i !== 2 && ","}
                            </span>
                          ))}
                          <span className="text-sm opacity-80 font-semibold">
                            3 more skills
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                  <hr />
                </CardContent>
              </Card>
              {/* Education card */}
              <Card>
                <CardHeader className="flex flex-row justify-between items-start gap-2">
                  <CardTitle>Education</CardTitle>
                  <div className="flex gap-2 md:gap-5">
                    <Plus className="w-5 h-5 opacity-90" />
                    <Pencil className="w-5 h-5 opacity-90" />
                  </div>
                </CardHeader>
                <CardContent className="flex flex-col gap-3">
                  <div className="flex justify-start items-start gap-3">
                    <Avatar className="w-16 h-16">
                      <AvatarImage src="" />
                      <AvatarFallback>
                        <Users2 className="w-10 h-10 opacity-80" />
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex flex-col justify-start">
                      <h3 className="font-semibold text-base leading-tight">
                        College/University Name
                      </h3>
                      <div className="text-sm opacity-70 leading-none flex items-center gap-1">
                        Degree Name
                      </div>
                      <div className="text-xs opacity-50  flex items-center gap-2">
                        <span>Mar 2025 - Present</span>
                      </div>
                      <div className="text-sm py-2 opacity-90">
                        <span className="text-sm font-normal">GPA:</span>{" "}
                        <span className="text-sm font-normal">3.5</span>
                      </div>
                    </div>
                  </div>
                  <hr />
                </CardContent>
              </Card>
              {/* Project card */}
              <Card>
                <CardHeader className="flex flex-row justify-between items-start gap-2">
                  <CardTitle>Projects</CardTitle>
                  <div className="flex gap-2 md:gap-5">
                    <Plus className="w-5 h-5 opacity-90" />
                    <Pencil className="w-5 h-5 opacity-90" />
                  </div>
                </CardHeader>
                <CardContent className="flex flex-col gap-3">
                  <div className="flex flex-col justify-start">
                    <h3 className="font-semibold text-base leading-tight">
                      Project Name
                    </h3>
                    <div className="text-xs opacity-50 leading-none flex items-center gap-2">
                      <span>Mar 2025 - Present</span>
                    </div>
                    <div className="text-sm line-clamp-2 py-6 overflow-hidden text-ellipsis">
                      Lorem ipsum dolor sit, amet consectetur adipisicing elit.
                      Ratione, ipsa quo quos cupiditate dicta possimus harum
                      eveniet necessitatibus consequuntur non!
                    </div>
                    <div className="flex justify-start px-3 py-2 -mt-2 items-center gap-2">
                      <Diamond className="w-5 stroke-2 h-5" />
                      <div className="flex gap-2 text-base">
                        {[0, 1, 2].map((_, i) => (
                          <span
                            key={i}
                            className="text-sm font-semibold opacity-80"
                          >
                            skill
                            {i !== 2 && ","}
                          </span>
                        ))}
                        <span className="text-sm opacity-80 font-semibold">
                          3 more skills
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      {[0, 1, 2].map((_, i) => (
                        <Image
                          className="w-24 h-16 md:w-32 md:h-20 rounded-lg"
                          src={back}
                          alt="project"
                          key={i}
                        />
                      ))}
                    </div>
                  </div>
                  <hr />
                </CardContent>
              </Card>
              {/* Skills card */}
              <Card>
                <CardHeader className="flex flex-row justify-between items-start gap-2">
                  <CardTitle>Skills</CardTitle>
                  <div className="flex gap-2 md:gap-5">
                    <Plus className="w-5 h-5 opacity-90" />
                    <Pencil className="w-5 h-5 opacity-90" />
                  </div>
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
              {/* Interest card */}
              <Card>
                <CardHeader className="pb-3">
                  <div className="flex pb-3 justify-between items-start flex-row gap-2">
                    <div>
                      <CardTitle className="text-lg">Interests</CardTitle>
                    </div>
                    {/* <div className="flex items-center gap-2">
                      <Button
                        variant={"outline"}
                        className="flex text-primary border-primary hover:text-primary items-center rounded-full"
                      >
                        Create a Post
                      </Button>
                      <Button variant={"link"} className="hover:no-underline">
                        <Edit2 className="w-5 h-5 opacity-90 text-black" />
                      </Button>
                    </div> */}
                  </div>
                  <div className="flex gap-3"></div>
                </CardHeader>
                <CardContent className="-mt-4">
                  <Tabs
                    onValueChange={(value) => setInterest(value)}
                    value={interest}
                  >
                    <TabsList className="flex gap-3 pb-0 rounded-none transition-all bg-transparent border-b border-foreground/40 items-center justify-start">
                      <TabsTrigger
                        style={{ boxShadow: "none" }}
                        className={
                          interest === "top"
                            ? "border-b-2 -mb-1 border-primary rounded-none"
                            : "border-b-2 -mb-1 border-transparent rounded-none"
                        }
                        value="top"
                      >
                        Top voices
                      </TabsTrigger>
                      <TabsTrigger
                        style={{ boxShadow: "none" }}
                        className={
                          interest === "companies"
                            ? "border-b-2 -mb-1 border-primary rounded-none"
                            : "border-b-2 -mb-1 border-transparent rounded-none"
                        }
                        value="companies"
                      >
                        Companies
                      </TabsTrigger>
                      <TabsTrigger
                        style={{ boxShadow: "none" }}
                        className={
                          interest === "groups"
                            ? "border-b-2 -mb-1 border-primary rounded-none"
                            : "border-b-2 -mb-1 border-transparent rounded-none"
                        }
                        value="groups"
                      >
                        Groups
                      </TabsTrigger>
                      <TabsTrigger
                        style={{ boxShadow: "none" }}
                        className={
                          interest === "newsletter"
                            ? "border-b-2 -mb-1 border-primary rounded-none"
                            : "border-b-2 -mb-1 border-transparent rounded-none"
                        }
                        value="newsletter"
                      >
                        News Letter
                      </TabsTrigger>
                      <TabsTrigger
                        style={{ boxShadow: "none" }}
                        className={
                          interest === "school"
                            ? "border-b-2 -mb-1 border-primary rounded-none"
                            : "border-b-2 -mb-1 border-transparent rounded-none"
                        }
                        value="school"
                      >
                        Schools
                      </TabsTrigger>
                    </TabsList>

                    <TabsContent value="top">
                      <div className="flex md:gap-20 py-2 justify-between">
                        {[0, 2].map((_, i) => (
                          <div key={i} className="flex items-start gap-2">
                            <Avatar className="w-12 h-12">
                              <AvatarImage src="" />
                              <AvatarFallback></AvatarFallback>
                            </Avatar>
                            <div className="flex flex-col justify-start">
                              <h3 className="font-semibold text-[15px] leading-tight">
                                User Name
                              </h3>
                              <p className="text-[13px] opacity-90 flex items-center gap-1">
                                Mern Stack Developer | frontend Developer |
                                React | Node.js | MongoDB | Express.js | Next.js
                                | Artificial Inteligence | Python | C++ |
                                Machine Learning
                              </p>
                              <span className="text-sm py-2 opacity-70 leading-none flex items-center gap-1">
                                500 followers
                              </span>
                              <Button
                                variant={"outline"}
                                className="flex items-center mt-2 px-3 w-32 rounded-full"
                                size={"sm"}
                              >
                                <Plus /> Follow
                              </Button>
                            </div>
                          </div>
                        ))}
                      </div>
                    </TabsContent>
                    <TabsContent value="comment">
                      <div className="flex flex-col gap-2 py-2 justify-start">
                        {[0, 1, 2, 3, 4].map((_, i) => (
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
                                Lorem ipsum dolor, sit amet consectetur
                                adipisicing elit. Saepe architecto quibusdam
                                esse inventore reiciendis corporis dicta dolorum
                                natus quis repudiandae?
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
                      <div className="min-h-20 flex justify-center items-center">
                        <span className="opacity-70 font-normal text-sm">
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
            </section>
            <aside className="md:flex flex-col gap-3 w-full shrink hidden h-min">
              <Card className="flex flex-col gap-3">
                <CardContent className="pt-2">
                  <div className="flex justify-between items-center gap-2">
                    <h3 className="text-base font-semibold">Languages</h3>
                    <span className="rounded-full p-2 bg-background/50 text-foreground">
                      <Edit2 className="w-4 h-4" />
                    </span>
                  </div>
                  <div className="opacity-80 text-sm">English</div>
                  <hr className="my-3" />
                  <div className="flex justify-between items-center gap-2">
                    <h3 className="text-base font-semibold">
                      Public Profile & URL
                    </h3>
                    <span className="rounded-full p-2 bg-background/50 text-foreground">
                      <Edit2 className="w-4 h-4" />
                    </span>
                  </div>
                  <div className="opacity-80 text-sm">
                    https://www.linkedin.com/in/username
                  </div>
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
                    <Fragment key={i}>
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
                    </Fragment>
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
                    <Fragment key={i}>
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
                    </Fragment>
                  ))}
                </CardContent>
              </Card>
            </aside>
          </section>
        </div>
      </main>
    </>
  );
};

export default ProfilePage;
