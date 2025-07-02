"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import Navbar from "@/components/userNavbar";
import { ArrowLeft, Building2 } from "lucide-react";
import React, { useState } from "react";
import Image from "next/image";
import back from "@/assets/back.png";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";

function Page() {
  const [create, setCreate] = useState(false);
  const [name, setName] = useState("");
  return (
    <>
      <main className="bg-[#f2f6f8] dark:bg-[#151515] w-full min-h-screen overflow-hidden py-5">
        <div className="container max-w-[1170px] mx-auto">
          {create ? (
            <section className="flex flex-col items-center gap-10">
              <div className="">
                <Button
                  variant={"outline"}
                  className="border-none flex gap-4 items-center"
                >
                  <ArrowLeft className="w-6 h-6" />
                  <div className="font-semibold text-base">Back</div>
                </Button>
              </div>
              <div className="">
                <form className="flex flex-col justify-center">
                  <Card>
                    <CardContent className="py-3">
                      <div className="grid w-full mb-4 max-w-sm items-center gap-1">
                        <Label htmlFor="name">Name</Label>
                        <Input
                          className="p-1"
                          id="name"
                          placeholder="Name..."
                          value={name}
                          onChange={(e) => setName(e.target.value)}
                        />
                      </div>
                      <div className="grid w-full mb-4 max-w-sm items-center gap-1">
                        <Label htmlFor="name">Name</Label>
                        <Input
                          className="p-1"
                          id="name"
                          placeholder="Name..."
                          value={name}
                          onChange={(e) => setName(e.target.value)}
                        />
                      </div>
                      <div className="grid w-full mb-4 max-w-sm items-center gap-1">
                        <Label htmlFor="name">Name</Label>
                        <Input
                          className="p-1"
                          id="name"
                          placeholder="Name..."
                          value={name}
                          onChange={(e) => setName(e.target.value)}
                        />
                      </div>
                    </CardContent>
                  </Card>
                </form>
                <Card>
                  <CardHeader className="p-0 rounded-2xl pb-3 flex flex-row justify-between items-center gap-2">
                    <div className="flex flex-col relative w-full">
                      <Image
                        src={back}
                        alt="background"
                        className="w-full aspect-[4/1] flex-shrink-0 rounded-t-lg"
                      />
                      <Avatar className="w-24 h-24 md:w-36 p-2 bg-background border-3 border-background md:-mt-16 md:h-36 ml-5 -mt-12">
                        <AvatarImage src="" />
                        <AvatarFallback>
                          <Building2 className="w-20 opacity-70 h-20 p-5" />
                        </AvatarFallback>
                      </Avatar>
                    </div>
                  </CardHeader>
                  <CardContent className="flex justify-between items-start gap-3">
                    <div className="flex flex-col gap-1 md:px-4 pt-0 pb-3">
                      <h3 className="md:text-2xl text-xl pb-2 font-semibold">
                        Professional Profile
                      </h3>
                      <span className="text-sm">
                        MERN FULL STACK WEB DEVELOPER || React || Node.js ||
                        MongoDB
                      </span>
                      <div className="flex justify-start items-center gap-2">
                        <h3 className="text-opacity-50 text-sm -mt-1 opacity-50">
                          Maharashtra, India
                        </h3>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </section>
          ) : (
            <section className="flex flex-col justify-center items-center gap-10">
              <div className="text-2xl font-extralight">
                Create a new Company
              </div>
              <div className="flex justify-center items-center w-full flex-wrap gap-5">
                <Card
                  className="min-w-64 hover:cursor-pointer"
                  onClick={() => setCreate(true)}
                >
                  <CardContent className="p-6 flex justify-center items-center flex-col">
                    <Building2 className="w-12 h-12 opacity-70" />
                    <h2 className="font-semibold text-center text-xl my-2">
                      Company
                    </h2>
                    <div className="font-normal text-center text-sm">
                      Create a new company
                    </div>
                  </CardContent>
                </Card>
              </div>
            </section>
          )}
        </div>
      </main>
    </>
  );
}

export default Page;
