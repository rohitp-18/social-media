"use client";

import React, { use, useEffect, useState } from "react";
import { CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Diamond, Edit2, Trash } from "lucide-react";
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

function ProjectCard({ project, isUser, setSelect, setEdit, username }: any) {
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
          {isUser && (
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
        <div
          style={{ scrollbarWidth: "thin" }}
          className="flex gap-1 py-2 overflow-x-auto"
        >
          {project.media.map((image: any) => (
            <img
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
