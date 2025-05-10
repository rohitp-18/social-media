"use client";

import ExperienceForm from "@/components/experienceForm";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { DropdownMenuContent } from "@radix-ui/react-dropdown-menu";
import {
  Diamond,
  Edit2,
  MoreVertical,
  MoveLeft,
  Plus,
  Users2,
} from "lucide-react";
import React, { Fragment, useState } from "react";
import Wrapper from "../_wrapper";

function Page() {
  const [select, setSelect] = useState<any>(null);
  const [open, setOpen] = useState(false);
  const [deleteE, setDeleteE] = useState(false);
  return (
    <Wrapper>
      <Card className="">
        <CardHeader className="flex flex-row justify-between items-center gap-5">
          <div className="flex items-center md:gap-6 gap-4">
            <MoveLeft className="w-5 h-5 hover:cursor-pointer opacity-80 hover:opacity-100" />

            <CardTitle className="font-semibold text-lg">Experience</CardTitle>
          </div>

          <DropdownMenu>
            <DropdownMenuTrigger className="focus-visible:outline-none">
              <Plus className="w-5 h-5 opacity-80 hover:opacity-100" />
            </DropdownMenuTrigger>
            <DropdownMenuContent className="shadow-md">
              <DropdownMenuGroup>
                <DropdownMenuItem>
                  <Plus className="w-5 h-5" />
                  <span className="">Add Experience</span>
                </DropdownMenuItem>
              </DropdownMenuGroup>
            </DropdownMenuContent>
          </DropdownMenu>
        </CardHeader>
        <CardContent className="flex flex-col gap-3">
          <div className="flex justify-between items-start">
            <div className="flex justify-start items-start gap-3">
              <Avatar className="w-16 h-16">
                <AvatarImage src="" />
                <AvatarFallback>
                  <Users2 className="w-10 h-10 opacity-80" />
                </AvatarFallback>
              </Avatar>
              <div className="flex flex-col justify-start">
                <h3 className="font-semibold text-base leading-tight">
                  Post Name
                </h3>
                <div className="text-sm opacity-70 leading-none flex items-center gap-1">
                  <span className="">Company Name</span>
                  <span className="text-sm flex items-center">- Intership</span>
                </div>
                <div className="text-xs opacity-50 leading-none flex items-center gap-2">
                  <span>Mar 2025 - Present</span>
                </div>
                <div className="text-xs opacity-60 flex items-center gap-2">
                  <span>Remote</span>
                </div>
                <p className="text-sm py-4 opacity-90 line-clamp-2 overflow-hidden text-ellipsis">
                  Lorem ipsum dolor sit amet consectetur adipisicing elit.
                  Nostrum doloribus placeat omnis? Excepturi, optio! Maxime
                  delectus ea facilis exercitationem officiis.
                </p>
                <div className="flex justify-start px-3 py-2 -mt-2 items-center gap-2">
                  <Diamond className="w-5 stroke-2 h-5" />
                  <div className="flex gap-2 text-base">
                    {[0, 1, 2].map((_, i) => (
                      <span
                        key={i}
                        className="text-sm font-semibold opacity-80"
                      >
                        skill
                        {i !== 2 && ","}
                      </span>
                    ))}
                    <span className="text-sm opacity-80 font-semibold">
                      3 more skills
                    </span>
                  </div>
                </div>
              </div>
            </div>
            <DropdownMenu>
              <DropdownMenuTrigger className="focus-visible:outline-none">
                <MoreVertical className="h-5 w-5" />
              </DropdownMenuTrigger>
              <DropdownMenuContent className="mt-2 p-2 bg-background rounded-lg shadow-lg">
                <DropdownMenuGroup>
                  <DropdownMenuItem onClick={() => setOpen(true)}>
                    <Edit2 className="w-1.5 h-1.5" />
                    <span className="text-sm">Edit</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setDeleteE(true)}>
                    <Edit2 className="w-1.5 h-1.5" />
                    <span className="text-sm">Delete</span>
                  </DropdownMenuItem>
                </DropdownMenuGroup>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
          <hr />
        </CardContent>
      </Card>
    </Wrapper>
  );
}

export default Page;
