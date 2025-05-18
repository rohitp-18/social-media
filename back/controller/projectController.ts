import { NextFunction, Request, Response } from "express";
import expressAsyncHandler from "express-async-handler";
import ErrorHandler from "../utils/errorHandler";
import Project from "../model/projectModel";
import { v2 as cloudinary } from "cloudinary";
import Comment from "../model/commentModel";
import User from "../model/userModel";
import Media from "../model/mediaModel";

const createProject = expressAsyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const {
      title,
      description,
      skills,
      githubLink,
      liveLink,
      startDate,
      endDate,
      current,
    } = req.body;

    // Validate input
    if (!title || !description || !skills) {
      return next(new ErrorHandler("Please provide all required fields", 400));
    }

    if (githubLink && !/^https?:\/\/github\.com\/.+/.test(githubLink)) {
      return next(new ErrorHandler("Invalid GitHub link format", 400));
    }
    if (liveLink && !/^https?:\/\/.+/.test(liveLink)) {
      return next(new ErrorHandler("Invalid live link format", 400));
    }

    // Check if the project already exists
    const existingProject = await Project.findOne({
      title,
      user: req.user._id,
    });

    if (existingProject) {
      return next(
        new ErrorHandler("Project with this title already exists", 400)
      );
    }

    let media: any = [];

    if (req.files) {
      await Promise.all(
        req.files.map(async (val: any, i: number) => {
          // Convert file buffer to base64 string
          const b64 = Buffer.from(val.buffer).toString("base64");
          // Create data URI for Cloudinary upload
          let dataURI = "data:" + val.mimetype + ";base64," + b64;
          try {
            // Upload image to Cloudinary
            const data = await cloudinary.uploader.upload(dataURI, {
              folder: `post/${req.user.name}/${title}`, // Organize uploads by user and post name
              height: 200,
              crop: "pad",
            });
            // Add uploaded image info to postData
            media.push({
              public_id: data.public_id,
              url: data.secure_url,
              order: i,
              type: "image",
            });
          } catch (error: any | unknown) {
            // Handle upload errors
            return next(new ErrorHandler(error, 501));
          }
        })
      );
    }

    const project = await Project.create({
      user: req.user._id,
      title,
      description,
      media,
      skills,
      githubLink,
      liveLink,
      startDate,
      endDate,
      current: Boolean(current),
    });

    await Promise.all(
      project.media.map(async (mrd: any) => {
        await Media.create({
          user: req.user._id,
          type: "image",
          url: mrd.secure_url,
          thumbnail: mrd.secure_url,
          project: project._id,
        });
      })
    );

    res.status(201).json({
      message: "Project created successfully",
      project,
    });
  }
);

const getAllProjects = expressAsyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const projects = await Project.find({
      isDeleted: false,
    }).populate("user", "name avatar");

    res.status(200).json({
      message: "Projects fetched successfully",
      projects,
    });
  }
);

const getProjectById = expressAsyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const projectId = req.params.id;
    const project = await Project.findById(projectId).populate(
      "user",
      "name avatar"
    );

    if (!project || project.isDeleted) {
      return next(new ErrorHandler("Project not found", 404));
    }

    res.status(200).json({
      message: "Project fetched successfully",
      project,
    });
  }
);

const updateProject = expressAsyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const projectId = req.params.id;
    const {
      title,
      description,
      skills,
      githubLink,
      liveLink,
      media: oldImages,
      startDate,
      endDate,
      current,
    } = req.body;

    // Validate input
    if (!title || !description || !skills) {
      return next(new ErrorHandler("Please provide all required fields", 400));
    }

    if (githubLink && !/^https?:\/\/github\.com\/.+/.test(githubLink)) {
      return next(new ErrorHandler("Invalid GitHub link format", 400));
    }
    if (liveLink && !/^https?:\/\/.+/.test(liveLink)) {
      return next(new ErrorHandler("Invalid live link format", 400));
    }

    // Check if the project exists
    const project = await Project.findById(projectId);

    if (!project || project.isDeleted) {
      return next(new ErrorHandler("Project not found", 404));
    }

    // Check if the user is authorized to update the project
    if (project.user.toString() !== req.user._id.toString()) {
      return next(new ErrorHandler("You are not authorized", 401));
    }

    let media: any[] = [];

    if (oldImages) {
      media = [...oldImages];
    }

    const tempProject = await Project.findById(projectId);
    if (!tempProject) {
      return next(new ErrorHandler("Project not found", 404));
    }

    if (tempProject.media.length > 0) {
      await Promise.all(
        tempProject.media.map(async (val: any) => {
          if (oldImages) {
            const image = oldImages.find(
              (img: any) => img.public_id === val.public_id
            );
            if (!image) {
              await cloudinary.uploader.destroy(val.public_id);
              await Media.deleteOne({ public_id: val.public_id });
            }
          }
        })
      );
    }

    if (req.files) {
      await Promise.all(
        req.files.map(async (val: any, i: number) => {
          // Convert file buffer to base64 string
          const b64 = Buffer.from(val.buffer).toString("base64");
          // Create data URI for Cloudinary upload
          let dataURI = "data:" + val.mimetype + ";base64," + b64;
          try {
            // Upload image to Cloudinary
            const data = await cloudinary.uploader.upload(dataURI, {
              folder: `post/${req.user.name}/${title}`, // Organize uploads by user and post name
              height: 200,
              crop: "pad",
            });
            // Add uploaded image info to postData
            media.push({
              public_id: data.public_id,
              url: data.secure_url,
              order: 1 + media.length,
              type: "image", // Assuming all files are images; adjust as needed
              // Maintain original file order
            });
            await Media.create({
              user: req.user._id,
              type: "image",
              url: data.secure_url,
              thumbnail: data.secure_url,
              project: projectId,
            });
          } catch (error: any | unknown) {
            // Handle upload errors
            return next(new ErrorHandler(error, 501));
          }
        })
      );
    }

    const updatedProject = await Project.findByIdAndUpdate(
      projectId,
      {
        title,
        description,
        media,
        skills,
        githubLink,
        liveLink,
        startDate,
        endDate,
        current: Boolean(current),
      },
      { new: true }
    );

    if (!updatedProject) {
      return next(new ErrorHandler("Project not found", 404));
    }

    res.status(200).json({
      message: "Project updated successfully",
      project: updatedProject,
    });
  }
);

