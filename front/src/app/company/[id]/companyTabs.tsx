"use client";

import { SecondaryLoader } from "@/components/loader";
import Post from "@/components/post";
import RecommendedJobs from "@/components/recommend/recommendedJobs";
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
import {
  DropdownMenu,
  DropdownMenuGroup,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { timeAgo } from "@/lib/functions";
import { RootState } from "@/store/store";
import { sUser } from "@/store/user/typeUser";
import {
  DropdownMenuContent,
  DropdownMenuItem,
} from "@radix-ui/react-dropdown-menu";
import { Bell, MoreHorizontal } from "lucide-react";
import Link from "next/link";
import React, { Fragment, useEffect, useState } from "react";
import { useSelector } from "react-redux";

function CompanyTabs({ tab }: { tab: string }) {
  const [isAdmin, setIsAdmin] = useState(false);

  const { company, posts, jobs } = useSelector(
    (state: RootState) => state.company
  );
  const { user } = useSelector((state: RootState) => state.user);

  useEffect(() => {
    if (user && company) {
      setIsAdmin(company.admin.some((admin) => admin === user._id));
    }
  }, [user, company]);

  if (!company) {
    return (
      <div className="flex items-center min-h-32 justify-center h-full">
        <SecondaryLoader />
      </div>
    );
  }

  interface member extends sUser {
    position?: string;
  }

  return (
    <>
      {tab == "About" && (
        <>
          <section className="">
            <Card>
              <CardHeader>
                <CardTitle>Overview</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>
                  {company.about ||
                    "This company has not provided any information about itself."}
                </CardDescription>
                <div className="flex flex-col mt-4 gap-3">
                  {company.website && (
                    <div className="">
                      <h3 className="text-sm font-semibold">Website</h3>
                      <p className="text-sm opacity-60 font-normal">
                        {company.website || "https://xyz.com"}
                      </p>
                    </div>
                  )}
                  <div className="">
                    <h3 className="text-sm font-semibold">Company size</h3>
                    <p className="text-sm opacity-60 font-normal">
                      {company.totalFollowers || "0"} followers <br />
                      {company.totalMembers || "0"} members
                    </p>
                  </div>
                  <div className="">
                    <h3 className="text-sm font-semibold">HeadQuater</h3>
                    <p className="text-sm opacity-60 font-normal">
                      {company.address?.[0]?.address || ""} <br />
                      {company.address?.[0]?.city || ""},{" "}
                      {company.address?.[0]?.state || ""},{" "}
                      {company.address?.[0]?.country || ""}
                    </p>
                  </div>
                  {/* <div className="">
                    <h3 className="text-sm font-semibold">Industry</h3>
                    <p className="text-sm opacity-60 font-normal">
                      {company.industry || ""}
                    </p>
                  </div> */}
                  <div className="">
                    <h3 className="text-sm font-semibold">Specialized</h3>
                    <p className="text-sm opacity-60 font-normal">
                      {company.headline ||
                        "No specialized information provided."}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </section>
        </>
      )}
      {tab == "Jobs" && (
        <section className="flex flex-col gap-5">
          <Card className="flex flex-col gap-3">
            <CardHeader className="flex flex-row justify-between p-4 items-center">
              <CardTitle className="text-base flex items-center">
                <Bell className="fill-foreground inline-block mr-3 text-base w-4 h-4" />
                {isAdmin ? "Manage Jobs" : "Jobs"}
              </CardTitle>
              {isAdmin && (
                <div className="flex items-center gap-2">
                  <Link href={`/jobs/create?company=${company._id}`}>
                    <Button
                      className="hover:bg-background hover:text-primary"
                      variant={"default"}
                    >
                      Post a Job
                    </Button>
                  </Link>
                  <Link href={`/company/${company._id}/details/jobs`}>
                    <Button
                      className="hover:bg-background hover:text-primary"
                      variant={"outline"}
                    >
                      Manage Jobs
                    </Button>
                  </Link>
                </div>
              )}
            </CardHeader>
            <CardContent className="text-sm opacity-60 -mt-5">
              {isAdmin
                ? "Manage your company's job listings here."
                : "Explore job opportunities at this company."}
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row justify-between p-4 items-center">
              <CardTitle className="text-base flex items-center">
                <Bell className="fill-foreground inline-block mr-3 text-base w-4 h-4" />
                Create Job Alert
              </CardTitle>
              <Button
                className="hover:bg-background hover:text-primary"
                variant={"default"}
              >
                Create Job Alert
              </Button>
            </CardHeader>
          </Card>
          {jobs.length > 0 ? (
            <Card>
              <CardHeader>
                <CardTitle className="">Recommended Jobs for you</CardTitle>
                <p className="text-sm opacity-80">Based on your profile</p>
              </CardHeader>
              <CardContent
                style={{ scrollbarWidth: "none" }}
                className="flex gap-3 overflow-auto"
              >
                {jobs.map((job, i) => (
                  <Card
                    key={job._id}
                    className="max-w-60 flex flex-col p-3 shrink-0 items-start"
                  >
                    <CardContent className="p-2">
                      <Link
                        href={`/jobs/${job._id}`}
                        className="flex flex-col gap-2"
                      >
                        <Avatar className="w-20 h-20">
                          <AvatarImage src={company.avatar?.url} />
                          <AvatarFallback>C</AvatarFallback>
                        </Avatar>
                        <h2 className="font-semibold pt-3 text-base">
                          {job.title}
                        </h2>
                        <p className="text-sm opacity-80">
                          {job.company.name} <br />
                          {job.location.map((loc) => loc).join(", ")}
                        </p>
                        <p className="pt-7 text-xs opacity-70">
                          {timeAgo(String(job.createdAt))}
                        </p>
                      </Link>
                      {isAdmin && (
                        <DropdownMenu>
                          <DropdownMenuTrigger className="hover:bg-foreground/5 p-2 rounded-full">
                            <MoreHorizontal className="w-4 h-4" />
                          </DropdownMenuTrigger>
                          <DropdownMenuContent className="shadow-md">
                            <DropdownMenuGroup>
                              <DropdownMenuItem>
                                <DropdownMenuLabel>Apply</DropdownMenuLabel>
                              </DropdownMenuItem>
                            </DropdownMenuGroup>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      )}
                    </CardContent>
                  </Card>
                ))}
              </CardContent>
            </Card>
          ) : (
            <Card className="text-sm opacity-60 flex items-center justify-center h-32 p-2">
              No jobs available for this company.
            </Card>
          )}
          <RecommendedJobs company={company._id} />
        </section>
      )}
      {tab == "Posts" && (
        <section className="flex flex-col gap-5">
          <Card className="flex flex-col gap-3">
            <CardHeader className="flex flex-row justify-between p-4 items-center">
              <CardTitle className="text-base flex items-center">
                <Bell className="fill-foreground inline-block mr-3 text-base w-4 h-4" />
                {isAdmin ? "Manage Posts" : "Posts"}
              </CardTitle>
              {isAdmin && (
                <div className="flex items-center gap-2">
                  <Link href={`/post/create?company=${company._id}`}>
                    <Button
                      className="hover:bg-background hover:text-primary"
                      variant={"default"}
                    >
                      Post a Job
                    </Button>
                  </Link>
                  <Link href={`/company/${company._id}/details/posts`}>
                    <Button
                      className="hover:bg-background hover:text-primary"
                      variant={"outline"}
                    >
                      Manage Posts
                    </Button>
                  </Link>
                </div>
              )}
            </CardHeader>
            <CardContent className="text-sm opacity-60 -mt-5">
              {isAdmin
                ? "Manage your company's posts listings here."
                : "Explore posts of this company."}
            </CardContent>
          </Card>
          {posts.length > 0 ? (
            posts.map((post) => (
              <Fragment key={post._id}>
                <Post cardClass={"w-full"} post={post} />
              </Fragment>
            ))
          ) : (
            <Card className="text-sm opacity-60 flex items-center justify-center h-32 p-2">
              No posts available for this company.
            </Card>
          )}
        </section>
      )}
      {tab == "People" && (
        <section className="flex flex-col gap-5">
          <Card>
            <CardHeader>
              <CardTitle>Employees</CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col gap-3">
              {company.members.length > 0 ? (
                company.members
                  .filter((m) => typeof m !== "string")
                  .map((member) => (
                    <Link
                      href={`/u/${member.username}`}
                      key={member._id}
                      className="flex items-center gap-3 p-2 hover:bg-gray-50 rounded-md"
                    >
                      <Avatar className="w-10 h-10">
                        <AvatarImage src={member.avatar?.url} />
                        <AvatarFallback>{member.name[0]}</AvatarFallback>
                      </Avatar>
                      <div className="flex flex-col">
                        <span className="font-semibold">{member.name}</span>
                        <span className="text-sm opacity-70">
                          {member.position || "Employee"}
                        </span>
                      </div>
                    </Link>
                  ))
              ) : (
                <p className="text-sm opacity-60">No employees found.</p>
              )}
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Admin</CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col gap-3">
              {company.admin.length > 0 ? (
                company.admin.map((member: any) => (
                  <Link
                    href={`/u/${member.username}`}
                    key={member._id}
                    className="flex items-center gap-3 p-2 hover:bg-gray-50 rounded-md"
                  >
                    <Avatar className="w-10 h-10">
                      <AvatarImage src={member.avatar?.url} />
                      <AvatarFallback>{member.name[0]}</AvatarFallback>
                    </Avatar>
                    <div className="flex flex-col">
                      <span className="font-semibold">{member.name}</span>
                      <span className="text-sm opacity-70">
                        {member.position || "Member"}
                      </span>
                    </div>
                  </Link>
                ))
              ) : (
                <p className="text-sm opacity-60">No members found.</p>
              )}
            </CardContent>
          </Card>
        </section>
      )}
      {tab == "Home" && (
        <section className="flex flex-col gap-5">
          <Card>
            <CardHeader>
              <CardTitle>Company Overview</CardTitle>
            </CardHeader>
            <CardContent className="text-sm opacity-60">
              {company.about ||
                "This company has not provided any description."}
            </CardContent>
          </Card>
          {posts?.length > 0 &&
            posts.map((post: any) => (
              <Fragment key={post._id}>
                <Post cardClass={"w-full"} post={post} />
              </Fragment>
            ))}
        </section>
      )}
    </>
  );
}

export default CompanyTabs;
