"use client";
import { User2, X } from "lucide-react";
import axios from "@/store/axios";
import React, { useState, Fragment, useEffect } from "react";
import { toast } from "sonner";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import FooterS from "@/components/footerS";
import IntroNavbar from "@/components/introNavbar";
import Navbar from "@/components/userNavbar";
import Link from "next/link";
import { useSelector } from "react-redux";
import { RootState } from "@/store/store";

function Page() {
  const [jobs, setJobs] = useState([]);

  const { user } = useSelector((state: RootState) => state.user);

  async function fetchJobs() {
    try {
      const { data } = await axios.get("/jobs/intro");
      setJobs(data.jobs);
    } catch (error) {
      toast.error("Failed to fetch jobs", {
        position: "top-center",
      });
    }
  }

  useEffect(() => {
    fetchJobs();
  }, []);

  return (
    <>
      {user ? <Navbar /> : <IntroNavbar />}
      <section className="container lg:max-w-[1100px] mx-auto py-6">
        <section className="md:grid grid-cols-[1fr_300px] block gap-4">
          <Card className="flex flex-col max-w-screen-md w-full gap-3 overflow-auto">
            <div className="px-4 py-3 border-b border-gray-200 flex items-center justify-between">
              <div className="flex flex-col">
                <h3 className="text-lg font-bold text-primary">
                  Job Recommendations
                </h3>
              </div>
            </div>
            <CardContent className="flex flex-col gap-2 py-5">
              {jobs.length > 0 ? (
                jobs.map((job: any) => (
                  <Link
                    href={`/jobs/${job._id}`}
                    className="block"
                    key={job._id}
                  >
                    <div className="flex gap-5 justify-between items-center">
                      <div className="flex gap-5 items-center">
                        <Avatar className="w-14 h-14">
                          <AvatarImage src={job.company.avatar?.url} />
                          <AvatarFallback>
                            <User2 className="w-14 h-14 p-3" />
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex flex-col">
                          <h3 className="text-base text-primary font-bold">
                            {job.title}
                          </h3>
                          <span className="text-xs opacity-70">
                            {job.company.name} | {job.location}
                          </span>
                          <span className="text-xs opacity-50 pt-2">
                            {new Date(job.createdAt).toLocaleDateString(
                              "en-US",
                              {
                                year: "numeric",
                                month: "short",
                                day: "numeric",
                              }
                            )}
                          </span>
                        </div>
                      </div>
                      <div className="flex items-center h-full">
                        <X className="w-5 h-5" />
                      </div>
                    </div>
                    <hr className="my-2" />
                  </Link>
                ))
              ) : (
                <div className="text-center flex justify-center items-center text-gray-500">
                  No jobs available at the moment.
                </div>
              )}
            </CardContent>
          </Card>
          <aside>
            <FooterS />
          </aside>
        </section>
      </section>
    </>
  );
}

export default Page;