const deleteProject = expressAsyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const projectId = req.params.id;
    const project = await Project.findOne({
      _id: projectId,
      user: req.user._id,
    });

    if (!project || project.isDeleted) {
      return next(new ErrorHandler("Project not found", 404));
    }

    project.isDeleted = true;
    project.deletedAt = new Date();

    await project.save();

    if (project.media.length > 0) {
      await Promise.all(
        project.media.map(async (val: any) => {
          await Media.updateOne(
            { public_id: val.public_id },
            {
              $set: {
                deletedAt: new Date(),
                isDeleted: true,
                deletedBy: req.user._id,
              },
            }
          );
        })
      );
    }

    res.status(200).json({
      message: "Project deleted successfully",
    });
  }
);

const toggleLikeProject = expressAsyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const projectId = req.params.id;
    const project = await Project.findById(projectId);

    if (!project || project.isDeleted) {
      return next(new ErrorHandler("Project not found", 404));
    }

    const userId = req.user._id.toString();
    const isLiked = project.likes.some(
      (like) => like._id.toString() === userId
    );

    if (isLiked) {
      project.likes.pull({ _id: userId });
    } else {
      project.likes.push({ _id: userId });
    }

    project.likedCount = project.likes.length;
    await project.save();

    res.status(200).json({
      message: isLiked
        ? "Project unliked successfully"
        : "Project liked successfully",
      project,
    });
  }
);

const addCommentToProject = expressAsyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const projectId = req.params.id;
    const { comment } = req.body;

    if (!comment) {
      return next(new ErrorHandler("Please provide a comment", 400));
    }

    const project = await Project.findById(projectId);

    if (!project || project.isDeleted) {
      return next(new ErrorHandler("Project not found", 404));
    }

    const tempComment = await Comment.create({
      user: req.user._id,
      content: comment,
      post: projectId,
    });

    if (!tempComment) {
      return next(new ErrorHandler("Failed to create comment", 500));
    }

    project.comments.push({
      _id: tempComment._id,
    });
    project.commentCount = project.comments.length;
    await project.save();

    res.status(200).json({
      message: "Comment added successfully",
      project,
    });
  }
);

const getProjectComments = expressAsyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const projectId = req.params.id;
    const project = await Project.findById(projectId).populate(
      "user",
      "name avatar"
    );

    if (!project || project.isDeleted) {
      return next(new ErrorHandler("Project not found", 404));
    }

    const comments = project.comments.map((comment) => comment._id);
    const allComments = await Comment.find({ _id: { $in: comments } })
      .populate("user", "name avatar")
      .populate("post", "title content");

    if (!allComments) {
      return next(new ErrorHandler("Comments not found", 404));
    }

    res.status(200).json({
      message: "Comments fetched successfully",
      comments: allComments,
    });
  }
);

const getAllLikes = expressAsyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const projectId = req.params.id;
    const project = await Project.findById(projectId).populate(
      "likes._id",
      "name avatar"
    );

    if (!project || project.isDeleted) {
      return next(new ErrorHandler("Project not found", 404));
    }

    res.status(200).json({
      message: "Likes fetched successfully",
      likes: project.likes,
    });
  }
);

const getUserLikedProjects = expressAsyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const userId = req.user._id;
    const projects = await Project.find({
      likes: { $elemMatch: { _id: userId } },
    })
      .populate("user", "name avatar")
      .populate("likes._id", "name avatar");

    if (!projects) {
      return next(new ErrorHandler("No liked projects found", 404));
    }

    res.status(200).json({
      message: "Liked projects fetched successfully",
      projects,
    });
  }
);

const getUserProjects = expressAsyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const userId = req.user._id;
    const projects = await Project.find({
      user: userId,
      isDeleted: false,
    }).populate("user", "name avatar");

    if (!projects) {
      return next(new ErrorHandler("No projects found", 404));
    }

    res.status(200).json({
      message: "User projects fetched successfully",
      projects,
    });
  }
);

const searchProjects = expressAsyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const { query } = req.query;
    const projects = await Project.find({
      title: { $regex: query, $options: "i" },
    }).populate("user", "name avatar");

    if (!projects) {
      return next(new ErrorHandler("No projects found", 404));
    }

    res.status(200).json({
      message: "Projects fetched successfully",
      projects,
    });
  }
);

const getProfileProjects = expressAsyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const username = req.params.id;

    const user = await User.findOne({ username });
    if (!user) {
      return next(new ErrorHandler("User not found", 404));
    }

    const projects = await Project.find({
      user: user._id,
      isDeleted: false,
    }).populate("skills");

    if (!projects) {
      return next(new ErrorHandler("No projects found", 404));
    }

    res.status(200).json({
      message: "User projects fetched successfully",
      projects,
    });
  }
);

export {
  createProject,
  getAllProjects,
  getProjectById,
  updateProject,
  deleteProject,
  toggleLikeProject,
  addCommentToProject,
  getProjectComments,
  getAllLikes,
  getUserLikedProjects,
  getUserProjects,
  searchProjects,
  getProfileProjects,
};
