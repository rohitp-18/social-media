import { NextFunction, Request, Response } from "express";
import expressAsyncHandler from "express-async-handler";
import ErrorHandler from "../utils/errorHandler";
import Company from "../model/companyModel";
import User from "../model/userModel";
import Notification from "../model/notificationModel";
import { v2 as cloudinary } from "cloudinary";
import Post from "../model/postModel";
import Job from "../model/jobModel";

const createCompany = expressAsyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const {
      name,
      email,
      phone,
      address,
      website,
      headline,
      about,
      state,
      city,
      country,
    } = req.body;

    // Validate required fields
    if (!name || !email || !phone || !address) {
      return next(new ErrorHandler("Please provide all required fields", 400));
    }

    // Check if company with the same name already exists
    const existingCompany = await Company.findOne({
      name,
    });

    if (existingCompany) {
      return next(
        new ErrorHandler("Company with this name already exists", 400)
      );
    }

    const companyData: any = {
      name,
      email,
      phone,
      address: [{ address, city, state, country }],
      website,
      headline,
      about,
      admin: [req.user._id],
      isDeleted: false,
      members: [req.user._id],
    };

    if (req.files) {
      // Handle logo and banner images if provided
      const logo = req.files["logo"] ? req.files["logo"][0].path : null;
      const banner = req.files["banner"] ? req.files["banner"][0].path : null;

      if (logo) {
        const logoUpload = await cloudinary.uploader.upload(logo, {
          folder: "social/companies/logo",
          resource_type: "image",
        });
        if (logoUpload) {
          companyData.avatar = {
            public_id: logoUpload.public_id,
            url: logoUpload.secure_url,
          };
        }
      }

      if (banner) {
        const bannerUpload = await cloudinary.uploader.upload(banner, {
          folder: "social/companies/banner",
          resource_type: "image",
        });

        if (bannerUpload) {
          companyData.bannerImage = {
            public_id: bannerUpload.public_id,
            url: bannerUpload.secure_url,
          };
        }
      }
    }

    // Create new company
    const company = await Company.create(companyData);

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
      .populate("admin", "name email avatar username bannerImage")
      .populate("members", "name email avatar username bannerImage")
      .populate("followers", "name email avatar username bannerImage");

    if (!company || company.isDeleted) {
      return next(new ErrorHandler("Company not found", 404));
    }

    const posts = await Post.find({
      isDeleted: false,
      origin: company._id,
      postType: "company",
    })
      .populate("userId", "name email avatar username bannerImage")
      .populate("likes", "name email avatar username bannerImage")
      .populate("comment", "name headline avatar username bannerImage")
      .populate("origin", "name headline avatar username bannerImage")
      .sort({ createdAt: -1 });

    const jobs = await Job.find({ company: company._id, isDeleted: false })
      .populate("company", "name email avatar username bannerImage")
      .populate("user", "name email avatar username bannerImage")
      .limit(10)
      .sort({ createdAt: -1 });

    // Return success response with company data
    res.status(200).json({
      success: true,
      company,
      posts,
      jobs,
      message: "Company fetched successfully",
    });
  }
);

