"use client";

import React, { useCallback, useEffect, useState } from "react";
import { Card, CardContent, CardFooter, CardHeader } from "../ui/card";
import { Button } from "../ui/button";
import { ArrowLeft, ArrowRight, X } from "lucide-react";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import { Textarea } from "../ui/textarea";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/store/store";
import { searchSkill } from "@/store/skill/skillSlice";
import { createJobAction, updateJobAction } from "@/store/jobs/jobSlice";
import Questions, { SpacialBadge } from "./questions";
import { Job } from "@/store/jobs/typeJob";
import { skill } from "@/store/skill/typeSkill";

function JobForm({
  job,
  companyId,
  edit,
}: {
  job?: Job;
  companyId: string;
  edit?: boolean;
}) {
  const [steps, setSteps] = useState(1);
  // form inputs
  // Step 1: Basic Information
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [location, setLocation] = useState("");
  const [allLocations, setAllLocations] = useState<string[]>([]);
  const [type, setType] = useState("full-time");
  const [workType, setWorkType] = useState("onsite");
  const [salary, setSalary] = useState("");
  // Step 2: Job Requirements
  const [experience, setExperience] = useState("");
  const [pSkills, setPSkills] = useState<skill[]>([]);
  const [eSkills, setESkills] = useState<skill[]>([]);
  const [preferSelected, setPreferSelected] = useState(false);
  const [skillName, setSkillName] = useState("");
  const [category, setCategory] = useState("");
  const [preferredSkills, setPreferredSkills] = useState<skill[]>([]);
  const [essentialSkills, setEssentialSkills] = useState<skill[]>([]);
  const [noOfOpening, setNoOfOpening] = useState(1);
  const [open, setOpen] = useState(false);
  const [pSkillName, setPSkillName] = useState("");
  const [pOpen, setPOpen] = useState(false);
  // Step 3: Questions
  // This will hold the questions and their types
  const [questions, setQuestions] = useState<any[]>([]);
  const [isActive, setIsActive] = useState(true);

  const router = useRouter();
  const dispatch = useDispatch<AppDispatch>();
  const { searchSkills } = useSelector((state: RootState) => state.skill);
  const { loading } = useSelector((state: RootState) => state.jobs);

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (loading) return;

    const jobData = {
      title,
      description,
      company: companyId,
      location: allLocations,
      type,
      salary,
      experience,
      essentialSkills,
      preferredSkills,
      category,
      noOfOpening,
      workType,
      questions,
      isActive,
    };

    if (edit) {
      // Update the job with the new data
      job && dispatch(updateJobAction({ jobId: job._id, jobData: jobData }));
    } else {
      dispatch(createJobAction(jobData));
    }
  };

  // Function to handle step submission
  // It validates the current step's inputs and moves to the next step if valid
  const stepSubmit = useCallback(
    (step: number) => {
      if (step === 2) {
        if (!title || !description || allLocations.length === 0) {
          return toast.error("please fill all fields", {
            position: "top-center",
          });
        }
      }
      if (step === 3) {
        if (!experience || !category || noOfOpening <= 0) {
          return toast.error("please fill all fields", {
            position: "top-center",
          });
        }
      }
      setSteps(step);
    },
    [steps, title, description, allLocations, experience, category, noOfOpening]
  );

  // Fetch skills when the component mounts or when skillName or pSkillName changes
  useEffect(() => {
    if (pSkillName) {
      dispatch(searchSkill(pSkillName));
    }
    if (skillName) {
      dispatch(searchSkill(skillName));
    }
  }, [dispatch, pSkillName, skillName]);

  // Update essential and preferred skills based on search results
  useEffect(() => {
    if (preferSelected) {
      setPSkills(searchSkills);
    } else {
      setESkills(searchSkills);
    }
  }, [searchSkills, preferSelected]);

  // If editing a job, populate the form with existing job data
  useEffect(() => {
    if (edit && job) {
      setTitle(job.title);
      setDescription(job.description);
      setAllLocations(job.location);
      setType(job.type);
      setWorkType(job.workType || "onsite");
      setSalary(job.salary.toString());
      setExperience(job.experience);
      setCategory(job.category);
      setPreferredSkills(job.preferredSkills || []);
      setEssentialSkills(job.essentialSkills || []);
      setNoOfOpening(job.noOfOpening);
      setQuestions(job.questions || []);
    }
  }, [edit, job]);

  return (
    <section className="flex flex-col items-center gap-10">
      {/* get back button */}
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
      <div className="w-full flex md:flex-row justify-center items-center">
        <form
          onSubmit={handleSubmit}
          className="flex justify-center gap-5 w-full md:w-1/2"
        >
          <Card className="w-full max-w-lg">
            <CardContent className="py-3">
              {steps === 1 && (
                <div className="flex flex-col gap-3 mb-5">
                  <h3 className="text-lg font-semibold">Basic Information</h3>
                  <div className="grid w-full mb-2 gap-1">
                    <Label htmlFor="jobTitle">Job Title</Label>
                    <Input
                      id="jobTitle"
                      placeholder="Enter Job Title"
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                    />
                  </div>

                  <div className="grid w-full mb-2 gap-1">
                    <Label htmlFor="location">Location</Label>
                    {allLocations.length > 0 && (
                      <div className="flex flex-wrap gap-2 mb-2">
                        {allLocations.map((loc) => (
                          <SpacialBadge
                            key={loc}
                            text={loc}
                            onClick={() =>
                              setAllLocations((prev) =>
                                prev.filter((l) => l !== loc)
                              )
                            }
                          />
                        ))}
                      </div>
                    )}
                    <div className="flex gap-1 items-center">
                      <Input
                        id="location"
                        placeholder="Enter location"
                        value={location}
                        onChange={(e) => setLocation(e.target.value)}
                      />
                      <Button
                        type="button"
                        variant="outline"
                        className={`max-w-20 ${
                          !location
                            ? "opacity-50 cursor-not-allowed"
                            : "bg-primary/90 text-white hover:bg-primary"
                        }`}
                        onClick={() => {
                          if (location) {
                            if (allLocations.includes(location)) {
                              toast.error("Location already added", {
                                position: "top-center",
                              });
                              return;
                            }
                            setAllLocations((prev) => [...prev, location]);
                            setLocation("");
                          } else {
                            toast.error("Please enter a job location", {
                              position: "top-center",
                            });
                          }
                        }}
                      >
                        Add
                      </Button>
                    </div>
                  </div>
                  <div className="grid w-full mb-2 gap-1">
                    <Label htmlFor="jobDescription">Job Description</Label>
                    <Textarea
                      id="jobDescription"
                      placeholder="Enter job description"
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                    />
                  </div>
                  <div className="grid w-full mb-2 gap-1">
                    <Label htmlFor="jobType">Job Type</Label>
                    <Select value={type} onValueChange={setType}>
                      <SelectTrigger id="jobType">
                        <SelectValue placeholder="Select work type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectGroup>
                          <SelectItem value="full-time">Full Time</SelectItem>
                          <SelectItem value="part-time">Part Time</SelectItem>
                        </SelectGroup>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="grid w-full mb-2 gap-1">
                    <Label htmlFor="workType">Work Type</Label>
                    <Select value={workType} onValueChange={setWorkType}>
                      <SelectTrigger id="workType">
                        <SelectValue placeholder="Select work type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectGroup>
                          <SelectItem value="onsite">On Site</SelectItem>
                          <SelectItem value="remote">Remote</SelectItem>
                          <SelectItem value="hybrid">Hybrid</SelectItem>
                        </SelectGroup>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="grid w-full mb-2 gap-1">
                    <Label htmlFor="salary">Salary</Label>
                    <Input
                      id="salary"
                      placeholder="Enter salary"
                      value={salary}
                      onChange={(e) => setSalary(e.target.value)}
                    />
                  </div>
                </div>
              )}
              {steps === 2 && (
                <div className="flex flex-col gap-3 mb-5">
                  <h3 className="text-lg font-semibold">Job Requirements</h3>
                  <div className="grid w-full mb-2 gap-1">
                    <Label htmlFor="experience">Experience</Label>
                    <Input
                      id="experience"
                      placeholder="Enter required experience"
                      value={experience}
                      onChange={(e) => setExperience(e.target.value)}
                    />
                  </div>
                  <div className="grid w-full mb-2 gap-1">
                    <Label htmlFor="category">Category</Label>
                    <Select value={category} onValueChange={setCategory}>
                      <SelectTrigger id="category">
                        <SelectValue placeholder="Select category" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectGroup>
                          {[
                            { value: "software", label: "Software" },
                            { value: "marketing", label: "Marketing" },
                            { value: "design", label: "Design" },
                            { value: "finance", label: "Finance" },
                            {
                              value: "human-resources",
                              label: "Human Resources",
                            },
                            { value: "sales", label: "Sales" },
                            { value: "operations", label: "Operations" },
                            {
                              value: "customer-service",
                              label: "Customer Service",
                            },
                            { value: "legal", label: "Legal" },
                            { value: "healthcare", label: "Healthcare" },
                            { value: "education", label: "Education" },
                            { value: "engineering", label: "Engineering" },
                            { value: "it", label: "Information Technology" },
                            { value: "other", label: "Other" },
                          ].map((cat) => (
                            <SelectItem key={cat.value} value={cat.value}>
                              {cat.label}
                            </SelectItem>
                          ))}
                        </SelectGroup>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="flex flex-col gap-1">
                    <Label
                      htmlFor="essentialSkills"
                      className="text-sm font-medium"
                    >
                      Essential Skills
                    </Label>
                    {essentialSkills.length > 0 && (
                      <div className="flex flex-wrap gap-2 mb-2 mt-1">
                        {essentialSkills.map((skill) => (
                          <SpacialBadge
                            key={skill._id}
                            text={skill.name}
                            onClick={() =>
                              setEssentialSkills((prev) =>
                                prev.filter((s) => s._id !== skill._id)
                              )
                            }
                          />
                        ))}
                      </div>
                    )}
                    <div className="relative">
                      <Input
                        id="essentialSkills"
                        type="text"
                        placeholder="Search essential skills..."
                        value={skillName}
                        onChange={(e) => setSkillName(e.target.value)}
                        onFocusCapture={(e) => {
                          e.preventDefault();
                          setPreferSelected(false);
                          setOpen(true);
                        }}
                        onBlur={() => setTimeout(() => setOpen(false), 300)}
                        className="w-full"
                      />
                      {eSkills.length > 0 && skillName && open && (
                        <div className="absolute top-full left-0 w-full z-10 mt-1 bg-white rounded-md border shadow-md max-h-60 overflow-y-auto">
                          {eSkills.map((skill2) => (
                            <div
                              key={skill2._id}
                              onClick={() => {
                                setEssentialSkills((prev) => [...prev, skill2]);
                                setSkillName("");
                                setOpen(false);
                              }}
                              className="cursor-pointer hover:bg-gray-100 p-2 text-sm text-gray-800 flex items-center gap-2"
                            >
                              {skill2.name}
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="flex flex-col gap-1">
                    <Label
                      htmlFor="preferredSkills"
                      className="text-sm font-medium"
                    >
                      Preferred Skills
                    </Label>
                    {preferredSkills.length > 0 && (
                      <div className="flex flex-wrap gap-2 mb-2 mt-1">
                        {preferredSkills.map((skill) => (
                          <SpacialBadge
                            key={skill._id}
                            text={skill.name}
                            onClick={() =>
                              setPreferredSkills((prev) =>
                                prev.filter((s) => s._id !== skill._id)
                              )
                            }
                          />
                        ))}
                      </div>
                    )}
                    <div className="relative">
                      <Input
                        id="preferredSkills"
                        type="text"
                        placeholder="Search preferred skills..."
                        value={pSkillName}
                        onChange={(e) => {
                          setPreferSelected(true);
                          setPSkillName(e.target.value);
                        }}
                        onFocusCapture={() => {
                          setPreferSelected(true);
                          setPOpen(true);
                        }}
                        onBlur={() => setTimeout(() => setPOpen(false), 300)}
                        className="w-full"
                      />
                      {pSkills.length > 0 && pSkillName && pOpen && (
                        <div className="absolute top-full left-0 w-full z-10 mt-1 bg-white rounded-md border shadow-md max-h-60 overflow-y-auto">
                          {pSkills.map((skill2) => (
                            <div
                              key={skill2._id}
                              onClick={() => {
                                setPreferredSkills((prev) => [...prev, skill2]);
                                setPSkillName("");
                                setPOpen(false);
                              }}
                              className="cursor-pointer hover:bg-gray-100 p-2 text-sm text-gray-800 flex items-center gap-2"
                            >
                              {skill2.name}
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="grid w-full mb-2 gap-1">
                    <Label htmlFor="openings">Number of Openings</Label>
                    <Input
                      id="openings"
                      type="number"
                      placeholder="Enter number of openings"
                      value={noOfOpening}
                      onChange={(e) => setNoOfOpening(Number(e.target.value))}
                    />
                  </div>
                </div>
              )}
              {steps === 3 && (
                <div className="flex flex-col gap-3 mb-5">
                  <h3 className="text-lg font-semibold">Questions</h3>
                  <Questions
                    questions={questions}
                    setQuestions={setQuestions}
                    isActive={isActive}
                    setIsActive={setIsActive}
                    edit={edit ? edit : false}
                  />
                </div>
              )}
            </CardContent>
            <CardFooter className="flex justify-between items-center p-3">
              {steps > 1 && (
                <Button
                  type="button"
                  disabled={loading}
                  variant="outline"
                  onClick={() => setSteps((prev) => prev - 1)}
                >
                  <ArrowLeft className="w-4 h-4" />
                  Back
                </Button>
              )}
              {steps < 3 && (
                <Button
                  type="button"
                  disabled={loading}
                  onClick={() => stepSubmit(steps + 1)}
                  className="bg-primary/90 justify-end text-white hover:bg-primary"
                >
                  Next
                  <ArrowRight className="w-4 h-4" />
                </Button>
              )}
              {steps === 3 && (
                <Button
                  type="submit"
                  className="bg-primary/90 text-white hover:bg-primary"
                  disabled={loading}
                >
                  {edit ? "Update Job" : "Create Job"}
                </Button>
              )}
            </CardFooter>
          </Card>
        </form>
      </div>
    </section>
  );
}

export default JobForm;
