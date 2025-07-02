"use client";

import React, { Fragment } from "react";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../ui/card";
import { Button } from "../ui/button";
import { Diamond, Plus, Pencil, ArrowRight } from "lucide-react";
import { useSelector } from "react-redux";
import Image from "next/image";
import { Separator } from "../ui/separator";
import Link from "next/link";

function ProjectCard({ isUser }: { isUser: boolean }) {
  const { user, profile } = useSelector((state: any) => state.user);
  return (
    <Card>
      <CardHeader className="flex flex-row justify-between items-start gap-2">
        <CardTitle>Projects</CardTitle>

        {isUser && profile.projects.length > 0 && (
          <Link
            href={`/u/${profile.user.username}/details/projects?add=true`}
            className="flex gap-2 md:gap-5"
          >
            <Plus className="w-5 h-5 opacity-90" />
          </Link>
        )}
      </CardHeader>
      <CardContent className="flex flex-col gap-3 py-4">
        {profile.projects.length > 0 ? (
          profile.projects.map((project: any, i: number) => (
            <Fragment key={project._id}>
              <Link
                href={`/u/${profile.user.username}/details/projects/${project._id}`}
                key={project._id}
                className="flex flex-col justify-start"
              >
                <h3 className="font-semibold text-base leading-tight">
                  {project.title}
                </h3>
                <div className="text-xs opacity-50 mt-0.5 leading-none flex items-center gap-2">
                  <span>
                    {new Date(project.startDate).toLocaleString("en-US", {
                      month: "short",
                      year: "numeric",
                    })}
                    -{" "}
                    {project.current
                      ? "Current"
                      : new Date(project.endDate).toLocaleString("en-US", {
                          month: "short",
                          year: "numeric",
                        })}
                  </span>
                </div>
                <div className="text-sm my-2 overflow-hidden line-clamp-2 break-words">
                  {project.description}
                </div>
                <div className="flex justify-start px-3 py-3 -mt-2 items-center gap-2">
                  <Diamond className="w-5 stroke-2 h-5" />
                  <div className="flex gap-2 text-base">
                    {project.skills.map((skill: any, i: number) => (
                      <span
                        key={i}
                        className="text-sm font-semibold opacity-80"
                      >
                        {skill.name}
                        {i !== project.skills.length - 1 && ","}
                      </span>
                    ))}
                  </div>
                </div>
                {project.media.length > 0 && (
                  <div
                    style={{ scrollbarWidth: "thin" }}
                    className="flex gap-1 py-2 overflow-x-auto"
                  >
                    {project.media.map((image: any, i: number) => (
                      <img
                        className="h-16 md:w-32 md:h-20 rounded-lg"
                        src={image.url}
                        alt={project.name}
                        key={i}
                      />
                    ))}
                  </div>
                )}
              </Link>
              {i < profile.projects.length - 1 && (
                <Separator className="my-4" />
              )}
            </Fragment>
          ))
        ) : (
          <div className="flex justify-center items-center flex-col min-h-24">
            {isUser && (
              <Link
                href={`/u/${profile.user.username}/details/projects?add=true`}
              >
                <Button
                  variant={"outline"}
                  className="flex text-primary border-primary hover:text-primary items-center rounded-full"
                >
                  Add Projects
                </Button>
              </Link>
            )}
            <span className="text-sm opacity-60">
              No projects have been added yet
            </span>
          </div>
        )}
      </CardContent>
      <Separator />
      {profile.user.skills.length > 0 && (
        <Link href={`/u/${profile.user.username}/details/projects`}>
          <Button
            variant={"link"}
            className="w-full h-12 hover:no-underline hover:bg-secondary text-foreground"
          >
            Show all Projects <ArrowRight className="w-10 h-10" />
          </Button>
        </Link>
      )}
    </Card>
  );
}

export default ProjectCard;
