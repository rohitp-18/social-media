"use client";

import AuthProvider from "@/components/authProvider";
import FooterS from "@/components/footerS";
import RecommendCompany from "@/components/recommend/recommendCompany";
import RecommendedJobs from "@/components/recommend/recommendedJobs";
import RecommendUser from "@/components/recommend/recommendUser";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import Navbar from "@/components/userNavbar";
import {
  clearError,
  deleteJobApplicationAction,
  getApplication,
  getJobApplicationAction,
  resetApplyJobState,
} from "@/store/jobs/applyJobsSlice";
import { AppDispatch, RootState } from "@/store/store";
import Link from "next/link";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import React, { Fragment, use, useCallback, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Badge } from "@/components/ui/badge";
import JobCard from "@/components/jobs/jobCard";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
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
import CompanyCard from "@/components/company/companyCard";
import axios from "@/store/axios";
import { isAxiosError } from "axios";

function Page() {
  const [reason, setReason] = useState<string>("");
  const [date, setDate] = useState<string>("");
  const [dates, setDates] = useState<string[]>([]);
  const [open, setOpen] = useState(false);

  const { id } = useParams();
  const router = useRouter();
  const dispatch = useDispatch<AppDispatch>();
  const { application, loading, deleted, error } = useSelector(
    (state: RootState) => state.applyJobs
  );
  const { user } = useSelector((state: RootState) => state.user);

  const handleReschedule = useCallback(
    async (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      if (dates.length < 1 || !reason) {
        toast.error("Please fill all fields", { position: "top-center" });
        return;
      }
      try {
        const { data } = await axios.put(
          `/applyjobs/reschedule/${application._id}`,
          {
            dates,
            reason,
          }
        );
        toast.success(data.message, { position: "top-center" });
        dispatch(getApplication(id as string));
        setDates([]);
        setDate("");
        setReason("");
        setOpen(false);
      } catch (error) {
        toast.error(
          isAxiosError(error)
            ? error.response?.data.message
            : "Something went wrong",
          { position: "top-center" }
        );
      }
    },
    [id, dates, reason, dispatch]
  );

  useEffect(() => {
    if (!application || application.job._id !== id) {
      dispatch(getApplication(id as string));
    }
  }, [user, application]);

  useEffect(() => {
    if (deleted) {
      toast.success("Application deleted successfully", {
        position: "top-center",
      });
      dispatch(getApplication(id as string));
      dispatch(resetApplyJobState());
    }
    if (error) {
      toast.error(error, { position: "top-center" });
      dispatch(clearError());
    }
  }, [deleted, error]);

  return (
    <AuthProvider>
      <Navbar />
      <main className="bg-[#f2f6f8] dark:bg-[#151515] w-full overflow-hidden py-5">
        <div className="container mx-auto">
          {/* <section className="flex mx-auto max-w-7xl justify-center gap-2"> */}
          <section className="md:grid grid-cols-[300px_1fr_300px] block mx-auto max-w-7xl min-h-screen gap-2">
            <aside className="md:flex flex-col gap-3 shrink hidden h-min">
              {application && (
                <RecommendedJobs company={application.company._id} />
              )}
            </aside>
            <section className="flex flex-col gap-5">
              {application && (
                <JobCard
                  job={{
                    ...application.job,
                    company: { ...application.company },
                  }}
                />
              )}
              <div className="flex flex-col gap-2">
                {/* show only updated status */}
                {application ? (
                  <Card className="p-6 shadow-lg">
                    <CardHeader className="flex items-center justify-between">
                      <h2 className="text-2xl font-semibold">
                        Application Status
                      </h2>
                      <Badge variant="secondary" className="text-md px-2 py-1">
                        {application.status}
                      </Badge>
                    </CardHeader>
                    {application.status === "interview" &&
                      application.interview && (
                        <div className="mt-4">
                          <Label className="block text-sm font-medium mb-2">
                            Interview Time
                          </Label>
                          <Input
                            type="text"
                            value={new Date(
                              application.interview
                            ).toLocaleString()}
                            disabled
                            className="bg-gray-100 border rounded-md"
                          />
                        </div>
                      )}
                    {application.reschedule?.newInterviewDate.length > 0 && (
                      <div className="mt-4">
                        <h3 className="text-lg font-semibold">
                          Reschedule Request Submitted
                        </h3>
                        <p className="text-sm text-gray-600">
                          You have already applied for rescheduling your
                          interview. Please await further updates.
                        </p>
                        <ul className="mt-2">
                          {application.reschedule.newInterviewDate.map(
                            (d: Date, i: number) => (
                              <li key={i} className="text-sm text-gray-500">
                                {new Date(d).toLocaleString()}
                              </li>
                            )
                          )}
                        </ul>
                      </div>
                    )}
                    <CardFooter className="mt-4 flex gap-3 justify-end">
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button variant="destructive">
                            Delete Application
                          </Button>
                        </DialogTrigger>
                        <DialogContent>
                          <DialogHeader>
                            <DialogTitle className="text-lg font-semibold">
                              Delete Application
                            </DialogTitle>
                          </DialogHeader>
                          <p className="text-sm text-gray-600 mb-4">
                            Are you sure you want to delete this application?
                          </p>
                          <DialogFooter>
                            <Button
                              variant="destructive"
                              onClick={() => {
                                dispatch(
                                  deleteJobApplicationAction(application._id)
                                );
                              }}
                            >
                              Delete
                            </Button>
                            <DialogClose asChild>
                              <Button
                                variant="outline"
                                onClick={() => router.back()}
                              >
                                Cancel
                              </Button>
                            </DialogClose>
                          </DialogFooter>
                        </DialogContent>
                      </Dialog>
                      <Dialog open={open} onOpenChange={(val) => setOpen(val)}>
                        <DialogTrigger asChild>
                          {application.status === "interview" &&
                            application.reschedule?.newInterviewDate.length ===
                              0 &&
                            application.interview && (
                              <Button
                                disabled={
                                  application.reschedule?.newInterviewDate
                                    .length !== 0
                                }
                                variant={"secondary"}
                              >
                                Reschedule Interview
                              </Button>
                            )}
                        </DialogTrigger>
                        <DialogContent>
                          <DialogHeader>
                            <DialogTitle className="text-lg font-semibold">
                              Reschedule Interview
                            </DialogTitle>
                          </DialogHeader>
                          <form onSubmit={handleReschedule}>
                            <div className="space-y-4">
                              <div>
                                <Label htmlFor="date" className="block mb-2">
                                  New Interview Date
                                </Label>
                                <div className="flex gap-2">
                                  <Input
                                    type="datetime-local"
                                    name="date"
                                    id="date"
                                    className="w-full"
                                    value={date}
                                    onChange={(e) => setDate(e.target.value)}
                                  />
                                  <Button
                                    type="button"
                                    onClick={() => {
                                      if (date) {
                                        setDates((prev) => [...prev, date]);
                                        setDate("");
                                      }
                                    }}
                                  >
                                    Add
                                  </Button>
                                </div>
                              </div>
                              {dates.length > 0 && (
                                <div className="mt-2">
                                  <Label className="block mb-2">
                                    Added Dates
                                  </Label>
                                  <ul className="space-y-1">
                                    {dates.map((d, index) => (
                                      <li
                                        key={index}
                                        className="flex items-center justify-between bg-gray-100 p-2 rounded"
                                      >
                                        <span>
                                          {new Date(d).toLocaleString()}
                                        </span>
                                        <Button
                                          type="button"
                                          variant="destructive"
                                          size="sm"
                                          onClick={() =>
                                            setDates((prev) =>
                                              prev.filter((_, i) => i !== index)
                                            )
                                          }
                                        >
                                          Remove
                                        </Button>
                                      </li>
                                    ))}
                                  </ul>
                                </div>
                              )}
                              <div>
                                <Label htmlFor="reason" className="block mb-2">
                                  Reason for Rescheduling
                                </Label>
                                <Input
                                  type="text"
                                  name="reason"
                                  required
                                  value={reason}
                                  onChange={(e) => setReason(e.target.value)}
                                  className="w-full"
                                />
                              </div>
                            </div>
                            <DialogFooter className="mt-4">
                              <Button type="submit">Reschedule</Button>
                              <DialogClose asChild>
                                <Button type="button" variant="outline">
                                  Cancel
                                </Button>
                              </DialogClose>
                            </DialogFooter>
                          </form>
                        </DialogContent>
                      </Dialog>
                    </CardFooter>
                  </Card>
                ) : (
                  <Card className="p-5">
                    <CardContent>
                      <CardDescription>Application not found</CardDescription>
                    </CardContent>
                  </Card>
                )}
              </div>
              <FooterS />
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
