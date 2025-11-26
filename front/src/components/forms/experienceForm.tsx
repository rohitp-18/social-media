"use client";

import React, { use, useEffect, useState } from "react";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import {
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../ui/dialog";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/store/store";
import { toast } from "sonner";
import {
  clearError,
  createExperience,
  getProfileExperiences,
  resetExperience,
  updateExperience,
} from "@/store/user/experienceSlice";
import { resetSkill, searchSkill } from "@/store/skill/skillSlice";
import { DialogDescription } from "@radix-ui/react-dialog";
import { Textarea } from "../ui/textarea";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";
import { experience } from "@/store/user/typeUser";
import { skill } from "@/store/skill/typeSkill";

interface form {
  title?: string;
  update?: boolean;
}

function ExperienceForm({
  onClose,
  experience,
  edit,
}: {
  onClose: () => void;
  experience: experience;
  edit: boolean;
}) {
  const [title, setTitle] = useState("");
  const [startDate, setStartDate] = useState<string | null>();
  const [endDate, setEndDate] = useState<string | null>();
  const [description, setDescription] = useState("");
  const [skills, setSkills] = useState<skill[]>([]);
  const [working, setWorking] = useState(false);
  const [jobType, setJobType] = useState("");
  const [location, setLocation] = useState("");
  const [companyName, setCompanyName] = useState("");
  const [skillName, setSkillName] = useState("");
  const [open, setOpen] = useState(false);
  const [workType, setWorkType] = useState("");

  const { created, updated, loading, error, message } = useSelector(
    (state: RootState) => state.experience
  );
  const { searchSkills } = useSelector((state: RootState) => state.skill);
  const dispatch = useDispatch<AppDispatch>();

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const form = {
      title,
      startDate,
      endDate,
      description,
      skills: skills.map((skill) => skill._id),
      working,
      jobType,
      location,
      companyName,
    };

    if (edit) {
      dispatch(
        updateExperience({ experienceId: experience._id, experienceData: form })
      );
      return;
    }

    dispatch(createExperience(form));
  }

  useEffect(() => {
    if (created || updated) {
      setTitle("");
      setStartDate(null);
      setEndDate(null);
      setDescription("");
      setSkills([]);
      setWorking(false);
      setWorkType("");
      setJobType("");
      setLocation("");
      setCompanyName("");
      toast.success(message, {
        description: "The experience has been added successfully.",
        position: "top-center",
      });
      dispatch(resetExperience());
      dispatch(resetSkill());
      onClose();
    }
    if (error) {
      toast.error(error, {
        description: "There was an error adding the experience.",
        position: "top-center",
      });
      dispatch(clearError());
    }
  }, [created, error, message, updated]);

  useEffect(() => {
    if (experience && edit) {
      setTitle(experience.title);
      experience.startDate &&
        setStartDate(String(experience.startDate)?.split("T")[0]);
      experience.endDate &&
        setEndDate(String(experience.endDate)?.split("T")[0]);
      setDescription(experience.description);
      setSkills(experience.skills);
      setWorking(experience.working);
      setJobType(experience.jobType);
      setLocation(experience.location);
      setWorkType(experience.workType);
      setCompanyName(experience.companyName);
    }
  }, [experience, edit]);

  useEffect(() => {
    if (skillName) {
      dispatch(searchSkill(skillName));
    }
  }, [skillName]);
  return (
    <DialogContent
      style={{ scrollbarWidth: "thin", scrollbarColor: "gray transparent" }}
      className="overflow-y-auto max-h-[90vh]"
    >
      <form onSubmit={handleSubmit}>
        <DialogHeader>
          <DialogTitle>{edit ? "Edit" : "Add"} Experience</DialogTitle>
          <p className="text-sm text-muted-foreground -mt-6 mb-3">
            {edit ? "Edit" : "Add"} your work experience details
          </p>
        </DialogHeader>
        <div className="flex flex-col py-5 gap-6">
          <div className="flex flex-col gap-1">
            <Label htmlFor="title">Title</Label>
            <Input
              type="text"
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Enter your job title"
              required
            />
          </div>
          <div className="flex flex-col gap-1">
            <Label htmlFor="companyName">Company Name</Label>
            <Input
              type="text"
              id="companyName"
              value={companyName}
              onChange={(e) => setCompanyName(e.target.value)}
              placeholder="Enter your company name"
              required
            />
          </div>
          <div className="flex flex-col gap-1">
            <Label htmlFor="location">Location</Label>
            <Input
              type="text"
              id="location"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              placeholder="Enter your location"
              required
            />
          </div>
          <div className="flex flex-col gap-1">
            <Label htmlFor="startDate">Start Date</Label>
            <Input
              type="date"
              id="startDate"
              value={startDate?.toString()}
              placeholder="Enter your start date"
              onChange={(e) => setStartDate(e.target.value)}
              required
            />
          </div>
          <div className="flex items-center gap-2">
            <Input
              type="checkbox"
              id="working"
              className="h-4 w-4"
              checked={working}
              onChange={(e) => {
                setWorking(e.target.checked);
                if (e.target.checked) {
                  setEndDate("");
                }
              }}
            />
            <Label htmlFor="working" className="text-sm font-medium">
              workingly Working On This experience
            </Label>
          </div>
          <div className="flex flex-col gap-1">
            <Label htmlFor="endDate">End Date</Label>
            <Input
              type="date"
              id="endDate"
              value={endDate?.toString()}
              required={!working}
              disabled={working}
              onChange={(e) => setEndDate(e.target.value)}
            />
          </div>
          <div className="flex flex-col gap-1">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              rows={4}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Enter your job description"
            />
          </div>
          <div className="flex flex-col gap-1">
            <Label htmlFor="skills" className="text-sm font-medium">
              Skills
            </Label>
            {skills.length > 0 && (
              <div className="flex flex-wrap gap-2 mb-2 mt-1">
                {skills.map((skill, index: number) => (
                  <Badge
                    key={index}
                    className="flex items-center gap-1 px-1 py-1 bg-gray-200 text-gray-600 hover:bg-gray-300 rounded-md opacity-80"
                  >
                    <span className="text-xs">{skill.name}</span>
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="h-4 text-xs w-4 p-0.5 text-gray-500 hover:text-red-500"
                      onClick={() => {
                        const updatedSkills = skills.filter(
                          (s) => s._id !== skill._id
                        );
                        setSkills(updatedSkills);
                      }}
                    >
                      ✕
                    </Button>
                  </Badge>
                ))}
              </div>
            )}
            <div className="relative">
              <Input
                type="text"
                id="skill"
                placeholder="Search skills..."
                value={skillName}
                onChange={(e) => setSkillName(e.target.value)}
                onFocusCapture={() => {
                  setOpen(true);
                }}
                onBlur={() => {
                  setTimeout(() => {
                    setOpen(false);
                  }, 300);
                }}
                className="w-full"
              />
              {searchSkills.length > 0 && skillName && open && (
                <div className="absolute top-full left-0 w-full z-10 mt-1 bg-white rounded-md border shadow-md max-h-60 overflow-y-auto">
                  {searchSkills.length === 0 ? (
                    <div className="py-2 px-3 text-sm text-gray-500">
                      No skills found.
                    </div>
                  ) : (
                    <div className="max-h-60">
                      {searchSkills.map((skill2) => (
                        <div
                          key={skill2._id}
                          onClick={() => {
                            setSkills((prev) => [...prev, skill2]);
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
              )}
            </div>
          </div>
          <div className="flex flex-col gap-1">
            <Label htmlFor="jobType">Job Type</Label>
            <Select value={jobType} onValueChange={setJobType}>
              <SelectTrigger className="">
                <SelectValue placeholder="Select job type" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectItem value="full-time">Full Time</SelectItem>
                  <SelectItem value="part-time">Part Time</SelectItem>
                  <SelectItem value="internship">Internship</SelectItem>
                  <SelectItem value="freelance">Freelance</SelectItem>
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>
          <div className="flex flex-col gap-1">
            <Label htmlFor="workType">Work Type</Label>
            <Select value={workType} onValueChange={setWorkType}>
              <SelectTrigger className="">
                <SelectValue placeholder="Select work type" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectItem value="remote">Remote</SelectItem>
                  <SelectItem value="onsite">Onsite</SelectItem>
                  <SelectItem value="hybrid">Hybrid</SelectItem>
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>
        </div>
        <DialogFooter>
          <Button type="submit" disabled={loading} className="w-full">
            {loading ? "Loading..." : edit ? "Update" : "Add"} Experience
          </Button>
          <DialogClose />
        </DialogFooter>
      </form>
    </DialogContent>
  );
}

export default ExperienceForm;
