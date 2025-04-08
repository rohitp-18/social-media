import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Navbar from "@/components/userNavbar";
import { List, Save, SquarePen, User2, X } from "lucide-react";
import Image from "next/image";
import React from "react";

import back from "@/assets/back.png";
import FooterS from "@/components/footerS";
import ProfileCard from "@/components/profileCard";

function Page() {
  return (
    <>
      <Navbar />
      <main className="bg-[#f2f6f8] dark:bg-[#151515] w-full overflow-hidden py-5">
        <div className="container max-w-[1170px] mx-auto">
          {/* <section className="flex mx-auto max-w-7xl justify-center gap-2"> */}
          <section className="md:grid network hidden mx-auto max-w-7xl min-h-screen gap-3">
            <aside className="md:flex flex-col gap-3 w-full shrink hidden h-min">
              {/* <Card className="bg-background w-full rounded-lg">
                <CardHeader className="p-0 rounded-2xl pb-3 flex flex-row justify-between items-center gap-2">
                  <div className="flex flex-col relative w-full h-32">
                    <Image
                      src={back}
                      alt="back"
                      className="w-full aspect-[4/1] flex-shrink-0 rounded-t-lg"
                    />
                    <Avatar className="w-24 h-24 ml-5 -mt-10">
                      <AvatarImage src="" />
                      <AvatarFallback>
                        <User2 className="w-20  opacity-70 h-20 p-5" />
                      </AvatarFallback>
                    </Avatar>
                  </div>
                </CardHeader>
                <CardContent className="flex flex-col gap-1 px-4 pt-0 pb-3">
                  <h3 className="text-lg pb-2 font-semibold">Your Name</h3>
                  <span className="text-xs opacity-70 -mt-2">
                    MERN FULL STACK WEB DEVELOPER || MongoDB || Express ||
                  </span>
                  <h3 className="text-opacity-50 text-xs opacity-50">
                    Maharashtra
                  </h3>
                </CardContent>
              </Card> */}
              <ProfileCard />
              <Card className="bg-background rounded-lg">
                <CardContent className="flex flex-col gap-5 p-5 px-8">
                  <div className="flex gap-5 items-center">
                    <List className="w-5 h-5" />
                    <h3 className="text-base font-semibold">Preferences</h3>
                  </div>
                  <div className="flex gap-5 items-center">
                    <Save className="w-5 h-5" />
                    <h3 className="text-base font-semibold">My Jobs</h3>
                  </div>
                  <hr />
                  <div className="flex gap-5 text-primary items-center">
                    <SquarePen className="w-5 h-5" />
                    <h3 className="text-base font-semibold">Post a free Job</h3>
                  </div>
                </CardContent>
              </Card>
              <FooterS />
            </aside>
            <section className="min-h-screen max-w-[860px] overflow-hidden w-full flex flex-col gap-5 flex-grow-0">
              <Card className="bg-background rounded-lg">
                <CardHeader className="">
                  <CardTitle className="text-lg -mb-1.5 font-semibold">
                    Top job picks for you
                  </CardTitle>
                  <p className="text-xs opacity-70">
                    Based on your profile and preferences
                  </p>
                </CardHeader>
                <CardContent className="flex flex-col gap-3 p-5">
                  <div className="flex gap-5 justify-between items-center">
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
                        <span className="text-xs opacity-50 pt-3">
                          9 hours ago
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center h-full">
                      <X className="w-5 h-5" />
                    </div>
                  </div>
                  <hr />
                  <div className="flex gap-5 justify-between items-center">
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
                        <span className="text-xs opacity-50 pt-3">
                          9 hours ago
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center h-full">
                      <X className="w-5 h-5" />
                    </div>
                  </div>
                  <hr />
                  <div className="flex gap-5 justify-between items-center">
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
                        <span className="text-xs opacity-50 pt-3">
                          9 hours ago
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center h-full">
                      <X className="w-5 h-5" />
                    </div>
                  </div>
                </CardContent>
              </Card>
              <Card className="bg-background rounded-lg">
                <CardHeader className="">
                  <CardTitle className="text-lg -mb-2 font-semibold">
                    Frontend Developer
                  </CardTitle>
                  <p className="text-xs opacity-70">
                    Based on your skills and experience
                  </p>
                </CardHeader>
                <CardContent className="flex flex-col gap-3 p-5">
                  <div className="flex gap-5 justify-between items-center">
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
                        <span className="text-xs opacity-50 pt-3">
                          9 hours ago
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center h-full">
                      <X className="w-5 h-5" />
                    </div>
                  </div>
                  <hr />
                  <div className="flex gap-5 justify-between items-center">
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
                        <span className="text-xs opacity-50 pt-3">
                          9 hours ago
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center h-full">
                      <X className="w-5 h-5" />
                    </div>
                  </div>
                  <hr />
                  <div className="flex gap-5 justify-between items-center">
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
                        <span className="text-xs opacity-50 pt-3">
                          9 hours ago
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center h-full">
                      <X className="w-5 h-5" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </section>
          </section>
        </div>
      </main>
    </>
  );
}

export default Page;
