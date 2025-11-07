import React, { Fragment, useEffect, useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Check, Plus, User2, X } from "lucide-react";
import axios from "@/store/axios";
import { sCompany } from "@/store/company/typeCompany";
import { SecondaryLoader } from "../loader";
import Link from "next/link";
import { toast } from "sonner";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/store/store";
import { toggleFollowCompany } from "@/store/company/companySlice";

function RecommendCompany({ horizontal }: { horizontal?: boolean }) {
  const [companies, setCompanies] = useState<sCompany[]>([]);
  const [loading, setLoading] = useState(true);
  const [following, setFollowing] = useState<{ [key: string]: boolean }>({});

  const dispatch = useDispatch<AppDispatch>();
  const { user } = useSelector((state: RootState) => state.user);

  async function fetchData() {
    try {
      setLoading(true);
      const { data } = await axios.get("/company/recommend");

      setCompanies(data.companies);
      setFollowing(
        data.companies.reduce(
          (acc: { [key: string]: boolean }, company: sCompany) => {
            acc[company._id] = company.followers.includes(user?._id || "");
            return acc;
          },
          {}
        )
      );
    } catch (error) {
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchData();
  }, []);

  if (loading) return <SecondaryLoader />;

  if (companies.length === 0) return null;

  if (horizontal) {
    return (
      <Card className="flex flex-col gap-3 md:hidden">
        <CardHeader className="pb-2">
          <h3 className="text-base font-semibold">People also Follow</h3>
        </CardHeader>
        <CardContent className="flex flex-row gap-3 overflow-x-auto">
          {companies.map((company, i) => (
            <Card
              className="border p-1 min-w-48 h-56 relative"
              key={company._id}
            >
              <Button
                size={"icon"}
                variant={"ghost"}
                onClick={(e) => {
                  setCompanies((prevCompanies) =>
                    prevCompanies.filter((u) => u._id !== company._id)
                  );
                  e.stopPropagation();
                }}
                className="absolute top-1 right-1 p-0.5 rounded-full"
              >
                <X className="w-4 h-4" />
              </Button>
              <CardContent className="flex items-center flex-col gap-2 p-3">
                <Link
                  href={`/user/${company._id}`}
                  className="flex justify-center items-center flex-col"
                >
                  <Avatar className="w-16 h-16">
                    <AvatarImage src={company.avatar?.url} alt={company.name} />
                    <AvatarFallback>
                      {company.name.charAt(0).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex flex-col justify-center items-center mt-2">
                    <span className="font-semibold text-center line-clamp-2 overflow-ellipsis overflow-hidden">
                      {company.name}
                    </span>
                    <span className="text-sm text-center text-muted-foreground line-clamp-2 overflow-ellipsis overflow-hidden">
                      {company.headline}
                    </span>
                  </div>
                </Link>
              </CardContent>
              <CardFooter>
                <Button
                  className="flex items-center mt-2 px-3 w-full rounded-full"
                  onClick={(e) => {
                    e.stopPropagation();
                    if (!user) {
                      toast.error("You must be logged in to follow users", {
                        position: "top-center",
                      });
                      return;
                    }
                    dispatch(
                      toggleFollowCompany({
                        companyId: company._id,
                        follow: !following,
                      })
                    ).then(() => {
                      toast.success(
                        company.followers.includes(user._id)
                          ? `Unfollowed ${company.name}`
                          : `Followed ${company.name}`,
                        { position: "top-center" }
                      );
                      setFollowing({
                        ...following,
                        [company._id]: !following[company._id],
                      });
                    });
                  }}
                >
                  {following ? <Check /> : <Plus />}
                  {following ? "Following" : "Follow"}
                </Button>
              </CardFooter>
            </Card>
          ))}
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="flex-col gap-3 hidden md:flex">
      <CardHeader className="pb-2">
        <h3 className="text-base font-semibold">People also Follow</h3>
      </CardHeader>
      <CardContent className="flex flex-col gap-3">
        {companies.map((company, i) => (
          <Fragment key={company._id}>
            <div className="flex justify-start items-start gap-3">
              <Link href={`/company/${company._id}`}>
                <Avatar className="w-10 h-10">
                  <AvatarImage src={company.avatar?.url} alt={company.name} />
                  <AvatarFallback>
                    <User2 className="w-8 h-8 p-1.5" />
                  </AvatarFallback>
                </Avatar>
              </Link>
              <div className="flex flex-col">
                <Link href={`/company/${company?._id}`}>
                  <span className="font-semibold">{company.name}</span>
                  <span className="text-sm opacity-90 line-clamp-1 leading-tight text-ellipsis overflow-hidden">
                    {company.headline}
                  </span>
                  <span className="opacity-70 text-[13px]">
                    {company.followers.length} followers
                  </span>
                </Link>
                <Button
                  className="flex items-center justify-center w-min mt-2 px-5 border-primary text-primary hover:text-white hover:bg-primary rounded-full"
                  variant={"outline"}
                  size={"sm"}
                  onClick={(e) => {
                    e.stopPropagation();
                    if (!user) {
                      toast.error("You must be logged in to follow users", {
                        position: "top-center",
                      });
                      return;
                    }
                    dispatch(
                      toggleFollowCompany({
                        companyId: company._id,
                        follow: !following[company._id],
                      })
                    ).then(() => {
                      toast.success(
                        company.followers.includes(user._id)
                          ? `Unfollowed ${company.name}`
                          : `Followed ${company.name}`,
                        { position: "top-center" }
                      );
                      setFollowing({
                        ...following,
                        [company._id]: !following[company._id],
                      });
                    });
                  }}
                >
                  {following[company._id] ? <Check /> : <Plus />}
                  {following[company._id] ? "Following" : "Follow"}
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
