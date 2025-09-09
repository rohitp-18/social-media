import React, { Fragment, useEffect } from "react";
import FooterS from "../footerS";
import { Card, CardContent } from "../ui/card";
import Post from "../post";
import { Button } from "../ui/button";
import { useSelector, useDispatch } from "react-redux";
import { RootState, AppDispatch } from "@/store/store";
import { searchPosts } from "@/store/search/allSearchSlice";

function PostSearch({
  selectValues,
  setSelectValues,
}: {
  selectValues: any;
  setSelectValues: (val: any) => void;
}) {
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
                <Fragment key={post._id}>
                  <Post cardClass="w-full" post={post} />
                </Fragment>
              ))}
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center w-full min-h-[400px] gap-6 px-6">
            <div className="text-center space-y-4">
              <div className="w-16 h-16 mx-auto bg-gray-100 rounded-full flex items-center justify-center">
                <svg
                  className="w-8 h-8 text-gray-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                  />
                </svg>
              </div>
              <h2 className="text-xl font-semibold text-gray-800">
                No posts found
              </h2>
              <p className="text-gray-500 max-w-md">
                We couldn't find any posts matching your search criteria. Try
                adjusting your filters or search terms.
              </p>
            </div>
            {Object.keys(selectValues).length > 1 && (
              <button
                onClick={() =>
                  setSelectValues({ q: selectValues.q, type: "post" })
                }
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                Clear Filters
              </button>
            )}
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
