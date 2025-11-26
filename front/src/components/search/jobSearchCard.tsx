"use client";

import React from "react";
import Link from "next/link";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { User2, X } from "lucide-react";
import { Button } from "../ui/button";
import { Job } from "@/store/jobs/typeJob";

function JobSearchCard({
  job,
  removeHandler,
}: {
  job: Job;
  removeHandler: (id: string) => void;
}) {
  return (
    <>
      <div className="flex gap-5 justify-between items-center">
        <Link href={`/jobs/${job._id}`} className="flex gap-5 items-center">
          <Avatar className="w-14 h-14">
            <AvatarImage src={job.company.avatar?.url} />
            <AvatarFallback>
              <User2 className="w-14 h-14 p-3" />
            </AvatarFallback>
          </Avatar>
          <div className="flex flex-col">
            <h3 className="text-base text-primary font-bold">{job.title}</h3>
            <span className="text-xs opacity-70">
              {job.company.name} | {job.location}
            </span>
            <span className="text-xs opacity-50 pt-2">
              {new Date(job.createdAt).toLocaleDateString("en-US", {
                year: "numeric",
                month: "short",
                day: "numeric",
              })}
            </span>
          </div>
        </Link>
        <div className="flex items-center h-full">
          <Button
            onClick={() => removeHandler(job._id)}
            variant={"outline"}
            size={"icon"}
            className=""
          >
            <X className="w-5 h-5" />
          </Button>
        </div>
      </div>
      <hr className="my-2" />
    </>
  );
}

export default JobSearchCard;
