"use client";

import {
  Bell,
  ChevronDown,
  Home,
  MessageCircleMore,
  Moon,
  Newspaper,
  Search,
  Sun,
  User2,
  Users,
} from "lucide-react";
import { useTheme } from "next-themes";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import {
  DropdownMenu,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { DropdownMenuContent } from "@radix-ui/react-dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/store/store";
import { clearError, logout, resetUser } from "@/store/user/userSlice";
import { toast } from "sonner";
import Link from "next/link";
import { isAxiosError } from "axios";
import {
  createSearchHistoryAction,
  getAllSearchHistoryAction,
} from "@/store/history/searchHistory";
import { Badge } from "./ui/badge";
import { getAllInvitationsCount } from "@/store/user/notificationSlice";
import { removePushSubscription } from "./notificationMiddle";

const Navbar: React.FC = () => {
  const pathname = usePathname();
  const { setTheme, theme } = useTheme();
  const param = useSearchParams();

  const [drop, setDrop] = useState(false);
  const [search, setSearch] = useState<string>("");
  const [searchDrop, setSearchDrop] = useState(false);
  const [open, setOpen] = useState(false);

  const router = useRouter();
  const dispatch = useDispatch<AppDispatch>();
  const {
    user,
    logout: logout2,
    error,
  } = useSelector((state: RootState) => state.user);
  const { history } = useSelector((state: RootState) => state.searchHistory);
  const { totalInvitations, totalNotifications, totalChats } = useSelector(
    (state: RootState) => state.notification
  );

  const searchCall = useCallback(
    (e: any) => {
      if (e.key === "Enter" && search.trim()) {
        dispatch(createSearchHistoryAction(search));

        router.push(`/search?q=${encodeURIComponent(search.trim())}`);
      }
    },
    [search, open, searchDrop]
  );

  async function logoutAction() {
    await removePushSubscription(dispatch);
    dispatch(logout());
  }

  useEffect(() => {
    if (search) {
      dispatch(getAllSearchHistoryAction(search));
    }
  }, [search]);

  useEffect(() => {
    if (param.get("q")) {
      setSearch(param.get("q") || "");
    }
  }, [param]);

  useEffect(() => {
    if (logout2) {
      toast.success("Logout successfully", { position: "top-center" });
      dispatch(resetUser());
      router.push("/login");
    }
    if (error) {
      toast.success(
        isAxiosError(error)
          ? error.response?.data.message
          : "Something went wrong",
        { position: "top-center" }
      );
      dispatch(clearError());
    }
  }, [logout2, error]);

  useEffect(() => {
    user && dispatch(getAllInvitationsCount());
  }, [dispatch, user]);

  const HistoryRender = () => (
    <div className="absolute top-full left-0 w-full z-10 mt-1 bg-white rounded-md border shadow-md max-h-60 overflow-y-auto">
      {history.length === 0 ? (
        <div className="py-2 px-3 text-sm text-gray-500">No result found.</div>
      ) : (
        <div className="max-h-60">
          {history.map((q: any) => (
            <div
              key={q._id}
              onMouseDown={(e) => {
                e.preventDefault();
                e.stopPropagation();
                setSearch(q.query);
                setTimeout(() => {
                  router.push(`/search?q=${encodeURIComponent(q.query)}`);
                }, 0);
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
    <nav className="sticky h-[70px] top-0 z-50 left-0 w-full border text-card-foreground bg-opacity-20 backdrop-blur-md shadow-md p-2 pt-3 flex flex-col justify-between bg-background/40 dark:shadow-lg">
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
            href="/feed"
            className={`no-underline hover:underline flex flex-col items-center ${
              pathname === "/feed" ? "font-bold" : ""
            }`}
          >
            <Home className="w-[1rem] h-[1rem]" />
            <span className="md:block hidden text-sm"> Feed</span>
          </Link>
          <Link
            href="/network"
            className={`no-underline hover:underline flex relative flex-col items-center w-fit ${
              pathname === "/network" ? "font-bold" : ""
            }`}
          >
            <div className="inline-block relative">
              {totalInvitations > 0 && (
                <Badge className="absolute -top-2.5 -right-2.5 h-5 min-w-5 rounded-full px-1 tabular-nums">
                  {totalInvitations}
                </Badge>
              )}
            </div>
            <Users className="w-[1rem] h-[1rem]" />
            <span className="md:block hidden text-sm">Network</span>
          </Link>
          <Link
            href="/jobs"
            className={` no-underline hover:underline flex flex-col items-center ${
              pathname === "/jobs" ? "font-bold" : ""
            }`}
          >
            <Newspaper className="w-[1rem] h-[1rem]" />
            <span className="md:block hidden text-sm"> Jobs</span>
          </Link>
          <Link
            href="/chat"
            className={` no-underline hover:underline flex flex-col relative items-center ${
              pathname === "/chat" ? "font-bold" : ""
            }`}
          >
            <div className="inline-block relative">
              {totalChats > 0 && (
                <Badge className="absolute -top-2.5 -right-2.5 h-5 min-w-5 rounded-full px-1 tabular-nums">
                  {totalChats}
                </Badge>
              )}

              <MessageCircleMore className="w-[1rem] h-[1rem]" />
            </div>
            <span className="md:block hidden text-sm"> Messages</span>
          </Link>
          <Link
            href="/notification"
            className={` no-underline hover:underline flex flex-col relative items-center ${
              pathname === "/notification" ? "font-bold" : ""
            }`}
          >
            <div className="inline-block relative">
              {totalNotifications > 0 && (
                <Badge className="absolute -top-2.5 -right-2.5 h-5 min-w-5 rounded-full px-1 tabular-nums">
                  {totalNotifications}
                </Badge>
              )}
            </div>
            <Bell className="w-[1rem] h-[1rem]" />
            <span className="md:block hidden text-sm"> Notification</span>
          </Link>

          {user && (
            <DropdownMenu open={drop} onOpenChange={(open) => setDrop(open)}>
              <DropdownMenuTrigger className="focus-visible:outline-none flex justify-center items-center flex-col">
                <Avatar className="w-4.5 h-4.5 flex-shrink-0">
                  <AvatarImage src="" />
                  <AvatarFallback>
                    <User2 className="w-4 h-4 flex-shrink-0" />
                  </AvatarFallback>
                </Avatar>
                <span className="md:flex hidden items-center gap-1 text-sm">
                  You
                  <ChevronDown
                    className={`w-4 h-4 ${drop ? "rotate-180" : ""}`}
                  />
                </span>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56 mt-5 px-2 bg-background rounded-lg shadow-lg">
                <DropdownMenuGroup className="px-1 py-2">
                  <div className="flex items-center gap-3">
                    <Avatar className="flex-shrink-0">
                      <AvatarImage src={user.avatar?.url}></AvatarImage>
                      <AvatarFallback>
                        <User2 className="w-14 flex-shrink-0 p-2 h-14" />
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex flex-col items-start">
                      <h3 className="font-semibold text-base">{user.name}</h3>
                      <p className="opacity-70 text-sm leading-none">
                        {user.headline}
                      </p>
                    </div>
                  </div>
                  <Button
                    variant={"outline"}
                    onClick={() => router.push("/u/" + user.username)}
                    className="w-full mt-3 mb-1 border-primary py-2 h-7 px-3 text-primary"
                  >
                    View Profile
                  </Button>
                </DropdownMenuGroup>
                <hr />
                <DropdownMenuGroup>
                  <DropdownMenuItem>
                    <Link href="/setting">Setting & Privacy</Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <Link href="/terms">Terms & conditions</Link>
                  </DropdownMenuItem>
                </DropdownMenuGroup>
                <hr />
                <DropdownMenuGroup>
                  <DropdownMenuItem onClick={logoutAction}>
                    Sign Out
                  </DropdownMenuItem>
                </DropdownMenuGroup>
              </DropdownMenuContent>
            </DropdownMenu>
          )}

          <Button
            variant={"outline"}
            size={"icon"}
            className="xs:flex hidden"
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
