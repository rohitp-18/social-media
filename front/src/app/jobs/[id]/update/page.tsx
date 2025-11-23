"use client";

import JobForm from "@/components/jobs/jobForm";
import { PrimaryLoader } from "@/components/loader";
import { Button } from "@/components/ui/button";
import Navbar from "@/components/userNavbar";
import { getSingleCompany } from "@/store/company/companySlice";
import { getJobAction, resetJob } from "@/store/jobs/jobSlice";
import { AppDispatch, RootState } from "@/store/store";
import { useParams, useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "sonner";

function Page() {
  const [isAdmin, setIsAdmin] = useState(false);

  const { id } = useParams();
  const router = useRouter();
  const { user } = useSelector((state: RootState) => state.user);
  const { updated, loading, error, job } = useSelector(
    (state: RootState) => state.jobs
  );
  const dispatch = useDispatch<AppDispatch>();

  useEffect(() => {
    if (!id) {
      if (!job?._id) {
        router.push("/jobs");
      }
      return;
    }
    if (user && job && job?._id === id) {
      setIsAdmin(job.company.admin.includes(user._id));
      console.log("Is Admin:", isAdmin);
    }
    if (id && job?._id !== id) {
      dispatch(getJobAction(id as string)).catch((err) => {
        toast.error("Failed to fetch job details", {
          position: "top-center",
        });
        router.push("/jobs");
      });
    }
  }, [id, job, user, dispatch, router]);

  useEffect(() => {
    if (updated && !loading) {
      toast.success("Job updated successfully", {
        position: "top-center",
      });
      router.push(`/jobs/${id}`);
      dispatch(resetJob());
    }
    if (error && !loading) {
      toast.error(error, {
        position: "top-center",
      });
      dispatch(resetJob());
    }
  }, [updated, loading, error, dispatch, router]);

  return (
    <>
      <Navbar />
      {isAdmin && job && !loading ? (
        <JobForm companyId={job.company._id} job={job} edit={true} />
      ) : (
        <PrimaryLoader />
      )}
    </>
  );
}

export default Page;
