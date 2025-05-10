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
import { User2, Edit2 } from "lucide-react";
import Image from "next/image";
import back from "@/assets/back.png";
import { Button } from "@/components/ui/button";
import Sidebar from "@/components/sidebar";
import { useParams, usePathname } from "next/navigation";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import CompanyTabs from "./companyTabs";

function Page() {
  const [editIntro, setEditIntro] = useState(false);
  const [tab, setTab] = useState("");

  const param = useParams();
  const pathname = usePathname();

  useEffect(() => {
    console.log(pathname.split("tab=")[1] || "Home");
    setTab(pathname.split("tab=")[1] || "Home");
  }, [pathname]);

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
                      <span className="text-xs pl-2 opacity-70">(He/Him)</span>
                    </h3>
                    <span className="text-sm">
                      MERN FULL STACK WEB DEVELOPER || React || Node.js ||
                      MongoDB
                    </span>
                    <span className="text-opacity-90 md:hidden text-sm opacity-70">
                      Punyashlok ahilybai holker solapur University
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
                    </div>
                    <div className="flex justify-start items-center gap-3 mt-5">
                      <Button
                        className="flex items-center border-primary text-primary rounded-full hover:text-white hover:bg-primary"
                        variant={"outline"}
                      >
                        Add profile section
                      </Button>
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
          </section>
        </div>
      </main>
    </>
  );
}

export default Page;
