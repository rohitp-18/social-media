"use client";

import React, { useEffect, useMemo, useState } from "react";
import Navbar from "@/components/userNavbar";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { User2, Edit2, MoreHorizontal, Plus } from "lucide-react";
import Image from "next/image";
import back from "@/assets/back.png";
import { Button } from "@/components/ui/button";
import Sidebar from "@/components/sidebar";
import { useParams, usePathname } from "next/navigation";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import CompanyTabs from "./companyTabs";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/store/store";
import { getSingleCompany } from "@/store/company/companySlice";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

function Page({ params }: { params: { id: string } }) {
  const [editIntro, setEditIntro] = useState(false);
  const [tab, setTab] = useState("");

  const param = useParams();
  const pathname = usePathname();
  const dispatch = useDispatch<AppDispatch>();
  const { company, loading, error } = useSelector(
    (state: RootState) => state.company
  );

  useEffect(() => {
    console.log(pathname.split("tab=")[1] || "Home");
    setTab(pathname.split("tab=")[1] || "Home");
  }, [pathname]);

  useEffect(() => {
    Promise.resolve(params).then((res: { id: string }) => {
      dispatch(getSingleCompany(res.id));
    });
  }, [params]);

  const tabValues = useMemo(() => ["Home", "About", "Jobs", "People"], []);

  return (
    <>
      <Navbar />
      <main className="bg-[#f2f6f8] dark:bg-[#151515] w-full overflow-hidden py-5">
        <div className="container max-w-[1170px] mx-auto">
          {/* <section className="flex mx-auto max-w-7xl justify-center gap-2"> */}
          <section className="md:grid grid-cols-[1fr_300px] block mx-auto max-w-7xl min-h-screen gap-3">
            <section className="min-h-screen max-w-[860px] overflow-hidden w-full flex flex-col gap-5 flex-grow-0">
              {/* profile card */}
              <Card>
                <CardHeader className="p-0 rounded-2xl pb-3 flex flex-row justify-between items-center gap-2">
                  <div className="flex flex-col relative w-full">
                    <Image
                      src={back}
                      alt="background"
                      className="w-full aspect-[4/1] flex-shrink-0 rounded-t-lg"
                    />
                    <Avatar className="w-24 h-24 md:w-36 p-2 bg-background border-3 border-background md:-mt-16 md:h-36 ml-5 -mt-12">
                      <AvatarImage src="" />
                      <AvatarFallback>
                        <User2 className="w-20 opacity-70 h-20 p-5" />
                      </AvatarFallback>
                    </Avatar>
                  </div>
                </CardHeader>
                <CardContent className="flex justify-between items-start gap-3">
                  <div className="flex flex-col gap-1 md:px-4 pt-0 pb-3">
                    <h3 className="md:text-2xl text-xl pb-2 font-semibold">
                      Professional Profile
                    </h3>
                    <span className="text-sm">
                      MERN FULL STACK WEB DEVELOPER || React || Node.js ||
                      MongoDB
                    </span>
                    <div className="flex justify-start items-center gap-2">
                      <h3 className="text-opacity-50 text-sm -mt-1 opacity-50">
                        Maharashtra, India
                      </h3>
                    </div>
                    <div className="flex opacity-60 items-center gap-2">
                      <div className="">
                        <span className="text-sm pr-1 font-semibold">545</span>
                        <span className="text-sm">Followers</span>
                      </div>
                      <div className="">
                        <span className="text-sm pr-1 font-semibold">545</span>
                        <span className="text-sm">Employees</span>
                      </div>
                    </div>
                    <div className="flex justify-start items-center gap-3 mt-5">
                      <Button
                        className="flex items-center rounded-full"
                        variant={"default"}
                        // onClick={() => dispatch(toggleFollow(profile.user._id))}
                      >
                        <Plus /> Follow
                      </Button>
                      <Button
                        className="flex items-center rounded-full"
                        variant={"default"}
                        // onClick={() => dispatch(toggleFollow(profile.user._id))}
                      >
                        Visit website
                      </Button>
                      <Button
                        className="flex items-center border-primary text-primary rounded-full hover:text-white hover:bg-primary"
                        variant={"outline"}
                      >
                        Add profile section
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
                              <Plus className="w-4 h-4" />
                              <div className="">Create page</div>
                            </DropdownMenuItem>
                          </DropdownMenuGroup>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </div>
                  <div className="flex justify-start items-start">
                    <Edit2
                      onClick={() => setEditIntro(true)}
                      className="w-5 h-5 opacity-90"
                    />
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
              <CompanyTabs tab={tab} />
            </section>
            <Sidebar />
            <section></section>
          </section>
        </div>
      </main>
    </>
  );
}

export default Page;
