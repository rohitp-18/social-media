"use client";

import { PrimaryLoader } from "@/components/loader";
import PostForm from "@/components/postComponents/postForm";
import { Button } from "@/components/ui/button";
import Navbar from "@/components/userNavbar";
import { getSingleCompany } from "@/store/company/companySlice";
import { getSingleGroup } from "@/store/group/groupSlice";
import { resetJob } from "@/store/jobs/jobSlice";
import { AppDispatch, RootState } from "@/store/store";
import { useRouter, useSearchParams } from "next/navigation";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "sonner";

function Page() {
  const [isAdmin, setIsAdmin] = useState(false);
  const [type, setType] = useState("");
  const [target, setTarget] = useState("");

  const searchParams = useSearchParams();
  const router = useRouter();
  const { company } = useSelector((state: RootState) => state.company);
  const { group } = useSelector((state: RootState) => state.group);
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
      if (company.admin.some((admin) => admin === user?._id)) {
        setIsAdmin(true);
        setType("company");
        setTarget(company._id);
      } else {
        router.push(`/company/${company._id}`);
      }
    }
    if (searchParams.get("group") && group?._id === searchParams.get("group")) {
      if (group.admin.some((admin) => admin._id === user?._id)) {
        setIsAdmin(true);
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

  useEffect(() => {
    if (created && !loading && post) {
      toast.success("Post created successfully", {
        position: "top-center",
      });
      router.push(`/post/${post._id}`);
      dispatch(resetJob());
    }
    if (error && !loading) {
      toast.error(error, {
        position: "top-center",
      });
      dispatch(resetJob());
    }
  }, [created, loading, error, dispatch, router]);

  if (loading) {
    return <PrimaryLoader />;
  }

  return (
    <>
      <Navbar />
      {isAdmin && target && type ? (
        <PostForm
          type={searchParams.get("group") ? "group" : "company"}
          target={searchParams.get("company") as string}
        />
      ) : (
        <PrimaryLoader />
      )}
    </>
  );
}

export default Page;
