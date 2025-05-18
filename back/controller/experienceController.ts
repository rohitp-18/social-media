import expressAsyncHandler from "express-async-handler";
import { Request, Response, NextFunction } from "express";
import Experience from "../model/experienceModel";
import ErrorHandler from "../utils/errorHandler";
import User from "../model/userModel";

const createExperience = expressAsyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const {
      title,
      companyName,
      location,
      startDate,
      endDate,
      description,
      workType,
      skills,
      jobType,
      working,
    } = req.body;

    // Validate input
    if (!title || !companyName || !startDate || !location) {
      return next(new ErrorHandler("Please provide all required fields", 400));
    }

    const experience = await Experience.create({
      user: req.user._id,
      title,
      companyName,
      location,
      startDate,
      endDate,
      working,
      description,
      workType,
      skills,
      jobType,
    });

    await experience.populate("skills", "name _id");

    res.status(201).json({
      message: "Experience created successfully",
      experience,
    });
  }
);

const getUserExperiences = expressAsyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const experiences = await Experience.find({
      user: req.user._id,
      isDeleted: false,
    });

    res.status(200).json({
      message: "Experiences fetched successfully",
      experiences,
    });
  }
);

const getExperienceById = expressAsyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const experienceId = req.params.id;
    const experience = await Experience.findById(experienceId);

    if (!experience || experience.isDeleted) {
      return next(new ErrorHandler("Experience not found", 404));
    }

    res.status(200).json({
      message: "Experience fetched successfully",
      experience,
    });
  }
);

const updateExperience = expressAsyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const experienceId = req.params.id;
    const {
      title,
      companyName,
      location,
      startDate,
      endDate,
      description,
      workType,
      skills,
      jobType,
      working,
    } = req.body;

    // Validate input
    if (!title || !companyName || !startDate || !location) {
      return next(new ErrorHandler("Please provide all required fields", 400));
    }

    const experience = await Experience.findByIdAndUpdate(
      experienceId,
      {
        title,
        location,
        startDate,
        endDate,
        description,
        workType,
        skills,
        jobType,
        working,
      },
      { new: true }
    );

    if (!experience) {
      return next(new ErrorHandler("Experience not found", 404));
    }

    res.status(200).json({
      message: "Experience updated successfully",
      experience,
    });
  }
);

const deleteExperience = expressAsyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const experienceId = req.params.id;
    const experience = await Experience.findById(experienceId);

    if (!experience) {
      return next(new ErrorHandler("Experience not found", 404));
    }

    if (experience.user.toString() !== req.user._id.toString()) {
      return next(
        new ErrorHandler("Not authorized to delete this experience", 403)
      );
    }

    experience.isDeleted = true;
    experience.deletedAt = new Date();

    await experience.save();

    res.status(200).json({
      message: "Experience deleted successfully",
    });
  }
);

const profileExperience = expressAsyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const userId = req.params.id;

    const user = await User.findOne({ username: userId, deleted: false });

    if (!user) {
      return next(new ErrorHandler("User not found", 404));
    }

    const experiences = await Experience.find({
      user: user._id,
      isDeleted: false,
    }).populate("skills", "name _id");

    if (!experiences) {
      return next(new ErrorHandler("No experiences found", 404));
    }

    res.status(200).json({
      message: "Experiences fetched successfully",
      experiences,
    });
  }
);

export {
  createExperience,
  getUserExperiences,
  getExperienceById,
  updateExperience,
  deleteExperience,
  profileExperience,
};
