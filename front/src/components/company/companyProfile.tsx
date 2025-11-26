"use client";

import React, { useCallback, useEffect, useMemo, useState } from "react";
import { Card, CardContent, CardFooter } from "../ui/card";
import { TabsList, Tabs, TabsTrigger } from "../ui/tabs";
import { Button } from "../ui/button";
import { Edit2, MoreHorizontal, Plus } from "lucide-react";
import Link from "next/link";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
} from "../ui/dropdown-menu";
import { Separator } from "../ui/separator";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/store/store";
import CompanyHeader from "./companyHeader";
import { toast } from "sonner";
import { isAxiosError } from "axios";
import axios from "@/store/axios";
import {
  resetcompany,
  toggleFollowCompany,
} from "@/store/company/companySlice";

function CompanyProfile({ tab, setTab }: { tab: string; setTab: any }) {
  const [isAdmin, setIsAdmin] = useState(false);
  const [following, setFollowing] = useState(false);

  const dispatch = useDispatch<AppDispatch>();
  const { company, error, followed } = useSelector(
    (state: RootState) => state.company
  );
  const { user } = useSelector((state: RootState) => state.user);

  const tabValues = useMemo(
    () => ["Home", "About", "Jobs", "People", "Posts"],
    []
  );

  useEffect(() => {
    if (company && company.admin && user) {
      setIsAdmin(company.admin.some((admin) => admin._id === user._id));
      setFollowing(company.followers.some((follower) => follower === user._id));
    }
  }, [company, user]);

  useEffect(() => {
    if (followed) {
      toast.success(
        !following
          ? "You are now following this company."
          : "You have unfollowed this company.",
        { position: "top-center" }
      );
      setFollowing(!following);
      dispatch(resetcompany());
    }
  }, [followed, following]);

  if (!company) return null;

  return (
    <Card>
      <CompanyHeader isAdmin={isAdmin} />
      <CardContent className="flex justify-between items-start gap-3">
        <div className="flex flex-col gap-1 md:px-4 pt-0 pb-3">
          <h3 className="md:text-2xl text-xl pb-2 font-semibold">
            {company.name || "Company Name"}
          </h3>
          <span className="text-sm">
            {company.headline || "Company Headline"}
          </span>
          <div className="flex justify-start items-center gap-2">
            <h3 className="text-opacity-50 text-sm -mt-1 opacity-50">
              {company.address?.[0]?.city + ", " || ""}
              {company.address?.[0]?.state + ", " || ""}
              {company.address?.[0]?.country || ""}
            </h3>
          </div>
          <div className="flex opacity-60 items-center gap-2">
            <div className="">
              <span className="text-sm pr-1 font-semibold">
                {company.followers.length || 0}
              </span>
              <span className="text-sm">Followers</span>
            </div>
            <div className="">
              <span className="text-sm pr-1 font-semibold">
                {company.members.length || 0}
              </span>
              <span className="text-sm">Employees</span>
            </div>
          </div>
          <div className="flex justify-start flex-wrap items-center gap-3 mt-5">
            <Button
              className={`flex items-center rounded-full ${
                following ? "bg-white text-black border" : ""
              }`}
              variant={"default"}
              onClick={() =>
                dispatch(
                  toggleFollowCompany({
                    companyId: company._id,
                    follow: !following,
                  })
                )
              }
            >
              {following ? "Following" : "+ Follow"}
            </Button>
            <Button
              className="flex items-center rounded-full"
              variant={"default"}
            >
              <Link target="_blank" href={company.website || ""}>
                Visit website
              </Link>
            </Button>

            <Button
              className="flex items-center border-primary text-primary rounded-full hover:text-white hover:bg-primary"
              variant={"outline"}
            >
              Message
            </Button>
            <DropdownMenu>
              <DropdownMenuTrigger className="flex justify-center items-center gap-2 p-2 border-foreground rounded-full border">
                <MoreHorizontal className="w-5 h-5" />
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuGroup>
                  <DropdownMenuItem>
                    <Link className="flex gap-3" href={"/company/new"}>
                      <Plus className="w-4 h-4" />
                      <div className="">Create page</div>
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <Link href={`/company/${company._id}/invitation`}>
                      <div className="">Send Invitation</div>
                    </Link>
                  </DropdownMenuItem>
                </DropdownMenuGroup>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
        <div className="flex justify-start items-start">
          {isAdmin && (
            <Link href={`/company/${company._id}/update`} className="p-2">
              <Edit2 className="w-5 h-5 opacity-90" />
            </Link>
          )}
        </div>
      </CardContent>
      <Separator />
      <CardFooter className="pb-2">
        <Tabs onValueChange={(value) => setTab(value)} value={tab}>
          <TabsList className="flex md:gap-6 gap-3 pb-0 rounded-none transition-all bg-transparent items-center justify-start">
            {tabValues.map((tabs) => (
              <TabsTrigger
                key={tabs}
                style={{ boxShadow: "none" }}
                className={
                  tab === tabs
                    ? "border-b-2 -mb-1 py-2 border-primary rounded-none"
                    : "border-b-2 -mb-1 py-2 border-transparent rounded-none"
                }
                value={tabs}
              >
                {tabs}
              </TabsTrigger>
            ))}
          </TabsList>
        </Tabs>
      </CardFooter>
    </Card>
  );
}

export default CompanyProfile;
