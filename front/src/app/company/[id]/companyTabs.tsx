import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuGroup,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  DropdownMenuContent,
  DropdownMenuItem,
} from "@radix-ui/react-dropdown-menu";
import { Bell, MoreHorizontal } from "lucide-react";
import React from "react";

function CompanyTabs({ tab }: { tab: string }) {
  return (
    <>
      {tab == "About" && (
        <>
          <section className="">
            <Card>
              <CardHeader>
                <CardTitle>Overview</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>
                  Lorem ipsum dolor sit, amet consectetur adipisicing elit.
                  Nihil, aspernatur! Asperiores, voluptatibus ut ratione
                  necessitatibus accusamus laudantium ad delectus, dolor
                  deserunt aspernatur corrupti! Doloribus quas voluptatum
                  numquam iure molestias quidem ut ratione facere suscipit
                  maxime vel est quae optio enim harum cupiditate repellendus
                  dolorum et soluta id quod, aspernatur minus excepturi dolore.
                  Nam, odio sed necessitatibus officiis saepe molestias id
                  recusandae, itaque similique ipsa nihil commodi aperiam,
                  deserunt quae numquam veniam voluptate aliquam velit.
                  Explicabo accusamus dolorum amet beatae nostrum?
                </CardDescription>
                <div className="flex flex-col mt-4 gap-3">
                  <div className="">
                    <h3 className="text-sm font-semibold">Website</h3>
                    <p className="text-sm opacity-60 font-normal">
                      https://xyz.com
                    </p>
                  </div>
                  <div className="">
                    <h3 className="text-sm font-semibold">Company size</h3>
                    <p className="text-sm opacity-60 font-normal">
                      {1000} employess <br />
                      {10000}members
                    </p>
                  </div>
                  <div className="">
                    <h3 className="text-sm font-semibold">HeadQuater</h3>
                    <p className="text-sm opacity-60 font-normal">
                      Maharashtra, India
                    </p>
                  </div>
                  <div className="">
                    <h3 className="text-sm font-semibold">Industry</h3>
                    <p className="text-sm opacity-60 font-normal">
                      IT Industry
                    </p>
                  </div>
                  <div className="">
                    <h3 className="text-sm font-semibold">Specilized</h3>
                    <p className="text-sm opacity-60 font-normal">
                      Web developement, Mobile app developement, SAAS, IoS app
                      developement
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </section>
        </>
      )}
      {tab == "Jobs" && (
        <section className="flex flex-col gap-5">
          <Card>
            <CardHeader className="flex flex-row justify-between p-4 items-center">
              <CardTitle className="text-base flex items-center">
                <Bell className="fill-foreground inline-block mr-3 text-base w-4 h-4" />
                Create Job Alert
              </CardTitle>
              <Button
                className="hover:bg-background hover:text-primary"
                variant={"default"}
              >
                Create Job Alert
              </Button>
            </CardHeader>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle className="">Recommended Jobs for you</CardTitle>
              <p className="text-sm opacity-80">Based on your profile</p>
            </CardHeader>
            <CardContent
              style={{ scrollbarWidth: "none" }}
              className="flex gap-3 overflow-auto"
            >
              {[0, 1, 2, 3, 4].map((i) => (
                <Card
                  key={i}
                  className="max-w-60 flex p-3 shrink-0 justify-between items-start"
                >
                  <CardContent className="p-2">
                    <Avatar className="w-20 h-20">
                      <AvatarImage src="" />
                      <AvatarFallback>C</AvatarFallback>
                    </Avatar>
                    <h2 className="font-semibold pt-3 text-base">
                      Frontend Developer
                    </h2>
                    <p className="text-sm opacity-80">
                      Company <br />
                      Pune
                    </p>
                    <p className="pt-7 text-xs opacity-70">3 days ago</p>
                  </CardContent>
                  <DropdownMenu>
                    <DropdownMenuTrigger className="hover:bg-foreground/5 p-2 rounded-full">
                      <MoreHorizontal className="w-4 h-4" />
                    </DropdownMenuTrigger>
                    <DropdownMenuContent className="shadow-md">
                      <DropdownMenuGroup>
                        <DropdownMenuItem>
                          <DropdownMenuLabel>Apply</DropdownMenuLabel>
                        </DropdownMenuItem>
                      </DropdownMenuGroup>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </Card>
              ))}
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle className="">Recently posted jobs</CardTitle>
            </CardHeader>
            <CardContent
              style={{ scrollbarWidth: "none" }}
              className="flex gap-3 overflow-auto"
            >
              {[0, 1, 2, 3, 4].map((i) => (
                <Card
                  key={i}
                  className="max-w-60 flex p-3 shrink-0 justify-between items-start"
                >
                  <CardContent className="p-2">
                    <Avatar className="w-20 h-20">
                      <AvatarImage src="" />
                      <AvatarFallback>C</AvatarFallback>
                    </Avatar>
                    <h2 className="font-semibold pt-3 text-base">
                      Frontend Developer
                    </h2>
                    <p className="text-sm opacity-80">
                      Company <br />
                      Pune
                    </p>
                    <p className="pt-7 text-xs opacity-70">3 days ago</p>
                  </CardContent>
                  <DropdownMenu>
                    <DropdownMenuTrigger className="hover:bg-foreground/5 p-2 rounded-full">
                      <MoreHorizontal className="w-4 h-4" />
                    </DropdownMenuTrigger>
                    <DropdownMenuContent className="shadow-md">
                      <DropdownMenuGroup>
                        <DropdownMenuItem>
                          <DropdownMenuLabel>Apply</DropdownMenuLabel>
                        </DropdownMenuItem>
                      </DropdownMenuGroup>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </Card>
              ))}
            </CardContent>
          </Card>
        </section>
      )}
    </>
  );
}

export default CompanyTabs;
