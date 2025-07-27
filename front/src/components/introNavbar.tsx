"use client";

import {
  BriefcaseBusiness,
  DollarSign,
  Home,
  Moon,
  Newspaper,
  Plus,
  Search,
  Sun,
  User2,
  Users,
} from "lucide-react";
import { useTheme } from "next-themes";
import { usePathname, useRouter } from "next/navigation";
import React from "react";
import { Button } from "./ui/button";
import { useSelector } from "react-redux";
import { RootState } from "@/store/store";
import { Input } from "./ui/input";
import Link from "next/link";
import { SocialPost } from "@/assets/icons";

const Navbar: React.FC = () => {
  const [search, setSearch] = React.useState("");
  const [searchDrop, setSearchDrop] = React.useState(false);

  const pathname = usePathname();
  const { setTheme, theme } = useTheme();
  const router = useRouter();

  const { user, loading } = useSelector((state: RootState) => state.user);

  return (
    <nav className="sticky top-0 z-50 left-0 w-full bg-opacity-20 backdrop-blur-md shadow-md p-4 flex justify-between items-center bg-background/40 dark:shadow-lg">
      <section className="max-w-6xl mx-auto flex items-center justify-between w-full space-x-4">
        <div className="flex gap-4 items-center">
          <h2 className="text-2xl font-bold italic">TS</h2>
          <div className="md:flex hidden items-center relative max-w-xs">
            <Search className="absolute left-3 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-10 w-full"
              onKeyDown={(e) =>
                e.key === "Enter" &&
                search.trim() &&
                router.push(`/search?q=${encodeURIComponent(search.trim())}`)
              }
            />
          </div>
          <Search
            onClick={() => setSearchDrop(!searchDrop)}
            className="md:hidden block w-5 h-5 cursor-pointer"
          />
        </div>
        <div className="flex gap-5 space-x-6">
          <Link
            href="/"
            className={`no-underline hover:underline flex flex-col items-center ${
              pathname === "/" ? "font-bold" : ""
            }`}
          >
            <Home className="w-[1rem] h-[1rem]" /> Home
          </Link>
          <Link
            href="/intro/users"
            className={`no-underline hover:underline flex flex-col items-center ${
              pathname === "/intro/users" ? "font-bold" : ""
            }`}
          >
            <Users className="w-[1rem] h-[1rem]" /> Users
          </Link>
          <Link
            href="/intro/posts"
            className={` no-underline hover:underline flex flex-col items-center ${
              pathname === "/intro/posts" ? "font-bold" : ""
            }`}
          >
            <SocialPost className="w-[1rem] h-[1rem]" /> Posts
          </Link>
          <Link
            href="/intro/jobs"
            className={` no-underline hover:underline flex flex-col items-center ${
              pathname === "/intro/jobs" ? "font-bold" : ""
            }`}
          >
            <BriefcaseBusiness className="w-[1rem] h-[1rem]" /> Jobs
          </Link>
          {user ? (
            <Link
              href={`/u/${user.username}/`}
              className={` no-underline hover:underline flex flex-col items-center ${
                pathname === `/u/${user.username}/` ? "font-bold" : ""
              }`}
            >
              <User2 className="w-[1rem] h-[1rem]" /> Account
            </Link>
          ) : (
            <div className="flex gap-4">
              <Link
                href={`/register?back=${pathname}`}
                className="no-underline"
              >
                <Button variant={"outline"}>Join with Us</Button>
              </Link>
              <Link href={`/login?back=${pathname}`} className="no-underline">
                <Button>Sign In</Button>
              </Link>
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
      <div className="md:hidden block w-full">
        {searchDrop && (
          <div className="absolute top-16 left-0 w-full z-50 bg-background backdrop-blur-md shadow-md p-4">
            <Input
              type="search"
              placeholder="Search..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-10 w-full"
              onKeyDown={(e) =>
                e.key === "Enter" &&
                search.trim() &&
                router.push(`/search?q=${encodeURIComponent(search.trim())}`)
              }
            />
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
