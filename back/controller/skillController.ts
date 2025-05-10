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
    if (!name || !description || !category) {
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
    if (!name || !description || !category) {
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

const deleteSkillUser = expressAsyncHandler(
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
    const skillIndex = user.skills.findIndex(
      (s) => s._id.toString() === skillId
    );
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
    const user = await User.findById(userId)
      .populate("skills._id", "name")
      .populate("skills.accessedFrom", "name avatar");
    if (!user) {
      return next(new ErrorHandler("User not found", 404));
    }

    const skills = user.skills.map((skill) => skill._id);
    res.status(200).json({
      message: "Skills fetched successfully",
      skills,
    });
  }
);

const updateSkillUser = expressAsyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const userId = req.user._id; // Assuming you have user ID in req.user
    const { skillId } = req.params;
    const { from, accessedFrom } = req.body;

    // Check if the skill belongs to the user
    const user = await User.findById(userId);

    if (!user) {
      return next(new ErrorHandler("User not found", 404));
    }

    const skillIndex = user.skills.findIndex(
      (s) => s._id.toString() === skillId
    );
    if (skillIndex === -1) {
      return next(
        new ErrorHandler("You do not have permission to update this skill", 403)
      );
    }

    // Update the skill
    user.skills[skillIndex].from = from;
    user.skills[skillIndex].accessedFrom = accessedFrom;

    await user.save();

    res.status(200).json({
      message: "Skill updated successfully",
      skill: user.skills[skillIndex],
    });
  }
);

export {
  addSkill,
  getAllSkills,
  getSkillById,
  updateSkill,
  deleteSkill,
  deleteSkillUser,
  getUserSkills,
  updateSkillUser,
};
