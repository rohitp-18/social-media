import expressAsyncHandler from "express-async-handler";
import { Request, Response, NextFunction } from "express";
import Experience from "../model/experienceModel";
import ErrorHandler from "../utils/errorHandler";

const createExperience = expressAsyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const {
      title,
      company,
      companyName,
      location,
      startDate,
      endDate,
      current,
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
      company,
      location,
      startDate,
      endDate,
      current,
      description,
      workType,
      skills,
      jobType,
      working,
    });

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

    if (experience.user.toString() !== req.user._id.toString()) {
      return next(new ErrorHandler("You are not authorized", 401));
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
      company,
      companyName,
      location,
      startDate,
      endDate,
      current,
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
        company,
        location,
        startDate,
        endDate,
        current,
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

export {
  createExperience,
  getUserExperiences,
  getExperienceById,
  updateExperience,
  deleteExperience,
};
