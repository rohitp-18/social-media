"use client";

import React, { Fragment, useEffect, useState } from "react";
import Image from "next/image";
import Navbar from "@/components/userNavbar";
import back from "@/assets/back.png";
import {
  ArrowRight,
  BarChartBigIcon,
  Diamond,
  Dot,
  Earth,
  Edit2,
  Eye,
  MessageCircle,
  MoreHorizontal,
  Pencil,
  Plus,
  Repeat,
  Search,
  Share2,
  ThumbsUp,
  User2,
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
import PersonalInfo from "./personalInfo";
import EditAbout from "./editAbout";
import Sidebar from "../../../components/sidebar";
import Head from "next/head";
import { Metadata } from "next";
import { useDispatch, useSelector } from "react-redux";
import { userProfile } from "@/store/user/userSlice";
import { AppDispatch } from "@/store/store";

const ProfilePage: React.FC = ({ params }: any) => {
  const [activity, setActivity] = useState("post");
  const [editIntro, setEditIntro] = useState(false);
  const [editAbout, setEditAbout] = useState(false);

  const dispatch = useDispatch<AppDispatch>();
  const { user, loading, profile } = useSelector((state: any) => state.user);

  useEffect(() => {
    (async () => {
      const { name } = await Promise.resolve(params);
      console.log(name);
      dispatch(userProfile("/user/profile/" + name));
    })();
  }, [params]);

  return (
    <>
      {profile && (
        <>
          {editIntro && (
            <PersonalInfo
              open={editIntro}
              setClose={(val: boolean) => setEditIntro(val)}
            />
          )}
          {editAbout && (
            <EditAbout
              open={editAbout}
              setClose={(val: boolean) => setEditAbout(val)}
            />
          )}
          <Navbar />
          <main className="bg-[#f2f6f8] dark:bg-[#151515] w-full overflow-hidden py-5">
            <div className="container max-w-[1170px] mx-auto">
              {/* <section className="flex mx-auto max-w-7xl justify-center gap-2"> */}
              <section className="md:grid grid-cols-[1fr_300px] block mx-auto max-w-7xl min-h-screen gap-3">
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
                    <CardContent className="flex justify-between items-start gap-3">
                      <div className="flex flex-col gap-1 md:px-4 pt-0 pb-3">
                        <h3 className="md:text-2xl text-xl pb-2 font-semibold">
                          {profile.user.name}
                          <span className="text-xs pl-2 opacity-70">
                            (He/Him)
                          </span>
                        </h3>
                        <span className="text-sm">{profile.user.about}</span>
                        {profile.user.educcation &&
                          profile.user.education[0] && (
                            <span className="text-opacity-90 md:hidden text-sm opacity-70">
                              {profile.user.education[0]}
                            </span>
                          )}
                        {profile.user.location && (
                          <div className="flex justify-start items-center gap-2">
                            <h3 className="text-opacity-50 text-sm -mt-1 opacity-50">
                              {profile.user.location.city +
                                profile.user.location.state}
                            </h3>
                          </div>
                        )}
                        <div className="flex opacity-60 items-center gap-2">
                          <div className="">
                            <span className="text-sm pr-1 font-semibold">
                              {profile.user.totalFollowers}
                            </span>
                            <span className="text-sm">Followers</span>
                          </div>
                          <div className="">
                            <span className="text-sm pr-1 font-semibold">
                              {profile.user.totalFollowing}
                            </span>
                            <span className="text-sm">Following</span>
                          </div>
                        </div>
                      </div>
                      {profile.user._id === user?._id && (
                        <div className="flex justify-start items-start">
                          <Edit2
                            onClick={() => setEditIntro(true)}
                            className="w-5 h-5 opacity-90"
                          />
                        </div>
                      )}
                    </CardContent>
                    <CardFooter className="flex justify-start items-center gap-3">
                      {profile.user._id === user?._id ? (
                        <Button
                          className="flex items-center border-primary text-primary rounded-full hover:text-white hover:bg-primary"
                          variant={"outline"}
                        >
                          Add profile section
                        </Button>
                      ) : (
                        <>
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
                        </>
                      )}
                    </CardFooter>
                  </Card>
                  {/* Analytics card */}
                  {profile.user._id === user?._id && (
                    <Card>
                      <CardHeader>
                        <CardTitle>Analytics</CardTitle>
                        <div className="flex gap-1 text-sm items-center opacity-70">
                          <Eye className="w-4 h-4" />
                          <span className="-mt-0.5">Private to you</span>
                        </div>
                      </CardHeader>
                      <CardContent className="flex md:flex-row flex-col justify-between md:py-4 md:px-8 items-start gap-5">
                        <div className="flex gap-3 md:max-w-48">
                          <Users2 className="opacity-90 w-8 h-8" />
                          <div className="">
                            <h4 className="font-semibold text-sm">
                              1 Profile views
                            </h4>
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
                            <span className="opacity-80 text-xs">
                              Past 7 days
                            </span>
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
                          Show all Analytics{" "}
                          <ArrowRight className="w-10 h-10" />
                        </Button>
                      </div>
                    </Card>
                  )}
                  {/* About card */}
                  {(profile.user._id === user?._id || profile.user.about2) && (
                    <Card>
                      <CardHeader className="flex flex-row justify-between items-start gap-2">
                        <CardTitle>About</CardTitle>
                        {profile.user._id === user?._id && (
                          <Edit2
                            onClick={() => setEditAbout(true)}
                            className="w-5 h-5 opacity-90"
                          />
                        )}
                      </CardHeader>
                      {/* <CardContent className="text-sm line-clamp-2 overflow-hidden text-ellipsis text-opacity-90"> */}
                      <CardContent>
                        <div className="text-sm line-clamp-2 leading-tight text-ellipsis overflow-hidden">
                          {profile.user.about2 ? (
                            profile.user.about2
                          ) : (
                            <span className="h-full w-full min-h-10 text-center">
                              Please all some about you
                            </span>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  )}
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
                          <Button
                            variant={"link"}
                            className="hover:no-underline"
                          >
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
                          <Button
                            variant={
                              activity === "post" ? "default" : "outline"
                            }
                            onClick={() => setActivity("post")}
                            className="rounded-full"
                            value="post"
                          >
                            All Posts
                          </Button>
                          <Button
                            variant={
                              activity === "comment" ? "default" : "outline"
                            }
                            onClick={() => setActivity("comment")}
                            className="rounded-full"
                            value="comment"
                          >
                            Comments
                          </Button>
                          <Button
                            variant={
                              activity === "image" ? "default" : "outline"
                            }
                            onClick={() => setActivity("image")}
                            className="rounded-full"
                            value="image"
                          >
                            Images
                          </Button>
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
                                            MERN STACK WEB DEVELOPER || NODE.JS
                                            || REACT.JS
                                          </p>
                                          <div className="text-xs opacity-70 leading-none flex items-center gap-1">
                                            <span className="text-xs">
                                              1 mo
                                            </span>
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
                                        doloremque laborum, nisi magnam
                                        accusantium, ut cupiditate iste, hic
                                        excepturi veniam nesciunt voluptatum
                                        sequi tempora?
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
                                    <span className="font-normal">
                                      Your Name
                                    </span>
                                    <span>commented on a post</span>
                                    <span>
                                      <Dot className="w-4 h-4 inline -mr-1.5" />{" "}
                                      3w
                                    </span>
                                  </div>
                                  <p className="text-sm pb-2 pt-1">
                                    Lorem ipsum dolor, sit amet consectetur
                                    adipisicing elit. Saepe architecto quibusdam
                                    esse inventore reiciendis corporis dicta
                                    dolorum natus quis repudiandae?
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
                            Lorem ipsum dolor sit amet consectetur adipisicing
                            elit. Nostrum doloribus placeat omnis? Excepturi,
                            optio! Maxime delectus ea facilis exercitationem
                            officiis.
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
                          Lorem ipsum dolor sit, amet consectetur adipisicing
                          elit. Ratione, ipsa quo quos cupiditate dicta possimus
                          harum eveniet necessitatibus consequuntur non!
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
                        <a href="/u/name/details/skills">
                          <Plus className="w-5 h-5 opacity-90" />
                        </a>
                        <a href="/u/name/details/skills">
                          <Pencil className="w-5 h-5 opacity-90" />
                        </a>
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
                    <a href="/u/name/details/skills">
                      <Button
                        variant={"link"}
                        className="w-full h-12 hover:no-underline hover:bg-secondary text-foreground"
                      >
                        Show all 8 Skills <ArrowRight className="w-10 h-10" />
                      </Button>
                    </a>
                  </Card>
                  {/* Interest card */}
                </section>
                <Sidebar />
              </section>
            </div>
          </main>
        </>
      )}
    </>
  );
};

export default ProfilePage;
