"use client";

import FooterS from "@/components/footerS";
import RecommendUser from "@/components/recommend/recommendUser";
import RecommendUserHorizon from "@/components/recommend/recommendUserHorizon";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Navbar from "@/components/userNavbar";
import axios from "@/store/axios";
import { RootState } from "@/store/store";
import { isAxiosError } from "axios";
import {
  CalendarDays,
  MoreHorizontal,
  Newspaper,
  User,
  User2,
  Users,
  Users2,
} from "lucide-react";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { toast } from "sonner";

function Page() {
  const [value, setValue] = useState("updates");
  const [networkLoading, setNetworkLoading] = useState(false);
  const [updates, setUpdates] = useState<any[]>([]);
  const [meet, setMeet] = useState<any[]>([]);

  const { user, loading, login } = useSelector(
    (state: RootState) => state.user
  );

  async function getUpdates() {
    try {
      const { data } = await axios.get("/invitations/all");

      setUpdates(data.invitations);
    } catch (error) {
      toast.error(
        isAxiosError(error)
          ? error.response?.data.message
          : "Something went wrong"
      );
    } finally {
      setNetworkLoading(false);
    }
  }

  async function updateInvitationStatus(
    invitationId: string,
    status: "accepted" | "rejected"
  ) {
    try {
      const { data } = await axios.put(`/invitations/${invitationId}`, {
        status,
      });
      toast.success(data.message, {
        position: "top-center",
      });
      setUpdates((prev) =>
        prev.map((update) =>
          update._id === invitationId ? { ...update, status } : update
        )
      );
    } catch (error) {
      toast.error(
        isAxiosError(error)
          ? error.response?.data.message
          : "Something went wrong"
      );
    }
  }

  async function getMeet() {
    try {
      const { data } = await axios.get("/notifications/meet");
      setMeet(data.notifications);
    } catch (error) {
      toast.error(
        isAxiosError(error)
          ? error.response?.data.message
          : "Something went wrong"
      );
    } finally {
      setNetworkLoading(false);
    }
  }

  useEffect(() => {
    if (value === "updates") {
      setNetworkLoading(true);
      getUpdates();
    } else {
      setNetworkLoading(true);
      getMeet();
    }
  }, [value]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <>
      <Navbar />
      <main className="bg-[#f2f6f8] dark:bg-[#151515] w-full overflow-hidden py-5">
        <div className="container max-w-[1170px] mx-auto">
          {/* <section className="flex mx-auto max-w-7xl justify-center gap-2"> */}
          <section className="md:grid network mx-auto max-w-7xl min-h-screen gap-2">
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
                    <div className="font-semibold text-base">
                      {user?.connections.length}
                    </div>
                  </div>
                  <div className="flex justify-between items-center gap-3 opacity-75">
                    <div className="flex justify-start items-center gap-3">
                      <User className="w-5 h-5" />
                      <span className="font-semibold text-base">followers</span>
                    </div>
                    <div className="font-semibold text-base">
                      {user?.followers.length}
                    </div>
                  </div>
                  <div className="flex justify-between items-center gap-3 opacity-75">
                    <div className="flex justify-start items-center gap-3">
                      <Users2 className="w-5 h-5" />
                      <span className="font-semibold text-base">Following</span>
                    </div>
                    <div className="font-semibold text-base">
                      {user?.following.length}
                    </div>
                  </div>
                  <div className="flex justify-between items-center gap-3 opacity-75">
                    <div className="flex justify-start items-center gap-3">
                      <Users2 className="w-5 h-5" />
                      <span className="font-semibold text-base">Groups</span>
                    </div>
                    <div className="font-semibold text-base">
                      {user?.groups.length}
                    </div>
                  </div>
                  {/* <div className="flex justify-between items-center gap-3 opacity-75">
                    <div className="flex justify-start items-center gap-3">
                      <CalendarDays className="w-5 h-5" />
                      <span className="font-semibold text-base">Event</span>
                    </div>
                    <div className="font-semibold text-base">{(user as any)?.events?.length ?? 0}</div>
                  </div> */}
                  {/* <div className="flex justify-between items-center gap-3 opacity-75">
                    <div className="flex justify-start items-center gap-3">
                      <Newspaper className="w-5 h-5" />
                      <span className="font-semibold text-base">Pages</span>
                    </div>
                    <div className="font-semibold text-base">{(user as any)?.pages?.length ?? 0}</div>
                  </div> */}
                  {/* <div className="flex justify-between items-center gap-3 opacity-75">
                    <div className="flex justify-start items-center gap-3">
                      <Newspaper className="w-5 h-5" />
                      <span className="font-semibold text-base">
                        News Letter
                      </span>
                    </div>
                    <div className="font-semibold text-base">5</div>
                  </div> */}
                </CardContent>
              </Card>
              <FooterS />
            </aside>
            <section className="min-h-screen max-w-[860px] overflow-hidden w-full flex flex-col gap-5 flex-grow-0">
              <div className="bg-background rounded-xl border text-card-foreground shadow-sm w-full flex justify-center items-center py-4 px-2 gap-10">
                {/* <Button
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
                </Button> */}
                <h3 className="text-center text-lg font-semibold">Updates</h3>
              </div>

              {/* {value === "updates" ? ( */}
              <Card className="p-3">
                <div className="flex flex-col gap-3">
                  {networkLoading ? (
                    <div className="flex justify-center items-center h-20">
                      <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-500"></div>
                    </div>
                  ) : updates.length === 0 ? (
                    <div className="flex justify-center items-center h-20">
                      <p className="text-gray-500">No updates available</p>
                    </div>
                  ) : (
                    updates.map((update: any, i) => (
                      <div
                        key={update._id}
                        className="flex justify-between gap-3 items-center p-3 rounded-md hover:bg-gray-100 bg-white dark:bg-gray-800 transition-all duration-200"
                      >
                        <Link
                          href={update.link}
                          className="flex items-center gap-3"
                        >
                          <Avatar className="w-12 h-12 transition-colors duration-200 group-hover:bg-white hover:bg-white">
                            <AvatarImage
                              src={update.targetId.avatar?.url}
                              className="w-12 h-12"
                            />
                            <AvatarFallback className="w-12 h-12">
                              <User2 className="w-12 h-12 p-1" />
                            </AvatarFallback>
                          </Avatar>
                          <div className="flex flex-col">
                            <h4 className="font-semibold text-base">
                              {update.targetId.name}
                            </h4>
                            <p className="opacity-70 text-sm">
                              {update.message}
                            </p>
                            {update.status === "accepted" ? (
                              <p className="text-sm text-green-600">Accepted</p>
                            ) : update.status === "rejected" ? (
                              <p className="text-sm text-red-600">Rejected</p>
                            ) : null}
                          </div>
                        </Link>
                        {update.status === "pending" ? (
                          <div className="flex gap-3 items-center">
                            <Button
                              size="sm"
                              variant="default"
                              className="p-1 bg-green-600 text-white rounded-md hover:bg-green-700"
                              onClick={() =>
                                updateInvitationStatus(update._id, "accepted")
                              }
                              aria-label="Accept invitation"
                            >
                              Accept
                            </Button>
                            <Button
                              size="sm"
                              variant="destructive"
                              className="p-1 rounded-md"
                              onClick={() =>
                                updateInvitationStatus(update._id, "rejected")
                              }
                              aria-label="Reject invitation"
                            >
                              Reject
                            </Button>
                          </div>
                        ) : null}
                      </div>
                    ))
                  )}
                </div>
              </Card>
              {/* // ) : (
              //   <Card className="p-3">
              //     <div className="flex p-3 flex-col gap-3">
              //       {[0, 1, 3, 2, 4, 5].map((_, i) => (
              //         <>
              //           <div className="flex justify-between gap-3 items-center">
              //             <div className="flex justify-start gap-3 items-center">
              //               <Avatar>
              //                 <AvatarImage src="" />
              //                 <AvatarFallback>
              //                   <User2 className="w-10 h-10 p-1" />
              //                 </AvatarFallback>
              //               </Avatar>
              //               <div className="flex flex-col justify-start items-start">
              //                 <h4 className="font-semibold text-sm">
              //                   Your Name
              //                 </h4>
              //                 <p className="opacity-70 -mt-0.5 -mb-2 text-sm">
              //                   Celebrated Your's birthday on 26th march
              //                 </p>
              //                 <Button
              //                   size={"sm"}
              //                   className="p-0"
              //                   variant={"link"}
              //                 >
              //                   message send
              //                 </Button>
              //               </div>
              //             </div>
              //             <MoreHorizontal className="w-5 h-5 opacity-80" />
              //           </div>

              //           <hr />
              //         </>
              //       ))}
              //     </div>
              //   </Card>
              // )} */}

              {/* <Card className="p-0 rounded-xl pt-1 px-4 pb-5">
                <CardHeader className="flex flex-row space-y-0 p-2 justify-between items-center gap-3">
                  <CardTitle className="pt-2">You might be know</CardTitle> */}
              {/* <Button variant={"link"} className="hover:no-underline">
                    See All
                  </Button> */}
              {/* </CardHeader> */}
              {/* <div className="flex flex-wrap w-full justify-evenly items-center md:gap-4 gap-2"> */}
              {/* </div> */}
              {/* </Card> */}
              <RecommendUserHorizon force={true} />
              <div className="md:hidden flex w-full justify-center">
                <FooterS />
              </div>
            </section>
          </section>
        </div>
      </main>
    </>
  );
}

export default Page;
