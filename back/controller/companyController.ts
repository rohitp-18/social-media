import { NextFunction, Request, Response } from "express";
import expressAsyncHandler from "express-async-handler";
import ErrorHandler from "../utils/errorHandler";
import Company from "../model/companyModel";
import User from "../model/userModel";
import Notification from "../model/notificationModel";

const createComapany = expressAsyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const { name, email, phone, address, users } = req.body;

    // Validate required fields
    if (!name || !email || !phone || !address) {
      return next(new ErrorHandler("Please provide all required fields", 400));
    }

    // Create new company
    const company = await Company.create({
      name,
      email,
      phone,
      address,
      admin: req.user._id,
      members: [users],
    });

    // Handle case when company creation fails
    if (!company) {
      return next(new ErrorHandler("Internal error", 500));
    }

    // Return success response with created company data
    res.status(201).json({
      success: true,
      company,
      message: "Company created successfully",
    });
  }
);

const getAllCompanies = expressAsyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    // Retrieve all companies and populate with name email avatar and bannerImage
    // and exclude deleted companies
    const companies = await Company.find({ isDeleted: false });

    // Handle case when companies retrieval fails
    if (!companies) {
      return next(new ErrorHandler("Internal error", 500));
    }

    // Return success response with all companies
    res.status(200).json({
      success: true,
      companies,
      message: "Companies fetched successfully",
    });
  }
);

const getSingleCompany = expressAsyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const companyId = req.params.id;

    // Find company by ID and populate with name email avatar and bannerImage
    const company = await Company.findById(companyId)
      .populate("admin", "name email avatar bannerImage")
      .populate("members", "name email avatar bannerImage")
      .populate("posts")
      .populate("jobs", "title description location salary companyId")
      .populate("followers", "name email avatar bannerImage");

    if (!company || company.isDeleted) {
      return next(new ErrorHandler("Company not found", 404));
    }

    // Return success response with company data
    res.status(200).json({
      success: true,
      company,
      message: "Company fetched successfully",
    });
  }
);

const updatePrimaryCompany = expressAsyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const companyId = req.params.id;
    const { name, email, phone, address, users } = req.body;

    // Validate required fields
    if (!name || !email || !phone || !address) {
      return next(new ErrorHandler("Please provide all required fields", 400));
    }

    // Find company by ID and update it
    // First find the company by ID
    let company = await Company.findById(companyId);

    // Check if company exists
    if (!company || company.isDeleted || company.admin !== req.user._id) {
      return next(new ErrorHandler("Company not found", 404));
    }

    // Update company fields
    company.name = name;
    company.email = email;
    company.phone = phone;
    company.address = address;
    company.members = users;

    // Save the updated company
    company = await company.save();

    // Handle case when company update fails
    if (!company) {
      return next(new ErrorHandler("Internal error", 500));
    }

    // Return success response with updated company data
    res.status(200).json({
      success: true,
      company,
      message: "Company updated successfully",
    });
  }
);

const deleteCompany = expressAsyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const companyId = req.params.id;

    // Find the company by ID
    const company = await Company.findById(companyId);

    // Check if company exists
    if (!company || company.isDeleted || company.admin !== req.user._id) {
      return next(new ErrorHandler("Company not found", 404));
    }

    // Soft delete the company
    company.isDeleted = true;
    await company.save();

    // Return success response with message
    res.status(200).json({
      success: true,
      message: "Company deleted successfully",
    });
  }
);

const getCompanyJobs = expressAsyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const companyId = req.params.id;

    // Find the company by ID and populate with jobs
    const company = await Company.findById(companyId).populate("jobs");

    // Handle case when company retrieval fails
    if (!company || company.isDeleted) {
      return next(new ErrorHandler("Internal error", 500));
    }

    // Return success response with company's jobs
    res.status(200).json({
      success: true,
      jobs: company.jobs,
      message: "Jobs fetched successfully",
    });
  }
);

const getCompanyPosts = expressAsyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const companyId = req.params.id;

    // Find the company by ID and populate with posts
    const company = await Company.findById(companyId).populate("posts");

    // Handle case when company retrieval fails
    if (!company || company.isDeleted) {
      return next(new ErrorHandler("Internal error", 500));
    }

    // Return success response with company's posts
    res.status(200).json({
      success: true,
      posts: company.posts,
      message: "Posts fetched successfully",
    });
  }
);

const getCompanyFollowers = expressAsyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const companyId = req.params.id;

    // Find the company by ID and populate with followers
    const company = await Company.findById(companyId).populate(
      "followers",
      "name email avatar bannerImage"
    );

    // Handle case when company retrieval fails
    if (!company || company.isDeleted) {
      return next(new ErrorHandler("Internal error", 500));
    }

    // Return success response with company's followers
    res.status(200).json({
      success: true,
      followers: company.followers,
      message: "Followers fetched successfully",
    });
  }
);

