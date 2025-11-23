import React, { Fragment, useEffect } from "react";
import FooterS from "../footerS";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { Card, CardContent } from "../ui/card";
import { User2 } from "lucide-react";
import { Button } from "../ui/button";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/store/store";
import { searchPeoples } from "@/store/search/allSearchSlice";
import { toast } from "sonner";
import { toggleFollow } from "@/store/user/userSlice";
import RecommendUserHorizon from "../recommend/recommendUserHorizon";
import RecommendUser from "../recommend/recommendUser";
import Link from "next/link";

function PeopleSearch({
  selectValues,
  setSelectValues,
}: {
  selectValues: any;
  setSelectValues: (values: any) => void;
}) {
  const dispatch = useDispatch<AppDispatch>();
  const { peoples } = useSelector((state: RootState) => state.search);
  const { user, loading } = useSelector((state: RootState) => state.user);

  useEffect(() => {
    dispatch(searchPeoples(selectValues));
  }, [selectValues]);

  return (
    <>
      <section className="grid-cols-[1fr_300px] sm:grid block gap-4">
        <div>
          {peoples.length > 0 ? (
            <Card className="">
              <CardContent className="flex flex-col gap-2 py-3">
                {peoples.map((people: any, i: number) => (
                  <Fragment key={people._id}>
                    <div className="flex justify-between my-2 items-start">
                      <Link
                        href={`/u/${people.username}`}
                        className="flex justify-start items-start gap-3"
                      >
                        <Avatar className="w-10 h-10">
                          <AvatarImage src={people.avatar?.url} />
                          <AvatarFallback>
                            <User2 className="w-8 h-8 p-1.5" />
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex flex-col max-w-screen-sm">
                          <span className="font-semibold">{people.name}</span>
                          <span className="text-sm opacity-80 line-clamp-1 leading-tight text-ellipsis overflow-hidden">
                            {people.headline}
                          </span>
                          {people.location && (
                            <span className="opacity-60 text-[13px]">
                              {`${
                                people.location.city
                                  ? people.location.city + ", "
                                  : ""
                              }${
                                people.location.state
                                  ? people.location.state + ", "
                                  : ""
                              }${
                                people.location.country
                                  ? people.location.country
                                  : ""
                              }`}
                            </span>
                          )}
                        </div>
                      </Link>

                      {((!people.isFollowing && people._id !== user?._id) ||
                        user?.following.includes(people._id)) && (
                        <Button
                          className="flex items-center w-min md:ml-8 mt-2 px-7 py-2 border-primary text-primary hover:text-white hover:bg-primary rounded-full"
                          variant={"outline"}
                          size={"sm"}
                          onClick={() => {
                            if (!user) {
                              toast.error(
                                "You must be logged in to follow users",
                                {
                                  position: "top-center",
                                }
                              );
                              return;
                            }
                            dispatch(toggleFollow(people._id));
                          }}
                        >
                          Follow
                        </Button>
                      )}
                    </div>
                    {i < peoples.length - 1 && <hr className="my-1" />}
                  </Fragment>
                ))}
              </CardContent>
            </Card>
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
                  No People found
                </h2>
                <p className="text-gray-500 max-w-md">
                  We couldn't find any posts matching your search criteria. Try
                  adjusting your filters or search terms.
                </p>
              </div>
              {Object.keys(selectValues).length > 1 && (
                <button
                  onClick={() =>
                    setSelectValues({
                      q: selectValues.q,
                      type: "people",
                    })
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
          <RecommendUser />
          <RecommendUserHorizon />
          <FooterS />
        </aside>
      </section>
    </>
  );
}

export default PeopleSearch;
