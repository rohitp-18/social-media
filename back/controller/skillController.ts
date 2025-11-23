import expressAsyncHandler from "express-async-handler";
import { Request, Response, NextFunction } from "express";
import Skill from "../model/skillModel";
import ErrorHandler from "../utils/errorHandler";
import User from "../model/userModel";

const addSkill = expressAsyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const { name, description, category } = req.body;
    const userId = req.user._id; // Assuming you have user ID in req.user

    // Validate input
    if (!name) {
      return next(new ErrorHandler("Please provide all required fields", 400));
    }

    // Create a new skill
    const newSkill = await Skill.create({
      name,
      description,
      category,
      user: userId,
    });

    res.status(200).json({
      message: "Skill added successfully",
      skill: newSkill,
    });
  }
);

const getAllSkills = expressAsyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const skills = await Skill.find({});
    res.status(200).json({
      message: "Skills fetched successfully",
      skills,
    });
  }
);

const getSkillById = expressAsyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const skillId = req.params.id;
    const skill = await Skill.findById(skillId);

    if (!skill) {
      return next(new ErrorHandler("Skill not found", 404));
    }

    res.status(200).json({
      message: "Skill fetched successfully",
      skill,
    });
  }
);

const updateSkill = expressAsyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const skillId = req.params.id;
    const { name, description, category } = req.body;

    // Validate input
    if (!name) {
      return next(new ErrorHandler("Please provide all required fields", 400));
    }

    const skill = await Skill.findByIdAndUpdate(
      skillId,
      { name, description, category },
      { new: true }
    );

    if (!skill) {
      return next(new ErrorHandler("Skill not found", 404));
    }

    res.status(200).json({
      message: "Skill updated successfully",
      skill,
    });
  }
);

const deleteSkill = expressAsyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const skillId = req.params.id;

    const skill = await Skill.findByIdAndDelete(skillId);
    if (!skill) {
      return next(new ErrorHandler("Skill not found", 404));
    }

    // Remove the skill from all users who have it
    await User.updateMany(
      { "skills._id": skillId },
      { $pull: { skills: { _id: skillId } } }
    );

    res.status(200).json({
      message: "Skill deleted successfully",
    });
  }
);

const removeSkillUser = expressAsyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const skillId = req.params.id;

    const user = await User.findById(req.user._id);
    if (!user) {
      return next(new ErrorHandler("User not found", 404));
    }

    const skill = await Skill.findById(skillId);
    if (!skill) {
      return next(new ErrorHandler("Skill not found", 404));
    }

    // Check if the skill belongs to the user
    const skillIndex = user.skills.findIndex((s) => s.toString() === skillId);
    if (skillIndex === -1) {
      return next(
        new ErrorHandler("You do not have permission to delete this skill", 403)
      );
    }

    // Remove the skill from the user's skills array
    user.skills.splice(skillIndex, 1);
    await user.save();

    res.status(200).json({
      message: "Skill deleted successfully",
    });
  }
);

const getUserSkills = expressAsyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const userId = req.params.id;
    const user = await User.findById(userId).populate("skills");
    if (!user) {
      return next(new ErrorHandler("User not found", 404));
    }

    const skills = user.skills.map((skill) => skill);
    res.status(200).json({
      message: "Skills fetched successfully",
      skills,
    });
  }
);

const addUserSkill = expressAsyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const userId = req.user._id; // Assuming you have user ID in req.user
    const { skillId, proficiency, description } = req.body;

    // Validate input
    if (!skillId) {
      return next(new ErrorHandler("Please provide all required fields", 400));
    }

    // Check if the skill exists
    const skill = await Skill.findById(skillId);
    if (!skill) {
      return next(new ErrorHandler("Skill not found", 404));
    }

    // Add the skill to the user's skills array
    const user = await User.findById(userId);
    if (!user) {
      return next(new ErrorHandler("User not found", 404));
    }

    user.skills.push({ skill: skillId, proficiency, description });
    await user.save();

    res.status(200).json({
      message: "Skill added successfully",
      skill,
    });
  }
);

const updateSkillUser = expressAsyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const userId = req.user._id; // Assuming you have user ID in req.user
    const { skillId } = req.params;
    const { proficiency, description } = req.body;

    // Check if the skill belongs to the user
    const user = await User.findById(userId);

    if (!user) {
      return next(new ErrorHandler("User not found", 404));
    }

    const skillIndex = user.skills.findIndex(
      (s) => s.skill.toString() === skillId
    );
    if (skillIndex === -1) {
      return next(
        new ErrorHandler("You do not have permission to update this skill", 403)
      );
    }

    // Update the skill
    user.skills[skillIndex].proficiency = proficiency;
    user.skills[skillIndex].description = description;

    await user.save();

    res.status(200).json({
      message: "Skill updated successfully",
      skill: user.skills[skillIndex],
    });
  }
);

const searchSkills = expressAsyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const { query } = req.query;

    // if (!query) {
    //   return next(new ErrorHandler("Please provide a search query", 400));
    // }

    const skills = await Skill.find({
      name: { $regex: query, $options: "i" },
    }).limit(20);

    res.status(200).json({
      message: "Skills fetched successfully",
      skills,
    });
  }
);

export {
  addSkill,
  getAllSkills,
  getSkillById,
  updateSkill,
  deleteSkill,
  removeSkillUser,
  getUserSkills,
  addUserSkill,
  updateSkillUser,
  searchSkills,
};
