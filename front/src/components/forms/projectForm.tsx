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
import {
  clearError,
  createProject,
  getProfileProjects,
  resetProject,
  updateProject,
} from "@/store/user/projectSlice";
import { Button } from "../ui/button";
import { resetSkill, searchSkill } from "@/store/skill/skillSlice";
import { Badge } from "../ui/badge";
import { toast } from "sonner";

function ProjectForm({
  onClose,
  project,
  name,
  isUser,
  edit,
}: {
  onClose: () => void;
  project: any;
  name: string;
  isUser: boolean;
  edit: boolean;
}) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [current, setCurrent] = useState(false);
  const [skills, setSkills] = useState<any[]>([]);
  const [githubLink, setGithubLink] = useState("");
  const [liveLink, setLiveLink] = useState("");
  const [media, setMedia] = useState<any[]>([]);
  const [newMedia, setNewMedia] = useState<File[]>([]);
  const [newMediaPreview, setNewMediaPreview] = useState<string[]>([]);
  const [skillName, setSkillName] = useState("");
  const [open, setOpen] = useState(false);

  const dispatch = useDispatch<AppDispatch>();
  const { loading, created, error, message, updated } = useSelector(
    (state: RootState) => state.project
  );
  const { searchSkills, searchLoading, searchError } = useSelector(
    (state: RootState) => state.skill
  );

  function uploadMedia(e: React.ChangeEvent<HTMLInputElement>) {
    const files = e.target.files;

    if (files) {
      const fileArray = Array.from(files);
      setNewMedia([...fileArray, ...newMedia]);
      const previews = fileArray.map((file) => URL.createObjectURL(file));
      setNewMediaPreview([...previews, ...newMediaPreview]);
    }
    e.target.value = ""; // Clear the input value
  }

  function handleDeleteMedia(index: number) {
    const updatedPreviews = newMediaPreview.filter((_, i) => i !== index);
    const updatedMedia = newMedia.filter((_, i) => i !== index);
    setNewMediaPreview(updatedPreviews);
    setNewMedia(updatedMedia);
  }

  function editProject(formData: FormData) {
    media.forEach((file: any) => {
      formData.append("media", file);
    });
    if (newMedia.length > 0) {
      newMedia.forEach((file) => {
        formData.append("newMedia", file);
      });
    }
    dispatch(updateProject({ projectId: project._id, data: formData }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    const formData = new FormData();
    formData.append("title", title);
    formData.append("description", description);
    formData.append("startDate", startDate);
    formData.append("endDate", endDate);
    if (current) {
      formData.append("current", current.toString());
    } else {
      formData.append("endDate", endDate);
      formData.append("current", String(false));
    }
    skills.forEach((skill: any) => {
      formData.append("skills", skill._id);
    });
    formData.append("githubLink", githubLink);
    formData.append("liveLink", liveLink);

    if (edit) {
      editProject(formData);
      return;
    }

    newMedia.forEach((file: any) => {
      formData.append("media", file);
    });

    dispatch(createProject(formData));
  }

  useEffect(() => {
    if (created || updated) {
      onClose();
      setTitle("");
      setDescription("");
      setStartDate("");
      setEndDate("");
      setCurrent(false);
      setSkills([]);
      setGithubLink("");
      setLiveLink("");
      setMedia([]);
      setNewMedia([]);
      setNewMediaPreview([]);
      toast.success(message, {
        description: "The project has been created successfully.",
        position: "top-center",
      });
      dispatch(resetProject());
      dispatch(resetSkill());
      dispatch(getProfileProjects(name));
    }
    if (error) {
      toast.error(error, {
        description: "There was an error creating the project.",
        position: "top-center",
      });
      dispatch(clearError());
    }
  }, [created, error, message, updated]);

  useEffect(() => {
    if (project && edit) {
      setTitle(project.title);
      setDescription(project.description);
      project.startDate &&
        setStartDate(String(project.startDate)?.split("T")[0]);
      project.endDate && setEndDate(String(project.endDate)?.split("T")[0]);
      setCurrent(project.current);
      setSkills(project.skills);
      setGithubLink(project.githubLink);
      setLiveLink(project.liveLink);
      setMedia(project.media);
    }
  }, [project]);

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
          <DialogTitle className="text-lg font-semibold">
            Create Project
          </DialogTitle>
          <p className="text-sm -mt-2 text-muted-foreground">
            Create a new project to start tracking your tasks.
          </p>
        </DialogHeader>
        <div className="flex flex-col py-6 gap-3">
          {/* Project title */}
          <div className="flex flex-col gap-1">
            <Label htmlFor="title" className="text-sm font-medium">
              Project title
            </Label>
            <Input
              id="title"
              className="text-sm"
              placeholder="Project title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </div>
          {/* Project description */}
          <div className="flex flex-col gap-1">
            <Label htmlFor="description" className="text-sm font-medium">
              Description
            </Label>
            <Textarea
              rows={4}
              id="description"
              placeholder="Project description"
              className="text-sm"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>
          {/* Project start date */}
          <div className="flex flex-col gap-1">
            <Label htmlFor="startDate" className="text-sm font-medium">
              Start Date
            </Label>
            <Input
              type="date"
              id="startDate"
              className="text-sm"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
            />
          </div>
          {/* Project currently working */}
          <div className="flex items-center gap-2">
            <Input
              type="checkbox"
              id="current"
              className="h-4 w-4"
              checked={current}
              onChange={(e) => {
                setCurrent(e.target.checked);
                if (e.target.checked) {
                  setEndDate("");
                }
              }}
            />
            <Label htmlFor="current" className="text-sm font-medium">
              Currently Working On This Project
            </Label>
          </div>

          {/* Project end date */}
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
              disabled={current}
            />
          </div>
          {/* Project skills */}
          <div className="flex flex-col gap-1">
            <Label htmlFor="skills" className="text-sm font-medium">
              Skills
            </Label>
            <div className="flex flex-wrap gap-2 mb-2 mt-1">
              {skills.map((skill: any, index: number) => (
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
                        (s: any) => s._id !== skill._id
                      );
                      setSkills(updatedSkills);
                    }}
                  >
                    ✕
                  </Button>
                </Badge>
              ))}
            </div>
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
                      {searchSkills.map((skill2: any) => (
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
            <Label htmlFor="githubLink" className="text-sm font-medium">
              GitHub Link
            </Label>
            <Input
              id="githubLink"
              className="text-sm"
              value={githubLink}
              onChange={(e) => setGithubLink(e.target.value)}
            />
          </div>
          <div className="flex flex-col gap-1">
            <Label htmlFor="liveLink" className="text-sm font-medium">
              Live Link
            </Label>
            <Input
              id="liveLink"
              className="text-sm"
              value={liveLink}
              onChange={(e) => setLiveLink(e.target.value)}
            />
          </div>
          <div className="flex flex-col gap-1">
            <Label htmlFor="media" className="text-sm font-medium">
              Media
            </Label>
            <Input
              id="media"
              className="text-sm"
              type="file"
              multiple
              onChange={(e) =>
                uploadMedia(e as React.ChangeEvent<HTMLInputElement>)
              }
            />
          </div>
          <div className="flex flex-wrap gap-2">
            {newMediaPreview.map((preview, index) => (
              <div key={index} className="relative">
                <img
                  loading="lazy"
                  src={preview}
                  alt={`Preview ${index + 1}`}
                  className="h-20 object-cover rounded"
                />
                <Button
                  type="button"
                  className="absolute top-0 right-0 h-5 w-5 bg-red-500 text-white rounded-full p-1 text-xs"
                  onClick={() => handleDeleteMedia(index)}
                >
                  ✕
                </Button>
              </div>
            ))}
            {media.map((m: any, index) => (
              <div key={index} className="relative">
                <img
                  loading="lazy"
                  src={m.url}
                  alt={`Media ${index + 1}`}
                  className="h-20 object-cover rounded"
                />
                <Button
                  type="button"
                  className="absolute top-0 right-0 h-5 w-5 bg-red-500 text-white rounded-full p-1 text-xs"
                  onClick={() => {
                    const updatedMedia = media.filter(
                      (mediaItem: any) => mediaItem._id !== m._id
                    );
                    setMedia(updatedMedia);
                  }}
                >
                  ✕
                </Button>
              </div>
            ))}
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

export default ProjectForm;