const updatePrimaryCompany = expressAsyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const companyId = req.params.id;
    const {
      name,
      email,
      phone,
      address,
      website,
      headline,
      about,
      state,
      city,
      country,
    } = req.body;

    // Validate required fields
    if (!name || !email || !phone || !address) {
      return next(new ErrorHandler("Please provide all required fields", 400));
    }

    // Find company by ID and update it
    // First find the company by ID
    let company = await Company.findById(companyId);

    // Check if company exists
    if (
      !company ||
      company.isDeleted ||
      !company.admin.includes(req.user._id)
    ) {
      return next(new ErrorHandler("Company not found", 404));
    }

    const companyData: any = {
      name,
      email,
      phone,
      address: [{ address, city, state, country }],
      website,
      headline,
      about,
    };

    if (req.files) {
      // Handle logo and banner images if provided
      const logo = req.files["logo"] ? req.files["logo"][0] : null;
      const banner = req.files["banner"] ? req.files["banner"][0] : null;

      if (logo) {
        const b64 = Buffer.from(logo.buffer).toString("base64");
        let dataURI = "data:" + logo.mimetype + ";base64," + b64;
        const logoUpload = await cloudinary.uploader.upload(dataURI, {
          folder: "social/companies/logo",
          resource_type: "image",
        });
        if (logoUpload) {
          company.avatar?.public_id &&
            (await cloudinary.uploader.destroy(company.avatar.public_id || ""));
          companyData.avatar = {
            public_id: logoUpload.public_id,
            url: logoUpload.secure_url,
          };
        }
      }

      if (banner) {
        const b64 = Buffer.from(banner.buffer).toString("base64");
        let dataURI = "data:" + banner.mimetype + ";base64," + b64;
        const bannerUpload = await cloudinary.uploader.upload(dataURI, {
          folder: "social/companies/banner",
          resource_type: "image",
        });
        if (bannerUpload) {
          company.bannerImage?.public_id &&
            (await cloudinary.uploader.destroy(
              company.bannerImage.public_id || ""
            ));
          companyData.bannerImage = {
            public_id: bannerUpload.public_id,
            url: bannerUpload.secure_url,
          };
        }
      }
    }

    // Save the updated company
    company = await Company.findByIdAndUpdate(companyId, companyData, {
      new: true,
      runValidators: true,
      useFindAndModify: false,
    });

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

    let isFollowing = false;
    if (req.user) {
      // Check if the user is following the company
      isFollowing = company.followers.some(
        (follower) => follower._id.toString() === req.user._id.toString()
      );
    }

    const postsWithIsLike = company.posts.map((post: any) => {
      const isLiked = post.likes.some(
        (like: any) => like._id.toString() === req.user?._id.toString()
      );
      return {
        ...post.toObject(),
        isLiked,
        isFollowing,
      };
    });

    // Return success response with company's posts
    res.status(200).json({
      success: true,
      company: {
        ...company.toObject(),
        posts: postsWithIsLike,
      },
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
    company.followers.push(req.user._id);
    // Add company to user's following list
    const user = await User.findById(req.user._id);
    if (!user) {
      return next(new ErrorHandler("User not found", 404));
    }
    // Check if user is already following the company
    const isUserFollowing = user.companies.some(
      (company) => company.toString() === companyId.toString()
    );

    if (isUserFollowing) {
      return next(new ErrorHandler("Already following this company", 400));
    }

    user.companies.push(company._id as any);

    try {
      await Notification.create(
        company.admin.map(async (admin) => {
          if (admin._id.toString() !== req.user._id.toString()) {
            return {
              sender: req.user._id,
              recipient: admin._id,
              type: "follow",
              message: `${req.user.name} followed your company ${company.name}`,
              relatedId: company._id,
              url: req.user.url,
              company: companyId,
            };
          }
        })
      );
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
    // company.followers.pull( req.user._id );
    company.followers = company.followers.filter(
      (follower) => follower._id.toString() !== req.user._id.toString()
    );
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
        (company) => company.toString() === follower.toString()
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
    const user = await User.findById(req.user._id);
    // Handle case when user retrieval fails
    if (!user) {
      return next(new ErrorHandler("User not found", 404));
    }

    // Filter the followers of the company to find those who are also followed by the user
    const commonFollowers = company.followers.filter((follower) =>
      user.companies.some((comp) => comp.toString() === follower._id.toString())
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

const updateBanner = expressAsyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const { remove } = req.body;

    const { id } = req.params;

    let company = await Company.findById(id);

    if (!company) {
      return next(new ErrorHandler("Company not found", 404));
    }

    if (remove === "true") {
      if (company.bannerImage && company.bannerImage.public_id) {
        await cloudinary.uploader.destroy(company.bannerImage.public_id);
      }
      company = await Company.findByIdAndUpdate(
        id,
        { bannerImage: { public_id: "", url: "" } },
        {
          new: true,
          runValidators: true,
          useFindAndModify: false,
        }
      );

      return next(
        res.status(200).json({
          success: true,
          message: "Banner removed successfully",
          company,
        })
      );
    }

    if (!req.file) {
      return next(new ErrorHandler("Please upload a banner image", 403));
    }

    if (company.bannerImage && company.bannerImage.public_id) {
      await cloudinary.uploader.destroy(company.bannerImage.public_id);
    }

    let form: any = {
      bannerImage: { public_id: "", url: "" },
    };

    if (req.file) {
      const b64 = Buffer.from(req.file.buffer).toString("base64");
      let dataURI = "data:" + req.file.mimetype + ";base64," + b64;
      try {
        const data = await cloudinary.uploader.upload(dataURI, {
          folder: "social/companies/banner",
          resource_type: "image",
        });
        form.bannerImage = { public_id: data.public_id, url: data.secure_url };
      } catch (error: any | unknown) {
        return next(new ErrorHandler(error, 501));
      }
    }

    company = await Company.findByIdAndUpdate(company._id, form, {
      new: true,
      runValidators: true,
      useFindAndModify: false,
    });

    res.status(200).json({
      success: true,
      message: "Banner updated successfully",
      company,
    });
  }
);

export {
  createCompany,
  getAllCompanies,
  getSingleCompany,
  updatePrimaryCompany,
  deleteCompany,
  getCompanyJobs,
  getCompanyPosts,
  getCompanyFollowers,
  followCompany,
  unfollowCompany,
  updateBanner,
};
