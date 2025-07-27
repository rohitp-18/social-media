"use client";

import AuthProvider from "@/components/authProvider";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectTrigger,
  SelectValue,
  SelectItem,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import Navbar from "@/components/userNavbar";
import { timeAgo } from "@/lib/functions";
import {
  clearError,
  createJobApplicationAction,
  resetApplyJobState,
} from "@/store/jobs/applyJobsSlice";
import { getJobAction } from "@/store/jobs/jobSlice";
import { AppDispatch, RootState } from "@/store/store";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import React, { useCallback, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "sonner";

function Page() {
  const [coverletter, setCoverletter] = useState("");
  const [questions, setQuestion] = useState<any[]>([]);
  const [resume, setResume] = useState<File | null>(null);
  const [userResumes, setUserResumes] = useState<any[]>([]);
  const [readResume, setReadResume] = useState<any>();

  const dispatch = useDispatch<AppDispatch>();
  const { id } = useParams();
  const router = useRouter();
  const { user } = useSelector((state: RootState) => state.user);
  const { job } = useSelector((state: RootState) => state.jobs);
  const { loading, created, error } = useSelector(
    (state: RootState) => state.applyJobs
  );

  const handleLogoChange = useCallback(
    (e: any) => {
      if (!e.target.files[0]) return;

      setResume(e.target.files[0]);

      const reader = new FileReader();
      reader.onloadend = () => {
        setReadResume(reader.result);
      };
      reader.readAsDataURL(e.target.files[0]);
    },
    [resume]
  );

  const handleSubmit = useCallback(
    (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      if (!resume) {
        toast.error("Please upload your resume", { position: "top-center" });
        return;
      }

      if (questions.some((q) => !q.answer)) {
        toast.error("Please answer all questions", { position: "top-center" });
        return;
      }

      const formData = new FormData();
      formData.append("jobId", id as string);
      formData.append("resume", resume, resume.name);
      formData.append("coverLetter", coverletter);
      formData.append(
        "questions",
        JSON.stringify(
          questions.map(({ ques, answer }) => ({ question: ques, answer }))
        )
      );

      dispatch(createJobApplicationAction(formData));
    },
    [coverletter, questions, resume]
  );

  const handleQuestionChange = useCallback(
    (id: string, answer: string) => {
      setQuestion((prevQuestions) =>
        prevQuestions.map((question) =>
          question._id === id ? { ...question, answer } : question
        )
      );
    },
    [questions]
  );

  useEffect(() => {
    if (!job) {
      dispatch(getJobAction(id as string)).catch((error) => {
        toast.error(`Failed to fetch job details`, { position: "top-center" });
        router.push("/jobs");
      });
    }
    if (job && job._id !== id) {
      dispatch(getJobAction(id as string)).catch((error) => {
        toast.error(`Failed to fetch job details`, { position: "top-center" });
        router.push("/jobs");
      });
    }
    if (job && job._id === id && job.questions) {
      setQuestion(job.questions.map((q: any) => ({ ...q, answer: "" })));
    }
  }, [id, job]);

  useEffect(() => {
    if (created) {
      toast.success("Job application created successfully", {
        position: "top-center",
      });
      router.push(`/jobs/${id}`);
      dispatch(resetApplyJobState());
    }
    if (error) {
      toast.error(error, { position: "top-center" });
      dispatch(clearError());
    }
  }, [created, error]);

  useEffect(() => {
    if (user && user.resumes) {
      setUserResumes(user.resumes);
    }
  }, [user]);

  return (
    <AuthProvider>
      <Navbar />
      {job && (
        <main className="bg-[#f2f6f8] dark:bg-[#151515] w-full overflow-hidden py-5">
          <div className="container mx-auto">
            <section className="block mx-auto max-w-7xl min-h-screen gap-2">
              <section className="flex flex-col items-center gap-10">
                <div className="w-full flex justify-start items-center">
                  <Button
                    variant="outline"
                    className="border-none flex gap-4 items-center"
                    onClick={() => router.back()}
                  >
                    <ArrowLeft className="w-6 h-6" />
                    <span className="font-semibold text-base">Back</span>
                  </Button>
                </div>
                <div className="w-full flex flex-col gap-5 justify-center items-center">
                  <Card className="md:flex flex-col gap-3 h-min">
                    <CardHeader className="flex flex-col justify-between gap-3 items-start">
                      <div className="flex flex-col gap-2 w-full">
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
                              {job.company?.name?.charAt(0).toUpperCase() ||
                                "?"}
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
                            <Badge className="text-xs bg-gray-400">
                              {job.type}
                            </Badge>
                          </div>
                        </div>
                      </div>
                    </CardHeader>
                  </Card>
                  <form
                    onSubmit={handleSubmit}
                    className="flex justify-center gap-5 w-full md:w-1/2"
                  >
                    <Card className="w-full max-w-lg">
                      <CardHeader>
                        <CardTitle>Apply For Job</CardTitle>
                      </CardHeader>
                      <CardContent className="py-3 flex flex-col gap-2">
                        <div className="grid w-full mb-2 gap-1">
                          <Label htmlFor="coverletter">Cover Letter</Label>
                          <Textarea
                            id="coverletter"
                            placeholder="Write your cover letter here"
                            value={coverletter}
                            rows={4}
                            onChange={(e) => setCoverletter(e.target.value)}
                          />
                        </div>
                        <div className="grid w-full max-w-lg mb-2 gap-1">
                          <Label
                            htmlFor="pdf"
                            className="font-semibold text-sm mb-1"
                          >
                            Upload PDF File
                          </Label>
                          <div className="flex flex-col max-w-md gap-3 w-full border border-dashed border-gray-300 rounded-md p-4">
                            <div className="flex items-center justify-between w-full">
                              <p className="text-sm max-w-xs flex flex-wrap w-full font-medium text-gray-600 overflow-hidden text-ellipsis whitespace-nowrap">
                                {resume
                                  ? resume.name.toString()
                                  : "No file selected"}
                              </p>
                              <label
                                htmlFor="pdf-input"
                                className="cursor-pointer bg-primary text-white px-3 py-1 rounded text-xs"
                              >
                                {resume ? "Change" : "Upload"}
                                <input
                                  type="file"
                                  id="pdf-input"
                                  onChange={handleLogoChange}
                                  accept="application/pdf"
                                  className="hidden"
                                />
                              </label>
                            </div>
                            {resume && (
                              <div className="flex flex-col gap-2">
                                <div className="flex gap-3">
                                  <Dialog>
                                    <DialogTrigger asChild>
                                      <button
                                        type="button"
                                        className="bg-green-500 text-white px-3 py-1 rounded text-xs"
                                      >
                                        View
                                      </button>
                                    </DialogTrigger>
                                    <DialogContent>
                                      <DialogTitle>PDF Preview</DialogTitle>
                                      {readResume ? (
                                        <iframe
                                          src={readResume as string}
                                          title="PDF Preview"
                                          className="w-full h-80 border rounded"
                                        />
                                      ) : (
                                        <p className="text-xs text-gray-500">
                                          Preview unavailable.
                                        </p>
                                      )}
                                    </DialogContent>
                                  </Dialog>
                                  <button
                                    type="button"
                                    className="bg-red-500 text-white px-3 py-1 rounded text-xs"
                                    onClick={() => setResume(null)}
                                  >
                                    Remove
                                  </button>
                                </div>
                                <p className="text-xs text-gray-400">
                                  Supported: PDF
                                </p>
                              </div>
                            )}
                          </div>
                        </div>
                        <div className="grid w-full mb-2 gap-1">
                          <Label className="text-lg" htmlFor="questions">
                            Questions
                          </Label>
                          {questions.map((question: any) => (
                            <div
                              key={question._id}
                              className="grid w-full mb-2 gap-1"
                            >
                              <Label htmlFor="">{question.ques}</Label>
                              {question.type === "text" ? (
                                <Input
                                  type="text"
                                  required
                                  placeholder="Your answer"
                                  id={question._id}
                                  onChange={(e) =>
                                    handleQuestionChange(
                                      question._id,
                                      e.target.value
                                    )
                                  }
                                  value={question.answer || ""}
                                />
                              ) : (
                                <Select
                                  required
                                  onValueChange={(val) =>
                                    handleQuestionChange(question._id, val)
                                  }
                                  value={question.answer || ""}
                                >
                                  <SelectTrigger className="w-full">
                                    <SelectValue placeholder="Select an option" />
                                  </SelectTrigger>
                                  <SelectContent>
                                    <SelectGroup>
                                      {question.options.map((option: any) => (
                                        <SelectItem key={option} value={option}>
                                          {option}
                                        </SelectItem>
                                      ))}
                                    </SelectGroup>
                                  </SelectContent>
                                </Select>
                              )}
                            </div>
                          ))}
                        </div>
                      </CardContent>
                      <CardFooter>
                        <Button
                          type="submit"
                          className="w-full bg-primary text-white hover:bg-primary-dark"
                        >
                          Submit Application
                        </Button>
                      </CardFooter>
                    </Card>
                  </form>
                </div>
              </section>
            </section>
          </div>
        </main>
      )}
    </AuthProvider>
  );
}

export default Page;
