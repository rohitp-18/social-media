"use client";
import { User2, X } from "lucide-react";
import axios from "@/store/axios";
import React, { useState, Fragment, useEffect } from "react";
import { toast } from "sonner";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import FooterS from "@/components/footerS";
import Navbar from "@/components/introNavbar";
import Post from "@/components/post";
import { isAxiosError } from "axios";

function Page() {
  const [posts, setPosts] = useState([]);

  async function fetchPosts() {
    try {
      const { data } = await axios.get(
        "/search/posts?sort=popular&page=1&limit=30"
      );
      setPosts(data.posts);
    } catch (error: any) {
      toast.error(
        isAxiosError(error)
          ? error.response?.data.message
          : "Failed to fetch posts",
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
      <section className="container lg:max-w-[1100px] mx-auto py-6">
        <div className="mb-6">
          <div className="flex items-center justify-between gap-4">
            <div>
              <h2 className="text-2xl font-semibold">Recommended Posts</h2>
              <p className="text-sm text-gray-500">
                Trending, viral, and most liked posts curated for you
              </p>
            </div>
          </div>
        </div>
        <section className="md:grid grid-cols-[1fr_300px] block gap-4">
          <div className="flex flex-col max-w-screen-md w-full gap-3 md:gap-5 overflow-auto">
            {posts.length > 0 ? (
              posts.map((post: any) => (
                <Fragment key={post._id}>
                  <Post post={post} cardClass="w-full" />
                </Fragment>
              ))
            ) : (
              <Card className="flex flex-col max-w-screen-md w-full gap-3 overflow-auto">
                <CardContent className="flex flex-col gap-2 py-5">
                  <div className="text-center flex justify-center items-center text-gray-500">
                    No posts available at the moment.
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
          <aside>
            <FooterS />
          </aside>
        </section>
      </section>
    </>
  );
}

export default Page;
