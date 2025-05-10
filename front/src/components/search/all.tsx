import React, { Fragment } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import RecommendCompany from "../recommend/recommendCompany";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { ArrowRight, User2 } from "lucide-react";
import { Button } from "../ui/button";
import Post from "../post";
import FooterS from "../footerS";

function All() {
  return (
    <section className="md:grid block grid-cols-[200px_1fr_300px] gap-4">
      <aside className="h-min md:block hidden">
        <Card className="sticky  top-[70px] left-0">
          <CardHeader>
            <CardTitle>On this Page</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col gap-2">
            <a className="opacity-70" href="#people">
              People
            </a>
            <a className="opacity-70" href="#posts">
              Posts
            </a>
            <a className="opacity-70" href="#jobs">
              Jobs
            </a>
            <a className="opacity-70" href="#groups">
              Groups
            </a>
            <a className="opacity-70" href="#companies">
              Companies
            </a>
          </CardContent>
        </Card>
        <div className="md:block hidden">
          <FooterS />
        </div>
      </aside>

      <div className="flex flex-col gap-6">
        <Card id="people">
          <CardHeader>
            <CardTitle>People</CardTitle>
          </CardHeader>
          <CardContent>
            {[0, 1, 2, 3, 4, 5].map((i) => (
              <Fragment key={i}>
                <div className="flex justify-between my-2 items-start">
                  <div className="flex justify-start items-start gap-3">
                    <Avatar className="w-10 h-10">
                      <AvatarImage src="" />
                      <AvatarFallback>
                        <User2 className="w-8 h-8 p-1.5" />
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex flex-col max-w-96">
                      <span className="font-semibold">John Doe</span>
                      <span className="text-sm opacity-80 line-clamp-1 leading-tight text-ellipsis overflow-hidden">
                        Software Engineer | Microsoft | 500+ connections | India
                        | React | Node.js | MongoDB
                      </span>
                      <span className="opacity-60 text-[13px]">Amarawati</span>
                    </div>
                  </div>

                  <Button
                    className="flex items-center w-min md:ml-8 mt-2 px-7 py-2 border-primary text-primary hover:text-white hover:bg-primary rounded-full"
                    variant={"outline"}
                    size={"sm"}
                  >
                    Follow
                  </Button>
                </div>
                <hr className="my-1" />
              </Fragment>
            ))}
          </CardContent>
          <Button
            variant={"link"}
            className="w-full h-12 hover:no-underline hover:bg-secondary text-foreground"
          >
            Show all People tesult <ArrowRight className="w-10 h-10" />
          </Button>
        </Card>
        <Card id="posts">
          <CardHeader>
            <CardTitle>Posts</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col gap-3 px-1 md:px-6">
            {[0, 1, 2, 3, 4].map((i) => (
              <Post key={i} cardClass="w-full" />
            ))}
          </CardContent>
          <Button
            variant={"link"}
            className="w-full h-12 hover:no-underline hover:bg-secondary text-foreground"
          >
            Show all Posts result <ArrowRight className="w-10 h-10" />
          </Button>
        </Card>
        <Card id="jobs">
          <CardHeader>
            <CardTitle>Jobs</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col gap-4">
            {[0, 1, 2, 3, 4].map((i) => (
              <Fragment key={i}>
                <div className="flex gap-5 justify-between items-start">
                  <div className="flex gap-5 items-center">
                    <Avatar className="w-14 h-14">
                      <AvatarImage src="" />
                      <AvatarFallback>
                        <User2 className="w-14 h-14 p-3" />
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex flex-col">
                      <h3 className="text-base text-primary font-bold">
                        Job Title
                      </h3>
                      <span className="text-xs opacity-70">Company Name</span>
                      <span className="text-xs opacity-70">
                        Location(Remote)
                      </span>
                      <span className="text-xs opacity-50 pt-1">
                        9 hours ago
                      </span>
                    </div>
                  </div>
                  <Button
                    className="w-min md:ml-8 mt-2 px-7 py-2 border-primary text-primary hover:text-white hover:bg-primary rounded-full"
                    variant={"outline"}
                    size={"sm"}
                  >
                    Save
                  </Button>
                </div>
                <hr />
              </Fragment>
            ))}
          </CardContent>
          <Button
            variant={"link"}
            className="w-full h-12 hover:no-underline hover:bg-secondary text-foreground"
          >
            Show all Posts result <ArrowRight className="w-10 h-10" />
          </Button>
        </Card>
        <Card id="groups">
          <CardHeader>
            <CardTitle>Groups</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col gap-2">
            {[0, 1, 2, 3, 4].map((i) => (
              <Fragment key={i}>
                <div className="flex justify-between my-2 items-start">
                  <div className="flex justify-start items-start gap-3">
                    <Avatar className="w-10 h-10">
                      <AvatarImage src="" />
                      <AvatarFallback>
                        <User2 className="w-8 h-8 p-1.5" />
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex flex-col max-w-96">
                      <span className="font-semibold line-clamp-2 leading-tight text-ellipsis overflow-hidden">
                        John Doe
                      </span>
                      <span className="opacity-90 text-sm">45 Members</span>
                      <span className="text-xs opacity-60 line-clamp-2 leading-tight text-ellipsis overflow-hidden">
                        Software Engineer | Microsoft | 500+ connections | India
                        | React | Node.js | MongoDB
                      </span>
                    </div>
                  </div>

                  <Button
                    className="flex items-center w-min md:ml-8 mt-2 px-7 py-2 border-primary text-primary hover:text-white hover:bg-primary rounded-full"
                    variant={"outline"}
                    size={"sm"}
                  >
                    Join
                  </Button>
                </div>
                <hr className="my-1" />
              </Fragment>
            ))}
          </CardContent>
          <Button
            variant={"link"}
            className="w-full h-12 hover:no-underline hover:bg-secondary text-foreground"
          >
            Show all Groups result <ArrowRight className="w-10 h-10" />
          </Button>
        </Card>
        <Card id="companies">
          <CardHeader>
            <CardTitle>Companies</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col gap-2">
            {[0, 1, 2, 3, 4].map((i) => (
              <Fragment key={i}>
                <div className="flex justify-between my-2 items-start">
                  <div className="flex justify-start items-start gap-3">
                    <Avatar className="w-10 h-10">
                      <AvatarImage src="" />
                      <AvatarFallback>
                        <User2 className="w-8 h-8 p-1.5" />
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex flex-col max-w-96">
                      <span className="font-semibold">John Doe</span>
                      <span className="text-sm opacity-90 line-clamp-1 leading-tight text-ellipsis overflow-hidden">
                        Software Engineer | Microsoft | 500+ connections | India
                        | React | Node.js | MongoDB
                      </span>
                      <span className="opacity-70 text-[13px]">
                        10M followers
                      </span>
                    </div>
                  </div>

                  <Button
                    className="flex items-center w-min md:ml-8 mt-2 px-7 py-2 border-primary text-primary hover:text-white hover:bg-primary rounded-full"
                    variant={"outline"}
                    size={"sm"}
                  >
                    follow
                  </Button>
                </div>
                <hr className="my-1" />
              </Fragment>
            ))}
          </CardContent>
        </Card>
      </div>
      <aside className="h-min md:block hidden">
        <RecommendCompany />
      </aside>
    </section>
  );
}

export default All;
