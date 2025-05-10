import React, { Fragment } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Plus, User2 } from "lucide-react";

function RecommendCompany() {
  return (
    <Card className="flex flex-col gap-3">
      <CardHeader className="pb-2">
        <h3 className="text-base font-semibold">People also viewed</h3>
      </CardHeader>
      <CardContent className="flex flex-col gap-3">
        {[1, 2, 3, 4, 5].map((_, i) => (
          <Fragment key={i}>
            <div className="flex justify-start items-start gap-3">
              <Avatar className="w-10 h-10">
                <AvatarImage src="" />
                <AvatarFallback>
                  <User2 className="w-8 h-8 p-1.5" />
                </AvatarFallback>
              </Avatar>
              <div className="flex flex-col">
                <span className="font-semibold">John Doe</span>
                <span className="text-sm opacity-90 line-clamp-1 leading-tight text-ellipsis overflow-hidden">
                  Software Engineer | Microsoft | 500+ connections | India |
                  React | Node.js | MongoDB
                </span>
                <span className="opacity-70 text-[13px]">10M followers</span>
                <Button
                  className="flex items-center w-min mt-2 px-5 border-primary text-primary hover:text-white hover:bg-primary rounded-full"
                  variant={"outline"}
                  size={"sm"}
                >
                  Follow
                </Button>
              </div>
            </div>
            <hr />
          </Fragment>
        ))}
      </CardContent>
    </Card>
  );
}

export default RecommendCompany;
