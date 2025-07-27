"use client";

import React, { useEffect } from "react";
import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/store/store";
import { recommendedJobsAction } from "@/store/jobs/jobSlice";
import { timeAgo } from "@/lib/functions";
import { useRouter } from "next/navigation";

function RecommendedJobs({ company }: { company?: string }) {
  const router = useRouter();
  const dispatch = useDispatch<AppDispatch>();
  const { recommendedJobs } = useSelector((state: RootState) => state.jobs);

  useEffect(() => {
    if (company) {
      dispatch(recommendedJobsAction(company));
    }
  }, [company]);

  if (recommendedJobs.length === 0) return null;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="">Recently posted jobs</CardTitle>
      </CardHeader>
      <div
        style={{ scrollbarWidth: "none" }}
        className="flex flex-col gap-3 overflow-auto px-2"
      >
        {Array.isArray(recommendedJobs) &&
          recommendedJobs.map((job) => (
            <div
              key={job._id}
              onClick={() => router.push(`/jobs/${job._id}`)}
              className="w-full flex flex-col p-3 rounded-md hover:bg-gray-50 transition-shadow duration-300"
            >
              <div className="flex flex-row items-center mb-2">
                <Avatar className="w-10 h-10">
                  <AvatarImage src={job.company.avatar?.url} />
                  <AvatarFallback>{job.company.name.charAt(0)}</AvatarFallback>
                </Avatar>
                <div className="flex-1 ml-3 flex flex-col">
                  <h2 className="font-semibold text-base">{job.title}</h2>
                  <p className="text-sm text-gray-600">{job.company.name}</p>
                  <p className="text-sm text-gray-600">
                    {job.location.length > 1
                      ? "Multiple locations"
                      : job.location[0]}
                  </p>

                  <p className="text-xs text-gray-500">
                    {timeAgo(job.createdAt)}
                  </p>
                </div>
              </div>
            </div>
          ))}
      </div>
    </Card>
  );
}

export default RecommendedJobs;