const followCompany = expressAsyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const companyId = req.params.id;

    // Find the company by ID
    const company = await Company.findById(companyId);

    // Handle case when company is not found or is deleted
    if (!company || company.isDeleted) {
      return next(new ErrorHandler("Company not found", 404));
    }

    // Check if user is already following the company
    const isFollowing = company.followers.some(
      (follower) => follower._id.toString() === req.user._id.toString()
    );

    if (isFollowing) {
      return next(new ErrorHandler("Already following this company", 400));
    }

    // Add user to company's followers
    company.followers.push({ _id: req.user._id });
    // Add company to user's following list
    const user = await User.findById(req.user._id);
    if (!user) {
      return next(new ErrorHandler("User not found", 404));
    }
    // Check if user is already following the company
    const isUserFollowing = user.companies.some(
      (company) => company._id.toString() === companyId.toString()
    );

    if (isUserFollowing) {
      return next(new ErrorHandler("Already following this company", 400));
    }

    // Add company to user's following list

    try {
      company.admin.map(async (admin) => {
        if (admin._id.toString() !== req.user._id.toString()) {
          const notification = await Notification.create({
            sender: req.user._id,
            recipient: admin._id,
            type: "follow",
            message: `${req.user.name} followed your company ${company.name}`,
            relatedId: company._id,
            url: req.user.url,
            company: companyId,
          });
        }
      });
    } catch (error) {}

    user.updateOne({
      $addToSet: { companies: companyId },
    });
    await user.save();
    await company.save();

    // Return success response with message
    res.status(200).json({
      success: true,
      message: "Followed the company successfully",
    });
  }
);

const unfollowCompany = expressAsyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const companyId = req.params.id;

    // Find the company by ID
    const company = await Company.findById(companyId);

    // Handle case when company is not found or is deleted
    if (!company || company.isDeleted) {
      return next(new ErrorHandler("Company not found", 404));
    }

    // Check if user is already following the company
    const isFollowing = company.followers.some(
      (follower) => follower._id.toString() === req.user._id.toString()
    );

    if (!isFollowing) {
      return next(new ErrorHandler("Not following this company", 400));
    }

    // Remove user from company's followers
    company.followers.pull({ _id: req.user._id });
    // Remove company from user's following list
    const user = await User.findById(req.user._id);
    if (!user) {
      return next(new ErrorHandler("User not found", 404));
    }
    user.companies = user.companies.filter(
      (company) => company.toString() !== companyId.toString()
    );
    await user.save();
    // Save the updated company
    await company.save();

    // Return success response with message
    res.status(200).json({
      success: true,
      message: "Unfollowed the company successfully",
    });
  }
);

// to see users who are following the company and you are following the user
const getCompanyFollowersAndYou = expressAsyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const companyId = req.params.id;

    // Find the company by ID and populate with followers
    const company = await Company.findById(companyId).populate(
      "followers",
      "name email avatar bannerImage"
    );

    // Handle case when company retrieval fails
    if (!company || company.isDeleted) {
      return next(new ErrorHandler("Internal error", 500));
    }

    // Find the user who is following the company
    const user = await User.findById(req.user._id).populate(
      "companies",
      "name email avatar bannerImage"
    );

    // Handle case when user retrieval fails
    if (!user) {
      return next(new ErrorHandler("User not found", 404));
    }

    // Filter the followers of the company to find those who are also followed by the user
    const followers = company.followers.filter((follower) =>
      user.companies.some(
        (company) => company._id.toString() === follower._id.toString()
      )
    );

    // Return success response with company's followers and user's companies
    res.status(200).json({
      success: true,
      followers,
      companies: user.companies,
      message: "Followers fetched successfully",
    });
  }
);

// get all companies that the common followers are following of company and user
const getCommonFollowers = expressAsyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const companyId = req.params.id;

    // Find the company by ID and populate with followers
    const company = await Company.findById(companyId).populate(
      "followers",
      "name email avatar bannerImage"
    );
    // Handle case when company retrieval fails

    if (!company || company.isDeleted) {
      return next(new ErrorHandler("Internal error", 500));
    }

    // Find the user who is following the company
    const user = await User.findById(req.user._id).populate(
      "companies",
      "name email avatar bannerImage"
    );

    // Handle case when user retrieval fails
    if (!user) {
      return next(new ErrorHandler("User not found", 404));
    }

    // Filter the followers of the company to find those who are also followed by the user
    const commonFollowers = company.followers.filter((follower) =>
      user.companies.some(
        (company) => company._id.toString() === follower._id.toString()
      )
    );

    // Return success response with company's followers and user's companies
    res.status(200).json({
      success: true,
      commonFollowers,
      companies: user.companies,
      message: "Common followers fetched successfully",
    });
  }
);

export {
  createComapany,
  getAllCompanies,
  getSingleCompany,
  updatePrimaryCompany,
  deleteCompany,
  getCompanyJobs,
  getCompanyPosts,
  getCompanyFollowers,
  followCompany,
  unfollowCompany,
};
