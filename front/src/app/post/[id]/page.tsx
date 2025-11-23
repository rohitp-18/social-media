"use client";

import React, { useEffect, useState } from "react";
import Post from "@/components/post";
import ProfileCard from "@/components/profileCard";
import FooterS from "@/components/footerS";
import { Card, CardContent } from "@/components/ui/card";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/store/store";
import { getSinglePost } from "@/store/user/userPostSlice";
import PostForm from "@/components/forms/userPostForm";
import { Dialog } from "@/components/ui/dialog";
import Wrapper from "@/app/u/[name]/details/_wrapper";
import { useParams } from "next/navigation";

function Page() {
  const [userName, setUserName] = useState<string | undefined>(undefined);
  const [isUser, setIsUser] = useState(false);
  const [create, setCreate] = useState(false);
  const [edit, setEdit] = useState(false);
  const [select, setSelect] = useState<any>(null);

  const dispatch = useDispatch<AppDispatch>();
  const { user } = useSelector((state: RootState) => state.user);
  const { singlePost, loading } = useSelector(
    (state: RootState) => state.userPosts
  );
  const { id } = useParams();

  function handleClose() {
    setCreate(false);
    setEdit(false);
    setSelect(null);
  }

  useEffect(() => {
    if (id) {
      setUserName(id as string);
      dispatch(getSinglePost(id as string));
    }
  }, [id]);

  useEffect(() => {
    if (userName && user) {
      setIsUser(userName === user?.username);
    }
  }, [userName, user]);

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
      {singlePost && (
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
            {singlePost && (
              <Post
                cardClass="w-full"
                post={singlePost}
                isFollowing={singlePost.isFollowing}
                setEdit={setEdit}
                setSelect={setSelect}
              />
            )}
          </div>
        </section>
      )}
    </Wrapper>
  );
}

export default Page;
