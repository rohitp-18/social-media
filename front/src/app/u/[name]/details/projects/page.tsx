"use client";

import ExperienceForm from "@/components/forms/experienceForm";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
} from "@/components/ui/dialog";
import {
  Diamond,
  Edit2,
  MoreVertical,
  MoveLeft,
  Plus,
  Trash,
  Users2,
} from "lucide-react";
import React, { Fragment, use, useEffect, useState } from "react";
import Wrapper from "../_wrapper";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/store/store";
import { userProfile } from "@/store/user/userSlice";
import Image from "next/image";
import { getProfileProjects } from "@/store/user/projectSlice";
import ProjectForm from "@/components/forms/projectForm";
import { useParams, usePathname, useSearchParams } from "next/navigation";
import { Separator } from "@/components/ui/separator";
import ProjectCard from "@/components/projectCard";
import Link from "next/link";

function Page() {
  const [select, setSelect] = useState<any>(null);
  const [create, setCreate] = useState(false);
  const [edit, setEdit] = useState(false);

  const [name, setName] = useState("");
  const [isUser, setIsUser] = useState(false);

  const pathname = usePathname();
  const { name: userName } = useParams();
  const searchParams = useSearchParams();
  const dispatch = useDispatch<AppDispatch>();
  const { user } = useSelector((state: RootState) => state.user);
  const { projects, loading } = useSelector(
    (state: RootState) => state.project
  );

  function handleClose() {
    setCreate(false);
    setEdit(false);
    setSelect(null);
  }

  useEffect(() => {
    if (userName) {
      setName(userName as string);
      dispatch(getProfileProjects(userName as string));
    }
  }, [userName]);

  useEffect(() => {
    if (user) {
      setIsUser(user.username === name);
    }
  }, [user, name]);

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
  }, [isUser, pathname, searchParams]);

  return (
    <Wrapper>
      {user && (create || edit) && (
        <Dialog open={create || edit} onOpenChange={setCreate}>
          <ProjectForm
            onClose={handleClose}
            project={select}
            isUser={isUser}
            edit={edit}
            name={name}
          />
        </Dialog>
      )}
      {projects && (
        <Card className="">
          <CardHeader className="flex flex-row justify-between items-center gap-5">
            <div className="flex items-center md:gap-6 gap-4">
              <Link href={`/u/${name}`}>
                <MoveLeft className="w-5 h-5 hover:cursor-pointer opacity-80 hover:opacity-100" />
              </Link>

              <CardTitle className="font-semibold text-lg">Projects</CardTitle>
            </div>

            {isUser && projects.length > 0 && (
              <Button
                variant={"outline"}
                className="flex text-primary border-primary hover:text-primary items-center rounded-full"
                onClick={() => setCreate(true)}
                disabled={loading}
              >
                <Plus className="w-5 h-5 opacity-80 hover:opacity-100" />
              </Button>
            )}
          </CardHeader>
          <Separator className="my-2" />
          <CardContent className="flex flex-col gap-3 pt-3">
            {projects.length > 0 ? (
              projects.map((project: any, i: number) => (
                <Fragment key={project._id}>
                  <ProjectCard
                    project={project}
                    isUser={isUser}
                    setEdit={setEdit}
                    setSelect={setSelect}
                    name={name}
                  />
                  {i < projects.length - 1 && <Separator className="my-3" />}
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
                    Add Projects
                  </Button>
                )}
                <span className="text-sm opacity-60">
                  No projects have been added yet
                </span>
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </Wrapper>
  );
}
export default Page;
