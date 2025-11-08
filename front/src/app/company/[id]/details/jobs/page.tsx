"use client";

import AuthProvider from "@/components/authProvider";
import CompanyCard from "@/components/company/companyCard";
import RecommendCompany from "@/components/recommend/recommendCompany";
import RecommendedJobs from "@/components/recommend/recommendedJobs";
import RecommendUser from "@/components/recommend/recommendUser";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Navbar from "@/components/userNavbar";
import { timeAgo } from "@/lib/functions";
import axios from "@/store/axios";
import { getSingleCompany } from "@/store/company/companySlice";
import { AppDispatch, RootState } from "@/store/store";
import { isAxiosError } from "axios";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import React, { Fragment, useCallback, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "sonner";

function Page() {
  const [isAdmin, setIsAdmin] = useState(false);

  const router = useRouter();
  const { id } = useParams();
  const dispatch = useDispatch<AppDispatch>();
  const { company, error, jobs } = useSelector(
    (state: RootState) => state.company
  );
  const { user } = useSelector((state: RootState) => state.user);

  const handleActiveJob = useCallback(
    async (jobId: string, isActive: boolean) => {
      try {
        const { data } = await axios.put(`/jobs/active/${jobId}`, { isActive });
        toast.success(
          `Job has been ${isActive ? "activated" : "deactivated"}`,
          {
            position: "top-center",
          }
        );
        dispatch(getSingleCompany(id as string));
      } catch (error: any) {
        toast.error(error.message || "Something went wrong", {
          position: "top-center",
        });
      }
    },
    [dispatch]
  );

  useEffect(() => {
    if (!company || company._id !== id) {
      dispatch(getSingleCompany(id as string))
        .unwrap()
        .catch((err: any) => {
          toast.error(
            isAxiosError(err)
              ? err.response?.data.message
              : "Failed to fetch company",
            {
              position: "top-center",
            }
          );
        });
    }
    if (company && company._id === id) {
      if (user && company.admin?.some((admin: any) => admin._id === user._id)) {
        setIsAdmin(true);
      } else {
        router.push(`/company/${id}`);
      }
    }
  }, [company, id, router]);

  if (!company) return null;

  if (!isAdmin) return null;

  return (
    <AuthProvider>
      <Navbar />
      <main className="bg-[#f2f6f8] dark:bg-[#151515] w-full overflow-hidden py-5">
        <div className="mx-5">
          {/* <section className="flex mx-auto max-w-7xl justify-center gap-2"> */}
          <section className="md:grid grid-cols-[300px_1fr_256px] block mx-auto max-w-7xl min-h-screen gap-2">
            <aside className="md:flex flex-col gap-3 shrink hidden h-min">
              <CompanyCard />
              {company && <RecommendedJobs company={company._id} />}
            </aside>
            <section className="flex flex-col gap-5">
              <Card className="w-full flex flex-row gap-3 p-0 bg-white dark:bg-[#1a1a1a] border border-gray-200 dark:border-gray-700 rounded-lg shadow-sm">
                <CardHeader className="flex flex-row items-center justify-between w-full gap-4">
                  <Button
                    type="button"
                    variant="outline"
                    className="text-blue-500 hover:text-blue-700"
                    onClick={() => router.back()}
                  >
                    &larr; Go Back
                  </Button>
                  <Button
                    type="button"
                    onClick={() =>
                      router.push(`/jobs/create?companyId=${company._id}`)
                    }
                  >
                    Create Job
                  </Button>
                </CardHeader>
              </Card>
              {jobs.length > 0 ? (
                <Card className="w-full flex flex-col gap-3 bg-white dark:bg-[#1a1a1a] border border-gray-200 dark:border-gray-700 rounded-lg shadow-sm">
                  <CardHeader>
                    <CardTitle className="text-lg font-semibold -mb-1">
                      Manage Jobs for {company.name}
                    </CardTitle>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      Here you can manage all the jobs for your company.
                    </p>
                  </CardHeader>
                  <CardContent>
                    {jobs.map((job: any, i: number) => (
                      <Fragment key={job._id}>
                        <div className="flex flex-wrap justify-between items-center">
                          <Link
                            href={`/jobs/${job._id}`}
                            className="flex-1 flex flex-col p-3 rounded-md hover:bg-gray-50 transition-shadow duration-300"
                          >
                            <div className="flex items-center mb-2">
                              <Avatar className="w-10 h-10">
                                <AvatarImage
                                  src={job.company.avatar?.url}
                                  alt={job.company.name}
                                />
                                <AvatarFallback>
                                  {job.company.name.charAt(0)}
                                </AvatarFallback>
                              </Avatar>
                              <div className="ml-3 flex-1">
                                <h2 className="text-base font-semibold">
                                  {job.title}
                                </h2>
                                <p className="text-sm text-gray-600">
                                  {job.company.name} | {job.type} |{" "}
                                  {job.noOfApplied} applications
                                </p>
                                <p className="text-sm text-gray-600">
                                  {job.location.length > 1
                                    ? "Multiple locations"
                                    : job.location[0]}{" "}
                                  | {job.workType}
                                </p>
                                <p className="text-xs text-gray-500">
                                  {timeAgo(job.createdAt)} |{" "}
                                  {job.isActive ? "Active" : "Inactive"}
                                </p>
                              </div>
                            </div>
                          </Link>
                          <div className="flex flex-col gap-2">
                            <Button
                              variant={job.isActive ? "outline" : "default"}
                              onClick={() =>
                                handleActiveJob(job._id, !job.isActive)
                              }
                            >
                              {job.isActive ? "Deactivate" : "Activate"}
                            </Button>
                            <Button
                              variant="default"
                              size="sm"
                              className="w-full bg-green-500 text-white hover:bg-green-600"
                              onClick={() =>
                                router.push(`/jobs/edit/${job._id}`)
                              }
                            >
                              Edit
                            </Button>
                            <Button
                              variant="destructive"
                              size="sm"
                              onClick={() =>
                                router.push(`/jobs/delete/${job._id}`)
                              }
                            >
                              Delete
                            </Button>
                          </div>
                        </div>
                        {i < jobs.length - 1 && (
                          <hr className="my-2 border-gray-200 dark:border-gray-700" />
                        )}
                      </Fragment>
                    ))}
                  </CardContent>
                </Card>
              ) : (
                <Card className="w-full flex flex-col gap-3 bg-white dark:bg-[#1a1a1a] border border-gray-200 dark:border-gray-700 rounded-lg shadow-sm">
                  <CardHeader>
                    <CardTitle className="text-lg font-semibold -mb-1">
                      No Jobs Available
                    </CardTitle>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      You have not created any jobs for this company yet.
                    </p>
                  </CardHeader>
                  <CardContent className="flex items-center justify-center h-32">
                    <Button
                      type="button"
                      onClick={() =>
                        router.push(`/jobs/create?companyId=${company._id}`)
                      }
                    >
                      Create Job
                    </Button>
                  </CardContent>
                </Card>
              )}
            </section>
            <aside className="w-64 md:flex hidden flex-col gap-5">
              <RecommendCompany />
              <RecommendedJobs />
              <RecommendUser />
            </aside>
          </section>
        </div>
      </main>
    </AuthProvider>
  );
}

export default Page;
