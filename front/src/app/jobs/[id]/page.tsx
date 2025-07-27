"use client";

import Navbar from "@/components/userNavbar";
import IntroNavbar from "@/components/introNavbar";
import { AppDispatch, RootState } from "@/store/store";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import RecommendCompany from "@/components/recommend/recommendCompany";
import RecommendedJobs from "@/components/recommend/recommendedJobs";
import FooterS from "@/components/footerS";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { useParams, useRouter } from "next/navigation";
import {
  clearError,
  deleteJobAction,
  getJobAction,
  resetJob,
  toggleSaveJobAction,
} from "@/store/jobs/jobSlice";
import ProfileCard from "@/components/profileCard";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { timeAgo } from "@/lib/functions";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import RecommendUser from "@/components/recommend/recommendUser";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { PrimaryLoader, SecondaryLoader } from "@/components/loader";
import { toast } from "sonner";

function Page() {
  const [isAdmin, setIsAdmin] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  const [isApplied, setIsApplied] = useState(false);

  const dispatch = useDispatch<AppDispatch>();
  const { id } = useParams();
  const router = useRouter();
  const { user } = useSelector((state: RootState) => state.user);
  const { job, saved, error, loading, message } = useSelector(
    (state: RootState) => state.jobs
  );

  useEffect(() => {
    if (id) {
      dispatch(getJobAction(id as string));
    }
  }, [dispatch, id]);

  useEffect(() => {
    if (user && job) {
      setIsAdmin(job.company?.admin.includes(user._id));
      setIsSaved(job.savedBy.includes(user._id));
      setIsApplied(job.applyBy?.includes(user._id));
    }
  }, [user, job]);

  useEffect(() => {
    if (error) {
      toast.error(error, { position: "top-center" });
      dispatch(clearError());
    }
    if (saved && job._id === saved) {
      toast.success(
        message ||
          (!isSaved ? "Job unsaved successfully" : "Job saved successfully"),
        { position: "top-center" }
      );
      setIsSaved(!isSaved);
      dispatch(resetJob());
    }
  }, [error, dispatch, saved, job, isSaved, message]);

  if (!job && loading) return <PrimaryLoader />;

  if (!job) return null;

  interface HandleJobButtonsProps {
    deleteJob?: boolean;
  }

  const HandleJobButtons: React.FC<HandleJobButtonsProps> = ({ deleteJob }) => {
    const [open, setOpen] = useState(false);

    return (
      <div className="flex items-center gap-2 mt-2">
        <Button disabled={!job.isActive} variant="default">
          {isApplied ? (
            "Applied"
          ) : (
            <Link href={`/jobs/${id}/apply`}>Apply Now</Link>
          )}
        </Button>
        {isAdmin && (
          <Button variant="secondary">
            <Link href={`/jobs/${id}/update`}>Edit Job</Link>
          </Button>
        )}
        <Button
          variant="outline"
          onClick={() =>
            dispatch(
              toggleSaveJobAction({ save: !isSaved, jobId: id as string })
            )
          }
        >
          {isSaved ? "Unsave Job" : "Save Job"}
        </Button>
        {isAdmin && deleteJob && (
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger onClick={() => setOpen(true)} asChild>
              <Button variant="destructive">Delete Job</Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle className="text-lg font-semibold">
                  Delete Job
                </DialogTitle>
              </DialogHeader>
              <DialogDescription>
                This will permanently delete the job posting and all associated
                data.
              </DialogDescription>
              <DialogFooter>
                <DialogClose onClick={() => setOpen(false)} asChild>
                  <Button variant="outline" onClick={() => router.back()}>
                    Close
                  </Button>
                </DialogClose>
                <Button
                  variant="destructive"
                  onClick={() => deleteJobAction(id as string)}
                >
                  Delete
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        )}
        {isAdmin && (
          <Button variant="secondary">
            <Link href={`/jobs/${id}/applications`}>Manage Applications</Link>
          </Button>
        )}
      </div>
    );
  };

  return (
    <>
      {user ? <Navbar /> : <IntroNavbar />}
      <main className="bg-[#f2f6f8] dark:bg-[#151515] w-full overflow-hidden py-5">
        <div className="container mx-auto">
          {/* <section className="flex mx-auto max-w-7xl justify-center gap-2"> */}
          <section className="md:grid grid-cols-[300px_1fr_300px] block mx-auto max-w-7xl min-h-screen gap-2">
            <aside className="md:flex flex-col gap-3 shrink hidden h-min">
              <RecommendedJobs company={job.company._id} />
            </aside>
            <Card className="md:flex flex-col gap-3 h-min">
              <CardHeader className="flex flex-col justify-between gap-3 items-start space-y-4">
                {!job.isActive && (
                  <Badge className="bg-red-100 text-red-800">
                    This job is currently inactive
                  </Badge>
                )}
                <div className="flex flex-col gap-2 w-full p-4 bg-white rounded-lg shadow">
                  <Link
                    href={`/company/${job.company._id}`}
                    className="flex items-center gap-4"
                  >
                    <Avatar className="w-8 h-8">
                      <AvatarImage
                        src={job.company?.avatar?.url}
                        alt={job.company?.name}
                      />
                      <AvatarFallback>
                        {job.company?.name?.charAt(0).toUpperCase() || "?"}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex flex-col">
                      <h3 className="text-base font-bold text-gray-900">
                        {job.company?.name}
                      </h3>
                    </div>
                  </Link>

                  <h2 className="mt-2 text-2xl font-extrabold text-gray-800">
                    {job.title}
                  </h2>
                  <div className="text-sm text-gray-600">
                    <p>
                      {job.location.length > 1
                        ? "Multiple Locations"
                        : job.location[0]}{" "}
                      | Posted {timeAgo(job.createdAt)} |{" "}
                      {job.applications.length}{" "}
                      {job.applications.length === 1
                        ? "Application"
                        : "Applications"}
                    </p>
                    <div className="mt-2 flex gap-2">
                      <Badge className="text-xs bg-gray-400">
                        {job.category}
                      </Badge>
                      <Badge className="text-xs bg-gray-400">
                        {job.workType}
                      </Badge>
                      <Badge className="text-xs bg-gray-400">{job.type}</Badge>
                    </div>
                  </div>

                  <div className="mt-4">
                    <HandleJobButtons />
                  </div>
                </div>
              </CardHeader>
              <CardContent className="p-6 bg-white rounded-md shadow-sm flex flex-col gap-6">
                <section>
                  <h1 className="text-2xl font-bold text-gray-900">
                    Job Overview
                  </h1>
                  <p className="mt-2 text-gray-700">{job.description}</p>
                </section>
                {job.essentialSkills?.length > 0 && (
                  <section>
                    <h2 className="text-xl font-semibold text-gray-800">
                      Essential Skills
                    </h2>
                    <ul className="mt-2 grid grid-cols-2 gap-2">
                      {job.essentialSkills.map((skill: any) => (
                        <li key={skill._id} className="flex items-center">
                          <Badge className="mr-2 bg-blue-100 text-blue-800">
                            {skill.name}
                          </Badge>
                        </li>
                      ))}
                    </ul>
                  </section>
                )}
                {job.preferredSkills?.length > 0 && (
                  <section>
                    <h2 className="text-xl font-semibold text-gray-800">
                      Preferred Skills
                    </h2>
                    <ul className="mt-2 grid grid-cols-2 gap-2">
                      {job.preferredSkills.map((skill: any) => (
                        <li key={skill._id} className="flex items-center">
                          <Badge className="mr-2 bg-green-100 text-green-800">
                            {skill.name}
                          </Badge>
                        </li>
                      ))}
                    </ul>
                  </section>
                )}
                <section className="grid grid-cols-2 gap-6">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-800">
                      Salary
                    </h3>
                    <p className="mt-1 text-gray-600">
                      {job.salary ? `${job.salary}` : "Not specified"}
                    </p>
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-800">
                      Experience Required
                    </h3>
                    <p className="mt-1 text-gray-600">
                      {job.experience ? job.experience : "Not specified"}
                    </p>
                  </div>
                </section>
              </CardContent>
              <CardFooter className="p-4 flex-col">
                <div className="flex flex-col gap-6 w-full">
                  {/* Company Section */}
                  <div className="flex flex-col gap-3 border rounded-md p-4 shadow-sm">
                    <span className="text-sm text-gray-600">Posted by:</span>
                    <Link
                      href={`/company/${job.company._id}`}
                      className="flex items-center gap-3"
                    >
                      <Avatar className="w-8 h-8">
                        <AvatarImage
                          src={job.company?.avatar?.url}
                          alt={job.company?.name}
                        />
                        <AvatarFallback>
                          {job.company?.name?.charAt(0).toUpperCase() || "?"}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex flex-col">
                        <span className="text-sm font-semibold">
                          {job.company?.name}
                        </span>
                        <span className="text-xs text-gray-500">
                          {job.company.headline}
                        </span>
                      </div>
                    </Link>
                    <div className="flex flex-wrap gap-2">
                      <Button
                        variant="outline"
                        onClick={() =>
                          router.push(`/company/${job.company._id}`)
                        }
                        className="text-sm text-blue-600 hover:underline hover:bg-blue-100 hover:text-blue-600"
                      >
                        View Company
                      </Button>
                      <Button
                        variant="outline"
                        className="text-sm text-blue-600 hover:underline hover:bg-blue-100 hover:text-blue-600"
                      >
                        Follow
                      </Button>
                    </div>
                  </div>
                  {/* User Section */}
                  <div className="flex flex-col gap-3 border rounded-md p-4 shadow-sm">
                    <span className="text-sm text-gray-600">
                      Job created by:
                    </span>
                    <Link
                      href={`/u/${job.user.username}`}
                      className="flex items-center gap-3"
                    >
                      <Avatar className="w-10 h-10">
                        <AvatarImage
                          src={job.user?.avatar?.url}
                          alt={job.user?.name}
                        />
                        <AvatarFallback>
                          {job.user?.name?.charAt(0).toUpperCase() || "?"}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex flex-col">
                        <span className="text-sm font-semibold">
                          {job.user?.name}
                        </span>
                        <span className="text-xs text-gray-500">
                          {job.user?.headline}
                        </span>
                      </div>
                    </Link>
                    <div className="flex flex-wrap gap-2">
                      <Button
                        variant="outline"
                        onClick={() => router.push(`/u/${job.user.username}`)}
                        className="text-sm text-blue-600 hover:underline hover:bg-blue-100 hover:text-blue-600"
                      >
                        View Profile
                      </Button>
                      <Button
                        className="text-sm text-blue-600 hover:underline hover:bg-blue-100 hover:text-blue-600"
                        variant={"outline"}
                      >
                        Follow
                      </Button>
                    </div>
                  </div>
                </div>
                <div className="mt-4">
                  <HandleJobButtons deleteJob={isAdmin} />
                </div>
              </CardFooter>
            </Card>
            <aside className="w-64 md:flex hidden flex-col gap-5">
              <RecommendedJobs />
              <RecommendCompany />
              <RecommendUser />
            </aside>
          </section>
          <FooterS />
        </div>
      </main>
    </>
  );
}

export default Page;
