"use client";

import CreateForm from "@/components/company/createForm";
import { PrimaryLoader } from "@/components/loader";
import Navbar from "@/components/userNavbar";
import { clearError, getSingleCompany } from "@/store/company/companySlice";
import { AppDispatch, RootState } from "@/store/store";
import { useParams, useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "sonner";

function Page() {
  const router = useRouter();
  const { id } = useParams();
  const dispatch = useDispatch<AppDispatch>();
  const { company, loading, error } = useSelector(
    (state: RootState) => state.company
  );
  const { user } = useSelector((state: RootState) => state.user);

  useEffect(() => {
    if (id) {
      typeof id === "string" && dispatch(getSingleCompany(id));
    }
  }, [id]);

  useEffect(() => {
    if (company && user) {
      console.log(company.admin.some((admin: any) => admin._id === user._id));
      if (!company.admin.some((admin: any) => admin._id === user._id)) {
        router.push(`/company/${id}`);
      }
    }
  }, [company, user]);

  useEffect(() => {
    if (error && !company) {
      toast.error(error, { position: "top-center" });
      dispatch(clearError());
      router.back();
    }
  }, [error]);
  return (
    <>
      <Navbar />
      {loading ? (
        <PrimaryLoader />
      ) : company ? (
        <main className="bg-[#f2f6f8] dark:bg-[#151515] w-full min-h-screen overflow-hidden py-5">
          <div className="container max-w-[1170px] mx-auto">
            <CreateForm
              edit={true}
              id={id as string}
              nextStep={() => router.push(`/company/${id}`)}
            />
          </div>
        </main>
      ) : (
        <PrimaryLoader />
      )}
    </>
  );
}

export default Page;
