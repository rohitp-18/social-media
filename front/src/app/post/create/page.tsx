"use client";

import { PrimaryLoader } from "@/components/loader";
import PostForm from "@/components/postComponents/postForm";
import { Button } from "@/components/ui/button";
import Navbar from "@/components/userNavbar";
import { getSingleCompany } from "@/store/company/companySlice";
import { getSingleGroup } from "@/store/group/groupSlice";
import { AppDispatch, RootState } from "@/store/store";
import { clearError, resetPosts } from "@/store/utils/postSlice";
import { useRouter, useSearchParams } from "next/navigation";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "sonner";

function Page() {
  const [isAdmin, setIsAdmin] = useState(false);
  const [isMember, setIsMember] = useState(false);
  const [type, setType] = useState("");
  const [target, setTarget] = useState("");

  const searchParams = useSearchParams();
  const router = useRouter();
  const { company } = useSelector((state: RootState) => state.company);
  const { group, users } = useSelector((state: RootState) => state.group);
  const { user } = useSelector((state: RootState) => state.user);
  const { created, loading, error, post } = useSelector(
    (state: RootState) => state.posts
  );
  const dispatch = useDispatch<AppDispatch>();

  useEffect(() => {
    if (!searchParams.get("company") && !searchParams.get("group")) {
      router.back();
      return;
    }
    if (company && company?._id === searchParams.get("company")) {
      if (company.admin.some((admin: any) => admin._id === user?._id)) {
        setIsAdmin(true);
        setType("company");
        setTarget(company._id);
      } else {
        router.push(`/company/${company._id}`);
      }
    }
    if (searchParams.get("group") && group?._id === searchParams.get("group")) {
      if (users.admin.some((admin: any) => admin._id === user?._id)) {
        setIsAdmin(true);
        setType("group");
        setTarget(group._id);
      } else if (
        users.members.some((member: any) => member._id === user?._id)
      ) {
        setIsMember(true);
        setType("group");
        setTarget(group._id);
      } else {
        router.push(`/group/${group._id}`);
      }
    }
    if (
      searchParams.get("company") &&
      company?._id !== searchParams.get("company")
    ) {
      dispatch(getSingleCompany(searchParams.get("company") as string));
    }
    if (searchParams.get("group") && group?._id !== searchParams.get("group")) {
      dispatch(getSingleGroup(searchParams.get("group") as string));
    }
  }, [searchParams, company, user, dispatch, router]);

  return (
    <>
      <Navbar />
      {(isAdmin || isMember) && target && type ? (
        <PostForm
          type={searchParams.get("group") ? "group" : "company"}
          target={
            searchParams.get("company")
              ? (searchParams.get("company") as string)
              : (searchParams.get("group") as string)
          }
        />
      ) : (
        <PrimaryLoader />
      )}
    </>
  );
}

export default Page;
