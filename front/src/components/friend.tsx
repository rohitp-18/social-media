import React from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
} from "./ui/card";
import { MoreVerticalIcon, User, User2, UserPlus2, X } from "lucide-react";
import { Button } from "./ui/button";
import back from "../assets/back.png";
import Image from "next/image";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { InheritUser } from "@/store/user/typeUser";

function Friend({
  user,
  removeHandler,
}: {
  user: InheritUser;
  removeHandler: (id: string) => void;
}) {
  return (
    <>
      <Card className="max-w-[186px] w-[48%] rounded-2xl p-0">
        <CardHeader className="p-0 rounded-2xl flex flex-row justify-between items-center gap-2">
          <div className="flex flex-col relative w-full h-32">
            {user.bannerImage ? (
              <img
                src={user.bannerImage.url}
                alt="back"
                className="w-full aspect-[4/1] min-h-20 flex-shrink-0 rounded-t-2xl"
              />
            ) : (
              <Image
                src={back}
                alt={user.name}
                className="w-full aspect-[4/1] min-h-20 flex-shrink-0 rounded-t-2xl"
              />
            )}
            <Avatar className="w-20 h-20 mx-auto -mt-10">
              <AvatarImage src={user.avatar?.url} />
              <AvatarFallback>
                <User2 className="w-20  opacity-70 h-20 p-5" />
              </AvatarFallback>
            </Avatar>
            <div className="bg-foreground/80 text-background absolute right-2 top-2 rounded-full p-1">
              <Button
                variant={"ghost"}
                className="p-1"
                onClick={() => removeHandler(user._id)}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent className="flex justify-center p-1 items-center flex-col">
          <h2 className="font-semibold overflow-ellipsis text-lg">
            {user.name}
          </h2>
          <CardDescription className="text-sm opacity-90 mt-[-6px]">
            <p className="text-sm leading-tight text-center pb-3">
              {user.headline}
            </p>
          </CardDescription>
        </CardContent>
        <CardFooter className="pb-2 justify-center">
          <Button
            className="flex items-center w-min mt-2 px-7 min-w-[100px] py-2 border-primary text-primary hover:text-white hover:bg-primary rounded-full"
            variant={"outline"}
            size={"sm"}
          >
            Follow
          </Button>
        </CardFooter>
      </Card>
    </>
  );
}

export default Friend;
