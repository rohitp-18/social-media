"use client";

import Navbar from "@/components/userNavbar";
import {
  User,
  Image as LuImage,
  CalendarDaysIcon,
  Newspaper,
} from "lucide-react";
import Image from "next/image";
import React, { useEffect } from "react";
import back from "@/assets/back.png";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Post from "@/components/post";
import {
  DropdownMenu,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { DropdownMenuContent } from "@radix-ui/react-dropdown-menu";
import FooterS from "@/components/footerS";
import ProfileCard from "@/components/profileCard";
import axios from "@/store/axios";
import { toast } from "sonner";
import { isAxiosError } from "axios";
import { SocialPost } from "@/assets/icons";

function Page() {
  const [posts, setPosts] = React.useState([]);

  async function fetchPosts() {
    try {
      const { data } = await axios.get("/posts/feed");
      setPosts(data.posts);
    } catch (error) {
      toast.error(
        (isAxiosError(error) && error.response?.data?.message) ||
          "Failed to fetch posts",
        {
          position: "top-center",
        }
      );
    }
  }

  useEffect(() => {
    fetchPosts();
  }, []);

  return (
    <>
      <Navbar />
      <main className="bg-[#f2f6f8] dark:bg-[#151515] w-full overflow-hidden py-5">
        <div className="container mx-auto">
          {/* <section className="flex mx-auto max-w-7xl justify-center gap-2"> */}
          <section className="md:grid feed block mx-auto max-w-7xl min-h-screen gap-2">
            <aside className="md:flex flex-col gap-3 shrink hidden h-min w-60">
              <ProfileCard />
              <Card className="">
                <CardContent className="flex flex-col gap-1 p-3">
                  <h3 className="text-lg pb-2 font-semibold">Profile Views</h3>
                  <div className="flex justify-between items-center">
                    <span className="text-sm opacity-80">Views today</span>
                    <span className="font-semibold text-sm">123</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm opacity-80">Views this week</span>
                    <span className="font-semibold text-sm">456</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm opacity-80">Views this month</span>
                    <span className="font-semibold text-sm">789</span>
                  </div>
                </CardContent>
              </Card>
              <div className="md:block hidden">
                <FooterS />
              </div>
            </aside>
            <section className="min-h-screen overflow-hidden w-full flex flex-col gap-5 flex-grow-0">
              <Card className="bg-background md:rounded-none p-3 flex flex-col gap-3 shadow-md w-full">
                <div className="flex justify-center gap-2 w-full items-center">
                  <Avatar className="h-12 w-12">
                    <AvatarImage src=""></AvatarImage>
                    <AvatarFallback>R</AvatarFallback>
                  </Avatar>
                  <Input
                    className="w-full h-11 rounded-full placeholder-black placeholder"
                    placeholder="Create a post"
                  />
                </div>
                <div className="flex justify-evenly items-center gap-2">
                  <div className="flex justify-center items-center gap-2">
                    <LuImage className="w-4 h-4" color="blue" />
                    <span className="">Media</span>
                  </div>
                  {/* <div className="flex justify-center items-center gap-2">
                    <CalendarDaysIcon color="red" className="w-4 h-4" />
                    <span className="">Event</span>
                  </div> */}
                  <div className="flex justify-center items-center gap-2">
                    <SocialPost color="red" className="w-4 h-4" />
                    <span className="">Post</span>
                  </div>
                </div>
              </Card>
              <Card className="bg-background flex-grow-0 p-3 gap-2 shadow-md w-full">
                <CardTitle>Stories</CardTitle>
                <CardContent
                  style={{ scrollbarWidth: "none" }}
                  className="flex gap-2 pt-2 flex-grow-0 overflow-y-auto"
                >
                  {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((num) => (
                    <div
                      key={num}
                      className="p-2 rounded-full hue-color border-4 border-red-100"
                    >
                      <Avatar className="md:h-16 md:w-16 h-12 w-12">
                        <AvatarImage src=""></AvatarImage>
                        <AvatarFallback>R</AvatarFallback>
                      </Avatar>
                    </div>
                  ))}
                </CardContent>
              </Card>
              {posts.map((post: any) => (
                <Post key={post._id} cardClass="w-full" post={post} />
              ))}
            </section>
            <aside className="min-h-screen flex-shrink-0 md:block hidden w-64">
              <div className="bg-background flex flex-col gap-2 h-min rounded-xl shadow-2xl p-3">
                <h2 className="text-lg font-bold">Trending</h2>
                <div className="flex flex-col gap-3">
                  <div className="flex flex-col gap-0">
                    <a
                      href="#"
                      className="text-sm opacity-80 hover:underline hover:opacity-100"
                    >
                      Latest React Updates
                    </a>
                    <div className="flex text-xs opacity-50 gap-2">
                      <span>2 hours ago</span>
                      <span>1.2k views</span>
                    </div>
                  </div>
                  <div className="flex flex-col gap-1">
                    <a
                      href="#"
                      className="text-sm opacity-80 hover:underline hover:opacity-100"
                    >
                      Node.js Best Practices
                    </a>
                    <div className="flex text-xs opacity-50 gap-2">
                      <span>5 hours ago</span>
                      <span>900 views</span>
                    </div>
                  </div>
                  <div className="flex flex-col gap-1">
                    <a
                      href="#"
                      className="text-sm opacity-80 hover:underline hover:opacity-100"
                    >
                      MongoDB Performance Tips
                    </a>
                    <div className="flex text-xs opacity-50 gap-2">
                      <span>1 day ago</span>
                      <span>3.4k views</span>
                    </div>
                  </div>
                  <div className="flex flex-col gap-1">
                    <a
                      href="#"
                      className="text-sm opacity-80 hover:underline hover:opacity-100"
                    >
                      Express.js Middleware
                    </a>
                    <div className="flex text-xs opacity-50 gap-2">
                      <span>2 days ago</span>
                      <span>2.1k views</span>
                    </div>
                  </div>
                  <div className="flex flex-col gap-1">
                    <a
                      href="#"
                      className="text-sm opacity-80 hover:underline hover:opacity-100"
                    >
                      JavaScript ES2023 Features
                    </a>
                    <div className="flex text-xs opacity-50 gap-2">
                      <span>3 days ago</span>
                      <span>1.8k views</span>
                    </div>
                  </div>
                </div>
              </div>
            </aside>
          </section>
        </div>
      </main>
    </>
  );
}

export default Page;
