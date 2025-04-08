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

function Friend() {
  return (
    <>
      <Card className="w-[186px] rounded-2xl p-0">
        <CardHeader className="p-0 rounded-2xl flex flex-row justify-between items-center gap-2">
          <div className="flex flex-col relative w-full h-32">
            <Image
              src={back}
              alt="back"
              className="w-full aspect-[4/1] min-h-20 flex-shrink-0 rounded-t-2xl"
            />
            <Avatar className="w-20 h-20 mx-auto -mt-10">
              <AvatarImage src="" />
              <AvatarFallback>
                <User2 className="w-20  opacity-70 h-20 p-5" />
              </AvatarFallback>
            </Avatar>
            <div className="bg-foreground/80 text-background absolute right-2 top-2 rounded-full p-1">
              <X className="h-4 w-4" />
            </div>
          </div>
        </CardHeader>
        <CardContent className="flex justify-center p-1 items-center flex-col">
          <h2 className="font-semibold overflow-ellipsis text-lg">
            Rohit Patil
          </h2>
          <CardDescription className="text-sm opacity-90 mt-[-6px]">
            <p className="text-sm leading-tight text-center pb-3">
              full stack web developer
            </p>
            <p className="text-sm text-center opacity-70">4 mutual followers</p>
          </CardDescription>
        </CardContent>
        <CardFooter className="pb-2">
          <Button
            className="w-full hover:bg-transparent hover:border hover:text-foreground hover:scale-105"
            variant={"outline"}
          >
            <UserPlus2 height={20} width={20} /> Add Friend
          </Button>
        </CardFooter>
      </Card>
    </>
  );
}

export default Friend;
