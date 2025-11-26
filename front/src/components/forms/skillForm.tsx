import React, { useEffect, useState, useRef } from "react";
import {
  DialogContent,
  DialogHeader,
  DialogDescription,
  DialogTitle,
  DialogFooter,
  DialogClose,
} from "../ui/dialog";
import { Button } from "../ui/button";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import axios from "@/store/axios";
import { isAxiosError } from "axios";
import {
  Select,
  SelectGroup,
  SelectItem,
  SelectContent,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { toast } from "sonner";
import { Textarea } from "../ui/textarea";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/store/store";
import { getUser, userProfile } from "@/store/user/userSlice";
import e from "express";
import { skill } from "@/store/skill/typeSkill";

function SkillForm({
  onClose,
  username,
  edit,
  skill: editSkill,
}: {
  onClose: () => void;
  username: string;
  edit?: boolean;
  skill?: skill;
}) {
  const [skillName, setSkillName] = useState("");
  const [skills, setSkills] = useState<skill[]>([]);
  const [loading, setLoading] = useState(false);
  const [skill, setSkill] = useState<skill>();
  const [open, setOpen] = useState(false);
  const [proficiency, setProficiency] = useState("");
  const [description, setDescription] = useState("");

  const dispatch = useDispatch<AppDispatch>();

  async function fetchSkills() {
    try {
      setLoading(true);

      const { data } = await axios.get("/skills/search?query=" + skillName);

      setSkills(data.skills);
      setLoading(false);
    } catch (error: unknown) {}
  }

  async function updateSkill() {
    if (!skill) return;
    try {
      setLoading(true);

      const { data } = await axios.put("/skills/user/update", {
        skillId: skill._id,
        proficiency,
        description,
      });

      if (data) {
        toast.success("Skill updated successfully", {
          description: "The skill has been updated successfully.",
          position: "top-center",
        });
      }
    } catch (error: unknown) {
      if (isAxiosError(error)) {
        toast.error(error.response?.data.message, {
          description: "There was an error updating the skill.",
          position: "top-center",
        });
        return;
      }
      toast.error("Error updating skill", {
        description: "There was an error updating the skill.",
        position: "top-center",
      });
    } finally {
      setLoading(false);
    }
  }

  async function formSubmit(e: React.FormEvent) {
    e.preventDefault();

    if (edit) {
      await updateSkill();
      return;
    }

    if (!skill) {
      return;
    }

    if (!skill._id) {
      toast.error("Please select a skill", { position: "top-center" });
      return;
    }

    if (skill.name !== skillName) {
      toast.error("Please select a proper skill", { position: "top-center" });
      return;
    }
    try {
      setLoading(true);
      await axios.post("/skills/user/new", {
        skillId: skill._id,
        proficiency,
        description,
      });
      toast.success("Skill added successfully", {
        position: "top-center",
      });
      setLoading(false);
      dispatch(userProfile(username));
      dispatch(getUser());
      onClose();
    } catch (error: unknown) {
      setLoading(false);
      if (isAxiosError(error)) {
        toast.error(error.response?.data.message, {
          position: "top-center",
        });
        return;
      }
      toast.error("An error occurred while submitting the skill", {
        position: "top-center",
      });
    }
  }

  useEffect(() => {
    fetchSkills();
  }, [skillName]);

  useEffect(() => {
    if (skill) {
      setSkillName(skill.name);
    }
  }, [skill]);

  useEffect(() => {
    if (edit && editSkill) {
      setSkillName(editSkill.name);
      setSkill(editSkill);
      setProficiency(editSkill.proficiency);
      setDescription(editSkill.description);
    }
  }, [edit, editSkill]);

  return (
    <DialogContent
      style={{ scrollbarWidth: "thin" }}
      className="sm:max-w-[425px] overflow-y-auto max-h-[90vh] w-full z-50"
    >
      <form onSubmit={formSubmit}>
        <DialogHeader>
          <DialogTitle className="text-center">Add Skill</DialogTitle>
          <DialogDescription className="text-center">
            Add a new skill to your profile
          </DialogDescription>
        </DialogHeader>

        <div className="flex flex-col gap-4 py-6">
          <div className="flex flex-col gap-1 justify-start">
            <Label htmlFor="name" className="text-sm font-medium">
              Skill Name
            </Label>
            <div className="relative">
              <Input
                type="text"
                id="name"
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
              {skills.length > 0 && skillName && open && (
                <div className="absolute top-full left-0 w-full z-10 mt-1 bg-white rounded-md border shadow-md max-h-60 overflow-y-auto">
                  {skills.length === 0 ? (
                    <div className="py-2 px-3 text-sm text-gray-500">
                      No skills found.
                    </div>
                  ) : (
                    <div className="max-h-60 overflow-y-auto">
                      {skills.map((skill2) => (
                        <div
                          key={skill2._id}
                          onClick={() => {
                            setSkill(skill2);
                            setSkillName(skill2.name);
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

          <div className="flex flex-col gap-1 justify-start">
            <Label htmlFor="proficiency" className="text-sm font-medium">
              Proficiency Level
            </Label>
            <Select onValueChange={setProficiency} defaultValue={proficiency}>
              <SelectTrigger>
                <SelectValue placeholder="Select proficiency level" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectItem value="beginner">Beginner</SelectItem>
                  <SelectItem value="intermediate">Intermediate</SelectItem>
                  <SelectItem value="advanced">Advanced</SelectItem>
                  <SelectItem value="expert">Expert</SelectItem>
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>

          <div className="flex flex-col gap-1 justify-start">
            <Label htmlFor="description" className="text-sm font-medium">
              Description
            </Label>
            <Textarea
              id="description"
              placeholder="Describe your experience with this skill"
              rows={3}
              value={description}
              className="resize-none"
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>
        </div>

        <DialogFooter className="gap-2">
          <div className="flex justify-end gap-4">
            <Button
              type="submit"
              className="w-full bg-blue-600 hover:bg-blue-700 text-white"
            >
              {edit ? "Save Changes" : "Add Skill"}
            </Button>
            <DialogClose asChild>
              <Button
                variant="outline"
                type="button"
                onClick={onClose}
                disabled={loading}
                className="w-full border-gray-300 hover:bg-gray-100"
              >
                Cancel
              </Button>
            </DialogClose>
          </div>
        </DialogFooter>
      </form>
    </DialogContent>
  );
}

export default SkillForm;
