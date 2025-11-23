"use client";

import AuthProvider from "@/components/authProvider";
import FooterS from "@/components/footerS";
import ProfileCard from "@/components/profileCard";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Navbar from "@/components/userNavbar";
import { timeAgo } from "@/lib/functions";
import { getUserJobApplicationsAction } from "@/store/jobs/applyJobsSlice";
import { AppDispatch, RootState } from "@/store/store";
import Link from "next/link";
import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

function Page() {
  const dispatch = useDispatch<AppDispatch>();
  const { user } = useSelector((state: RootState) => state.user);
  const { appliedJobs } = useSelector((state: RootState) => state.applyJobs);

  useEffect(() => {
    if (user) {
      dispatch(getUserJobApplicationsAction());
    }
  }, [user]);
  return (
    <AuthProvider>
      <Navbar />
      <main className="bg-[#f2f6f8] dark:bg-[#151515] w-full overflow-hidden py-5">
        <div className="container max-w-[1170px] mx-auto">
          {/* <section className="flex mx-auto max-w-7xl justify-center gap-2"> */}
          <section className="md:grid network mx-auto max-w-7xl min-h-screen gap-3">
            <aside className="md:flex flex-col gap-3 w-full shrink hidden h-min">
              <ProfileCard />
              <FooterS />
            </aside>
            <section className="min-h-screen max-w-[860px] overflow-hidden w-full flex flex-col gap-5 flex-grow-0">
              <Card className="bg-background rounded-lg">
                <CardHeader className="">
                  <CardTitle className="text-lg -mb-1.5 font-semibold">
                    You applied Jobs
                  </CardTitle>
                  <p className="text-xs opacity-70">
                    Jobs that you have been applied
                  </p>
                </CardHeader>
                <CardContent className="flex flex-col gap-3 p-5">
                  {appliedJobs &&
                    appliedJobs.map((job) => (
                      <div
                        key={job._id}
                        className="w-full flex justify-between md:p-3 p-1.5 rounded-md hover:bg-gray-50 transition-shadow duration-300"
                      >
                        <Link
                          href={`/jobs/${job._id}`}
                          className="flex flex-row items-center mb-2"
                        >
                          <Avatar className="w-10 h-10">
                            <AvatarImage src={job.company.avatar?.url} />
                            <AvatarFallback>
                              {job.job.title.charAt(0)}
                            </AvatarFallback>
                          </Avatar>
                          <div className="flex-1 ml-3 flex flex-col">
                            <h2 className="font-semibold text-base">
                              {job.job.title}
                            </h2>
                            <p className="text-sm text-gray-600">
                              {job.company.name},{" "}
                              {job.job.location.length > 1
                                ? "Multiple locations"
                                : job.job.location[0]}
                            </p>
                            <p className="text-sm text-gray-600"></p>

                            <p className="text-xs text-gray-500">
                              {timeAgo(new Date(job.createdAt).toString())}
                            </p>
                          </div>
                        </Link>
                      </div>
                    ))}
                </CardContent>
              </Card>
              <div className="w-full justify-center md:hidden flex">
                <FooterS />
              </div>
            </section>
          </section>
        </div>
      </main>
    </AuthProvider>
  );
}

export default Page;
