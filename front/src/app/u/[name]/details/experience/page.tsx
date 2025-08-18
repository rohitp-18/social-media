"use client";

import ExperienceForm from "@/components/forms/experienceForm";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Dialog } from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import {
  Diamond,
  Edit2,
  MoreVertical,
  MoveLeft,
  Plus,
  Users2,
  Trash,
} from "lucide-react";
import React, { Fragment, useEffect, useState } from "react";
import Wrapper from "../_wrapper";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/store/store";
import {
  deleteExperience,
  getProfileExperiences,
} from "@/store/user/experienceSlice";
import { Separator } from "@/components/ui/separator";
import { useParams, usePathname, useSearchParams } from "next/navigation";
import Link from "next/link";

function Page() {
  const [select, setSelect] = useState<any>(null);
  const [create, setCreate] = useState(false);
  const [edit, setEdit] = useState(false);
  const [username, setUsername] = useState("");
  const [isUser, setIsUser] = useState(false);

  const searchParams = useSearchParams();
  const { name } = useParams();
  const dispatch = useDispatch<AppDispatch>();
  const { loading, error, experiences } = useSelector(
    (state: RootState) => state.experience
  );
  const { user } = useSelector((state: RootState) => state.user);

  function handleClose(val: boolean) {
    setCreate(val);
    setEdit(val);
    setSelect(null);
  }

  useEffect(() => {
    if (name) {
      setUsername(name as string);
      dispatch(getProfileExperiences(name as string));
    }
  }, [name]);

  useEffect(() => {
    if (user) {
      setIsUser(user.username === username);
    }
  }, [user, username]);

  useEffect(() => {
    if (isUser) {
      const add = searchParams.get("add");
      if (add) {
        setCreate(true);
        const url = new URL(window.location.href);
        url.searchParams.delete("add");
        window.history.pushState({}, "", url);
      }
    }
  }, [isUser, searchParams]);

  return (
    <Wrapper>
      {(create || edit) && isUser && (
        <Dialog open={create || edit} onOpenChange={(val) => handleClose(val)}>
          <ExperienceForm
            onClose={() => handleClose(false)}
            experience={select}
            isUser={isUser}
            edit={edit}
            username={username}
          />
        </Dialog>
      )}
      <Card className="">
        <CardHeader className="flex flex-row justify-between items-center gap-5">
          <div className="flex items-center md:gap-6 gap-4">
            <Link href={`/u/${username}`}>
              <MoveLeft className="w-5 h-5 hover:cursor-pointer opacity-80 hover:opacity-100" />
            </Link>
            <CardTitle className="font-semibold text-lg">Experience</CardTitle>
          </div>

          {isUser && (
            <Button
              variant={"outline"}
              size="icon"
              onClick={() => setCreate(true)}
            >
              <Plus className="w-5 h-5 opacity-80 hover:opacity-100" />
            </Button>
          )}
        </CardHeader>
        <CardContent className="flex flex-col gap-3">
          {experiences.length > 0 ? (
            experiences.map((exp: any, i: number) => (
              <Fragment key={exp._id}>
                <div className="flex flex-col gap-2">
                  <div className="flex justify-between items-start gap-3">
                    {/* For future updates */}
                    {/* <Avatar className="w-16 h-16">
                        <AvatarImage src="" />
                        <AvatarFallback>
                          <Users2 className="w-10 h-10 opacity-80" />
                        </AvatarFallback>
                      </Avatar>  */}
                    <div className="flex flex-col justify-start gap-1">
                      <h3 className="font-semibold text-base flex items-center gap-2">
                        {exp.title}
                        {exp.working && (
                          <span className="ml-2 px-2 py-0.5 rounded-full bg-green-100 text-green-700 text-xs font-medium">
                            Current
                          </span>
                        )}
                      </h3>
                      <div className="flex items-center gap-2 text-sm text-gray-700">
                        <span className="font-medium">{exp.companyName}</span>
                        <span className="mx-1">•</span>
                        <span>{exp.location}</span>
                      </div>
                      <div className="flex items-center gap-2 text-xs text-gray-500">
                        <span>{exp.workType}</span>
                        <span className="mx-1">|</span>
                        <span>{exp.jobType}</span>
                      </div>
                      <div className="flex items-center gap-2 text-xs text-gray-400">
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
                    {isUser && (
                      <div className="text-xs opacity-50 leading-none flex items-center gap-2">
                        <Button
                          onClick={() => {
                            setSelect(exp);
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
                                  onClick={() =>
                                    dispatch(deleteExperience(exp._id))
                                  }
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
                  <CardDescription className="text-sm my-4 opacity-90 line-clamp-2 overflow-hidden text-ellipsis">
                    {exp.description}
                  </CardDescription>
                  <div className="flex justify-start px-3 py-2 -mt-2 items-center gap-2">
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
                {i < experiences.length - 1 && <Separator className="my-3" />}
              </Fragment>
            ))
          ) : (
            <div className="flex justify-center w-full items-center flex-col min-h-36">
              {isUser && (
                <Button
                  variant={"outline"}
                  className="flex text-primary border-primary hover:text-primary items-center rounded-full"
                  onClick={() => setCreate(true)}
                  disabled={loading}
                >
                  Add Experience
                </Button>
              )}
              <span className="text-sm opacity-60">
                No experience have been added yet
              </span>
            </div>
          )}
        </CardContent>
      </Card>
    </Wrapper>
  );
}

export default Page;
