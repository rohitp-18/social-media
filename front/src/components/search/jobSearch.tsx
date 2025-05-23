import { User2, X } from "lucide-react";
import React, { Fragment } from "react";
import { Avatar, AvatarImage, AvatarFallback } from "../ui/avatar";
import { Card, CardContent } from "../ui/card";
import FooterS from "../footerS";

function JobSearch({ setType, selectValues }: any) {
  return (
    <section className="grid grid-cols-[1fr_300px]  gap-4">
      <Card className="flex flex-col max-w-screen-md w-full gap-3 overflow-auto">
        <CardContent className="flex flex-col gap-2 py-5">
          {[0, 1, 2, 3, 4, 5].map((i) => (
            <Fragment key={i}>
              <div key={i} className="flex gap-5 justify-between items-center">
                <div className="flex gap-5 items-center">
                  <Avatar className="w-14 h-14">
                    <AvatarImage src="" />
                    <AvatarFallback>
                      <User2 className="w-14 h-14 p-3" />
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex flex-col">
                    <h3 className="text-base text-primary font-bold">
                      Job Title
                    </h3>
                    <span className="text-xs opacity-70">
                      Company Name, Location(Remote)
                    </span>
                    <span className="text-xs opacity-50 pt-2">9 hours ago</span>
                  </div>
                </div>
                <div className="flex items-center h-full">
                  <X className="w-5 h-5" />
                </div>
              </div>
              <hr />
            </Fragment>
          ))}
        </CardContent>
      </Card>
      <aside>
        <FooterS />
      </aside>
    </section>
  );
}

export default JobSearch;
