"use client";

import React, { Fragment, useEffect, useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Edit2, Plus, User2 } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import FooterS from "./footerS";
import { AppDispatch, RootState } from "@/store/store";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "sonner";
import {
  changeLanguage,
  changeUsername,
  clearError,
  resetUser,
} from "@/store/user/userSlice";
import axios from "@/store/axios";
import { isAxiosError } from "axios";
import RecommendCompany from "./recommend/recommendCompany";
import RecommendUser from "./recommend/recommendUser";

function Sidebar() {
  const [language, setLanguage] = useState("english");
  const [username, setUsername] = useState("");
  const [languageDialog, setLanguageDialog] = useState(false);
  const [usernameDialog, setUsernameDialog] = useState(false);
  const [available, setAvailable] = useState(false);

  const [isUser, setIsUser] = useState(false);

  const dispatch = useDispatch<AppDispatch>();
  const { user, profile, updated, error, loading, message } = useSelector(
    (state: RootState) => state.user
  );

  const languageOptions = [
    { label: "English", value: "english" },
    { label: "Hindi", value: "hindi" },
    { label: "Spanish", value: "spanish" },
    { label: "French", value: "french" },
    { label: "German", value: "german" },
    { label: "Chinese", value: "chinese" },
    { label: "Japanese", value: "japanese" },
    { label: "Korean", value: "korean" },
    { label: "Russian", value: "russian" },
    { label: "Arabic", value: "arabic" },
    { label: "Portuguese", value: "portuguese" },
    { label: "Italian", value: "italian" },
    { label: "Dutch", value: "dutch" },
    { label: "Turkish", value: "turkish" },
    { label: "Swedish", value: "swedish" },
    { label: "Norwegian", value: "norwegian" },
    { label: "Danish", value: "danish" },
    { label: "Finnish", value: "finnish" },
    { label: "Polish", value: "polish" },
    { label: "Czech", value: "czech" },
    { label: "Hungarian", value: "hungarian" },
    { label: "Romanian", value: "romanian" },
  ];

  const languageHandler = (e: any) => {
    e.preventDefault();
    console.log(language);
    setLanguageDialog(false);
  };

  const userNameHandler = (e: any) => {
    e.preventDefault();
    console.log(username);
    setUsernameDialog(false);
  };

  async function checkUsernameAvailable(username: string) {
    if (username.length < 3) {
      toast.error("Username should be at least 3 characters", {
        position: "top-center",
      });
      return;
    }
    try {
      const { data } = await axios.put("/user/check/username", { username });

      if (data.success) {
        setAvailable(true);
        toast.success(data.message, {
          position: "top-center",
        });
      } else {
        setAvailable(false);
        toast.error(data.message, {
          position: "top-center",
        });
      }
    } catch (error) {
      if (isAxiosError(error) && error.response) {
        toast.error(error.response?.data.message, {
          position: "top-center",
        });
      } else {
        toast.error("Something went wrong", {
          position: "top-center",
        });
      }
    }
  }

  useEffect(() => {
    if (user) {
      setIsUser(user._id === profile?.user?._id);
    }
  }, [user, profile]);

  useEffect(() => {
    if (updated) {
      toast.success(message, {
        position: "top-center",
      });
      dispatch(resetUser());
    }
    if (error) {
      toast.error(error, {
        position: "top-center",
      });
      dispatch(clearError());
    }
  }, [updated, error, message]);

  useEffect(() => {
    if (profile?.user) {
      setUsername(profile.user.username);
      setLanguage(profile.user.language);
    }
  }, [profile]);

  if (!profile?.user) return null;

  return (
    <aside className="md:flex flex-col gap-3 w-full shrink hidden h-min">
      {profile && (
        <Card className="flex flex-col gap-3">
          <CardContent className="pt-2">
            <div className="flex justify-between items-center gap-2">
              <h3 className="text-base font-semibold">Languages</h3>
              <div className="rounded-full p-2 bg-background/50 text-foreground">
                {isUser && (
                  <Dialog
                    open={languageDialog}
                    onOpenChange={(val) => setLanguageDialog(val)}
                  >
                    <DialogTrigger>
                      <Edit2 className="w-4 h-4" />
                    </DialogTrigger>
                    <DialogContent>
                      <form className="" onSubmit={languageHandler}>
                        <h2 className="font-semibold text-lg">
                          Select your language
                        </h2>
                        <p className="font-normal -mt-1 mb-2 text-sm">
                          Select the language you want to use on your profile.
                        </p>
                        <div className="grid w-full mb-8 mt-4 max-w-sm items-center gap-1">
                          <Select value={language} onValueChange={setLanguage}>
                            <SelectTrigger className="">
                              <SelectValue placeholder="Select a language" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectGroup>
                                {languageOptions.map((option) => (
                                  <SelectItem
                                    key={option.value}
                                    value={option.value}
                                  >
                                    {option.label}
                                  </SelectItem>
                                ))}
                              </SelectGroup>
                            </SelectContent>
                          </Select>
                        </div>
                        <DialogFooter className="flex justify-end">
                          <Button
                            variant={"link"}
                            className="cursor-pointer text-sm font-medium text-red-500 hover:underline"
                            onClick={() => setLanguageDialog(false)}
                          >
                            Cancel
                          </Button>
                          <Button
                            type="submit"
                            className="bg-blue-500 text-white"
                            onClick={() => dispatch(changeLanguage(language))}
                          >
                            Save
                          </Button>
                        </DialogFooter>
                      </form>
                    </DialogContent>
                  </Dialog>
                )}
              </div>
            </div>
            <div className="opacity-80 text-sm">
              {languageOptions
                .filter(
                  (lang: any) =>
                    profile?.user && lang.value === profile.user.language
                )
                .map((lang: any) => lang.label)
                .join(", ")}
            </div>
            {isUser && (
              <>
                <hr className="my-3" />
                <div className="flex justify-between items-center gap-2">
                  <h3 className="text-base font-semibold">
                    Public Profile & URL
                  </h3>
                  <div className="rounded-full p-2 bg-background/50 text-foreground">
                    <Dialog
                      open={usernameDialog}
                      onOpenChange={(val) => setUsernameDialog(val)}
                    >
                      <DialogTrigger>
                        <Edit2 className="w-4 h-4" />
                      </DialogTrigger>
                      <DialogContent>
                        <form className="" onSubmit={userNameHandler}>
                          <h2 className="font-semibold text-lg">
                            custom your link
                          </h2>
                          <p className="font-normal -mt-1 mb-2 text-sm">
                            This is the link to your public profile. You can
                            change it to make it easier for people to find you.
                          </p>
                          <div className="grid w-full mb-8 relative mt-4 max-w-sm items-center gap-1">
                            <span className="text-sm flex w-[190px] items-center h-9 text-gray-500 bg-gray-100 absolute top-0 left-0 px-2 rounded-l-md">
                              https://social-media.com/u/
                            </span>
                            <Input
                              type="text"
                              id="username"
                              placeholder="username"
                              className="p-1 border pl-48 border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                              value={username}
                              onChange={(e) => setUsername(e.target.value)}
                              onKeyDown={(e) => {
                                if (e.key === "Enter") {
                                  e.preventDefault();
                                  checkUsernameAvailable(username);
                                } else {
                                  setAvailable(false);
                                }
                              }}
                            />
                          </div>
                          <DialogFooter className="flex justify-end">
                            <Button
                              variant={"link"}
                              type="button"
                              className="cursor-pointer text-sm font-medium text-red-500 hover:underline"
                              onClick={() => setUsernameDialog(false)}
                            >
                              Cancel
                            </Button>
                            <Button
                              type="button"
                              variant={"link"}
                              className="cursor-pointer text-sm font-medium text-blue-500 hover:underline"
                              onClick={() => checkUsernameAvailable(username)}
                            >
                              Check availability
                            </Button>

                            <Button
                              type="submit"
                              className="bg-blue-500 text-white"
                              disabled={!available}
                              onClick={() => dispatch(changeUsername(username))}
                            >
                              Save
                            </Button>
                          </DialogFooter>
                        </form>
                      </DialogContent>
                    </Dialog>
                  </div>
                </div>
                <div className="opacity-80 text-sm">
                  {`https://social-media.com/u/${profile.user.username}`}
                </div>
              </>
            )}
          </CardContent>
        </Card>
      )}
      <RecommendCompany />
      <RecommendUser />
      <FooterS />
    </aside>
  );
}

export default Sidebar;
