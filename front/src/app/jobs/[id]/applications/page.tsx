"use client";

import AuthProvider from "@/components/authProvider";
import FooterS from "@/components/footerS";
import RecommendCompany from "@/components/recommend/recommendCompany";
import RecommendedJobs from "@/components/recommend/recommendedJobs";
import RecommendUser from "@/components/recommend/recommendUser";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardHeader } from "@/components/ui/card";
import Navbar from "@/components/userNavbar";
import {
  clearError,
  getJobApplicationAction,
  updateJobApplicationAction,
} from "@/store/jobs/applyJobsSlice";
import { AppDispatch, RootState } from "@/store/store";
import Link from "next/link";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import React, {
  Fragment,
  Suspense,
  use,
  useCallback,
  useEffect,
  useState,
} from "react";
import { useDispatch, useSelector } from "react-redux";
import { Badge } from "@/components/ui/badge";
import { timeAgo } from "@/lib/functions";
import JobCard from "@/components/jobs/jobCard";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { toast } from "sonner";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import axios from "@/store/axios";
import { isAxiosError } from "axios";
import { PrimaryLoader, SecondaryLoader } from "@/components/loader";
import { application } from "@/store/jobs/typeJob";

function Page() {
  const [isAdmin, setIsAdmin] = useState(false);
  const [selectApplication, setSelectApplication] =
    useState<application | null>(null);
  const [status, setStatus] = useState("");
  const [interviewDate, setInterviewDate] = useState("");
  const [rescheduleDate, setRescheduleDate] = useState<string>();

  const { id } = useParams();
  const router = useRouter();
  const searchParams = useSearchParams();
  const dispatch = useDispatch<AppDispatch>();
  const { applications, loading, job, updated, error } = useSelector(
    (state: RootState) => state.applyJobs
  );
  const { user } = useSelector((state: RootState) => state.user);

  const handleReschedule = useCallback(async () => {
    if (!selectApplication) return;
    if (!rescheduleDate) {
      toast.error("Please select a new interview date", {
        position: "top-center",
      });
      return;
    }
    try {
      const { data } = await axios.put(
        `/applyjobs/accept/${selectApplication._id}`,
        {
          date: rescheduleDate,
        }
      );
      toast.success("Interview rescheduled successfully", {
        position: "top-center",
      });
      setSelectApplication(null);
      dispatch(getJobApplicationAction(id as string));
    } catch (error) {
      toast.error(
        isAxiosError(error)
          ? error.response?.data.message
          : "Failed to reschedule interview",
        { position: "top-center" }
      );
    }
  }, [dispatch]);

  const handleStatusChange = useCallback(() => {
    if (selectApplication && status) {
      if (status === "interview" && !interviewDate) {
        toast.error("Please select an interview date", {
          position: "top-center",
        });
        return;
      }
      dispatch(
        updateJobApplicationAction({
          applicationId: selectApplication._id,
          updateData: { status, interview: interviewDate },
        })
      ).catch((error) => {
        toast.error(
          error instanceof Error ? error.message : "Failed to update status",
          { position: "top-center" }
        );
      });
    }
  }, [dispatch, selectApplication, status, interviewDate]);

  useEffect(() => {
    if (user && applications && job && job._id === id) {
      if (job.company.admin.some((admin) => admin === user._id)) {
        setIsAdmin(true);
      } else {
        router.push(`/jobs/${id}`);
      }
    }
    if (!job || job._id !== id) {
      dispatch(getJobApplicationAction(id as string));
    }
  }, [user, applications, job, id, dispatch, router]);

  useEffect(() => {
    if (selectApplication) {
      setStatus(selectApplication.status);
      setInterviewDate(
        selectApplication.interview
          ? new Date(selectApplication.interview).toISOString().slice(0, 16)
          : ""
      );
    }
  }, [selectApplication]);

  useEffect(() => {
    if (updated) {
      toast.success("Application status updated successfully", {
        position: "top-center",
      });
      setSelectApplication(null);
      dispatch(getJobApplicationAction(id as string));
    }
    if (error) {
      toast.error(error, {
        position: "top-center",
      });
      dispatch(clearError());
    }
  }, [updated]);

  useEffect(() => {
    if (searchParams.get("applicationId") && applications.length > 0) {
      const applicationId = searchParams.get("applicationId");
      if (applicationId) {
        const application = applications.find(
          (app) => app._id === applicationId
        );
        if (application) {
          setSelectApplication(application);
        } else {
          toast.error("Application not found", {
            position: "top-center",
          });
          router.push(`/jobs/${id}`);
        }
      }
    }
  }, [searchParams, applications]);

  if (!job || !applications) {
    return (
      <AuthProvider>
        <PrimaryLoader />
      </AuthProvider>
    );
  }

  return (
    <AuthProvider>
      <Navbar />
      <Suspense fallback={<SecondaryLoader />}>
        {isAdmin && (
          <main className="bg-[#f2f6f8] dark:bg-[#151515] w-full overflow-hidden py-5">
            <div className="container mx-auto">
              {/* <section className="flex mx-auto max-w-7xl justify-center gap-2"> */}
              <section className="md:grid grid-cols-[300px_1fr_300px] block mx-auto max-w-7xl min-h-screen gap-2">
                <aside className="md:flex flex-col gap-3 shrink hidden h-min">
                  <RecommendedJobs company={job.company._id} />
                </aside>
                <section className="flex flex-col gap-5">
                  <JobCard job={job} />
                  <div className="flex flex-col gap-2">
                    {applications.length > 0 ? (
                      <Card className="flex flex-col p-4 mb-5 shadow hover:shadow-lg transition-shadow cursor-pointer ">
                        {applications.map((application, i: number) => (
                          <Fragment key={application._id}>
                            <div className="flex items-center justify-between">
                              <div className="flex flex-col gap-1">
                                <Link
                                  href={`/u/${application.user.username}`}
                                  className="flex items-center gap-4"
                                >
                                  <Avatar className="w-12 h-12">
                                    <AvatarImage
                                      src={application.user.avatar?.url}
                                      alt={application.user.name}
                                    />
                                    <AvatarFallback>
                                      {application.user.name
                                        .charAt(0)
                                        .toUpperCase()}
                                    </AvatarFallback>
                                  </Avatar>
                                  <div>
                                    <h3 className="text-lg font-bold flex items-center gap-1">
                                      {application.user.name}
                                      <span className="text-xs font-normal text-gray-500">
                                        {" "}
                                        | Applied{" "}
                                        {timeAgo(
                                          application.createdAt.toString()
                                        )}
                                      </span>
                                    </h3>
                                    <p className="text-sm text-gray-600">
                                      {application.user.headline}
                                    </p>
                                  </div>
                                </Link>

                                {application.interview && (
                                  <p className="text-sm text-gray-500">
                                    Interview on{" "}
                                    {new Date(application.interview)
                                      .toISOString()
                                      .slice(0, 10)}{" "}
                                    at{" "}
                                    {new Date(
                                      application.interview
                                    ).toLocaleTimeString([], {
                                      hour: "2-digit",
                                      minute: "2-digit",
                                    })}
                                  </p>
                                )}
                              </div>
                              <div className="flex flex-col items-end">
                                <Badge variant="outline" className="capitalize">
                                  {application.status}
                                </Badge>
                                {application.reschedule?.explanation && (
                                  <Badge variant="secondary" className="mt-1">
                                    Rescheduled
                                  </Badge>
                                )}
                                <Button
                                  variant="secondary"
                                  className="mt-2"
                                  size={"sm"}
                                  onClick={() => {
                                    setSelectApplication(application);
                                  }}
                                >
                                  View
                                </Button>
                              </div>
                            </div>
                            {i < applications.length - 1 && (
                              <Separator className="my-4" />
                            )}
                          </Fragment>
                        ))}
                      </Card>
                    ) : (
                      <Card className="flex flex-col items-center justify-center p-8 border border-dashed border-gray-300 rounded-md shadow-sm">
                        <h3 className="text-xl font-semibold text-gray-800">
                          No Applications Found
                        </h3>
                        <p className="mt-2 text-sm text-gray-500">
                          We couldn’t find any applications. Please check back
                          later.
                        </p>
                      </Card>
                    )}
                  </div>
                  <Dialog
                    open={selectApplication !== null}
                    onOpenChange={() => setSelectApplication(null)}
                  >
                    <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto p-6">
                      <DialogHeader>
                        <DialogTitle className="text-2xl font-bold mb-4">
                          Application Details
                        </DialogTitle>
                      </DialogHeader>
                      {selectApplication && (
                        <div className="space-y-6">
                          <div className="flex items-center gap-4">
                            <Avatar className="w-20 h-20">
                              <AvatarImage
                                src={selectApplication.user.avatar?.url}
                                alt={selectApplication.user.name}
                              />
                              <AvatarFallback>
                                {selectApplication.user.name
                                  .charAt(0)
                                  .toUpperCase()}
                              </AvatarFallback>
                            </Avatar>
                            <div>
                              <h3 className="text-xl font-semibold">
                                {selectApplication.user.name}
                              </h3>
                              <p className="text-sm text-gray-500">
                                {selectApplication.user.headline}
                              </p>
                            </div>
                          </div>
                          <div>
                            <h4 className="text-lg font-semibold">
                              Status:{" "}
                              <span className="text-blue-600 capitalize">
                                {selectApplication.status}
                              </span>
                            </h4>
                            <Select value={status} onValueChange={setStatus}>
                              <SelectTrigger className="w-full mt-2">
                                <SelectValue placeholder="Select Status" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectGroup>
                                  <SelectItem value="applied">
                                    Applied
                                  </SelectItem>
                                  <SelectItem value="interview">
                                    Interviewing
                                  </SelectItem>
                                  <SelectItem value="hired">Hired</SelectItem>
                                  <SelectItem value="rejected">
                                    Rejected
                                  </SelectItem>
                                </SelectGroup>
                              </SelectContent>
                            </Select>

                            {status === "interview" && (
                              <div className="mt-2">
                                <Label className="block text-sm font-medium text-gray-700">
                                  Interview Date
                                </Label>
                                <Input
                                  type="datetime-local"
                                  className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring-blue-500"
                                  value={
                                    interviewDate
                                      ? new Date(interviewDate)
                                          .toISOString()
                                          .slice(0, 16)
                                      : ""
                                  }
                                  onChange={(e) =>
                                    setInterviewDate(e.target.value)
                                  }
                                />
                              </div>
                            )}
                            <Button
                              className="mt-4"
                              onClick={() => handleStatusChange()}
                            >
                              Update Status
                            </Button>
                          </div>
                          {selectApplication.reschedule?.explanation && (
                            <div className="border-t pt-4">
                              <h3 className="text-lg font-semibold mb-2">
                                Reschedule Reason
                              </h3>
                              <p className="text-gray-700">
                                {selectApplication.reschedule.explanation ||
                                  "No explanation provided."}
                              </p>
                              <h5 className="text-md font-semibold mb-2">
                                Rescheduled Interview Date
                              </h5>
                              <Select
                                value={rescheduleDate}
                                onValueChange={(val) => setRescheduleDate(val)}
                              >
                                <SelectTrigger className="w-full">
                                  <SelectValue placeholder="Select Date" />
                                </SelectTrigger>
                                <SelectContent>
                                  {selectApplication.reschedule.newInterviewDate.map(
                                    (date, index: number) => (
                                      <SelectItem
                                        key={index}
                                        value={date.toString()}
                                      >{`${new Date(
                                        date
                                      ).toLocaleDateString()} ${new Date(
                                        date
                                      ).toLocaleTimeString()}`}</SelectItem>
                                    )
                                  )}
                                </SelectContent>
                              </Select>
                              <Button
                                variant="default"
                                className="mt-2"
                                onClick={() => handleReschedule()}
                              >
                                Reschedule Interview
                              </Button>
                            </div>
                          )}
                          <div className="border-t pt-4">
                            <h5 className="text-md font-semibold mb-2">
                              Cover Letter
                            </h5>
                            <p className="text-gray-700 whitespace-pre-line">
                              {selectApplication.coverLetter}
                            </p>
                          </div>
                          <div className="border-t pt-4">
                            <h5 className="text-md font-semibold mb-2">
                              Resume
                            </h5>
                            <Link
                              target="_blank"
                              href={selectApplication.resume?.url || ""}
                              className="text-blue-600 underline"
                            >
                              {selectApplication.resume?.name || "View Resume"}
                            </Link>
                          </div>
                          <div className="border-t pt-4">
                            <h5 className="text-md font-semibold mb-2">
                              Questions
                            </h5>
                            {selectApplication.questions.length > 0 ? (
                              selectApplication.questions.map((q) => (
                                <div
                                  key={q._id}
                                  className="p-3 border rounded-md mb-2"
                                >
                                  <p className="font-medium">{q.question}</p>
                                  <p className="text-gray-700">{q.answer}</p>
                                </div>
                              ))
                            ) : (
                              <p className="text-gray-600">
                                No questions answered.
                              </p>
                            )}
                          </div>
                        </div>
                      )}

                      <DialogFooter className="mt-6">
                        <Button
                          variant="secondary"
                          onClick={() => setSelectApplication(null)}
                        >
                          Close
                        </Button>
                      </DialogFooter>
                    </DialogContent>
                  </Dialog>
                </section>
                <aside className="w-64 md:flex hidden flex-col gap-5">
                  <RecommendedJobs />
                  <RecommendCompany />
                  <RecommendUser />
                </aside>
              </section>
              <FooterS />
            </div>
          </main>
        )}
      </Suspense>
    </AuthProvider>
  );
}

export default Page;
