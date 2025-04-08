import React from "react";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { User2 } from "lucide-react";
import Image from "next/image";
import back from "@/assets/back.png";

function ProfileCard() {
  return (
    <Card>
      <CardHeader className="p-0 rounded-2xl pb-3 flex flex-row justify-between items-center gap-2">
        <div className="flex flex-col relative w-full">
          <Image
            src={back}
            alt="background"
            className="w-full aspect-[4/1] flex-shrink-0 rounded-t-lg"
          />
          <Avatar className="w-24 h-24 ml-5 -mt-10">
            <AvatarImage src="" />
            <AvatarFallback>
              <User2 className="w-20 opacity-70 h-20 p-5" />
            </AvatarFallback>
          </Avatar>
        </div>
      </CardHeader>
      <CardContent className="flex flex-col gap-1 px-4 pt-0 pb-3">
        <h3 className="text-lg pb-2 font-semibold">Professional Profile</h3>
        <span className="text-xs opacity-70 -mt-2">
          MERN FULL STACK WEB DEVELOPER || React || Node.js || MongoDB
        </span>
        <h3 className="text-opacity-50 text-xs opacity-50">
          Maharashtra, India
        </h3>
      </CardContent>
    </Card>
  );
}

export default ProfileCard;
