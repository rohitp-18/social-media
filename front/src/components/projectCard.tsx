"use client";

import React, { use, useEffect, useState } from "react";
import { CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Diamond, Edit2, Trash, User2 } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  AlertDialog,
  AlertDialogTrigger,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogAction,
  AlertDialogTitle,
  AlertDialogCancel,
  AlertDialogFooter,
} from "./ui/alert-dialog";
import { AppDispatch, RootState } from "@/store/store";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "sonner";
import { deleteProject, getProfileProjects } from "@/store/user/projectSlice";

function ProjectCard({
  project,
  isUser,
  setSelect,
  setEdit,
  username,
  showUser,
}: {
  project: any;
  isUser: boolean;
  setSelect?: (val: any) => void;
  setEdit?: (val: boolean) => void;
  username: string;
  showUser: boolean;
}) {
  const [showDescription, setShowDescription] = useState<any>(null);

  const dispatch = useDispatch<AppDispatch>();
  const { loading, deleted, message, error } = useSelector(
    (state: RootState) => state.project
  );

  useEffect(() => {
    if (deleted) {
      dispatch(getProfileProjects(username));
      toast.success(message, {
        description: "Project deleted successfully",
        position: "top-center",
      });
    }
    if (error) {
      toast.error(error, {
        description: "Something went wrong",
        position: "top-center",
      });
    }
  }, [deleted, message, error]);

  return (
    <div
      key={project._id}
      id={project._id}
      className="flex justify-between items-start"
    >
      <div className="flex flex-col justify-start">
        <div className="flex items-center justify-between gap-2 w-full">
          <div className="flex flex-col gap-1">
            <h3 className="font-semibold text-base leading-tight">
              {project.title}
            </h3>
            <div className="text-xs opacity-50 leading-none flex items-center gap-2">
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
          </div>
          {isUser && setSelect && setEdit && (
            <div className="text-xs opacity-50 leading-none flex items-center gap-2">
              <Button
                onClick={() => {
                  setSelect(project);
                  setEdit(true);
                }}
                variant={"outline"}
                size="icon"
              >
                <Edit2 className="w-4 h-4 opacity-80 hover:opacity-100" />
              </Button>
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button variant={"outline"} size="icon">
                    <Trash className="w-4 h-4 opacity-80 hover:opacity-100" />
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogTitle>Delete Project</AlertDialogTitle>
                  <AlertDialogDescription>
                    Are you sure you want to delete this project?
                  </AlertDialogDescription>
                  <AlertDialogFooter>
                    <AlertDialogAction asChild>
                      <Button
                        variant="outline"
                        className="bg-red-500 text-white hover:bg-red-600"
                        onClick={() => dispatch(deleteProject(project._id))}
                      >
                        Delete
                      </Button>
                    </AlertDialogAction>
                    <AlertDialogCancel asChild>
                      <Button
                        variant="outline"
                        className="bg-gray-200 text-black hover:bg-gray-300"
                      >
                        Cancel
                      </Button>
                    </AlertDialogCancel>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </div>
          )}
        </div>
        {project.description && (
          <div className="text-sm py-4 flex-wrap flex text-muted-foreground">
            <div className="flex">
              {showDescription === project._id ? (
                <CardDescription>{project.description}</CardDescription>
              ) : (
                <CardDescription className={`line-clamp-2`}>
                  {project.description.length > 150
                    ? `${project.description.substring(0, 150).trim()} ...`
                    : project.description}
                </CardDescription>
              )}
            </div>
            {project.description.length > 150 && (
              <Button
                variant="ghost"
                onClick={() =>
                  setShowDescription(
                    showDescription === project._id ? null : project._id
                  )
                }
                className="p-0 h-auto text-xs font-semibold"
              >
                {showDescription === project._id ? "Show less" : "Show more"}
              </Button>
            )}
          </div>
        )}
        {showUser && (
          <a
            href={`/u/${project.user.username}`}
            className="flex items-center gap-3 px-3 py-2 mb-3 bg-muted/50 w-min rounded-md shadow-sm hover:shadow-md"
          >
            <Avatar className="w-9 h-9 border border-primary/40 shadow-sm">
              <AvatarImage
                src={project.user.avatar?.url}
                alt={project.user.name}
              />
              <AvatarFallback>
                <User2 className="w-4 h-4 text-primary" />
              </AvatarFallback>
            </Avatar>
            <div className="flex flex-col min-w-0">
              <span className="text-sm font-medium text-primary truncate">
                {project.user.name}
              </span>
              <span className="text-xs text-muted-foreground truncate max-w-[140px]">
                {project.user.headline}
              </span>
            </div>
          </a>
        )}
        <div className="flex justify-start px-3 py-2 -mt-2 items-center gap-2">
          <Diamond className="w-5 stroke-2 h-5" />
          <div className="flex gap-2 text-base">
            {project.skills.map((skill: any, i: number) => (
              <span key={i} className="text-sm font-semibold opacity-80">
                {skill.name}
              </span>
            ))}
          </div>
        </div>
        {(!project.githubLink || project.liveLink) && (
          <div className="flex items-center gap-4 px-3 py-2">
            {project.githubLink && (
              <a
                href={project.githubLink}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1 text-sm font-semibold text-blue-600 hover:underline"
              >
                <svg
                  className="w-4 h-4"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                >
                  <path d="M12 2C6.477 2 2 6.484 2 12.021c0 4.428 2.865 8.184 6.839 9.504.5.092.682-.217.682-.482 0-.237-.009-.868-.014-1.703-2.782.605-3.369-1.342-3.369-1.342-.454-1.155-1.11-1.463-1.11-1.463-.908-.62.069-.608.069-.608 1.004.07 1.532 1.032 1.532 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.339-2.221-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.025A9.564 9.564 0 0 1 12 6.844c.85.004 1.705.115 2.504.337 1.909-1.295 2.748-1.025 2.748-1.025.546 1.378.202 2.397.1 2.65.64.7 1.028 1.595 1.028 2.688 0 3.847-2.337 4.695-4.566 4.944.36.31.68.924.68 1.863 0 1.345-.012 2.43-.012 2.76 0 .267.18.578.688.48C19.138 20.2 22 16.447 22 12.021 22 6.484 17.523 2 12 2z" />
                </svg>
                GitHub
              </a>
            )}
            {project.liveLink && (
              <a
                href={project.liveLink}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1 text-sm font-semibold text-green-600 hover:underline"
              >
                <svg
                  className="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth={2}
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M17 8V7a5 5 0 0 0-10 0v1M5 8h14a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-8a2 2 0 0 1 2-2z"
                  />
                </svg>
                Live Demo
              </a>
            )}
          </div>
        )}
        <div
          style={{ scrollbarWidth: "thin" }}
          className="flex gap-1 py-2 overflow-x-auto"
        >
          {project.media.map((image: any) => (
            <img
              loading="lazy"
              className="h-16 md:w-32 md:h-20 rounded-lg"
              src={image.url}
              alt={project.title}
              key={image.public_id}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

export default ProjectCard;
