import React, { Fragment, useEffect, useState } from "react";
import FooterS from "../footerS";
import { Card, CardContent } from "../ui/card";
import { Button } from "../ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { User2 } from "lucide-react";
import { RootState } from "@/store/store";
import { useSelector } from "react-redux";
import Link from "next/link";

function CompanySearch({ setType, selectValues }: any) {
  const { companies } = useSelector((state: RootState) => state.search);
  const { user } = useSelector((state: RootState) => state.user);
  return (
    <section className="grid grid-cols-[1fr_300px]  gap-4">
      <div>
        <Card className="flex flex-col w-full gap-3 overflow-auto">
          <CardContent className="flex flex-col gap-2 py-5">
            {companies.map((company: any) => {
              const [isFollowing, setIsFollowing] = useState(false);

              useEffect(() => {
                user &&
                  setIsFollowing(
                    company.followers.some((u: any) => u == user?._id)
                  );
              }, []);
              return (
                <Link
                  href={`/company/${company._id}`}
                  className="block"
                  key={company._id}
                >
                  <div className="flex justify-between my-2 items-start">
                    <div className="flex justify-start items-start gap-3">
                      <Avatar className="w-10 h-10">
                        <AvatarImage src={company.logo?.url} />
                        <AvatarFallback>
                          <User2 className="w-8 h-8 p-1.5" />
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex flex-col max-w-96">
                        <span className="font-semibold">{company.name}</span>
                        <span className="text-sm opacity-90 line-clamp-1 leading-tight text-ellipsis overflow-hidden">
                          {company.headline} | {company.location}
                        </span>
                        <span className="opacity-70 text-[13px]">
                          {company.followers.length} followers
                        </span>
                      </div>
                    </div>

                    <Button
                      className="flex items-center w-min md:ml-8 mt-2 px-7 py-2 border-primary text-primary hover:text-white hover:bg-primary rounded-full"
                      variant={isFollowing ? "outline" : "default"}
                      size={"sm"}
                    >
                      {isFollowing ? "Following" : "Follow"}
                    </Button>
                  </div>
                  <hr className="my-2" />
                </Link>
              );
            })}
          </CardContent>
        </Card>
      </div>
      <aside>
        <FooterS />
      </aside>
    </section>
  );
}

export default CompanySearch;
