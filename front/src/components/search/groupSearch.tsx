import React, { Fragment } from "react";
import FooterS from "../footerS";
import { Card, CardContent } from "../ui/card";
import { Button } from "../ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { User2 } from "lucide-react";
import { RootState } from "@/store/store";
import { useSelector } from "react-redux";
import Link from "next/link";

function GroupSearch({ setType, selectValues }: any) {
  const { groups } = useSelector((state: RootState) => state.search);
  return (
    <section className="grid grid-cols-[1fr_300px]  gap-4">
      <div>
        <Card className="flex flex-col w-full gap-3 overflow-auto">
          <CardContent className="flex flex-col gap-2 py-5">
            {groups.map((group: any) => (
              <Link
                href={`/group/${group._id}`}
                className="block"
                key={group._id}
              >
                <div className="flex justify-between my-2 items-start">
                  <div className="flex justify-start items-start gap-3">
                    <Avatar className="w-10 h-10">
                      <AvatarImage src={group.avatar?.url} />
                      <AvatarFallback>
                        <User2 className="w-8 h-8 p-1.5" />
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex flex-col max-w-96">
                      <span className="font-semibold line-clamp-2 leading-tight text-ellipsis overflow-hidden">
                        {group.name}
                      </span>
                      <span className="text-xs opacity-60 line-clamp-2 leading-tight mb-0.5 text-ellipsis overflow-hidden">
                        {group.location.length > 0
                          ? group.location[0] + " | "
                          : ""}{" "}
                        {group.headline}
                      </span>
                      <span className="opacity-90 text-sm">
                        {group.members.length} Members
                      </span>
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
                <hr className="my-2" />
              </Link>
            ))}
          </CardContent>
        </Card>
      </div>
      <aside>
        <FooterS />
      </aside>
    </section>
  );
}

export default GroupSearch;
