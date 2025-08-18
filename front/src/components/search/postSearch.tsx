import React, { useEffect } from "react";
import FooterS from "../footerS";
import { Card, CardContent } from "../ui/card";
import Post from "../post";
import { Button } from "../ui/button";
import { useSelector, useDispatch } from "react-redux";
import { RootState, AppDispatch } from "@/store/store";
import { searchPosts } from "@/store/search/allSearchSlice";

function PostSearch({ setType, selectValues }: any) {
  const dispatch = useDispatch<AppDispatch>();
  // const { user, loading } = useSelector((state: RootState) => state.user);
  const { posts } = useSelector((state: RootState) => state.search);

  useEffect(() => {
    if (selectValues) {
      dispatch(searchPosts({ ...selectValues }));
    }
  }, [selectValues, dispatch]);

  return (
    <section className="grid grid-cols-[1fr_300px]  gap-4">
      <div className="">
        {posts.length > 0 ? (
          <div className="flex px-6 flex-col bg-transparent w-full gap-3 overflow-auto">
            <div className="flex flex-col gap-2 py-5">
              {posts.map((post) => (
                <Post key={post._id} cardClass="w-full" post={post} />
              ))}
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center w-full h-full gap-4">
            <h1 className="text-2xl font-bold">No Posts Found</h1>
            <p className="text-gray-500">Try searching for something else.</p>
          </div>
        )}
      </div>
      <aside>
        <FooterS />
      </aside>
    </section>
  );
}

export default PostSearch;
