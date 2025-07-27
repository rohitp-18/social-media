"use client";

import Navbar from "@/components/userNavbar";
import { getSingleGroup } from "@/store/group/groupSlice";
import { AppDispatch, RootState } from "@/store/store";
import { useParams } from "next/navigation";
import React, { Fragment, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import IntroNavbar from "@/components/introNavbar";
import ProfileCard from "@/components/profileCard";
import { Card, CardContent } from "@/components/ui/card";
import FooterS from "@/components/footerS";
import RecommendUser from "@/components/recommend/recommendUser";
import RecommendGroups from "@/components/recommend/recommendGroups";
import GroupCard from "@/components/group/groupCard";
import GroupProfile from "@/components/group/groupProfile";
import Post from "@/components/post";
import { Button } from "@/components/ui/button";
import Link from "next/link";

function Page() {
  const [isAdmin, setIsAdmin] = useState(false);
  const [isMember, setIsMember] = useState(false);

  const { id } = useParams();
  const dispatch = useDispatch<AppDispatch>();
  const { group, loading, error, posts } = useSelector(
    (state: RootState) => state.group
  );
  const { user } = useSelector((state: RootState) => state.user);

  useEffect(() => {
    if (id?.toString() !== group?._id?.toString() || !group) {
      dispatch(getSingleGroup(id as string));
    }
  }, [dispatch, id]);

  useEffect(() => {
    if (group && user) {
      if (group.admin.some((admin: any) => admin._id === user._id)) {
        setIsAdmin(true);
        setIsMember(true);
        return;
      } else if (group.members.some((member: any) => member._id === user._id)) {
        setIsMember(true);
      }
    }
  }, [group, user]);

  return (
    <>
      {user ? <Navbar /> : <IntroNavbar />}
      <main className="bg-[#f2f6f8] dark:bg-[#151515] w-full overflow-hidden py-5">
        <div className="container mx-auto">
          <section className="md:grid feed block mx-auto max-w-7xl min-h-screen gap-2">
            <aside className="md:flex flex-col gap-3 shrink hidden h-min w-60">
              <ProfileCard />
              <FooterS />
              <div className="md:block hidden"></div>
            </aside>
            <section className="min-h-screen overflow-hidden w-full flex flex-col gap-5 flex-grow-0">
              <GroupProfile />
              {/* show the updates the posts */}
              {isMember && (
                <Card className="w-full p-4 flex items-center justify-between">
                  <span className="text-lg font-medium">
                    Share something with the group
                  </span>
                  <Link href={`/post/create?group=${group._id}`} passHref>
                    <Button className="rounded-lg" asChild>
                      <span>Create Post</span>
                    </Button>
                  </Link>
                </Card>
              )}
              <section className="mt-5">
                {posts.map((post: any) => (
                  <Fragment key={post._id}>
                    <Post post={post} />
                  </Fragment>
                ))}
              </section>
            </section>
            <aside className="min-h-screen flex-shrink-0 md:block hidden w-64">
              <RecommendGroups />
              <RecommendUser />
            </aside>
          </section>
        </div>
      </main>
    </>
  );
}

export default Page;
