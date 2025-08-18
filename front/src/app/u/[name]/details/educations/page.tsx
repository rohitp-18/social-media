"use client";

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
import { Separator } from "@/components/ui/separator";
import { useParams, useSearchParams } from "next/navigation";
import {
  deleteEducation,
  getProfileEducations,
} from "@/store/user/educationSlice";
import EducationForm from "@/components/forms/educationForm";
import Link from "next/link";

function page() {
  const [select, setSelect] = useState<any>(null);
  const [create, setCreate] = useState(false);
  const [edit, setEdit] = useState(false);
  const [username, setUsername] = useState("");
  const [isUser, setIsUser] = useState(false);

  const searchParams = useSearchParams();
  const dispatch = useDispatch<AppDispatch>();
  const { loading, error, educations } = useSelector(
    (state: RootState) => state.education
  );
  const { user } = useSelector((state: RootState) => state.user);
  const { name } = useParams();

  function handleClose(val: boolean) {
    setCreate(val);
    setEdit(val);
    setSelect(null);
  }

  useEffect(() => {
    if (name) {
      setUsername(name as string);
      dispatch(getProfileEducations(name as string));
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
          <EducationForm
            onClose={() => handleClose(false)}
            education={select}
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
            <CardTitle className="font-semibold text-lg">Educations</CardTitle>
          </div>
          {isUser && educations.length > 0 && (
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
          {educations.length > 0 ? (
            educations.map((edu: any, i: number) => (
              <Fragment key={edu._id}>
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
                      <div className="flex items-center gap-2">
                        <h3 className="font-bold text-lg">{edu.school}</h3>
                        <span className="text-xs text-muted-foreground">
                          {edu.location}
                        </span>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <span>{edu.degree}</span>
                        {edu.fieldOfStudy && (
                          <>
                            <span>•</span>
                            <span>{edu.fieldOfStudy}</span>
                          </>
                        )}
                      </div>
                      <div className="flex items-center gap-2 text-xs">
                        <span>
                          {edu.startDate &&
                            new Date(edu.startDate).toLocaleString("default", {
                              month: "short",
                              year: "numeric",
                            })}{" "}
                          -{" "}
                          {edu.currentlyStudying
                            ? "Present"
                            : edu.endDate &&
                              new Date(edu.endDate).toLocaleString("default", {
                                month: "short",
                                year: "numeric",
                              })}
                        </span>
                      </div>
                      {edu.grade && (
                        <div className="flex items-center gap-2 text-xs">
                          <span>Grade:</span>
                          <span>{edu.grade}</span>
                        </div>
                      )}
                    </div>
                    {isUser && (
                      <div className="text-xs opacity-50 leading-none flex items-center gap-2">
                        <Button
                          onClick={() => {
                            setSelect(edu);
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
                            <AlertDialogTitle>
                              Delete Education
                            </AlertDialogTitle>
                            <AlertDialogDescription>
                              Are you sure you want to delete this Education?
                            </AlertDialogDescription>
                            <AlertDialogFooter>
                              <AlertDialogAction asChild>
                                <Button
                                  variant="outline"
                                  className="bg-red-500 text-white hover:bg-red-600"
                                  onClick={() =>
                                    dispatch(deleteEducation(edu._id))
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
                  <CardDescription className="text-sm py-4 opacity-90 overflow-hidden text-ellipsis">
                    {edu.description}
                  </CardDescription>
                  <div className="flex justify-start px-3 py-2 -mt-2 items-center gap-2">
                    <Diamond className="w-5 stroke-2 h-5" />
                    <div className="flex gap-2 text-base">
                      {edu.skills.map((skill: any, i: number) => (
                        <span
                          key={skill._id}
                          className="text-sm font-semibold opacity-80"
                        >
                          {skill.name}
                          {i !== edu.skills.length - 1 && ","}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
                {i < educations.length - 1 && <Separator className="my-3" />}
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
                No education have been added yet
              </span>
            </div>
          )}
        </CardContent>
      </Card>
    </Wrapper>
  );
}

export default page;
