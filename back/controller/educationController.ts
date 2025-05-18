import { NextFunction, Request, Response } from "express";
import expressAsyncHandler from "express-async-handler";
import Education from "../model/educationModel";
import ErrorHandler from "../utils/errorHandler";
import User from "../model/userModel";

const createEducation = expressAsyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const {
      school,
      degree,
      fieldOfStudy,
      startDate,
      endDate,
      skills,
      description,
      currentlyStudying,
      grade,
    } = req.body;

    if (!school || !degree || !fieldOfStudy || !startDate) {
      return next(new ErrorHandler("Please provide all required fields", 400));
    }

    const education = await Education.create({
      user: req.user._id,
      school,
      degree,
      fieldOfStudy,
      startDate,
      endDate,
      currentlyStudying,
      grade,
      description,
      skills,
    });

    res.status(201).json({
      success: true,
      message: "Education created successfully",
      education,
    });
  }
);

const updateEducation = expressAsyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const {
      school,
      degree,
      fieldOfStudy,
      startDate,
      endDate,
      skills,
      description,
      currentlyStudying,
      grade,
    } = req.body;

    if (!school || !degree || !fieldOfStudy || !startDate) {
      return next(new ErrorHandler("Please provide all required fields", 400));
    }

    if (endDate && new Date(endDate) < new Date(startDate)) {
      return next(
        new ErrorHandler("End date cannot be before start date", 400)
      );
    }
    if (currentlyStudying && endDate) {
      return next(
        new ErrorHandler("End date cannot be set if currently studying", 400)
      );
    }

    if (!currentlyStudying && !endDate) {
      return next(
        new ErrorHandler("End date is required if not currently studying", 400)
      );
    }

    const tempEducation = await Education.findOne({
      _id: req.params.id,
      user: req.user._id,
      isDeleted: false,
    });

    if (!tempEducation) {
      return next(new ErrorHandler("Education not found", 400));
    }

    const education = await Education.findOneAndUpdate(
      { _id: req.params.id },
      {
        school,
        degree,
        fieldOfStudy,
        startDate,
        endDate,
        skills,
        description,
        currentlyStudying,
        grade,
      },
      { new: true, runValidators: true }
    ).populate("skills");

    res.status(200).json({
      success: true,
      message: "Education created successfully",
      education,
    });
  }
);

const getProfileEducation = expressAsyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const username = req.params.id;

    const user = await User.findOne({ username, deleted: false });

    if (!user) {
      return next(new ErrorHandler("User not found", 404));
    }

    const educations = await Education.find({
      user: user._id,
      isDeleted: false,
    }).populate("skills");

    res.status(200).json({
      success: true,
      message: "Education fetched successfully",
      educations,
    });
  }
);

const getSingleEducation = expressAsyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    // const
  }
);

const deleteEducation = expressAsyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;

    const tempEducation = await Education.findOne({
      _id: id,
      user: req.user._id,
      isDeleted: false,
    });

    if (!tempEducation) {
      return next(new ErrorHandler("Education not found", 404));
    }

    tempEducation.isDeleted = true;
    await tempEducation.save();

    res.status(200).json({
      success: true,
      message: "Education is deleted successfully",
    });
  }
);

export {
  createEducation,
  updateEducation,
  getProfileEducation,
  getSingleEducation,
  deleteEducation,
};
