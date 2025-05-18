import expressAsyncHandler from "express-async-handler";
import { NextFunction, Request, Response } from "express";

import User from "../model/userModel";
import ErrorHandler from "../utils/errorHandler";
import Company from "../model/companyModel";
import Post from "../model/postModel";
import Project from "../model/projectModel";
import Group from "../model/groupModel";
import Job from "../model/jobModel";
import Skill from "../model/skillModel";

const getAllSearch = expressAsyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const { q } = req.query;

    if (!q) {
      return next(new ErrorHandler("Please provide a search query", 400));
    }

    // Find matching skills for user search
    const matchingSkills = await Skill.find({
      name: { $regex: q, $options: "i" },
    }).select("_id");
    const skillIds = matchingSkills.map((skill) => skill._id);

    const peoples = await User.find({
      $or: [
        { name: { $regex: q, $options: "i" } },
        { headline: { $regex: q, $options: "i" } },
        { "location.city": { $regex: q, $options: "i" } },
        { "location.state": { $regex: q, $options: "i" } },
        { "location.country": { $regex: q, $options: "i" } },
        { "website.link": { $regex: q, $options: "i" } },
        { bio: { $regex: q, $options: "i" } },
        ...(skillIds.length > 0 ? [{ skills: { $in: skillIds } }] : []),
      ],
    }).limit(10);

    const companies = await Company.find({
      $or: [
        { name: { $regex: q, $options: "i" } },
        { location: { $regex: q, $options: "i" } },
        { website: { $regex: q, $options: "i" } },
        { bio: { $regex: q, $options: "i" } },
      ],
    }).limit(10);

    const posts = await Post.find({
      $or: [
        { title: { $regex: q, $options: "i" } },
        { description: { $regex: q, $options: "i" } },
        ...(peoples.length > 0
          ? [{ user: { $in: peoples.map((user) => user._id) } }]
          : []),
        ...(companies.length > 0
          ? [{ company: { $in: companies.map((company) => company._id) } }]
          : []),
        ...(peoples.length > 0
          ? [{ tags: { $in: peoples.map((user) => user._id) } }]
          : []),
      ],
    }).limit(10);

    const projects = await Project.find({
      $or: [
        { title: { $regex: q, $options: "i" } },
        { description: { $regex: q, $options: "i" } },
        ...(peoples.length > 0
          ? [{ user: { $in: peoples.map((user) => user._id) } }]
          : []),
      ],
    }).limit(10);

    const groups = await Group.find({
      $or: [
        { title: { $regex: q, $options: "i" } },
        { description: { $regex: q, $options: "i" } },
      ],
    }).limit(10);

    const jobs = await Job.find({
      $or: [
        { title: { $regex: q, $options: "i" } },
        { description: { $regex: q, $options: "i" } },
        ...(companies.length > 0
          ? [{ company: { $in: companies.map((company) => company._id) } }]
          : []),
      ],
    }).limit(10);

    if (
      peoples.length === 0 &&
      companies.length === 0 &&
      posts.length === 0 &&
      projects.length === 0 &&
      groups.length === 0 &&
      jobs.length === 0
    ) {
      return next(new ErrorHandler("No results found", 404));
    }

    // check you following people and companies

    if (req.user === undefined) {
      res.status(200).json({
        success: true,
        peoples,
        companies,
        posts,
        projects,
        groups,
        jobs,
      });
    } else {
      const followingPeoples = peoples.map((people) => {
        return {
          ...people.toObject(),
          isFollowing: req.user?.following.includes(people._id),
        };
      });

      console.log("follow people");

      const followingCompanies = companies.map((company) => {
        return {
          ...company.toObject(),
          isFollowing: req.user?.companies.includes(company._id),
        };
      });

      console.log("follow company");

      const followingGroups = groups.map((group) => {
        return {
          ...group.toObject(),
          isFollowing: req.user?.followingGroups.includes(group._id),
          isMember: req.user?.groups.includes(group._id),
        };
      });

      console.log("follow groups");

      res.status(200).json({
        success: true,
        peoples: followingPeoples,
        companies: followingCompanies,
        posts,
        projects,
        groups: followingGroups,
        jobs,
      });
    }

    // check if login user is following people and companies
  }
);

