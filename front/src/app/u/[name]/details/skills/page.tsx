"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  ChevronDown,
  Edit2,
  MoreVertical,
  MoveLeft,
  Plus,
  Trash2,
  User2,
} from "lucide-react";
import React, { Fragment, useEffect, useState } from "react";
import Wrapper from "../_wrapper";
import axios from "@/store/axios";
import { AppDispatch, RootState } from "@/store/store";
import { useDispatch, useSelector } from "react-redux";
import { userProfile } from "@/store/user/userSlice";
import { Button } from "@/components/ui/button";
import { Dialog, DialogTrigger } from "@/components/ui/dialog";
import SkillForm from "@/components/forms/skillForm";
import { usePathname, useSearchParams } from "next/navigation";
import { toast } from "sonner";
import { isAxiosError } from "axios";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Separator } from "@/components/ui/separator";
import Link from "next/link";

function Page({ params }: { params: { name: string } }) {
  const [name, setName] = useState("");
  const [isUser, setIsUser] = useState(false);
  const [select, setSelect] = useState<any>();
  const [create, setCreate] = useState(false);
  const [edit, setEdit] = useState(false);
  const [deleteS, setDeleteS] = useState(false);
  const [loading2, setLoading2] = useState(false);
  const [showDescription, setShowDescription] = useState<any>();

  const pathname = usePathname();
  const searchParams = useSearchParams();

  const dispatch = useDispatch<AppDispatch>();
  const { profile, user } = useSelector((state: RootState) => state.user);

  async function deleteSkill() {
    try {
      setLoading2(true);
      console.log(select);

      const { data } = await axios.delete(`/skills/user/${select._id._id}`);

      if (data) {
        setLoading2(false);
        setSelect(null);
        setEdit(false);
        dispatch(userProfile(name));
      }

      toast.success(data.message, {
        description: "The skill has been deleted successfully.",
        position: "top-center",
      });
    } catch (error) {
      if (isAxiosError(error) && error.response) {
        setLoading2(false);
        toast.error(error.response?.data.message, {
          description: "There was an error deleting the skill.",
          position: "top-center",
        });
        return;
      }
      toast.error("Error deleting skill", {
        description: "There was an error deleting the skill.",
        position: "top-center",
      });
    } finally {
      setLoading2(false);
    }
  }

  useEffect(() => {
    Promise.resolve(params).then((res: any) => {
      setName(res.name);
      dispatch(userProfile(res.name));
    });
  }, [params]);

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
  }, [isUser, pathname]);

  useEffect(() => {
    if (profile) {
      setIsUser(profile?.user._id === user?._id);
    }
  }, [profile]);
  return (
    <Wrapper>
      {(create || edit) && isUser && (
        <Dialog open={create || edit} onOpenChange={setCreate}>
          <SkillForm
            onClose={() => {
              setCreate(false);
              setEdit(false);
              setSelect(null);
              dispatch(userProfile(name));
            }}
            username={name}
            edit={edit}
            skill={select}
          />
        </Dialog>
      )}
      {profile && (
        <Card className="">
          <CardHeader className="flex flex-row justify-between items-center gap-5">
            <div className="flex items-center md:gap-6 gap-4">
              <Link href={`/u/${name}`}>
                <MoveLeft className="w-5 h-5 opacity-80 hover:opacity-100" />
              </Link>
              <CardTitle className="font-semibold text-lg">Skills</CardTitle>
            </div>

            {isUser && profile.user.skills.length > 0 && (
              <Button
                variant={"outline"}
                className="flex hover:text-primary items-center rounded-full"
                onClick={() => setCreate(true)}
              >
                <Plus className="w-5 h-5 opacity-80 hover:opacity-100" />
              </Button>
            )}
          </CardHeader>
          <Separator className="-mt-2 mb-2" />
          <CardContent className="mt-3">
            {profile.user.skills.length > 0 ? (
              profile.user.skills.map((skill: any, i: number) => (
                <Fragment key={skill._id}>
                  <div className="flex py-3 gap-1 justify-between items-center">
                    <div className="flex flex-col w-full">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="font-semibold text-base">
                          {skill.skill.name}
                        </h3>
                        <span className="text-[11px] px-2 py-0.5 bg-primary/10 text-primary rounded-full font-medium opacity-80">
                          {skill.proficiency}
                        </span>
                      </div>
                      {skill.description && (
                        <div className="text-sm flex-wrap flex text-muted-foreground">
                          <div className="flex">
                            {showDescription === skill._id ? (
                              <p>{skill.description}</p>
                            ) : (
                              <p className="line-clamp-2">
                                {skill.description.length > 50
                                  ? `${skill.description
                                      .substring(0, 50)
                                      .trim()} ...`
                                  : skill.description}
                              </p>
                            )}
                          </div>
                          {skill.description.length > 50 && (
                            <Button
                              variant="ghost"
                              onClick={() =>
                                setShowDescription(
                                  showDescription === skill._id
                                    ? null
                                    : skill._id
                                )
                              }
                              className="p-0 h-auto text-xs text-muted-foreground font-medium"
                            >
                              {showDescription === skill._id
                                ? "Show less"
                                : "Show more"}
                            </Button>
                          )}
                        </div>
                      )}
                    </div>
                    {isUser && (
                      <div className="flex gap-2">
                        <Button
                          onClick={() => {
                            setSelect(skill);
                            setEdit(true);
                          }}
                          variant={"outline"}
                          size="icon"
                        >
                          <Edit2 className="w-4 h-4 opacity-80 hover:opacity-100" />
                        </Button>
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button
                              variant={"outline"}
                              size="icon"
                              onClick={() => {
                                setSelect(skill);
                                setDeleteS(true);
                              }}
                            >
                              <Trash2 className="w-4 h-4 opacity-80 hover:opacity-100" />
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                              <AlertDialogDescription>
                                This action cannot be undone. This will
                                permanently delete the skill.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Cancel</AlertDialogCancel>
                              <AlertDialogAction
                                className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                                onClick={deleteSkill}
                              >
                                {loading2 ? "Deleting..." : "Delete"}
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      </div>
                    )}
                  </div>
                  {profile.user.skills.length > i + 1 && (
                    <Separator className="my-1" />
                  )}
                </Fragment>
              ))
            ) : (
              <div className="flex py-3 gap-1 justify-between items-center">
                <div className="flex justify-center items-center w-full flex-col min-h-36">
                  {isUser && (
                    <Button
                      variant={"outline"}
                      className="flex text-primary border-primary hover:text-primary items-center rounded-full"
                      onClick={() => setCreate(true)}
                    >
                      Add Skills
                    </Button>
                  )}
                  <span className="text-sm opacity-60">
                    No skills have been added yet
                  </span>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </Wrapper>
  );
}

export default Page;
