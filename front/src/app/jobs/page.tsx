"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Navbar from "@/components/userNavbar";
import { List, Save, SquarePen, User2, X } from "lucide-react";
import React, { useEffect, useState } from "react";

import FooterS from "@/components/footerS";
import ProfileCard from "@/components/profileCard";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/store/store";
import { recommendedJobsAction } from "@/store/jobs/jobSlice";
import { useRouter } from "next/navigation";
import { timeAgo } from "@/lib/functions";
import { Button } from "@/components/ui/button";

function Page() {
  const [jobs, setJobs] = useState<any[]>([]);

  const { recommendedJobs } = useSelector((state: RootState) => state.jobs);
  const dispatch = useDispatch<AppDispatch>();
  const router = useRouter();

  useEffect(() => {
    dispatch(recommendedJobsAction());
  }, []);

  useEffect(() => {
    setJobs(recommendedJobs);
  }, [recommendedJobs]);
  return (
    <>
      <Navbar />
      <main className="bg-[#f2f6f8] dark:bg-[#151515] w-full overflow-hidden py-5">
        <div className="container max-w-[1170px] mx-auto">
          {/* <section className="flex mx-auto max-w-7xl justify-center gap-2"> */}
          <section className="md:grid network mx-auto max-w-7xl min-h-screen gap-3">
            <aside className="md:flex flex-col gap-3 w-full shrink hidden h-min">
              {/* <Card className="bg-background w-full rounded-lg">
                <CardHeader className="p-0 rounded-2xl pb-3 flex flex-row justify-between items-center gap-2">
                  <div className="flex flex-col relative w-full h-32">
                    <Image
                      src={back}
                      alt="back"
                      className="w-full aspect-[4/1] flex-shrink-0 rounded-t-lg"
                    />
                    <Avatar className="w-24 h-24 ml-5 -mt-10">
                      <AvatarImage src="" />
                      <AvatarFallback>
                        <User2 className="w-20  opacity-70 h-20 p-5" />
                      </AvatarFallback>
                    </Avatar>
                  </div>
                </CardHeader>
                <CardContent className="flex flex-col gap-1 px-4 pt-0 pb-3">
                  <h3 className="text-lg pb-2 font-semibold">Your Name</h3>
                  <span className="text-xs opacity-70 -mt-2">
                    MERN FULL STACK WEB DEVELOPER || MongoDB || Express ||
                  </span>
                  <h3 className="text-opacity-50 text-xs opacity-50">
                    Maharashtra
                  </h3>
                </CardContent>
              </Card> */}
              <ProfileCard />
              <Card className="bg-background rounded-lg">
                <CardContent className="flex flex-col gap-5 p-5 px-8">
                  <div className="flex gap-5 items-center">
                    <List className="w-5 h-5" />
                    <h3 className="text-base font-semibold">Preferences</h3>
                  </div>
                  <div className="flex gap-5 items-center">
                    <Save className="w-5 h-5" />
                    <h3 className="text-base font-semibold">My Jobs</h3>
                  </div>
                  <hr />
                  <div className="flex gap-5 text-primary items-center">
                    <SquarePen className="w-5 h-5" />
                    <h3 className="text-base font-semibold">Post a free Job</h3>
                  </div>
                </CardContent>
              </Card>
              <FooterS />
            </aside>
            <section className="min-h-screen max-w-[860px] overflow-hidden w-full flex flex-col gap-5 flex-grow-0">
              <Card className="bg-background rounded-lg">
                <CardHeader className="">
                  <CardTitle className="text-lg -mb-1.5 font-semibold">
                    Top job picks for you
                  </CardTitle>
                  <p className="text-xs opacity-70">
                    Based on your profile and preferences
                  </p>
                </CardHeader>
                <CardContent className="flex flex-col gap-3 p-5">
                  {Array.isArray(jobs) &&
                    jobs.map((job) => (
                      <div
                        key={job._id}
                        onClick={() => router.push(`/jobs/${job._id}`)}
                        className="w-full flex justify-between md:p-3 p-1.5 rounded-md hover:bg-gray-50 transition-shadow duration-300"
                      >
                        <div className="flex flex-row items-center mb-2">
                          <Avatar className="w-10 h-10">
                            <AvatarImage src={job.company.avatar?.url} />
                            <AvatarFallback>
                              {job.title.charAt(0)}
                            </AvatarFallback>
                          </Avatar>
                          <div className="flex-1 ml-3 flex flex-col">
                            <h2 className="font-semibold text-base">
                              {job.title}
                            </h2>
                            <p className="text-sm text-gray-600">
                              {job.company.name},{" "}
                              {job.location.length > 1
                                ? "Multiple locations"
                                : job.location[0]}
                            </p>
                            <p className="text-sm text-gray-600"></p>

                            <p className="text-xs text-gray-500">
                              {timeAgo(job.createdAt)}
                            </p>
                          </div>
                        </div>
                        <Button
                          variant={"outline"}
                          size={"icon"}
                          onClick={() => {
                            setJobs((prevjobs) =>
                              prevjobs.filter((temp) => temp._id !== job._id)
                            );
                          }}
                        >
                          <X className="w-5 h-5 opacity-80 hover:opacity-100" />
                        </Button>
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
    </>
  );
}

export default Page;
