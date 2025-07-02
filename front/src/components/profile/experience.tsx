"use client";

import React, { Fragment } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../ui/card";
import { Button } from "../ui/button";
import { Diamond, Plus, Pencil, ArrowRight } from "lucide-react";
import { useSelector } from "react-redux";
import { Separator } from "../ui/separator";
import Link from "next/link";

function Experience({
  isUser,
  username,
}: {
  isUser: boolean;
  username: string;
}) {
  const { user, profile } = useSelector((state: any) => state.user);
  return (
    <Card>
      <CardHeader className="flex flex-row justify-between items-start gap-2">
        <CardTitle>Experience</CardTitle>
        {isUser && profile.experiences.length > 0 && (
          <div className="flex gap-2 md:gap-5">
            <Link href={`/u/${username}/details/experience?add=true`}>
              <Plus className="w-5 h-5 opacity-90" />
            </Link>
            <Link href={`/u/${username}/details/experience`}>
              <Pencil className="w-5 h-5 opacity-90" />
            </Link>
          </div>
        )}
      </CardHeader>
      <CardContent className="flex flex-col gap-3">
        {profile.experiences.length > 0 ? (
          profile.experiences.map((exp: any, i: number) => (
            <Fragment key={exp._id}>
              <div
                key={exp._id}
                className="flex justify-start items-start gap-3"
              >
                <div className="flex flex-col justify-start">
                  <div className="flex flex-col justify-start gap-1">
                    <h3 className="font-semibold text-base flex items-center gap-2">
                      {exp.title}
                      {exp.working && (
                        <span className="ml-1 px-2 py-0.5 rounded-full bg-green-100 text-green-700 text-xs font-medium">
                          Current
                        </span>
                      )}
                    </h3>
                    <div className="flex items-center gap-1 text-sm text-gray-700">
                      <span className="font-medium">{exp.companyName}</span>
                      <span className="mx-1">•</span>
                      <span>{exp.location}</span>
                    </div>
                    <div className="flex items-center gap-1 text-xs text-gray-500">
                      <span>{exp.workType}</span>
                      <span className="mx-1">|</span>
                      <span>{exp.jobType}</span>
                    </div>
                    <div className="flex items-center gap-1 text-xs text-gray-400">
                      <span>
                        {new Date(exp.startDate).toLocaleString("default", {
                          month: "short",
                          year: "numeric",
                        })}
                      </span>
                      <span className="mx-1">-</span>
                      <span>
                        {exp.working
                          ? "Present"
                          : exp.endDate
                          ? new Date(exp.endDate).toLocaleString("default", {
                              month: "short",
                              year: "numeric",
                            })
                          : ""}
                      </span>
                    </div>
                  </div>
                  <CardDescription className="text-sm my-4 opacity-90 line-clamp-2 overflow-hidden text-ellipsis">
                    {exp.description}
                  </CardDescription>
                  <div className="flex justify-start px-3 py-2 mt-2 items-center gap-2">
                    <Diamond className="w-5 stroke-2 h-5" />
                    <div className="flex gap-2 text-base">
                      {exp.skills.map((skill: any, i: number) => (
                        <span
                          key={skill._id}
                          className="text-sm font-semibold opacity-80"
                        >
                          {skill.name}
                          {i !== exp.skills.length - 1 && ","}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
              {i !== profile.experiences.length - 1 && (
                <Separator className="my-4" />
              )}
            </Fragment>
          ))
        ) : (
          <div className="flex justify-center items-center flex-col min-h-24">
            {isUser && (
              <Link href={`/u/${username}/details/experience?add=true`}>
                <Button
                  variant={"outline"}
                  className="flex text-primary border-primary hover:text-primary items-center rounded-full"
                >
                  kLink Add Experience
                </Button>
              </Link>
            )}
            <span className="text-sm opacity-60">
              No experience has been added yet
            </span>
          </div>
        )}
      </CardContent>
      <Separator className="mt-2" />
      {profile.experiences.length > 0 && (
        <Link href={`/u/${profile.user.username}/details/experience`}>
          <Button
            variant={"link"}
            className="w-full h-12 hover:no-underline hover:bg-secondary text-foreground"
          >
            kLink Show all Experiences <ArrowRight className="w-10 h-10" />
          </Button>
        </Link>
      )}
    </Card>
  );
}

export default Experience;
