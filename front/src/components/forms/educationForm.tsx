"use client";

import React, { useEffect, useState } from "react";
import {
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../ui/dialog";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import { Textarea } from "../ui/textarea";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/store/store";
import { Button } from "../ui/button";
import { resetSkill, searchSkill } from "@/store/skill/skillSlice";
import { Badge } from "../ui/badge";
import { toast } from "sonner";
import {
  clearError,
  createEducation,
  education,
  getProfileEducations,
  resetEducation,
  updateEducation,
} from "@/store/user/educationSlice";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectTrigger,
  SelectItem,
  SelectValue,
} from "../ui/select";
import { skill } from "@/store/skill/typeSkill";

function EducationForm({
  onClose,
  education,
  username,
  isUser,
  edit,
}: {
  onClose: () => void;
  education: education;
  username: string;
  isUser: boolean;
  edit: boolean;
}) {
  const [school, setSchool] = useState("");
  const [degree, setDegree] = useState("");
  const [field, setField] = useState("");
  const [grade, setGrade] = useState("");
  const [description, setDescription] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [currentlyStudying, setCurrentlyStudying] = useState(false);
  const [skills, setSkills] = useState<skill[]>([]);
  const [skillName, setSkillName] = useState("");
  const [open, setOpen] = useState(false);
  const dispatch = useDispatch<AppDispatch>();
  const { loading, created, updated, message, error } = useSelector(
    (state: RootState) => state.education
  );
  const { searchSkills, searchLoading, searchError } = useSelector(
    (state: RootState) => state.skill
  );

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    if (!currentlyStudying && !endDate) {
      toast.error("Please select an end date", {
        description: "End date is required if not currently studying.",
        position: "top-center",
      });
      return;
    }

    if (new Date(startDate) > new Date(endDate)) {
      toast.error("End date must be after start date", {
        description: "Please select a valid end date.",
        position: "top-center",
      });
      return;
    }

    const formData = {
      school,
      degree,
      fieldOfStudy: field,
      startDate,
      endDate: currentlyStudying ? "" : endDate,
      skills: skills.map((skill) => skill._id),
      description,
      currentlyStudying,
      grade,
    };

    if (edit) {
      dispatch(updateEducation({ educationId: education._id, form: formData }));
      return;
    }

    dispatch(createEducation(formData));
  }

  useEffect(() => {
    if (created || updated) {
      onClose();
      setDescription("");
      setSchool("");
      setDegree("");
      setField("");
      setGrade("");
      setCurrentlyStudying(false);
      setSkillName("");
      setStartDate("");
      setEndDate("");
      setSkills([]);
      toast.success(message, {
        description: "The education has been created successfully.",
        position: "top-center",
      });
      dispatch(resetEducation());
      dispatch(resetSkill());
      dispatch(getProfileEducations(username));
    }
    if (error) {
      toast.error(error, {
        description: "There was an error creating the education.",
        position: "top-center",
      });
      dispatch(clearError());
    }
  }, [created, error, message, updated]);

  useEffect(() => {
    if (education && edit) {
      setSchool(education.school);
      setDegree(education.degree);
      setField(education.fieldOfStudy);
      setDescription(education.description || "");
      setStartDate(
        education.startDate && education.startDate.toString().split("T")[0]
      );
      setEndDate(
        (education.endDate && education.endDate.toString().split("T")[0]) || ""
      );
      setCurrentlyStudying(education.currentlyStudying);
      setSkills(education.skills);
      setGrade(education.grade || "");
      setOpen(false);
    }
  }, [education]);

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
      <form onSubmit={handleSubmit} className="">
        <DialogHeader>
          <DialogTitle className="text-lg -mb-1 font-semibold">
            {edit ? "Edit" : "Add"} Education
          </DialogTitle>
          <p className="text-sm text-muted-foreground">
            {edit
              ? "Edit your education details"
              : "Add your education details"}
          </p>
        </DialogHeader>
        <div className="flex flex-col py-6 gap-3">
          <div className="flex flex-col gap-1">
            <Label htmlFor="title" className="text-sm font-medium">
              School/University/College/Organization
            </Label>
            <Input
              id="title"
              className="text-sm"
              placeholder="School/University/College/Organization"
              required
              autoFocus
              value={school}
              onChange={(e) => setSchool(e.target.value)}
              maxLength={100}
              autoComplete="off"
            />
          </div>
          <div className="flex flex-col gap-1">
            <Label htmlFor="degree" className="text-sm font-medium">
              Degree
            </Label>
            <Input
              id="degree"
              className="text-sm"
              placeholder="Degree"
              required
              value={degree}
              onChange={(e) => setDegree(e.target.value)}
              maxLength={100}
              autoComplete="off"
            />
          </div>
          <div className="flex flex-col gap-1">
            <Label htmlFor="field" className="text-sm font-medium">
              Field of Study
            </Label>
            <Select required value={field} onValueChange={setField}>
              <SelectTrigger>
                <SelectValue placeholder="Select field of study" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectItem value="Computer Science">
                    Computer Science
                  </SelectItem>
                  <SelectItem value="Information Technology">
                    Information Technology
                  </SelectItem>
                  <SelectItem value="Software Engineering">
                    Software Engineering
                  </SelectItem>
                  <SelectItem value="Data Science">Data Science</SelectItem>
                  <SelectItem value="Business Administration">
                    Business Administration
                  </SelectItem>
                  <SelectItem value="Marketing">Marketing</SelectItem>
                  <SelectItem value="Finance">Finance</SelectItem>
                  <SelectItem value="Economics">Economics</SelectItem>
                  <SelectItem value="Psychology">Psychology</SelectItem>
                  <SelectItem value="Biology">Biology</SelectItem>
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>
          <div className="flex flex-col gap-1">
            <Label htmlFor="description" className="text-sm font-medium">
              Description
            </Label>
            <Textarea
              rows={4}
              id="description"
              placeholder="Education description"
              className="text-sm"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              maxLength={500}
            />
          </div>
          <div className="flex flex-col gap-1">
            <Label htmlFor="startDate" className="text-sm font-medium">
              Start Date
            </Label>
            <Input
              type="date"
              id="startDate"
              className="text-sm"
              required
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
            />
          </div>
          <div className="flex items-center gap-1">
            <Input
              type="checkbox"
              id="current"
              className="h-4 w-4"
              checked={currentlyStudying}
              onChange={(e) => {
                setCurrentlyStudying(e.target.checked);
                if (e.target.checked) {
                  setEndDate("");
                }
              }}
            />
            <Label htmlFor="current" className="text-sm font-medium">
              Currently Studying
            </Label>
          </div>
          <div className="flex flex-col gap-1">
            <Label htmlFor="endDate" className="text-sm font-medium">
              End Date
            </Label>
            <Input
              type="date"
              id="endDate"
              className="text-sm"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              disabled={currentlyStudying}
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
                          className="cursor-pointer hover:bg-gray-100 p-2 text-sm text-gray-800 flex items-center gap-1"
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
            <Label htmlFor="githubLink" className="text-sm font-medium">
              grade
            </Label>
            <Input
              id="githubLink"
              className="text-sm"
              placeholder="Grade"
              type="number"
              value={grade}
              onChange={(e) => setGrade(e.target.value)}
              min={0}
              step="any"
              max={100}
            />
          </div>
        </div>
        <DialogFooter className="flex justify-end gap-2">
          <Button
            type="button"
            variant="outline"
            onClick={onClose}
            disabled={loading}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            disabled={loading}
            className="bg-blue-500 text-white"
          >
            {edit ? "Update" : "Create"}
          </Button>
        </DialogFooter>
      </form>
    </DialogContent>
  );
}

export default EducationForm;
