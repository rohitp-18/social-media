"use client";
import { User2, X } from "lucide-react";
import axios from "@/store/axios";
import React, { useState, Fragment, useEffect } from "react";
import { toast } from "sonner";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import FooterS from "@/components/footerS";
import Navbar from "@/components/introNavbar";
import { Button } from "@/components/ui/button";
import { sUser } from "@/store/user/typeUser";
import Link from "next/link";

function Page() {
  const [users, setUsers] = useState<sUser[]>([]);
  const [loading, setLoading] = useState(true);

  async function fetchUsers() {
    try {
      setLoading(true);
      const { data } = await axios.get("/user/intro");
      setUsers(data.users);
      setLoading(false);
    } catch (error) {
      toast.error("Failed to fetch users", {
        position: "top-center",
      });
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchUsers();
  }, []);

  return (
    <>
      <Navbar />
      <section className="container lg:max-w-[1100px] mx-auto py-6">
        <section className="mb-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <User2 className="w-6 h-6 text-primary" />
              <div>
                <h2 className="text-lg font-bold text-primary">
                  Recommended users
                </h2>
                <p className="text-xs opacity-70">
                  People you might want to follow
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-sm opacity-70">
                {users.length} suggestions
              </span>
              <Button variant="ghost" size="sm" onClick={fetchUsers}>
                Refresh
              </Button>
            </div>
          </div>
        </section>
        <section className="md:grid grid-cols-[1fr_300px] block gap-4">
          <Card className="flex flex-col max-w-screen-md w-full gap-3 overflow-auto">
            <CardContent className="flex flex-col gap-3 md:gap-5 py-5">
              {users.length > 0 ? (
                users.map((user) => (
                  <Fragment key={user._id}>
                    <div className="flex gap-5 justify-between items-center">
                      <Link
                        href={`/u/${user.username}`}
                        className="flex gap-5 items-center"
                      >
                        <Avatar className="w-14 h-14">
                          <AvatarImage src={user.avatar?.url} />
                          <AvatarFallback>
                            <User2 className="w-14 h-14 p-3" />
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex flex-col">
                          <h3 className="text-base text-primary font-bold">
                            {user.name}
                          </h3>
                          <span className="text-xs block opacity-70">
                            {user.headline || "No headline provided"},{" "}
                            {`${
                              user.location?.city
                                ? user.location.city + ", "
                                : ""
                            }${
                              user.location?.state
                                ? user.location.state + ", "
                                : ""
                            }${
                              user.location?.country
                                ? user.location.country
                                : ""
                            }` || "Unknown"}
                          </span>
                          <span className="text-xs opacity-70">
                            {user.followers.length} followers
                          </span>
                        </div>
                      </Link>
                      <div className="flex items-center h-full">
                        <Button
                          size={"icon"}
                          variant={"ghost"}
                          onClick={() =>
                            setUsers(users.filter((u) => u._id !== user._id))
                          }
                        >
                          <X className="w-5 h-5" />
                        </Button>
                      </div>
                    </div>
                    <hr />
                  </Fragment>
                ))
              ) : (
                <div className="text-center flex justify-center items-center text-gray-500">
                  No users found.
                </div>
              )}
            </CardContent>
          </Card>
          <aside>
            <FooterS />
          </aside>
        </section>
      </section>
    </>
  );
}

export default Page;
