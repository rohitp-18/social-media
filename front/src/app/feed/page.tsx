"use client";

import Navbar from "@/components/userNavbar";
import { Image as LuImage } from "lucide-react";
import React, { useEffect } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Post from "@/components/post";
import FooterS from "@/components/footerS";
import ProfileCard from "@/components/profileCard";
import axios from "@/store/axios";
import { toast } from "sonner";
import { isAxiosError } from "axios";
import { SocialPost } from "@/assets/icons";
import { useSelector } from "react-redux";
import { RootState } from "@/store/store";
import AuthProvider from "@/components/authProvider";
import { useRouter } from "next/navigation";
import Link from "next/link";

function Page() {
  const [posts, setPosts] = React.useState([]);

  const router = useRouter();
  const { user } = useSelector((state: RootState) => state.user);

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
    <AuthProvider>
      <Navbar />
      <main className="bg-[#f2f6f8] dark:bg-[#151515] w-full overflow-hidden py-5">
        <div className="container mx-auto">
          {/* <section className="flex mx-auto max-w-7xl justify-center gap-2"> */}
          <section className="md:grid grid-cols-[256px_1fr] block mx-auto max-w-7xl min-h-screen gap-2">
            <aside className="md:flex flex-col gap-3 shrink hidden h-min w-60">
              <ProfileCard />
              <div className="md:block hidden">
                <FooterS />
              </div>
            </aside>
            <section className="min-h-screen overflow-hidden w-full max-w-xl mx-auto flex flex-col gap-5 flex-grow-0">
              <Card className="bg-background p-3 flex flex-col gap-3 shadow-md w-full">
                <Link
                  href={`/u/${user?.username}/details/activity?add=true&type=post`}
                  className=""
                >
                  <div className="flex justify-center gap-2 w-full items-center">
                    <Avatar className="h-12 w-12">
                      <AvatarImage src={user?.avatar?.url}></AvatarImage>
                      <AvatarFallback>
                        {user?.name.charAt(0).toUpperCase()}
                      </AvatarFallback>
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
                </Link>
              </Card>
              {/* <Card className="bg-background flex-grow-0 p-3 gap-2 shadow-md w-full">
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
              </Card> */}
              {posts.map((post: any) => (
                <Post key={post._id} cardClass="w-full" post={post} />
              ))}
            </section>
          </section>
        </div>
      </main>
    </AuthProvider>
  );
}

export default Page;
