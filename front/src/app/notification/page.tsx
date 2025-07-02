"use client";

import { Card, CardContent } from "@/components/ui/card";
import Navbar from "@/components/userNavbar";
// import Image from "next/image";
import React, { Fragment, useState } from "react";
// import back from "@/assets/back.png";
import { EllipsisIcon, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
// import { ToggleGroup } from "@/components/ui/toggle-group";
import FooterS from "@/components/footerS";
import ProfileCard from "@/components/profileCard";

function Page() {
  const [value, setValue] = useState("all");
  return (
    <>
      <main className="bg-[#f2f6f8] dark:bg-[#151515] w-full overflow-hidden py-5">
        <div className="container mx-auto">
          {/* <section className="flex mx-auto max-w-7xl justify-center gap-2"> */}
          <section className="md:grid feed mx-auto max-w-7xl min-h-screen gap-2">
            <aside className="md:flex flex-col gap-3 shrink hidden h-min shadow-lg w-60">
              <ProfileCard />
              <Card>
                <div className="flex justify-between px-3 flex-col my-3">
                  <h2 className="font-medium text-md opacity-90 -mb-1">
                    Manage Notifications
                  </h2>
                  <Button variant={"link"} className="px-0 justify-start">
                    view settings
                  </Button>
                </div>
              </Card>
            </aside>
            <section className="min-h-screen overflow-hidden w-full flex flex-col gap-5 flex-grow-0">
              {/* <div className="bg-background rounded-xl border text-card-foreground shadow-sm w-full flex justify-start items-center py-4 px-2 gap-10">
                <ToggleGroup type="single" className="flex gap-2">
                  <Button
                    variant={value === "all" ? "default" : "outline"}
                    onClick={() => setValue("all")}
                    className="rounded-lg"
                    value="all"
                  >
                    All
                  </Button>
                  <Button
                    variant={value === "post" ? "default" : "outline"}
                    onClick={() => setValue("post")}
                    className="rounded-lg"
                    value="post"
                  >
                    My Post
                  </Button>
                  <Button
                    variant={value === "jobs" ? "default" : "outline"}
                    onClick={() => setValue("jobs")}
                    className="rounded-lg"
                    value="jobs"
                  >
                    Jobs
                  </Button>
                  <Button
                    variant={value === "mentions" ? "default" : "outline"}
                    onClick={() => setValue("mentions")}
                    className="rounded-lg"
                    value="mentions"
                  >
                    Mentions
                  </Button>
                </ToggleGroup>
              </div> */}
              <Card className="p-0 rounded-xl">
                <CardContent className="flex rounded-xl flex-col p-0">
                  {[
                    {
                      id: 1,
                      avatar: "",
                      fallback: <User />,
                      title:
                        "Lorem ipsum dolor sit amet consectetur adipisicing elit. Nobis inventore provident",
                      description:
                        "Lorem ipsum dolor sit amet consectetur adipisicing elit. Beatae, ex.",
                      extra:
                        "Lorem ipsum dolor sit amet consectetur, adipisicing elit.",
                      time: "16h",
                      highlight: true,
                    },
                    {
                      id: 2,
                      avatar: "",
                      fallback: null,
                      title:
                        "Lorem ipsum dolor sit amet consectetur adipisicing elit. Nobis inventore provident",
                      description:
                        "Lorem ipsum dolor sit amet consectetur adipisicing elit. Beatae, ex.",
                      extra:
                        "Lorem ipsum dolor sit amet consectetur, adipisicing elit.",
                      time: "16h",
                      highlight: false,
                    },
                    {
                      id: 3,
                      avatar: "",
                      fallback: null,
                      title:
                        "Lorem ipsum dolor sit amet consectetur adipisicing elit. Nobis inventore provident",
                      description:
                        "Lorem ipsum dolor sit amet consectetur adipisicing elit. Beatae, ex.",
                      extra:
                        "Lorem ipsum dolor sit amet consectetur, adipisicing elit.",
                      time: "16h",
                      highlight: false,
                    },
                    {
                      id: 4,
                      avatar: "",
                      fallback: null,
                      title:
                        "Lorem ipsum dolor sit amet consectetur adipisicing elit. Nobis inventore provident",
                      description:
                        "Lorem ipsum dolor sit amet consectetur adipisicing elit. Beatae, ex.",
                      extra:
                        "Lorem ipsum dolor sit amet consectetur, adipisicing elit.",
                      time: "16h",
                      highlight: false,
                    },
                  ].map((item, idx, arr) => (
                    <Fragment key={item.id}>
                      <div
                        className={`w-full min-h-10 justify-between items-center ${
                          item.highlight
                            ? "rounded-t-xl p-3 bg-blue-100"
                            : "px-3 py-5"
                        } flex gap-2`}
                      >
                        <div className="flex gap-4 items-center">
                          <Avatar className="w-12 h-12">
                            <AvatarImage src={item.avatar} />
                            <AvatarFallback>{item.fallback}</AvatarFallback>
                          </Avatar>
                          <div className="flex flex-col gap-1">
                            <h3 className="text-sm">{item.title}</h3>
                            <span className="text-sm opacity-70">
                              {item.description}
                            </span>
                            <span className="text-xs opacity-50 -mt-1">
                              {item.extra}
                            </span>
                          </div>
                        </div>
                        <div className="h-full flex flex-col justify-center items-center gap-1">
                          <span className="text-xs opacity-70">
                            {item.time}
                          </span>
                          <EllipsisIcon className="opacity-80 text-sm" />
                        </div>
                      </div>
                      {idx < arr.length - 1 && <hr />}
                    </Fragment>
                  ))}
                </CardContent>
              </Card>
            </section>
            <aside>
              <FooterS />
            </aside>
          </section>
        </div>
      </main>
    </>
  );
}

export default Page;
