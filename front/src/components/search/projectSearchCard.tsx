"use client";

import Link from "next/link";
import React, { useEffect, useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { Button } from "../ui/button";
import { Separator } from "../ui/separator";
import { timeAgo } from "@/lib/functions";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/store/store";
import { toast } from "sonner";
import { toggleFollow } from "@/store/user/userSlice";
import { project } from "@/store/user/typeUser";

function ProjectSearchCard({ project, i }: { project: project; i: number }) {
  const [followUser, setFollowUser] = useState(false);

  const dispatch = useDispatch<AppDispatch>();
  const { user } = useSelector((state: RootState) => state.user);
  const { projects } = useSelector((state: RootState) => state.search);

  useEffect(() => {
    if (user && user.following.includes(project.user._id)) {
      setFollowUser(true);
    }
  }, [user]);
  return (
    <>
      <div className="flex items-center justify-between gap-2 py-2">
        <Link className="flex items-start" href={`/u/${project.user.username}`}>
          <Avatar className="h-8 w-8">
            <AvatarImage
              src={project.user?.avatar?.url}
              alt={project.user?.name || "User"}
            />
            <AvatarFallback>{project.user?.name?.charAt(0)}</AvatarFallback>
          </Avatar>
          <div className="flex flex-col items-start ml-2">
            <span className="font-medium text-sm">{project.user.name}</span>
            <span className="text-xs opacity-80">{project.user.headline}</span>
          </div>
        </Link>
        {(!user || !followUser) && project.user._id !== user?._id && (
          <Button
            className="ml-2 px-3 py-1 border-primary text-primary hover:text-white hover:bg-primary rounded-full text-xs"
            variant="outline"
            size="sm"
            onClick={(e) => {
              if (!user) {
                toast.error("You must be logged in to follow users", {
                  position: "top-center",
                });
                return;
              }
              dispatch(toggleFollow(project.user._id))
                .then(() => {
                  toast.success(`You are now following ${project.user.name}`, {
                    position: "top-center",
                  });
                  setFollowUser(true);
                })
                .catch(() => {
                  toast.error(`Failed to follow ${project.user.name}`, {
                    position: "top-center",
                  });
                });
            }}
          >
            Follow
          </Button>
        )}
      </div>
      <div className="flex justify-between my-2 items-start">
        <div className="flex justify-start items-start gap-3">
          <div className="flex flex-col max-w-96 gap-1">
            <div className="flex gap-2">
              <h4 className="font-semibold text-primary">{project.title}</h4>
              {project.current ? (
                <span className="ml-1 px-2 py-0.5 rounded-full bg-yellow-100 text-yellow-700 text-xs font-medium">
                  working
                </span>
              ) : (
                <span className="ml-1 px-2 py-0.5 rounded-full bg-green-100 text-green-700 text-xs font-medium">
                  completed
                </span>
              )}
            </div>
            <span className="text-sm text-muted-foreground line-clamp-2">
              {project.description}
            </span>
            <div className="flex flex-wrap gap-1 mt-1">
              {project.skills.map((skill) => (
                <span
                  key={skill.name}
                  className="bg-secondary text-xs px-2 py-0.5 rounded-full"
                >
                  {skill.name}
                </span>
              ))}
            </div>

            <div className="flex items-center gap-3 text-xs text-muted-foreground mt-1">
              <span>{project.likes.length} likes</span>
              <span>{project.comments.length} comments</span>
            </div>
            <div className="text-xs opacity-70 leading-none mt-2 flex items-center gap-1">
              <span>{timeAgo(project.createdAt.toString())}</span>
            </div>
          </div>
        </div>

        {/* <Button
                        className="flex items-center w-min md:ml-8 mt-2 px-7 py-2 border-primary text-primary hover:text-white hover:bg-primary rounded-full"
                        variant={"outline"}
                        size={"sm"}
                        onClick={() => {
                          if (!user) {
                            toast.error(
                              "You must be logged in to save projects",
                              { position: "top-center" }
                            );
                            return;
                          }
                          // dispatch(saveProject(project._id)); future update
                        }}
                      >
                        Save
                      </Button> */}
      </div>
      {i < projects.length - 1 && <Separator className="my-1" />}
    </>
  );
}

export default ProjectSearchCard;
