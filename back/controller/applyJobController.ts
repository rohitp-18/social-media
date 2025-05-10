import expressAsyncHandler from "express-async-handler";
import { Request, Response, NextFunction } from "express";
import ApplyJob from "../model/applyJobModel";
import ErrorHandler from "../utils/errorHandler";
import Job from "../model/jobModel";

const createJobApplication = expressAsyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const { jobId, resume, coverLetter, jobCreator, question, company } =
      req.body;

    // Validate input
    if (!jobId || !resume || !question || !company) {
      return next(new ErrorHandler("Please provide all required fields", 400));
    }

    const application = await ApplyJob.create({
      user: req.user._id,
      job: jobId,
      resume,
      coverLetter,
      question,
      jobCreator,
      company,
    });

    res.status(201).json({
      message: "Job application created successfully",
      application,
    });
  }
);

const userJobApplications = expressAsyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const applications = await ApplyJob.find({
      user: req.user._id,
      isDeleted: false,
    })
      .populate("job")
      .populate("company", "name avatar");

    res.status(200).json({
      message: "Job applications fetched successfully",
      applications,
    });
  }
);

const deleteJobApplication = expressAsyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;

    const application = await ApplyJob.findOneAndUpdate(
      {
        _id: id,
        user: req.user._id,
      },
      { isDeleted: true },
      { new: true, runValidators: true, useFindAndModify: false }
    );

    if (!application) {
      return next(new ErrorHandler("Application not found", 404));
    }

    res.status(200).json({
      message: "Job application deleted successfully",
    });
  }
);

const allJobApplications = expressAsyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;

    const job = await Job.findOne({
      _id: id,
      user: req.user._id,
      isDeleted: false,
    });

    if (!job) {
      return next(new ErrorHandler("Job not found", 404));
    }

    const applications = await ApplyJob.find({
      job: id,
      isDeleted: false,
    }).populate("user", "name email avatar");

    if (!applications) {
      return next(new ErrorHandler("Applications not found", 404));
    }

    res.status(200).json({
      message: "Job applications fetched successfully",
      applications,
    });
  }
);

const updateJobApplication = expressAsyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;
    const { status } = req.body;

    const application = await ApplyJob.findOneAndUpdate(
      {
        _id: id,
        jobCreator: req.user._id,
      },
      { status },
      { new: true, runValidators: true, useFindAndModify: false }
    );

    if (!application) {
      return next(new ErrorHandler("Application not found", 404));
    }

    res.status(200).json({
      message: "Job application updated successfully",
      application,
    });
  }
);

const getJobApplication = expressAsyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;

    const application = await ApplyJob.findById(id)
      .populate("user", "name email avatar")
      .populate(
        "job",
        "title companyName location salary experience skills category preferredSkills essentialSkills noOfOpening questions"
      )
      .populate("company", "name avatar");

    if (!application) {
      return next(new ErrorHandler("Application not found", 404));
    }

    res.status(200).json({
      message: "Job application fetched successfully",
      application,
    });
  }
);

export {
  createJobApplication,
  userJobApplications,
  deleteJobApplication,
  allJobApplications,
  updateJobApplication,
  getJobApplication,
};
