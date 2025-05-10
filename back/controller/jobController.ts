import { NextFunction, Request, Response } from "express";
import expressAsyncHandler from "express-async-handler";
import ErrorHandler from "../utils/errorHandler";
import Job from "../model/jobModel";
import Company from "../model/companyModel";
import Notification from "../model/notificationModel";

const createJob = expressAsyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const {
      title,
      description,
      location,
      company,
      salary,
      noOfOpening,
      questions,
      type,
      experience,
      skills,
      category,
      preferredSkills,
      essentialSkills,
    } = req.body;

    if (
      !title ||
      !description ||
      !location ||
      !company ||
      !salary ||
      !noOfOpening
    ) {
      return next(new ErrorHandler("Please fill all required fields", 403));
    }

    const tempCompany = await Company.findById(company);

    if (!tempCompany || tempCompany.isDeleted) {
      return next(new ErrorHandler("Company not found", 404));
    }

    const isAdmin = tempCompany.admin.some(
      (admin) => admin._id.toString() === req.user._id.toString()
    );
    if (!isAdmin) {
      return next(
        new ErrorHandler("You are not authorized to create a job", 403)
      );
    }

    const job = await Job.create({
      title,
      description,
      company,
      location,
      salary,
      user: req.user._id,
      noOfOpening,
      type,
      experience,
      skills,
      category,
      preferredSkills,
      essentialSkills,
      questions,
    });

    if (!job) {
      return next(new ErrorHandler("Internal Error", 500));
    }

    company.jobs.push(job._id);
    await company.save();

    try {
      company.followers.forEach((follower: any) => {
        Notification.create({
          recipient: follower._id,
          sender: req.user._id,
          type: "job",
          message: `New job posted by ${tempCompany.name}`,
          job: job._id,
          company: tempCompany._id,
        });
      });

      company.members.forEach((member: any) => {
        Notification.create({
          recipient: member._id,
          sender: req.user._id,
          type: "job",
          message: `New job posted by ${tempCompany.name}`,
          job: job._id,
          company: tempCompany._id,
        });
      });

      company.admin.forEach((admin: any) => {
        Notification.create({
          recipient: admin._id,
          sender: req.user._id,
          type: "job",
          message: `New job posted by ${tempCompany.name}`,
          job: job._id,
          company: tempCompany._id,
        });
      });
    } catch (error) {}

    res.status(201).json({
      success: true,
      job,
      message: "Job created successfully",
    });
  }
);

const getAllJobs = expressAsyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const jobs = await Job.find({ isDeleted: false })
      .populate("user", "name email")
      .populate("company", "name avatar");

    if (!jobs) {
      return next(new ErrorHandler("Internal Error", 500));
    }

    res.status(200).json({
      success: true,
      jobs,
    });
  }
);

const searchJob = expressAsyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const { title, location, type, experience, skills } = req.query;
    const query: any = { isDeleted: false };

    if (title) {
      query.title = { $regex: title, $options: "i" };
    }
    if (location) {
      query.location = { $regex: location, $options: "i" };
    }
    if (type) {
      query.type = { $regex: type, $options: "i" };
    }
    if (experience) {
      query.experience = { $regex: experience, $options: "i" };
    }
    if (skills) {
      query.skills = { $regex: skills, $options: "i" };
    }

    const jobs = await Job.find(query)
      .populate("user", "name email avatar")
      .populate("company", "name avatar");

    if (!jobs) {
      return next(new ErrorHandler("Internal Error", 500));
    }

    res.status(200).json({
      success: true,
      jobs,
    });
  }
);

const deleteJob = expressAsyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const jobId = req.params.id;

    const job = await Job.findById(jobId)
      .populate("user", "name email")
      .populate("company", "name avatar");
    if (!job || job.isDeleted) {
      return next(new ErrorHandler("Job not found", 404));
    }

    if (job.user._id.toString() !== req.user._id.toString()) {
      return next(
        new ErrorHandler("You are not authorized to delete this job", 403)
      );
    }

    job.deletedAt = new Date(Date.now());
    job.isDeleted = true;

    await job.save();

    res.status(200).json({
      success: true,
      message: "Job deleted successfully",
    });
  }
);

const updateJob = expressAsyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const jobId = req.params.id;

    const job = await Job.findById(jobId)
      .populate("user", "name email")
      .populate("company", "name avatar");
    if (!job || job.isDeleted) {
      return next(new ErrorHandler("Job not found", 404));
    }

    if (job.user._id.toString() !== req.user._id.toString()) {
      return next(
        new ErrorHandler("You are not authorized to update this job", 403)
      );
    }

    const {
      title,
      description,
      location,
      company,
      salary,
      noOfOpening,
      questions,
      type,
      experience,
      skills,
      category,
      preferredSkills,
      essentialSkills,
    } = req.body;

    if (
      !title ||
      !description ||
      !location ||
      !company ||
      !salary ||
      !noOfOpening
    ) {
      return next(new ErrorHandler("Please fill all required fields", 403));
    }

    job.title = title;
    job.description = description;
    job.company = company;
    job.location = location;
    job.salary = salary;
    job.user = req.user._id;
    job.noOfOpening = noOfOpening;
    job.type = type;
    job.experience = experience;
    job.skills = skills;
    job.category = category;
    job.preferredSkills = preferredSkills;
    job.essentialSkills = essentialSkills;
    job.questions = questions;

    await job.save();

    res.status(200).json({
      success: true,
      message: "Job updated successfully",
    });
  }
);

const getJob = expressAsyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const jobId = req.params.id;

    const job = await Job.findById(jobId)
      .populate("user", "name email")
      .populate("company", "name avatar");
    if (!job || job.isDeleted) {
      return next(new ErrorHandler("Job not found", 404));
    }

    res.status(200).json({
      success: true,
      job,
    });
  }
);

const getMyJobs = expressAsyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const jobs = await Job.find({ user: req.user._id, isDeleted: false })
      .populate("user", "name email")
      .populate("company", "name avatar");

    if (!jobs) {
      return next(new ErrorHandler("Internal Error", 500));
    }

    res.status(200).json({
      success: true,
      jobs,
    });
  }
);

const getCompanyJobs = expressAsyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const companyId = req.params.id;

    const jobs = await Job.find({ company: companyId, isDeleted: false })
      .populate("user", "name email")
      .populate("company", "name avatar");

    if (!jobs) {
      return next(new ErrorHandler("Internal Error", 500));
    }

    res.status(200).json({
      success: true,
      jobs,
    });
  }
);

export {
  createJob,
  getAllJobs,
  deleteJob,
  updateJob,
  getJob,
  getMyJobs,
  searchJob,
  getCompanyJobs,
};
