"use client";

import React from "react";
import { Card, CardHeader } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { timeAgo } from "@/lib/functions";

function JobCard({ job }: any) {
  return (
    <Card className="md:flex flex-col gap-3 h-min">
      <CardHeader className="flex flex-col justify-between gap-3 items-start">
        <div className="flex flex-col gap-2 w-full">
          <Link
            href={`/company/${job.company._id}`}
            className="flex items-center gap-4"
          >
            <Avatar className="w-8 h-8">
              <AvatarImage
                src={job.company?.avatar?.url}
                alt={job.company?.name}
              />
              <AvatarFallback>
                {job.company?.name?.charAt(0).toUpperCase() || "?"}
              </AvatarFallback>
            </Avatar>
            <div className="flex flex-col">
              <h3 className="text-base font-bold text-gray-900">
                {job.company?.name}
              </h3>
            </div>
          </Link>
          <Link
            href={`/jobs/${job._id}`}
            className="mt-2 text-2xl font-extrabold text-gray-800"
          >
            {job.title}
          </Link>
          <div className="text-sm text-gray-600">
            <p>
              {job.location.length > 1 ? "Multiple Locations" : job.location[0]}{" "}
              | Posted {timeAgo(job.createdAt)} | {job.applications.length}{" "}
              {job.applications.length === 1 ? "Application" : "Applications"}
            </p>
            <div className="mt-2 flex gap-2">
              <Badge className="text-xs bg-gray-400">{job.category}</Badge>
              <Badge className="text-xs bg-gray-400">{job.workType}</Badge>
              <Badge className="text-xs bg-gray-400">{job.type}</Badge>
            </div>
          </div>
        </div>
      </CardHeader>
    </Card>
  );
}

export default JobCard;
