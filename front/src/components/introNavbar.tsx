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
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import React, { useCallback, useEffect, useState } from "react";
import { Button } from "./ui/button";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/store/store";
import { Input } from "./ui/input";
import Link from "next/link";
import { SocialPost } from "@/assets/icons";
import {
  createSearchHistoryAction,
  getAllSearchHistoryAction,
} from "@/store/history/searchHistory";

const Navbar: React.FC = () => {
  const [search, setSearch] = useState("");
  const [searchDrop, setSearchDrop] = useState(false);
  const [open, setOpen] = useState(false);

  const dispatch = useDispatch<AppDispatch>();
  const pathname = usePathname();
  const { setTheme, theme } = useTheme();
  const router = useRouter();
  const param = useSearchParams();

  const { user, loading } = useSelector((state: RootState) => state.user);
  const { history } = useSelector((state: RootState) => state.searchHistory);

  const searchCall = useCallback(
    (e: any) => {
      if (e.key === "Enter" && search.trim()) {
        dispatch(createSearchHistoryAction(search));

        router.push(`/search?q=${encodeURIComponent(search.trim())}`);
      }
    },
    [search, open, searchDrop]
  );

  useEffect(() => {
    if (param.get("q")) {
      setSearch(param.get("q") || "");
    }
  }, [param]);

  const HistoryRender = () => (
    <div className="absolute top-full left-0 w-full z-10 mt-1 bg-white rounded-md border shadow-md max-h-60 overflow-y-auto">
      {history.length === 0 ? (
        <div className="py-2 px-3 text-sm text-gray-500">No result found.</div>
      ) : (
        <div className="max-h-60">
          {history.map((q: any) => (
            <div
              key={q._id}
              onClick={() => {
                setSearch(q.query);
                router.push(`/search?q=${q.query}`);
              }}
              className="cursor-pointer hover:bg-gray-100 p-2 text-sm text-gray-800 flex items-center gap-1"
            >
              {q.query}
            </div>
          ))}
        </div>
      )}
    </div>
  );

  return (
    <nav className="sticky top-0 z-50 left-0 w-full bg-opacity-20 backdrop-blur-md shadow-md p-2 flex justify-between items-center bg-background/50 dark:shadow-lg">
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
              onKeyDown={(e) => searchCall(e)}
              onFocusCapture={() => {
                setOpen(true);
              }}
              onBlur={() => {
                setTimeout(() => {
                  setOpen(false);
                }, 300);
              }}
            />
            {open && search && <HistoryRender />}
          </div>
          <Search
            onClick={() => setSearchDrop(!searchDrop)}
            className="md:hidden block w-5 h-5 cursor-pointer"
          />
        </div>
        <div className="flex items-center gap-2 lg:gap-5 space-x-3 md:space-x-6">
          <Link
            href="/"
            className={`no-underline hover:underline flex flex-col items-center ${
              pathname === "/" ? "font-bold" : ""
            }`}
          >
            <Home className="w-[1rem] h-[1rem]" />
            <span className="md:block hidden text-sm">Home</span>
          </Link>
          <Link
            href="/intro/users"
            className={`no-underline hover:underline flex flex-col items-center ${
              pathname === "/intro/users" ? "font-bold" : ""
            }`}
          >
            <Users className="w-[1rem] h-[1rem]" />
            <span className="md:block hidden text-sm">Users</span>
          </Link>
          <Link
            href="/intro/posts"
            className={` no-underline hover:underline flex flex-col items-center ${
              pathname === "/intro/posts" ? "font-bold" : ""
            }`}
          >
            <SocialPost className="w-[1rem] h-[1rem]" />
            <span className="md:block hidden text-sm">Posts</span>
          </Link>
          <Link
            href="/intro/jobs"
            className={` no-underline hover:underline flex flex-col items-center ${
              pathname === "/intro/jobs" ? "font-bold" : ""
            }`}
          >
            <BriefcaseBusiness className="w-[1rem] h-[1rem]" />
            <span className="md:block hidden text-sm">Jobs</span>
          </Link>
          {user ? (
            <Link
              href={`/u/${user.username}/`}
              className={` no-underline hover:underline flex flex-col items-center ${
                pathname === `/u/${user.username}/` ? "font-bold" : ""
              }`}
            >
              <User2 className="w-[1rem] h-[1rem]" />
              <span className="md:block hidden text-sm">Account</span>
            </Link>
          ) : (
            <div className="flex gap-4">
              <Link
                href={`/register?back=${pathname}`}
                className="no-underline md:block hidden"
              >
                <Button
                  className="h-8 rounded-md px-3 text-xs md:h-9 md:text-sm md:px-4 md:py-2"
                  variant={"outline"}
                >
                  Join with Us
                </Button>
              </Link>
              <Link href={`/login?back=${pathname}`} className="no-underline">
                <Button className="h-8 rounded-md px-3 text-xs md:h-9 md:text-sm md:px-4 md:py-2">
                  Sign In
                </Button>
              </Link>
            </div>
          )}
          <Button
            variant={"outline"}
            size={"icon"}
            style={{ margin: "10px" }}
            className="xs:inline-flex hidden relative"
            onClick={() =>
              theme === "light" ? setTheme("dark") : setTheme("light")
            }
          >
            <Moon className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
            <Sun className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
          </Button>
        </div>
      </section>
      <div className="md:hidden block">
        {searchDrop && (
          <div className="absolute top-16 left-0 w-full z-50 bg-background backdrop-blur-md shadow-md p-4">
            <Search className="absolute top-6 left-7 h-5 w-5 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-10 w-full"
              onKeyDown={(e) => searchCall(e)}
              onFocusCapture={() => {
                setOpen(true);
              }}
              onBlur={() => {
                setTimeout(() => {
                  setOpen(false);
                }, 300);
              }}
            />
            {open && search && <HistoryRender />}
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
