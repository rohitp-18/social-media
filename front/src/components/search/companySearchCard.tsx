"use client";

import React, { Fragment, useEffect, useState } from "react";
import Link from "next/link";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { Button } from "../ui/button";
import { User2 } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/store/store";
import { toast } from "sonner";
import { toggleFollowCompany } from "@/store/company/companySlice";
import { company } from "@/store/company/typeCompany";

function CompanySearchCard({ company, i }: { company: company; i: number }) {
  const [isFollowing, setIsFollowing] = useState(false);
  const [followCount, setFollowCount] = useState(company.followers.length);

  const dispatch = useDispatch<AppDispatch>();
  const { user } = useSelector((state: RootState) => state.user);
  const { companies } = useSelector((state: RootState) => state.search);

  useEffect(() => {
    if (user && user.companies.includes(company._id)) {
      setIsFollowing(true);
    }
  }, [user]);
  return (
    <>
      <div className="flex justify-between my-2 items-start">
        <Link
          href={`/company/${company._id}`}
          className="flex justify-start items-start gap-3"
        >
          <Avatar className="w-10 h-10">
            <AvatarImage src={company.avatar?.url} />
            <AvatarFallback>
              {company.name.charAt(0).toUpperCase()}
            </AvatarFallback>
          </Avatar>
          <div className="flex flex-col max-w-96">
            <span className="font-semibold">{company.name} </span>
            <span className="text-sm opacity-90 line-clamp-1 leading-tight text-ellipsis overflow-hidden">
              {company.headline} | {company.address[0].address} |{" "}
            </span>
            <span className="opacity-70 text-[13px]">
              {followCount} followers
            </span>
          </div>
        </Link>

        {(!user || !isFollowing) && (
          <Button
            className="flex items-center w-min md:ml-8 mt-2 px-7 py-2 border-primary text-primary hover:text-white hover:bg-primary rounded-full"
            variant={"outline"}
            size={"sm"}
            onClick={() => {
              if (!user) {
                toast.error("You must be logged in to follow a company", {
                  position: "top-center",
                });
                return;
              }
              dispatch(
                toggleFollowCompany({ companyId: company._id, follow: true })
              )
                .then(() => {
                  setIsFollowing(true);
                  toast.success(`You are now following ${company.name}`, {
                    position: "top-center",
                  });
                  setFollowCount(followCount + 1);
                })
                .catch(() => {
                  toast.error(`Failed to follow ${company.name}`, {
                    position: "top-center",
                  });
                });
            }}
          >
            follow
          </Button>
        )}
      </div>
      {i < companies.length - 1 && <hr className="my-1" />}
    </>
  );
}

export default CompanySearchCard;
