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

    tempCompany.jobs.push(job._id);
    await tempCompany.save();

    try {
      await Notification.create(
        tempCompany.followers.map(
          (follower: any) =>
            follower !== req.user._id && {
              recipient: follower,
              sender: req.user._id,
              type: "job",
              message: `New job posted by ${tempCompany.name} for ${job.title}`,
              job: job._id,
              company: tempCompany._id,
            }
        )
      );

      await Notification.create(
        tempCompany.members.map(
          (member: any) =>
            member !== req.user._id && {
              sender: req.user._id,
              recipient: member,
              type: "job",
              message: `New job posted by ${tempCompany.name} for ${job.title}`,
              job: job._id,
              company: tempCompany._id,
            }
        )
      );

      await Notification.create(
        tempCompany.admin.map(
          (member: any) =>
            member !== req.user._id && {
              recipient: member._id,
              sender: req.user._id,
              type: "job",
              message: `New job posted by ${tempCompany.name} for ${job.title}`,
              job: job._id,
              company: tempCompany._id,
            }
        )
      );
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
      isActive,
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
        new ErrorHandler("You are not authorized to update this job", 403)
      );
    }

    await Job.findByIdAndUpdate(
      jobId,
      {
        title,
        description,
        company,
        location,
        salary,
        noOfOpening,
        type,
        experience,
        skills,
        category,
        preferredSkills,
        essentialSkills,
        questions,
        isActive: isActive !== undefined ? isActive : job.isActive,
      },
      { new: true, runValidators: true }
    );

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
      .populate("user", "name email avatar headline followers username")
      .populate("company", "name avatar headline followers admin address")
      .populate("preferredSkills", "name")
      .populate("essentialSkills", "name");
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

const introductionJobs = expressAsyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    // find highpaying jobs
    const jobs = await Job.find({})
      .sort({ salary: -1 })
      .limit(25)
      .populate("company", "name avatar headline followers")
      .populate("user", "name avatar");

    res.status(200).json({
      success: true,
      jobs,
      message: "High paying jobs fetched successfully",
    });
  }
);

const recommendedJobs = expressAsyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const { user } = req;
    const companyId = req.query.company as string;

    if (!user) {
      return next(new ErrorHandler("User not found", 404));
    }

    const jobs = await Job.find({
      isDeleted: false,
      company: companyId || { $ne: null },
      $or: [
        {
          preferredSkills: {
            $in: user.skills.map((skill: any) => skill.skill.toString()),
          },
        },
        {
          essentialSkills: {
            $in: user.skills.map((skill: any) => skill.skill.toString()),
          },
        },
        {
          description: {
            $regex: user.skills.map((skill: any) => skill.skill.name).join("|"),
            $options: "i",
          },
        },
      ],
    })
      .populate("user", "name email avatar username headline followers")
      .populate("company", "name avatar")
      .limit(10);

    if (!jobs) {
      return next(new ErrorHandler("Internal Error", 500));
    }

    res.status(200).json({
      success: true,
      jobs,
    });
  }
);

const toggleSaveJob = expressAsyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const { jobId } = req.params;
    const userId = req.user._id;

    const job = await Job.findById(jobId);
    if (!job) {
      return next(new ErrorHandler("Job not found", 404));
    }

    const isSaved = job.savedBy.includes(userId);
    console.log(isSaved);
    if (isSaved) {
      job.savedBy = job.savedBy.filter(
        (id) => id.toString() !== userId.toString()
      );
    } else {
      job.savedBy.push(userId);
    }

    console.log(job.savedBy);
    await job.save();

    res.status(200).json({
      success: true,
      message: isSaved ? "Job unsaved successfully" : "Job saved successfully",
      jobId,
      save: !isSaved,
    });
  }
);

const toggleActiveJob = expressAsyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const { jobId } = req.params;

    const job = await Job.findById(jobId);
    if (!job) {
      return next(new ErrorHandler("Job not found", 404));
    }

    const company = await Company.findById(job.company);

    if (!company || company.isDeleted) {
      return next(new ErrorHandler("Company not found", 404));
    }

    const isAdmin = company.admin.some(
      (admin) => admin._id.toString() === req.user._id.toString()
    );

    if (!isAdmin) {
      return next(
        new ErrorHandler("You are not authorized to toggle job status", 403)
      );
    }

    job.isActive = !job.isActive;
    await job.save();

    res.status(200).json({
      success: true,
      message: job.isActive
        ? "Job activated successfully"
        : "Job deactivated successfully",
      jobId,
      active: job.isActive,
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
  introductionJobs,
  recommendedJobs,
  toggleSaveJob,
  toggleActiveJob,
};
