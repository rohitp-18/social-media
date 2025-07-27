"use client";

import React, { useEffect, useState } from "react";
import Wrapper from "../_wrapper";
import Post from "@/components/post";
import ProfileCard from "@/components/profileCard";
import FooterS from "@/components/footerS";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MoveLeft } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/store/store";
import { Button } from "@/components/ui/button";
import { getProfileActivity } from "@/store/user/userPostSlice";
import PostForm from "@/components/forms/userPostForm";
import { Dialog } from "@/components/ui/dialog";
import { useParams, useSearchParams } from "next/navigation";
import Link from "next/link";
import { Tabs, TabsContent, TabsList } from "@/components/ui/tabs";

function Page() {
  const [userName, setUserName] = useState<string | undefined>(undefined);
  const [isUser, setIsUser] = useState(false);
  const [create, setCreate] = useState(false);
  const [edit, setEdit] = useState(false);
  const [select, setSelect] = useState<any>(null);
  const [activity, setActivity] = useState("post");

  const { name } = useParams();
  const dispatch = useDispatch<AppDispatch>();
  const searchParams = useSearchParams();
  const { user } = useSelector((state: RootState) => state.user);
  const { userPosts, isFollowing, comments, images, videos } = useSelector(
    (state: RootState) => state.userPosts
  );

  function handleClose() {
    setCreate(false);
    setEdit(false);
    setSelect(null);
  }

  useEffect(() => {
    if (name) {
      setUserName(name as string);
      dispatch(getProfileActivity(name as string));
    }
  }, [name]);

  useEffect(() => {
    if (userName && user) {
      setIsUser(userName === user?.username);
    }
  }, [userName, user]);

  useEffect(() => {
    if (searchParams && isUser) {
      const create = searchParams.get("add");
      if (create === "true") {
        setCreate(true);
        setEdit(false);
        setSelect(null);
      }
      const tab = searchParams.get("type");
      if (tab) {
        setActivity(tab);
      }
      const post = searchParams.get("post");
      if (post) {
        const postId = userPosts.find((p: any) => p._id === post);
        if (postId) {
          setSelect(postId);
        }
      }
      const edit = searchParams.get("edit");
      if (edit === "true") {
        setEdit(true);
        setCreate(false);
      }
      new URLSearchParams(window.location.search).delete("add");
      window.history.replaceState({}, document.title, window.location.pathname);
    }
  }, [searchParams, isUser]);
  return (
    <Wrapper
      asideClassName={"lg:flex md:hidden"}
      sectionClassName={"md:grid-cols-1"}
      section2ClassName={"max-w"}
    >
      {(create || edit) && isUser && (
        <Dialog open={create || edit} onOpenChange={handleClose}>
          <PostForm
            onClose={handleClose}
            post={select}
            username={userName || ""}
            isUser={isUser}
            edit={edit}
          />
        </Dialog>
      )}
      {userPosts.length > 0 && (
        <section className="md:grid grid-cols-[250px_1fr] block mx-auto w-full max-w-7xl min-h-screen gap-6">
          <aside className="md:flex flex-col gap-3 w-full shrink hidden h-min">
            {user && (
              <>
                <ProfileCard />
                <Card className="flex flex-col gap-4">
                  <CardContent className="flex flex-col gap-1 p-3">
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-semibold opacity-90">
                        Following
                      </span>
                      <span className="text-sm opacity-80">
                        {user.totalFollowing}
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-semibold opacity-80">
                        Followers
                      </span>
                      <span className="text-sm opacity-80">
                        {user.totalFollowers}
                      </span>
                    </div>
                  </CardContent>
                </Card>
              </>
            )}
            <FooterS />
          </aside>
          <div className="flex w-full flex-col gap-4 mb-5">
            {/* Activity Feed info about user post create post */}
            <Card className="w-full">
              <CardHeader className="flex-row justify-between pb-3 gap-5">
                <div className="flex items-center gap-5">
                  <Link href={`/u/${userName}`}>
                    <MoveLeft className="w-5 h-5 opacity-80 hover:opacity-100" />
                  </Link>
                  <CardTitle>Activity</CardTitle>
                </div>
                {isUser && userPosts.length > 0 && (
                  <Button
                    className="flex text-primary border-primary hover:text-primary items-center rounded-full"
                    variant={"outline"}
                    onClick={() => {
                      setCreate(true);
                      setEdit(false);
                      setSelect(null);
                    }}
                  >
                    Create Post
                  </Button>
                )}
              </CardHeader>
              <CardContent className="flex flex-col gap-1">
                <div className="flex  gap-2">
                  {userPosts.length > 0 && (
                    <p className="text-sm opacity-80">
                      {userPosts.length} posts
                    </p>
                  )}
                  {images.length > 0 && (
                    <p className="text-sm opacity-80">{images.length} images</p>
                  )}
                  {comments.length > 0 && (
                    <p className="text-sm opacity-80">
                      {comments.length} comments
                    </p>
                  )}
                  {videos.length > 0 && (
                    <p className="text-sm opacity-80">{videos.length} videos</p>
                  )}
                </div>
              </CardContent>
            </Card>
            <Tabs value={activity} onValueChange={(va) => setActivity(va)}>
              {/* activity feed buttons to navigate */}
              <Card>
                <CardContent className="pt-4 p-4 mb-3">
                  <TabsList className="flex gap-3 bg-transparent items-center justify-start">
                    <Button
                      variant={activity === "post" ? "default" : "outline"}
                      onClick={() => setActivity("post")}
                      className="rounded-full"
                      value="post"
                    >
                      All Posts
                    </Button>
                    {comments.length > 0 && (
                      <Button
                        variant={activity === "comment" ? "default" : "outline"}
                        onClick={() => setActivity("comment")}
                        className="rounded-full"
                        value="comment"
                      >
                        Comments
                      </Button>
                    )}
                    {images.length > 0 && (
                      <Button
                        variant={activity === "image" ? "default" : "outline"}
                        onClick={() => setActivity("image")}
                        className="rounded-full"
                        value="image"
                      >
                        Images
                      </Button>
                    )}
                    {videos.length > 0 && (
                      <Button
                        variant={activity === "video" ? "default" : "outline"}
                        onClick={() => setActivity("video")}
                        className="rounded-full"
                        value="video"
                      >
                        Videos
                      </Button>
                    )}
                  </TabsList>
                </CardContent>
              </Card>
              <TabsContent value="post" className="flex flex-col gap-2 w-full">
                {userPosts.length > 0 &&
                  userPosts.map((u) => (
                    <Post
                      cardClass="w-full"
                      post={u}
                      key={u._id}
                      isFollowing={isFollowing || isUser}
                      setEdit={setEdit}
                      setSelect={setSelect}
                    />
                  ))}
              </TabsContent>
              <TabsContent value="image" className="w-full">
                {images.length > 0 ? (
                  images.map((img: any, i: number) => (
                    <Card
                      key={i}
                      className="w-full h-full shrink-0 overflow-hidden my-2 rounded-lg bg-muted border border-border"
                    >
                      <img
                        loading="lazy"
                        src={img.url}
                        alt={img.name}
                        className="object-cover w-full h-full"
                      />
                    </Card>
                  ))
                ) : (
                  <div className="col-span-full flex flex-col items-center justify-center py-8">
                    <span className="opacity-70 text-sm">No images found</span>
                  </div>
                )}
              </TabsContent>
              <TabsContent
                value="comment"
                className="w-full flex flex-col gap-2"
              >
                {comments.length > 0 ? (
                  comments.map((c: any, i: number) => (
                    <Post
                      post={c.post}
                      key={c._id}
                      isFollowing={isFollowing || isUser}
                      setEdit={setEdit}
                      setSelect={setSelect}
                      comment={c}
                      cardClass="w-full"
                    />
                  ))
                ) : (
                  <div className="col-span-full flex flex-col items-center justify-center py-8">
                    <span className="opacity-70 text-sm">
                      No comments found
                    </span>
                  </div>
                )}
              </TabsContent>
              <TabsContent value="video" className="w-full">
                {videos.length > 0 ? (
                  videos.map((vid: any, i: number) => (
                    <Card
                      key={i}
                      className="w-full h-full shrink-0 overflow-hidden my-2 rounded-lg bg-muted border border-border"
                    >
                      <video
                        src={vid.url}
                        controls
                        className="object-cover w-full h-full"
                      />
                    </Card>
                  ))
                ) : (
                  <div className="col-span-full flex flex-col items-center justify-center py-8">
                    <span className="opacity-70 text-sm">No videos found</span>
                  </div>
                )}
              </TabsContent>
            </Tabs>
          </div>
        </section>
      )}
    </Wrapper>
  );
}

export default Page;
