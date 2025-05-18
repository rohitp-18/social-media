"use client";

import React, { Fragment, useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ArrowRight, Dot, Plus } from "lucide-react";
import { useSelector } from "react-redux";
import { RootState } from "@/store/store";

function Interest({ isUser }: { isUser: boolean }) {
  const [interest, setInterest] = useState("companies");

  const { profile } = useSelector((state: RootState) => state.user);
  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex pb-3 justify-between items-start flex-row gap-2">
          <div>
            <CardTitle className="text-lg">Interests</CardTitle>
          </div>
        </div>
        <div className="flex gap-3"></div>
      </CardHeader>
      <CardContent className="-mt-4">
        {profile.user.topVoice.lenght > 0 ||
        profile.user.schools.lenght > 0 ||
        profile.user.newsLetter.lenght > 0 ||
        profile.user.companies.lenght > 0 ? (
          <Tabs onValueChange={(value) => setInterest(value)} value={interest}>
            <TabsList className="flex gap-3 pb-0 rounded-none transition-all bg-transparent border-b border-foreground/40 items-center justify-start">
              {profile.user.topVoice.length > 0 && (
                <TabsTrigger
                  style={{ boxShadow: "none" }}
                  className={
                    interest === "top"
                      ? "border-b-2 -mb-1 border-primary rounded-none"
                      : "border-b-2 -mb-1 border-transparent rounded-none"
                  }
                  value="top"
                >
                  Top voices
                </TabsTrigger>
              )}
              {profile.user.topVoice.length > 0 && (
                <TabsTrigger
                  style={{ boxShadow: "none" }}
                  className={
                    interest === "companies"
                      ? "border-b-2 -mb-1 border-primary rounded-none"
                      : "border-b-2 -mb-1 border-transparent rounded-none"
                  }
                  value="companies"
                >
                  Companies
                </TabsTrigger>
              )}
              {profile.user.topVoice.length > 0 && (
                <TabsTrigger
                  style={{ boxShadow: "none" }}
                  className={
                    interest === "groups"
                      ? "border-b-2 -mb-1 border-primary rounded-none"
                      : "border-b-2 -mb-1 border-transparent rounded-none"
                  }
                  value="groups"
                >
                  Groups
                </TabsTrigger>
              )}
              {profile.user.topVoice.length > 0 && (
                <TabsTrigger
                  style={{ boxShadow: "none" }}
                  className={
                    interest === "newsletter"
                      ? "border-b-2 -mb-1 border-primary rounded-none"
                      : "border-b-2 -mb-1 border-transparent rounded-none"
                  }
                  value="newsletter"
                >
                  News Letter
                </TabsTrigger>
              )}
              {profile.user.topVoice.length > 0 && (
                <TabsTrigger
                  style={{ boxShadow: "none" }}
                  className={
                    interest === "school"
                      ? "border-b-2 -mb-1 border-primary rounded-none"
                      : "border-b-2 -mb-1 border-transparent rounded-none"
                  }
                  value="school"
                >
                  Schools
                </TabsTrigger>
              )}
            </TabsList>

            <TabsContent value="top">
              <div className="flex md:gap-20 py-2 justify-between">
                {profile.user.topVoice.map((top: any) => (
                  <div key={top} className="flex items-start gap-2">
                    <Avatar className="w-12 h-12">
                      <AvatarImage src="" />
                      <AvatarFallback></AvatarFallback>
                    </Avatar>
                    <div className="flex flex-col justify-start">
                      <h3 className="font-semibold text-[15px] leading-tight">
                        User Name
                      </h3>
                      <p className="text-[13px] opacity-90 flex items-center gap-1">
                        Mern Stack Developer | frontend Developer | React |
                        Node.js | MongoDB | Express.js | Next.js | Artificial
                        Inteligence | Python | C++ | Machine Learning
                      </p>
                      <span className="text-sm py-2 opacity-70 leading-none flex items-center gap-1">
                        500 followers
                      </span>
                      <Button
                        variant={"outline"}
                        className="flex items-center mt-2 px-3 w-32 rounded-full"
                        size={"sm"}
                      >
                        <Plus /> Follow
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </TabsContent>
            <TabsContent value="comment">
              <div className="flex flex-col gap-2 py-2 justify-start">
                {[0, 1, 2, 3, 4].map((_, i) => (
                  <Fragment key={i}>
                    <div className="text-xs pt-2">
                      <div className="opacity-70 flex gap-2">
                        <span className="font-normal">Your Name</span>
                        <span>commented on a post</span>
                        <span>
                          <Dot className="w-4 h-4 inline -mr-1.5" /> 3w
                        </span>
                      </div>
                      <p className="text-sm pb-2 pt-1">
                        Lorem ipsum dolor, sit amet consectetur adipisicing
                        elit. Saepe architecto quibusdam esse inventore
                        reiciendis corporis dicta dolorum natus quis
                        repudiandae?
                      </p>
                    </div>
                    <hr />
                  </Fragment>
                ))}
              </div>
              {/* <div className="min-h-20 flex justify-center items-center">
            <span className="opacity-70 font-normal text-sm">
              No Comments Found
            </span>
          </div> */}
            </TabsContent>
            <TabsContent value="image">
              <div className="min-h-20 flex justify-center items-center">
                <span className="opacity-70 font-normal text-sm">
                  No Images Found
                </span>
              </div>
            </TabsContent>
          </Tabs>
        ) : (
          <div className="flex justify-center items-center flex-col min-h-24">
            <span className="text-sm opacity-60">There is no interest</span>
          </div>
        )}
      </CardContent>
      <CardFooter className="p-0 flex-col">
        <hr className="w-full" />
        {((profile.user.companies.length > 0 && interest === "companies") ||
          (profile.user.topVoice.length > 0 && interest === "top") ||
          (profile.user.schools.length > 0 && interest === "school") ||
          (profile.user.newsLetter.length > 0 &&
            interest === "newsletter")) && (
          <Button
            variant={"link"}
            className="w-full h-12 hover:no-underline hover:bg-secondary text-foreground"
          >
            Show all{" "}
            {interest === "companies"
              ? "Companies"
              : interest === "newsletter"
              ? "Newsletters"
              : interest === "school"
              ? "Schools"
              : ""}{" "}
            <ArrowRight className="w-10 h-10" />
          </Button>
        )}
      </CardFooter>
    </Card>
  );
}

export default Interest;