const getPeopleSearch = expressAsyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const { q, page, connections, location, skills, sort } = req.query;

    if (!q) {
      return next(new ErrorHandler("Please provide a search query", 400));
    }

    const peoples = await User.find({
      $or: [
        { name: { $regex: q, $options: "i" } },
        { headline: { $regex: q, $options: "i" } },
        { location: { $regex: q, $options: "i" } },
        { skills: { $regex: q, $options: "i" } },
        { website: { $regex: q, $options: "i" } },
        { bio: { $regex: q, $options: "i" } },
      ],
      ...(connections && { connections }),
      ...(location && { location }),
      ...(skills && { skills }),
      ...(sort && { sort }),
    })
      .skip((Number(page) - 1) * 20)
      .limit(20);

    if (peoples.length === 0) {
      return next(new ErrorHandler("No results found", 404));
    }

    res.status(200).json({
      success: true,
      peoples,
    });
  }
);

const getCompaniesSearch = expressAsyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const { q, page } = req.query;

    if (!q) {
      return next(new ErrorHandler("Please provide a search query", 400));
    }

    const companies = await Company.find({
      $or: [
        { name: { $regex: q, $options: "i" } },
        { location: { $regex: q, $options: "i" } },
        { website: { $regex: q, $options: "i" } },
        { bio: { $regex: q, $options: "i" } },
      ],
    })
      .skip((Number(page) - 1) * 20)
      .limit(20);

    if (companies.length === 0) {
      return next(new ErrorHandler("No results found", 404));
    }

    res.status(200).json({
      success: true,
      companies,
    });
  }
);

const getPostsSearch = expressAsyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const { q, page } = req.query;

    if (!q) {
      return next(new ErrorHandler("Please provide a search query", 400));
    }

    const posts = await Post.find({
      $or: [
        { title: { $regex: q, $options: "i" } },
        { description: { $regex: q, $options: "i" } },
        { tags: { $regex: q, $options: "i" } },
      ],
    })
      .skip((Number(page) - 1) * 20)
      .limit(20);

    if (posts.length === 0) {
      return next(new ErrorHandler("No results found", 404));
    }

    res.status(200).json({
      success: true,
      posts,
    });
  }
);

const getProjectsSearch = expressAsyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const { q, page } = req.query;

    if (!q) {
      return next(new ErrorHandler("Please provide a search query", 400));
    }

    const projects = await Project.find({
      $or: [
        { title: { $regex: q, $options: "i" } },
        { description: { $regex: q, $options: "i" } },
        { tags: { $regex: q, $options: "i" } },
      ],
    })
      .skip((Number(page) - 1) * 20)
      .limit(20);

    if (projects.length === 0) {
      return next(new ErrorHandler("No results found", 404));
    }

    res.status(200).json({
      success: true,
      projects,
    });
  }
);

const getGroupsSearch = expressAsyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const { q, page } = req.query;

    if (!q) {
      return next(new ErrorHandler("Please provide a search query", 400));
    }

    const groups = await Group.find({
      $or: [
        { title: { $regex: q, $options: "i" } },
        { description: { $regex: q, $options: "i" } },
        { tags: { $regex: q, $options: "i" } },
      ],
    })
      .skip((Number(page) - 1) * 20)
      .limit(20);

    if (groups.length === 0) {
      return next(new ErrorHandler("No results found", 404));
    }

    res.status(200).json({
      success: true,
      groups,
    });
  }
);

const getJobsSearch = expressAsyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const { q, page } = req.query;

    if (!q) {
      return next(new ErrorHandler("Please provide a search query", 400));
    }

    const jobs = await Job.find({
      $or: [
        { title: { $regex: q, $options: "i" } },
        { description: { $regex: q, $options: "i" } },
        { tags: { $regex: q, $options: "i" } },
      ],
    })
      .skip((Number(page) - 1) * 20)
      .limit(20);

    if (jobs.length === 0) {
      return next(new ErrorHandler("No results found", 404));
    }

    res.status(200).json({
      success: true,
      jobs,
    });
  }
);

const searchInConnections = expressAsyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const { q } = req.query;

    if (!q) {
      return next(new ErrorHandler("Please provide a search query", 400));
    }

    const connections = await User.find({
      $in: { connections: req.user._id },
      $or: [
        { name: { $regex: q, $options: "i" } },
        { headline: { $regex: q, $options: "i" } },
        { bio: { $regex: q, $options: "i" } },
      ],
    }).select(
      "-password -email -connections -followers -following -__v -createdAt -updatedAt -skills"
    );

    if (connections.length === 0) {
      return next(new ErrorHandler("No results found", 404));
    }

    res.status(200).json({
      success: true,
      connections,
    });
  }
);

export {
  getAllSearch,
  getPeopleSearch,
  getCompaniesSearch,
  getPostsSearch,
  getProjectsSearch,
  getGroupsSearch,
  getJobsSearch,
  searchInConnections,
};
