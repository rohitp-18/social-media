"use client";

import JobForm from "@/components/jobs/jobForm";
import { PrimaryLoader } from "@/components/loader";
import { Button } from "@/components/ui/button";
import Navbar from "@/components/userNavbar";
import { getSingleCompany } from "@/store/company/companySlice";
import { resetJob } from "@/store/jobs/jobSlice";
import { AppDispatch, RootState } from "@/store/store";
import { useRouter, useSearchParams } from "next/navigation";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "sonner";

function Page() {
  const [isAdmin, setIsAdmin] = useState(false);

  const searchParams = useSearchParams();
  const router = useRouter();
  const { company } = useSelector((state: RootState) => state.company);
  const { user } = useSelector((state: RootState) => state.user);
  const { created, loading, error, job } = useSelector(
    (state: RootState) => state.jobs
  );
  const dispatch = useDispatch<AppDispatch>();

  useEffect(() => {
    if (!searchParams.get("company")) {
      if (!company?._id) {
        router.push("/jobs");
      }
      return;
    }
    if (company && company?._id === searchParams.get("company")) {
      setIsAdmin(company.admin.some((admin) => admin === user?._id));
    }
    if (
      searchParams.get("company") &&
      company?._id !== searchParams.get("company")
    ) {
      dispatch(getSingleCompany(searchParams.get("company") as string));
    }
  }, [searchParams, company, user, dispatch, router]);

  useEffect(() => {
    if (created && !loading && job) {
      toast.success("Job created successfully", {
        position: "top-center",
      });
      router.push(`/jobs/${job._id}`);
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

  if (
    company &&
    company._id === searchParams.get("company") &&
    company.admin.some((admin) => admin !== user?._id)
  ) {
    return (
      <div className="flex items-center justify-center h-screen">
        <h1 className="text-2xl font-bold">
          You are not authorized to create a job
        </h1>
        <div className="mt-4">
          <Button onClick={() => router.back()}>Go Back</Button>
          <Button onClick={() => router.push(`/company/create`)}>
            Create Company
          </Button>
        </div>
      </div>
    );
  }

  return (
    <>
      <Navbar />
      {isAdmin && company ? (
        <JobForm companyId={company._id} />
      ) : (
        <PrimaryLoader />
      )}
    </>
  );
}

export default Page;
