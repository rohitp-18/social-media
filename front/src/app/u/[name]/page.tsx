"use client";

import React, { Fragment, useEffect, useState } from "react";
import Navbar from "@/components/userNavbar";
import IntroNavbar from "@/components/introNavbar";
import {
  ArrowRight,
  BarChartBigIcon,
  Diamond,
  Edit2,
  Eye,
  Pencil,
  Plus,
  Search,
  Users2,
} from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import PersonalInfo from "./personalInfo";
import EditAbout from "./editAbout";
import Sidebar from "../../../components/sidebar";
import { useDispatch, useSelector } from "react-redux";
import { userProfile } from "@/store/user/userSlice";
import { AppDispatch } from "@/store/store";
import Interest from "@/components/profile/interest";
import ProfilePageCard from "@/components/profile/profilePageCard";
import ActivityCard from "@/components/profile/activityCard";
import Experience from "@/components/profile/experience";
import ProjectCard from "@/components/profile/profileProjectCard";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";

function ProfilePage({ params }: { params: { name: string } }) {
  const [editIntro, setEditIntro] = useState(false);
  const [editAbout, setEditAbout] = useState(false);
  const [showFullAbout, setShowFullAbout] = useState(false);
  const [isUser, setIsUser] = useState(false);
  const [userName, setUserName] = useState("");

  const dispatch = useDispatch<AppDispatch>();
  const { user, loading, profile } = useSelector((state: any) => state.user);

  useEffect(() => {
    Promise.resolve(params).then((res: any) => {
      dispatch(userProfile(res.name));
      setUserName(res.name);
    });
  }, [params]);

  useEffect(() => {
    if (profile) {
      setIsUser(profile?.user._id === user?._id);
      console.log(profile);
    }
  }, [dispatch, profile]);

  return (
    <>
      {profile && (
        <>
          {editIntro && isUser && (
            <PersonalInfo
              open={editIntro}
              setClose={(val: boolean) => setEditIntro(val)}
            />
          )}
          {editAbout && isUser && (
            <EditAbout
              open={editAbout}
              setClose={(val: boolean) => setEditAbout(val)}
            />
          )}

          {user ? <Navbar /> : <IntroNavbar />}
          <main className="bg-[#f2f6f8] dark:bg-[#151515] w-full overflow-hidden py-5">
            <div className="container max-w-[1170px] mx-auto">
              {/* <section className="flex mx-auto max-w-7xl justify-center gap-2"> */}
              <section className="md:grid grid-cols-[1fr_300px] block mx-auto max-w-7xl min-h-screen gap-3">
                <section className="min-h-screen max-w-[860px] overflow-hidden w-full flex flex-col gap-5 flex-grow-0">
                  {/* profile card */}
                  <ProfilePageCard
                    isUser={isUser}
                    profile={profile}
                    setEditIntro={setEditIntro}
                  />
                  {/* Analytics card */}
                  {isUser && (
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
                  <Card>
                    <CardHeader className="flex flex-row justify-between items-start gap-2">
                      <CardTitle>About</CardTitle>
                      {isUser && (
                        <Edit2
                          onClick={() => setEditAbout(true)}
                          className="w-5 h-5 opacity-90"
                        />
                      )}
                    </CardHeader>
                    {/* <CardContent className="text-sm line-clamp-2 overflow-hidden text-ellipsis text-opacity-90"> */}
                    <CardContent>
                      <div className="space-y-2">
                        <div
                          className={`text-sm ${
                            showFullAbout ? "" : "line-clamp-2"
                          } leading-tight overflow-hidden`}
                        >
                          {profile.user.about ? (
                            profile.user.about
                          ) : (
                            <div className="flex justify-center items-center flex-col min-h-24">
                              {isUser && (
                                <Button
                                  variant={"outline"}
                                  className="flex text-primary border-primary hover:text-primary items-center rounded-full"
                                  onClick={() => setEditAbout(true)}
                                >
                                  Add your introduction
                                </Button>
                              )}
                              <span className="text-sm opacity-60">
                                No about information has been added yet
                              </span>
                            </div>
                          )}
                        </div>
                        {profile.user.about &&
                          profile.user.about.length > 100 && (
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => setShowFullAbout(!showFullAbout)}
                              className="text-xs text-primary hover:text-primary/80"
                            >
                              {showFullAbout ? "Show less" : "Show more"}
                            </Button>
                          )}
                      </div>
                    </CardContent>
                  </Card>
                  {/* Activity card */}
                  <ActivityCard isUser={isUser} />
                  {/* Experience Card */}
                  <Experience
                    isUser={isUser}
                    username={profile.user.username}
                  />
                  {/* Education card */}
                  {(profile.educations.length > 0 || isUser) && (
                    <Card>
                      <CardHeader className="flex flex-row justify-between items-start gap-2">
                        <CardTitle>Education</CardTitle>
                        {isUser && profile.educations.length > 0 && (
                          <div className="flex gap-2 md:gap-5">
                            <a
                              href={`/u/${userName}/details/educations?add=true`}
                            >
                              <Plus className="w-5 h-5 opacity-90" />
                            </a>
                            <a href={`/u/${userName}/details/educations`}>
                              <Pencil className="w-5 h-5 opacity-90" />
                            </a>
                          </div>
                        )}
                      </CardHeader>
                      <CardContent className="flex flex-col gap-3">
                        {profile.educations.length > 0 ? (
                          profile.educations.map((edu: any, i: number) => (
                            <Fragment key={edu._id}>
                              <div className="flex justify-start flex-col items-start gap-3">
                                <div className="flex justify-start flex-col items-start gap-3">
                                  {/* <Avatar className="w-16 h-16">
                                  <AvatarImage src="" />
                                  <AvatarFallback>
                                    <Users2 className="w-10 h-10 opacity-80" />
                                  </AvatarFallback>
                                </Avatar> */}
                                  <div className="flex flex-col justify-start gap-1">
                                    <div className="flex items-center gap-2">
                                      <h3 className="font-semibold text-[17px]">
                                        {edu.school}
                                      </h3>
                                      <span className="text-xs text-muted-foreground">
                                        {edu.location}
                                      </span>
                                    </div>
                                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                      <span>{edu.degree}</span>
                                      {edu.fieldOfStudy && (
                                        <>
                                          <span>•</span>
                                          <span>{edu.fieldOfStudy}</span>
                                        </>
                                      )}
                                    </div>
                                    <div className="flex items-center gap-2 text-xs">
                                      <span>
                                        {edu.startDate &&
                                          new Date(
                                            edu.startDate
                                          ).toLocaleString("default", {
                                            month: "short",
                                            year: "numeric",
                                          })}{" "}
                                        -{" "}
                                        {edu.currentlyStudying
                                          ? "Present"
                                          : edu.endDate &&
                                            new Date(
                                              edu.endDate
                                            ).toLocaleString("default", {
                                              month: "short",
                                              year: "numeric",
                                            })}
                                      </span>
                                    </div>
                                    {edu.grade && (
                                      <div className="flex items-center gap-2 text-xs">
                                        <span>Grade:</span>
                                        <span>{edu.grade}</span>
                                      </div>
                                    )}
                                  </div>
                                </div>
                                <CardDescription className="text-sm py-4 opacity-90 line-clamp-2 overflow-hidden text-ellipsis">
                                  {edu.description}
                                </CardDescription>
                                <div className="flex justify-start px-3 py-2 -mt-2 items-center gap-2">
                                  <Diamond className="w-5 stroke-2 h-5" />
                                  <div className="flex gap-2 text-base">
                                    {edu.skills.map((skill: any, i: number) => (
                                      <span
                                        key={skill._id}
                                        className="text-sm font-semibold opacity-80"
                                      >
                                        {skill.name}
                                        {i !== edu.skills.length - 1 && ","}
                                      </span>
                                    ))}
                                  </div>
                                </div>
                              </div>
                              {i < profile.educations.length - 1 && (
                                <Separator className="my-2" />
                              )}
                            </Fragment>
                          ))
                        ) : (
                          <div className="flex justify-center items-center flex-col min-h-24">
                            {isUser && (
                              <a
                                href={`/u/${userName}/details/educations?add=true`}
                              >
                                <Button
                                  variant={"outline"}
                                  className="flex text-primary border-primary hover:text-primary items-center rounded-full"
                                >
                                  Add Education
                                </Button>
                              </a>
                            )}
                            <span className="text-sm opacity-60">
                              No education has been added yet
                            </span>
                          </div>
                        )}
                      </CardContent>
                      {profile.educations.length > 0 && (
                        <>
                          <Separator className="mt-3" />
                          <a href={`/u/${userName}/details/educations`}>
                            <Button
                              variant={"link"}
                              className="w-full h-12 hover:no-underline hover:bg-secondary text-foreground"
                            >
                              Show all Educations{" "}
                              <ArrowRight className="w-10 h-10" />
                            </Button>
                          </a>
                        </>
                      )}
                    </Card>
                  )}
                  {/* Project card */}
                  <ProjectCard isUser={isUser} />
                  {/* Skills card */}
                  <Card>
                    <CardHeader className="flex flex-row justify-between items-start gap-2">
                      <CardTitle>Skills</CardTitle>
                      {isUser && profile.user.skills.length > 0 && (
                        <div className="flex gap-2 md:gap-5">
                          <a href={`/u/${userName}/details/skills?add=true`}>
                            <Plus className="w-5 h-5 opacity-90" />
                          </a>
                          <a href={`/u/${userName}/details/skills`}>
                            <Pencil className="w-5 h-5 opacity-90" />
                          </a>
                        </div>
                      )}
                    </CardHeader>
                    <Separator className="mb-3 shadow-md" />
                    <CardContent className="py-1 pb-5">
                      {profile.user.skills.length > 0 ? (
                        profile.user.skills
                          .slice(0, 5)
                          .map((skill: any, i: number) => (
                            <div key={skill.skill._id} className="py-2">
                              <div className="flex items-center gap-2">
                                <h3 className="font-medium text-sm">
                                  {skill.skill.name}
                                </h3>
                                <Badge
                                  variant="outline"
                                  className="text-xs bg-primary/10 opacity-90"
                                >
                                  {skill.proficiency}
                                </Badge>
                              </div>
                              {profile.user.skills.length > i + 1 && (
                                <Separator className="my-2" />
                              )}
                            </div>
                          ))
                      ) : (
                        <div className="flex justify-center items-center flex-col min-h-24">
                          {isUser && (
                            <a href={`/u/${userName}/details/skills?add=true`}>
                              <Button
                                variant={"outline"}
                                className="flex text-primary border-primary hover:text-primary items-center rounded-full"
                              >
                                Add Skills
                              </Button>
                            </a>
                          )}
                          <span className="text-sm opacity-60">
                            No skills have been added yet
                          </span>
                        </div>
                      )}
                    </CardContent>
                    <Separator className="mt-3" />
                    {profile.user.skills.length > 0 && (
                      <a href={`/u/${userName}/details/skills`}>
                        <Button
                          variant={"link"}
                          className="w-full h-12 hover:no-underline hover:bg-secondary text-foreground"
                        >
                          Show all Skills <ArrowRight className="w-10 h-10" />
                        </Button>
                      </a>
                    )}
                  </Card>
                  {/* Interest card */}
                  {(profile.user.topVoice.length > 0 ||
                    profile.user.schools.length > 0 ||
                    profile.user.newsLetter.length > 0 ||
                    profile.user.companies.length > 0) && (
                    <Interest isUser={isUser} />
                  )}
                </section>
                <Sidebar />
              </section>
            </div>
          </main>
        </>
      )}
    </>
  );
}

export default ProfilePage;
