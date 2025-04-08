import React from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
} from "./ui/card";
import {
  Heart,
  MessageCircleMoreIcon,
  MoreVerticalIcon,
  Share2Icon,
  User,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { DropdownMenuItem } from "@radix-ui/react-dropdown-menu";
import { cn } from "@/lib/utils";

interface PostInter {
  cardClass?: string;
}

function Post({ cardClass }: PostInter) {
  return (
    // <Card className="card max-w-[500px] border border-1 border-zinc-800 justify-center items-center bg-card text-card-foreground">
    <Card className={cn("w-[500px]", cardClass)}>
      <CardHeader className="flex flex-row justify-between items-center gap-2 py-4">
        <div className="flex items-center gap-3">
          <div className="bg-zinc-200 rounded-full p-2">
            <User className="w-8 h-8" />
          </div>
          <div>
            <h2 className="font-semibold text-lg">Rohit Patil</h2>
            <p className="text-sm opacity-90">full stack web developer</p>
          </div>
        </div>
        <DropdownMenu>
          <DropdownMenuTrigger>
            <MoreVerticalIcon className="h-5 w-5" />
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuItem>Hello</DropdownMenuItem>
            <DropdownMenuItem>Hello</DropdownMenuItem>
            <DropdownMenuItem>Hello</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </CardHeader>
      <hr />
      <CardContent className="py-6">
        <CardDescription className="text-opacity-90">
          Lorem ipsum, dolor sit amet consectetur adipisicing elit.
          Exercitationem accusantium dolorum eaque, eveniet veritatis quaerat
          vitae maxime fugit assumenda dolorem ab impedit eos sed excepturi
          quasi libero. Facilis, reprehenderit error.
        </CardDescription>
      </CardContent>
      <hr className="pt-3 pb-1" />
      <CardFooter className="pb-3">
        <div className="flex w-full justify-between">
          <div className="flex-col gap-1 items-center flex">
            <Heart className="h-5 w-5" />
            <h4 className="text-base">Like</h4>
          </div>
          <div className="flex-col gap-1 items-center flex">
            <MessageCircleMoreIcon className="h-5 w-5" />
            <h4 className="text-base">Comment</h4>
          </div>
          <div className="flex-col gap-1 items-center flex">
            <Share2Icon className="h-5 w-5" />
            <h4 className="text-base">Share</h4>
          </div>
          <div className="flex-col gap-1 items-center flex">
            <Heart className="h-5 w-5" />
            <h4 className="text-base">Like</h4>
          </div>
        </div>
      </CardFooter>
    </Card>
  );
}

export default Post;
