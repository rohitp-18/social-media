"use client";

import FooterS from "@/components/footerS";
import Friend from "@/components/friend";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Navbar from "@/components/userNavbar";
import {
  CalendarDays,
  MoreHorizontal,
  Newspaper,
  User,
  User2,
  Users,
  Users2,
} from "lucide-react";
import React, { useState } from "react";

function Page() {
  const [value, setValue] = useState("updates");
  const [type, setType] = useState("all"); // catch up tab name
  return (
    <>
      <Navbar />
      <main className="bg-[#f2f6f8] dark:bg-[#151515] w-full overflow-hidden py-5">
        <div className="container max-w-[1170px] mx-auto">
          {/* <section className="flex mx-auto max-w-7xl justify-center gap-2"> */}
          <section className="md:grid network hidden mx-auto max-w-7xl min-h-screen gap-2">
            <aside className="md:flex flex-col gap-3 w-full shrink hidden h-min">
              <Card className="bg-background w-full rounded-lg">
                <CardHeader className="flex gap-3">
                  <CardTitle>Manage your network</CardTitle>
                  <hr className="mt-10" />
                </CardHeader>
                <CardContent className="flex flex-col gap-6">
                  <div className="flex justify-between items-center gap-3 opacity-75">
                    <div className="flex justify-start items-center gap-3">
                      <Users className="w-5 h-5" />
                      <span className="font-semibold text-base">
                        Connections
                      </span>
                    </div>
                    <div className="font-semibold text-base">45</div>
                  </div>
                  <div className="flex justify-between items-center gap-3 opacity-75">
                    <div className="flex justify-start items-center gap-3">
                      <User className="w-5 h-5" />
                      <span className="font-semibold text-base">
                        following & followers
                      </span>
                    </div>
                    <div className="font-semibold text-base"></div>
                  </div>
                  <div className="flex justify-between items-center gap-3 opacity-75">
                    <div className="flex justify-start items-center gap-3">
                      <Users2 className="w-5 h-5" />
                      <span className="font-semibold text-base">Groups</span>
                    </div>
                    <div className="font-semibold text-base">5</div>
                  </div>
                  <div className="flex justify-between items-center gap-3 opacity-75">
                    <div className="flex justify-start items-center gap-3">
                      <CalendarDays className="w-5 h-5" />
                      <span className="font-semibold text-base">Event</span>
                    </div>
                    <div className="font-semibold text-base">5</div>
                  </div>
                  <div className="flex justify-between items-center gap-3 opacity-75">
                    <div className="flex justify-start items-center gap-3">
                      <Newspaper className="w-5 h-5" />
                      <span className="font-semibold text-base">Pages</span>
                    </div>
                    <div className="font-semibold text-base">5</div>
                  </div>
                  <div className="flex justify-between items-center gap-3 opacity-75">
                    <div className="flex justify-start items-center gap-3">
                      <Newspaper className="w-5 h-5" />
                      <span className="font-semibold text-base">
                        News Letter
                      </span>
                    </div>
                    <div className="font-semibold text-base">5</div>
                  </div>
                </CardContent>
              </Card>
              <FooterS />
            </aside>
            <section className="min-h-screen max-w-[860px] overflow-hidden w-full flex flex-col gap-5 flex-grow-0">
              <div className="bg-background rounded-xl border text-card-foreground shadow-sm w-full flex justify-start items-center py-4 px-2 gap-10">
                <Button
                  variant={value === "updates" ? "default" : "outline"}
                  onClick={() => setValue("updates")}
                  className="rounded-lg"
                  value="updates"
                >
                  Updates
                </Button>
                <Button
                  variant={value === "meet" ? "default" : "outline"}
                  onClick={() => setValue("meet")}
                  className="rounded-lg"
                  value="meet"
                >
                  Catch Up
                </Button>
              </div>

              {value === "updates" ? (
                <div className="flex flex-col justify-start">
                  <Card></Card>
                </div>
              ) : (
                <Card className="p-3">
                  <Tabs value={type} onValueChange={(val) => setType(val)}>
                    <TabsList className="flex gap-3 bg-transparent items-center justify-start">
                      <TabsTrigger style={{ boxShadow: "none" }} value="all">
                        <Button
                          variant={type === "all" ? "default" : "outline"}
                          className="rounded-full"
                        >
                          All
                        </Button>
                      </TabsTrigger>
                      <TabsTrigger style={{ boxShadow: "none" }} value="job">
                        <Button
                          variant={type === "job" ? "default" : "outline"}
                          className="rounded-full"
                        >
                          Job Change
                        </Button>
                      </TabsTrigger>
                      <TabsTrigger
                        style={{ boxShadow: "none" }}
                        value="birthday"
                      >
                        <Button
                          variant={type === "birthday" ? "default" : "outline"}
                          className="rounded-full"
                        >
                          Birthdays
                        </Button>
                      </TabsTrigger>
                      <TabsTrigger style={{ boxShadow: "none" }} value="work">
                        <Button
                          variant={type === "work" ? "default" : "outline"}
                          className="rounded-full"
                        >
                          Work anniversaries
                        </Button>
                      </TabsTrigger>
                      <TabsTrigger
                        style={{ boxShadow: "none" }}
                        value="education"
                      >
                        <Button
                          variant={type === "education" ? "default" : "outline"}
                          className="rounded-full"
                        >
                          Education
                        </Button>
                      </TabsTrigger>
                    </TabsList>
                    <TabsContent value="all">
                      <div className="flex p-3 flex-col gap-3">
                        {[0, 1, 3, 2, 4, 5].map((_, i) => (
                          <>
                            <div className="flex justify-between gap-3 items-center">
                              <div className="flex justify-start gap-3 items-center">
                                <Avatar>
                                  <AvatarImage src="" />
                                  <AvatarFallback>
                                    <User2 className="w-10 h-10 p-1" />
                                  </AvatarFallback>
                                </Avatar>
                                <div className="flex flex-col justify-start items-start">
                                  <h4 className="font-semibold text-sm">
                                    Your Name
                                  </h4>
                                  <p className="opacity-70 -mt-0.5 -mb-2 text-sm">
                                    Celebrated Your's birthday on 26th march
                                  </p>
                                  <Button
                                    size={"sm"}
                                    className="p-0"
                                    variant={"link"}
                                  >
                                    message send
                                  </Button>
                                </div>
                              </div>
                              <MoreHorizontal className="w-5 h-5 opacity-80" />
                            </div>

                            <hr />
                          </>
                        ))}
                      </div>
                    </TabsContent>
                    <TabsContent value="job"></TabsContent>
                    <TabsContent value="birthday"></TabsContent>
                    <TabsContent value="work"></TabsContent>
                    <TabsContent value="education"></TabsContent>
                  </Tabs>
                </Card>
              )}

              <Card className="p-0 rounded-xl pt-1 px-4 pb-5">
                <CardHeader className="flex flex-row space-y-0 p-2 justify-between items-center gap-3">
                  <CardTitle>You might be know</CardTitle>
                  <Button variant={"link"} className="hover:no-underline">
                    See All
                  </Button>
                </CardHeader>
                <div className="flex flex-wrap w-full justify-center items-center gap-4">
                  <Friend />
                  <Friend />
                  <Friend />
                  <Friend />
                  <Friend />
                  <Friend />
                  <Friend />
                  <Friend />
                  <Friend />
                  <Friend />
                  <Friend />
                  <Friend />
                </div>
              </Card>
            </section>
          </section>
        </div>
      </main>
    </>
  );
}

export default Page;
