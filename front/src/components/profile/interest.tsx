"use client";

import React, { Fragment, useEffect, useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ArrowRight, Building2, Dot, Plus } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/store/store";
import Link from "next/link";
import {
  resetcompany,
  toggleFollowCompany,
} from "@/store/company/companySlice";
import { toast } from "sonner";
import { company } from "@/store/company/typeCompany";

function Interest({ isUser }: { isUser: boolean }) {
  const [interest, setInterest] = useState("companies");
  const [companies, setCompanies] = useState<company[]>([]);
  const dispatch = useDispatch<AppDispatch>();

  const { profile, user } = useSelector((state: RootState) => state.user);

  const handleFollowCompany = async (companyId: string, follow: boolean) => {
    if (!user) return;
    try {
      await dispatch(toggleFollowCompany({ companyId, follow })).unwrap();
      setCompanies((prev) =>
        prev.map((company) => {
          if (company._id === companyId) {
            if (follow) {
              return {
                ...company,
                followers: [...company.followers, user._id],
              };
            } else {
              return {
                ...company,
                followers: company.followers.filter(
                  (follower: string) => follower !== user._id
                ),
              };
            }
          }
          return company;
        })
      );
      toast.success(
        follow
          ? "You are now following this company."
          : "You have unfollowed this company.",
        { position: "top-center" }
      );
      dispatch(resetcompany());
    } catch (error: unknown) {
      toast.error((error as Error).message, {
        position: "top-center",
      });
    }
  };

  useEffect(() => {
    if (profile?.user?.companies) {
      setCompanies(profile.user.companies);
    }
  }, [profile]);

  if (!profile?.user) return null;

  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex pb-3 justify-between items-start flex-row gap-2">
          <div>
            <CardTitle className="text-lg">Interests</CardTitle>
          </div>
        </div>
        <div className="flex gap-3"></div>
      </CardHeader>
      <CardContent className="-mt-4">
        {profile.user.topVoice.length > 0 ||
        // profile.user.schools.length > 0 ||
        // profile.user.newsLetter.length > 0 ||
        profile.user.companies.length > 0 ? (
          <Tabs onValueChange={(value) => setInterest(value)} value={interest}>
            <TabsList className="flex gap-3 pb-0 rounded-none transition-all bg-transparent border-b border-foreground/40 items-center justify-start">
              {profile.user.topVoice.length > 0 && (
                <TabsTrigger
                  style={{ boxShadow: "none" }}
                  className={
                    interest === "top"
                      ? "border-b-2 -mb-1 border-primary rounded-none"
                      : "border-b-2 -mb-1 border-transparent rounded-none"
                  }
                  value="top"
                >
                  Top voices
                </TabsTrigger>
              )}
              {profile.user.companies.length > 0 && (
                <TabsTrigger
                  style={{ boxShadow: "none" }}
                  className={
                    interest === "companies"
                      ? "border-b-2 -mb-1 border-primary rounded-none"
                      : "border-b-2 -mb-1 border-transparent rounded-none"
                  }
                  value="companies"
                >
                  Companies
                </TabsTrigger>
              )}
              {profile.user.groups.length > 0 && (
                <TabsTrigger
                  style={{ boxShadow: "none" }}
                  className={
                    interest === "groups"
                      ? "border-b-2 -mb-1 border-primary rounded-none"
                      : "border-b-2 -mb-1 border-transparent rounded-none"
                  }
                  value="groups"
                >
                  Groups
                </TabsTrigger>
              )}
              {/*  future update
              {profile.user.newsLetter.length > 0 && (
                <TabsTrigger
                  style={{ boxShadow: "none" }}
                  className={
                    interest === "newsletter"
                      ? "border-b-2 -mb-1 border-primary rounded-none"
                      : "border-b-2 -mb-1 border-transparent rounded-none"
                  }
                  value="newsletter"
                >
                  News Letter
                </TabsTrigger>
              )} */}
              {/* future update
              {profile.user.schools.length > 0 && (
                <TabsTrigger
                  style={{ boxShadow: "none" }}
                  className={
                    interest === "school"
                      ? "border-b-2 -mb-1 border-primary rounded-none"
                      : "border-b-2 -mb-1 border-transparent rounded-none"
                  }
                  value="school"
                >
                  Schools
                </TabsTrigger>
              )} */}
            </TabsList>

            <TabsContent value="top">
              <div className="flex md:gap-20 py-2 justify-between">
                {profile.user.topVoice.map((top) => (
                  <div key={top._id} className="flex items-start gap-2">
                    <Avatar className="w-12 h-12">
                      <AvatarImage src={top.avatar?.url} />
                      <AvatarFallback>
                        {top.name.charAt(0).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex flex-col justify-start">
                      <h3 className="font-semibold text-[15px] leading-tight">
                        {top.name}
                      </h3>
                      <p className="text-[13px] opacity-90 flex items-center gap-1">
                        {top.headline}
                      </p>
                      <span className="text-sm py-2 opacity-70 leading-none flex items-center gap-1">
                        {top.followers.length} followers
                      </span>
                      <Button
                        variant={"outline"}
                        className="flex items-center mt-2 px-3 w-32 rounded-full"
                        size={"sm"}
                      >
                        <Plus /> Follow
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </TabsContent>
            <TabsContent value="companies">
              <div className="flex px-4 flex-wrap md:gap-12 py-2 gap-4 justify-stretch">
                {companies.map((company, i: number) => (
                  <div
                    key={company._id}
                    className="flex min-w-[250px] items-start gap-2"
                  >
                    <Link href={`/company/${company._id}`}>
                      <Avatar className="w-12 h-12">
                        <AvatarImage src={company.avatar?.url} />
                        <AvatarFallback>
                          {company.name.charAt(0) || (
                            <Building2 className="w-6 h-6" />
                          )}
                        </AvatarFallback>
                      </Avatar>
                    </Link>
                    <div className="flex flex-col justify-start">
                      <Link href={`/company/${company._id}`}>
                        <h3 className="font-semibold text-[15px] leading-tight">
                          {company.name}
                        </h3>
                        <p className="text-[13px] opacity-90 flex items-center gap-1">
                          {company.headline || "No description available"}
                        </p>
                        <span className="text-sm py-2 opacity-70 leading-none flex items-center gap-1">
                          {company.followers.length || 0} followers
                        </span>
                      </Link>
                      <Button
                        variant={"outline"}
                        className={`flex items-center mt-2 px-3 w-32 rounded-full ${
                          !company.followers.includes(profile.user?._id)
                            ? "bg-primary text-primary-foreground"
                            : ""
                        }`}
                        size={"sm"}
                        onClick={(e) => {
                          e.preventDefault();
                          handleFollowCompany(
                            company._id,
                            !company.followers.includes(profile.user?._id)
                          );
                        }}
                      >
                        {company.followers.includes(profile.user?._id)
                          ? "Following"
                          : "Follow"}
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </TabsContent>
            <TabsContent value="image">
              <div className="min-h-20 flex justify-center items-center">
                <span className="opacity-70 font-normal text-sm">
                  No Images Found
                </span>
              </div>
            </TabsContent>
          </Tabs>
        ) : (
          <div className="flex justify-center items-center flex-col min-h-24">
            <span className="text-sm opacity-60">There is no interest</span>
          </div>
        )}
      </CardContent>
      <CardFooter className="p-0 flex-col">
        <hr className="w-full" />
        {((profile.user.companies.length > 0 && interest === "companies") ||
          (profile.user.topVoice.length > 0 && interest === "top")) && (
          // (profile.user.schools.length > 0 && interest === "school") ||
          // (profile.user.newsLetter.length > 0 &&
          //   interest === "newsletter"))
          <Button
            variant={"link"}
            className="w-full h-12 hover:no-underline hover:bg-secondary text-foreground"
          >
            Show all{" "}
            {interest === "companies"
              ? "Companies"
              : // : interest === "newsletter"
                // ? "Newsletters"
                // : interest === "school"
                // ? "Schools"
                ""}{" "}
            <ArrowRight className="w-10 h-10" />
          </Button>
        )}
      </CardFooter>
    </Card>
  );
}

export default Interest;
