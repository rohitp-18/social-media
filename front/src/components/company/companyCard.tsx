"use client";

import { AppDispatch, RootState } from "@/store/store";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Card, CardContent, CardFooter, CardHeader } from "../ui/card";
import Image from "next/image";
import { Avatar, AvatarImage, AvatarFallback } from "../ui/avatar";
import { User2 } from "lucide-react";
import back from "@/assets/back.png";
import { Button } from "../ui/button";
import { toggleFollowCompany } from "@/store/company/companySlice";
import { toast } from "sonner";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";

function CompanyCard({ company: propsCompany }: { company?: any }) {
  const [following, setFollowing] = useState(false);
  const [companyData, setCompanyData] = useState<any>(null);
  const [company, setCompany] = useState<any>(null);

  const router = useRouter();
  const pathname = usePathname();
  const dispatch = useDispatch<AppDispatch>();
  const { company: rootCompany } = useSelector(
    (state: RootState) => state.company
  );
  const { user } = useSelector((state: RootState) => state.user);

  const handleFollow = async () => {
    if (!user) {
      router.push(`/login?back=${pathname}`);
      return;
    }
    try {
      await dispatch(
        toggleFollowCompany({ companyId: company._id, follow: !following })
      ).unwrap();
      setFollowing(!following);
      if (!following) {
        toast.success("You are now following this company", {
          position: "top-center",
        });
      } else {
        toast.success("You have unfollowed this company", {
          position: "top-center",
        });
      }
    } catch (error: any) {
      toast.error(error.message || "Something went wrong", {
        position: "top-center",
      });
    }
  };

  useEffect(() => {
    if (company) {
      setCompanyData(company);
      user &&
        setFollowing(
          company.followers?.some((follower: any) => follower._id === user?._id)
        );
    }
  }, [company, user]);

  useEffect(() => {
    if (propsCompany) {
      setCompany(propsCompany);
      console.log(propsCompany);
    } else {
      setCompany(rootCompany);
    }
  }, [propsCompany, rootCompany]);

  if (!company || !companyData) return null;
  return (
    <Card className="w-full flex p-0 flex-col gap-3 bg-white dark:bg-[#1a1a1a] border border-gray-200 dark:border-gray-700 rounded-lg shadow-sm">
      <CardHeader className="p-0">
        <Link
          href={`/company/${company._id}`}
          className="w-full flex flex-col gap-2"
        >
          <div className="flex flex-col relative w-full">
            {companyData.bannerImage ? (
              <img
                loading="lazy"
                src={companyData.bannerImage.url}
                alt="background"
                className="w-full aspect-[4/1] flex-shrink-0 rounded-t-lg"
              />
            ) : (
              <Image
                src={back}
                alt="background"
                className="w-full aspect-[4/1] flex-shrink-0 rounded-t-lg"
              />
            )}
            <Avatar className="w-24 h-24 ml-5 -mt-10">
              <AvatarImage src={company.avatar?.url} />
              <AvatarFallback>
                <User2 className="w-20 opacity-70 h-20 p-5" />
              </AvatarFallback>
            </Avatar>
          </div>
        </Link>
      </CardHeader>
      <CardContent>
        <Link href={`/company/${company._id}`} className="w-full flex flex-col">
          <h1 className="text-lg pb-2 font-semibold">{company.name}</h1>
          <p className="text-xs opacity-70 -mt-2">
            {company.headline || "No headline available"}
          </p>
          <p className="text-opacity-50 text-xs opacity-50">
            {`${company.address[0].city ? company.address[0].city + ", " : ""}${
              company.address[0].state ? company.address[0].state + ", " : ""
            }${company.address[0].country ? company.address[0].country : ""}`}
          </p>
        </Link>
        <p className="text-sm text-gray-600 mt-2">
          <span className="font-semibold">
            {company.followers?.length || 0}{" "}
          </span>
          Followers
          <span className="font-semibold ml-2">
            {company.members?.length || 0}{" "}
          </span>
          Members
        </p>
      </CardContent>
      <CardFooter className="flex flex-row justify-between items-center gap-2">
        <Link href={`/company/${company._id}`} className="flex-1">
          <Button
            variant="outline"
            className="w-full sm:w-auto text-blue-500 hover:text-blue-700"
            aria-label="View Company Profile"
          >
            View Profile
          </Button>
        </Link>
        <Button
          variant={following ? "outline" : "default"}
          className="flex-1 ml-0 sm:ml-2"
          onClick={handleFollow}
          aria-label={following ? "Unfollow Company" : "Follow Company"}
        >
          {following ? "Following" : "Follow"}
        </Button>
      </CardFooter>
    </Card>
  );
}

export default CompanyCard;
