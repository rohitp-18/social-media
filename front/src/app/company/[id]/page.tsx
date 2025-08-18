"use client";

import React, { useEffect, useMemo, useState } from "react";
import Navbar from "@/components/userNavbar";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { User2, Edit2, MoreHorizontal, Plus } from "lucide-react";
import Image from "next/image";
import back from "@/assets/back.png";
import { Button } from "@/components/ui/button";
import Sidebar from "@/components/sidebar";
import { useParams, usePathname } from "next/navigation";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import CompanyTabs from "./companyTabs";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/store/store";
import { getSingleCompany } from "@/store/company/companySlice";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import Link from "next/link";
import { PrimaryLoader } from "@/components/loader";
import CompanyProfile from "@/components/company/companyProfile";

function Page() {
  const [tab, setTab] = useState("");

  const { id } = useParams();
  const pathname = usePathname();
  const dispatch = useDispatch<AppDispatch>();
  const { company, loading, error } = useSelector(
    (state: RootState) => state.company
  );

  useEffect(() => {
    setTab(pathname.split("tab=")[1] || "Home");
  }, [pathname]);

  useEffect(() => {
    dispatch(getSingleCompany(id as string));
  }, [id]);

  return (
    <>
      <Navbar />
      {company ? (
        <main className="bg-[#f2f6f8] dark:bg-[#151515] w-full overflow-hidden py-5">
          <div className="container max-w-[1170px] mx-auto">
            {/* <section className="flex mx-auto max-w-7xl justify-center gap-2"> */}
            <section className="md:grid grid-cols-[1fr_300px] block mx-auto max-w-7xl min-h-screen gap-3">
              <section className="min-h-screen max-w-[860px] overflow-hidden w-full flex flex-col gap-5 flex-grow-0">
                {/* profile card */}
                <CompanyProfile tab={tab} setTab={setTab} />
                <CompanyTabs tab={tab} />
              </section>
              <Sidebar />
              <section></section>
            </section>
          </div>
        </main>
      ) : loading ? (
        <PrimaryLoader />
      ) : (
        <div className="flex flex-col justify-center items-center h-screen space-y-4">
          <h1 className="text-3xl font-bold text-red-600">
            {error || "Company not found"}
          </h1>
          <p className="text-base text-gray-700 dark:text-gray-300">
            We couldn’t locate the company you were looking for. Please check
            the ID or create a new one.
          </p>
          <Link href="/company/new">
            <Button variant="outline" className="mt-2">
              Create Company
            </Button>
          </Link>
        </div>
      )}
    </>
  );
}

export default Page;
