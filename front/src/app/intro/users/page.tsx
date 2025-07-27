"use client";
import { User2, X } from "lucide-react";
import axios from "@/store/axios";
import React, { useState, Fragment, useEffect } from "react";
import { toast } from "sonner";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import FooterS from "@/components/footerS";
import Navbar from "@/components/introNavbar";

function Page() {
  const [users, setUsers] = useState([]);

  async function fetchUsers() {
    try {
      const { data } = await axios.get("/user/intro");
      setUsers(data.users);
    } catch (error) {
      toast.error("Failed to fetch users", {
        position: "top-center",
      });
    }
  }

  useEffect(() => {
    fetchUsers();
  }, []);

  return (
    <>
      <Navbar />
      <section className="container lg:max-w-[1100px] mx-auto py-6">
        <section className="grid grid-cols-[1fr_300px]  gap-4">
          <Card className="flex flex-col max-w-screen-md w-full gap-3 overflow-auto">
            <CardContent className="flex flex-col gap-2 py-5">
              {users.length > 0 ? (
                users.map((user: any) => (
                  <Fragment key={user.id}>
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
                            {user.name}
                          </h3>
                          <span className="text-xs opacity-70">
                            {user.headline || "No headline provided"},{" "}
                            {user.location || "Unknown"}
                          </span>
                        </div>
                      </div>
                      <div className="flex items-center h-full">
                        <X className="w-5 h-5" />
                      </div>
                    </div>
                    <hr />
                  </Fragment>
                ))
              ) : (
                <div className="text-center flex justify-center items-center text-gray-500">
                  No jobs available at the moment.
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
