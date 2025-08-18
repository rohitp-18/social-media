import React, { Fragment, useEffect } from "react";
import FooterS from "../footerS";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { Card, CardContent } from "../ui/card";
import { User2 } from "lucide-react";
import { Button } from "../ui/button";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/store/store";
import { connect } from "http2";
import { searchPeoples } from "@/store/search/allSearchSlice";

function PeopleSearch({ setType, selectValues }: any) {
  const dispatch = useDispatch<AppDispatch>();
  const { peoples } = useSelector((state: RootState) => state.search);
  const { user, loading } = useSelector((state: RootState) => state.user);

  useEffect(() => {
    dispatch(searchPeoples(selectValues));
  }, [selectValues]);

  return (
    <>
      <section className="grid grid-cols-[1fr_300px] gap-4">
        <div>
          {peoples.length > 0 ? (
            <Card className="">
              <CardContent className="flex flex-col gap-2 py-3">
                {peoples.map((people: any, i: number) => (
                  <Fragment key={people._id}>
                    <div className="flex justify-between my-2 items-start">
                      <a
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
                      </a>

                      {!people.isFollowing && people._id !== user?._id && (
                        <Button
                          className="flex items-center w-min md:ml-8 mt-2 px-7 py-2 border-primary text-primary hover:text-white hover:bg-primary rounded-full"
                          variant={"outline"}
                          size={"sm"}
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
            <Card className="flex flex-col w-full gap-3 overflow-auto">
              <CardContent className="flex flex-col gap-2 py-5">
                <div className="flex flex-col items-center justify-center w-full h-full gap-4">
                  <h1 className="text-2xl font-bold">No People Found</h1>
                  <p className="text-gray-500">
                    Try searching for something else.
                  </p>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
        <aside>
          <FooterS />
        </aside>
      </section>
    </>
  );
}

export default PeopleSearch;
