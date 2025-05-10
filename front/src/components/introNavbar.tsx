"use client";

import {
  BriefcaseBusiness,
  DollarSign,
  Home,
  Moon,
  Newspaper,
  Plus,
  Sun,
  User2,
  Users,
} from "lucide-react";
import { useTheme } from "next-themes";
import { usePathname } from "next/navigation";
import React from "react";
import { Button } from "./ui/button";
import { useSelector } from "react-redux";
import { RootState } from "@/store/store";

const Navbar: React.FC = () => {
  const pathname = usePathname();
  const { setTheme, theme } = useTheme();

  const { user, loading } = useSelector((state: RootState) => state.user);

  return (
    <nav className="sticky top-0 z-50 left-0 w-full bg-opacity-20 backdrop-blur-md shadow-md p-4 flex justify-between items-center bg-background/40 dark:shadow-lg">
      <section className="max-w-6xl mx-auto flex items-center justify-between w-full space-x-4">
        <h2 className="text-xl font-bold italic">TS</h2>
        <div className="flex gap-5 space-x-6">
          <a
            href="/"
            className={`no-underline hover:underline flex flex-col items-center ${
              pathname === "/" ? "font-bold" : ""
            }`}
          >
            <Home className="w-[1rem] h-[1rem]" /> Home
          </a>
          <a
            href="/new"
            className={`no-underline hover:underline flex flex-col items-center ${
              pathname === "/new" ? "font-bold" : ""
            }`}
          >
            <Users className="w-[1rem] h-[1rem]" /> Users
          </a>
          <a
            href="/transactions"
            className={` no-underline hover:underline flex flex-col items-center ${
              pathname === "/transactions" ? "font-bold" : ""
            }`}
          >
            <Newspaper className="w-[1rem] h-[1rem]" /> Articles
          </a>
          <a
            href="/transactions"
            className={` no-underline hover:underline flex flex-col items-center ${
              pathname === "/transactions" ? "font-bold" : ""
            }`}
          >
            <BriefcaseBusiness className="w-[1rem] h-[1rem]" /> Jobs
          </a>
          {user ? (
            <a
              href={`/u/${user.username}/`}
              className={` no-underline hover:underline flex flex-col items-center ${
                pathname === `/u/${user.username}/` ? "font-bold" : ""
              }`}
            >
              <User2 className="w-[1rem] h-[1rem]" /> Account
            </a>
          ) : (
            <div className="flex gap-4">
              <a href="/register?back=/" className="no-underline">
                <Button variant={"outline"}>Join with Us</Button>
              </a>
              <a href="/login?back=/" className="no-underline">
                <Button>Sign In</Button>
              </a>
            </div>
          )}
          <Button
            variant={"outline"}
            size={"icon"}
            onClick={() =>
              theme === "light" ? setTheme("dark") : setTheme("light")
            }
          >
            <Moon className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
            <Sun className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
          </Button>
        </div>
      </section>
    </nav>
  );
};

export default Navbar;
