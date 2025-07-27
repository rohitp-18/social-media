import expressAsyncHandler from "express-async-handler";
import { Request, Response, NextFunction } from "express";
import ApplyJob from "../model/applyJobModel";
import ErrorHandler from "../utils/errorHandler";
import Job from "../model/jobModel";
import Notification from "../model/notificationModel";
import { v2 as cloudinary } from "cloudinary";

const createJobApplication = expressAsyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const { jobId, coverLetter, questions } = req.body;

    // Validate input
    if (!questions) {
      return next(new ErrorHandler("Please answer all questions", 400));
    }

    // Check if the job exists
    const job = await Job.findById(jobId);

    if (!job) {
      return next(new ErrorHandler("Job not found", 404));
    }

    let resume: any = null;
    if (req.file) {
      if (req.file.mimetype !== "application/pdf") {
        return next(new ErrorHandler("Only PDF files are allowed", 400));
      }

      await new Promise((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
          {
            folder: "resumes",
            resource_type: "raw",
          },
          (error, result) => {
            if (error) return reject(error);
            if (!result) {
              return next(new ErrorHandler("Failed to upload resume", 500));
            }
            resume = {
              url: result.secure_url,
              public_id: result.public_id,
              name: req.file.originalname,
            };
            resolve(result);
          }
        );
        stream.end(req.file.buffer);
      });
    }

    if (!resume) {
      return next(new ErrorHandler("Resume is required", 400));
    }

    const application = await ApplyJob.create({
      user: req.user._id,
      job: jobId,
      resume,
      coverLetter,
      questions: await JSON.parse(questions),
      jobCreator: job.user,
      company: job.company,
    });

    if (!application) {
      return next(new ErrorHandler("Failed to create job application", 500));
    }

    // Populate the application with user and job details
    await application.populate("job", "title location category noOfOpening");
    await application.populate("company", "name avatar");

    await Notification.create({
      recipient: job.user,
      sender: req.user._id,
      type: "application",
      message: `${req.user.name} has applied for the job ${job.title}`,
      relatedId: application._id,
      refModel: "applyJob",
      url: `/jobs/${jobId}/applications/${application._id}`,
    });

    job.noOfApplied += 1;
    job.applyBy.push(req.user._id);
    job.applications.push(application._id);
    await job.save();

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
    }).populate("user", "name email avatar headline username");

    await job.populate("company", "name avatar admin");

    res.status(200).json({
      message: "Job applications fetched successfully",
      applications,
      job,
    });
  }
);

const updateJobApplication = expressAsyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;
    const { status, interview } = req.body;

    const application = await ApplyJob.findOneAndUpdate(
      {
        _id: id,
        jobCreator: req.user._id,
      },
      { status, interview: status === "interview" ? interview : null },
      { new: true, runValidators: true, useFindAndModify: false }
    );

    if (!application) {
      return next(new ErrorHandler("Application not found", 404));
    }

    const job = await Job.findById(application.job);

    if (!job) {
      return next(new ErrorHandler("Job not found", 404));
    }

    await Notification.create({
      recipient: application.user,
      sender: req.user._id,
      type: "job",
      message: `Your application for the job ${job.title} has been updated to ${status}`,
      relatedId: application._id,
      refModel: "applyJob",
      url: `/jobs/${application.job._id}/status?applicationId=${application._id}`,
    });

    res.status(200).json({
      message: "Job application updated successfully",
      application,
    });
  }
);

const getJobApplication = expressAsyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;

    const application = await ApplyJob.findOne({
      job: id,
      user: req.user._id.toString(),
      isDeleted: false,
    })
      .populate("user", "name email avatar")
      .populate(
        "job",
        "title company location category noOfOpening questions applications workType type createdAt"
      )
      .populate("company", "name avatar admin");

    if (!application) {
      return next(new ErrorHandler("Application not found", 404));
    }

    res.status(200).json({
      message: "Job application fetched successfully",
      application,
      job: application.job,
    });
  }
);

const rescheduleInterview = expressAsyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const { dates, reason } = req.body;
    const { id } = req.params;

    if (!dates) {
      return next(
        new ErrorHandler(
          "please provide the dates for reschudling the interview",
          403
        )
      );
    }

    const applyJob = await ApplyJob.findById(id);
    if (!applyJob) {
      return next(new ErrorHandler("Application not found", 404));
    }

    if (applyJob.reschedule?.newInterviewDate[0]) {
      return next(
        new ErrorHandler("You have been requested for rescheduling", 403)
      );
    }

    if (applyJob.status !== "interview") {
      return next(new ErrorHandler("You can only reschedule interviews", 403));
    }

    await applyJob.updateOne(
      { reschedule: { newInterviewDate: dates, explanation: reason } },
      { new: true, runValidators: true, useFindAndModify: false }
    );

    const job = await Job.findById(applyJob.job);

    if (!job) {
      return next(new ErrorHandler("Job not found", 404));
    }

    await Notification.create({
      recipient: applyJob.user,
      sender: req.user._id,
      type: "job",
      message: `Your interview for the job ${job.title} has been requested to rescheduled to new dates. Reason: ${reason}`,
      relatedId: applyJob._id,
      refModel: "applyJob",
      url: `/jobs/${applyJob.job._id}/applications?applicationId=${applyJob._id}`,
    });

    res.status(200).json({
      success: true,
      message: "Your request successfully created",
    });
  }
);

const acceptReschedule = expressAsyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;
    const { date } = req.body;

    if (!date) {
      return next(new ErrorHandler("Please provide a new interview date", 400));
    }

    const application = await ApplyJob.findById(id);

    if (!application) {
      return next(new ErrorHandler("Application not found", 404));
    }

    if (application.status !== "interview") {
      return next(
        new ErrorHandler("You can only accept reschedule for interviews", 403)
      );
    }

    const job = await Job.findById(application.job);

    if (!job) {
      return next(new ErrorHandler("Job not found", 404));
    }

    application.interview = date;
    application.reschedule = {
      newInterviewDate: [],
      explanation: "",
    };
    await application.save();

    await Notification.create({
      recipient: application.user,
      sender: req.user._id,
      type: "job",
      message: `Your request to reschedule the interview for the job ${
        job.title
      } has been accepted. New date: ${new Date(
        date
      ).toLocaleDateString()} at ${new Date(date).toLocaleTimeString()}`,
      relatedId: application._id,
      refModel: "applyJob",
      url: `/jobs/${application.job._id}/status?applicationId=${application._id}`,
    });

    res.status(200).json({
      message: "Interview rescheduled successfully",
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
  rescheduleInterview,
  acceptReschedule,
};
