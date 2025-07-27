import React, { Fragment } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { Button } from "../ui/button";
import { User2 } from "lucide-react";

function RecommendGroups() {
  return (
    <Card className="flex flex-col gap-3">
      <CardHeader className="pb-2">
        <CardTitle className="text-base font-semibold">
          Recommended Groups
        </CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col gap-3 p-2">
        {[0, 1, 2, 3, 4].map((i) => (
          <Fragment key={i}>
            <div className="flex flex-col justify-between my-2 items-start">
              <div className="flex justify-start items-start gap-3">
                <Avatar className="w-10 h-10">
                  <AvatarImage src="" />
                  <AvatarFallback>
                    <User2 className="w-8 h-8 p-1.5" />
                  </AvatarFallback>
                </Avatar>
                <div className="flex flex-col max-w-96">
                  <span className="font-semibold line-clamp-2 leading-tight text-ellipsis overflow-hidden">
                    John Doe
                  </span>
                  <span className="text-xs opacity-60 line-clamp-2 leading-tight text-ellipsis overflow-hidden">
                    Software Engineer | Microsoft | 500+ connections | India |
                    React | Node.js | MongoDB
                  </span>
                  <span className="opacity-90 text-sm">45 Members</span>
                </div>
              </div>

              <Button
                className="flex items-center w-min md:ml-8 mt-2 px-7 py-2 border-primary text-primary hover:text-white hover:bg-primary rounded-full"
                variant={"outline"}
                size={"sm"}
              >
                Join
              </Button>
            </div>
            <hr className="my-1" />
          </Fragment>
        ))}
      </CardContent>
    </Card>
  );
}

export default RecommendGroups;
