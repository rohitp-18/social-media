import { NextFunction, Request, Response } from "express";
import expressAsyncHandler from "express-async-handler";
import ErrorHandler from "../utils/errorHandler";
import Group from "../model/groupModel";
import { v2 as cloudinary } from "cloudinary";
import Notification from "../model/notificationModel";
import Post from "../model/postModel";
import sendNotification from "../utils/sendNotification";

const createGroup = expressAsyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const { name, about, headline, website, location, email } = req.body;

    if (!name || !email) {
      return next(new ErrorHandler("Please provide all fields", 400));
    }

    const groupData: any = {
      name,
      about,
      headline,
      website,
      location,
      email,
      admin: [req.user._id],
      members: [req.user._id],
    };

    if (req.files) {
      const logo = req.files["logo"] ? req.files["logo"][0].path : null;
      const banner = req.files["banner"] ? req.files["banner"][0].path : null;

      if (logo) {
        const logoUpload = await cloudinary.uploader.upload(logo, {
          folder: "social/group/logo",
          resource_type: "image",
        });
        if (logoUpload) {
          groupData.avatar = {
            public_id: logoUpload.public_id,
            url: logoUpload.secure_url,
          };
        }
      }

      if (banner) {
        const bannerUpload = await cloudinary.uploader.upload(banner, {
          folder: "social/group/banner",
          resource_type: "image",
        });

        if (bannerUpload) {
          groupData.bannerImage = {
            public_id: bannerUpload.public_id,
            url: bannerUpload.secure_url,
          };
        }
      }
    }

    const group = await Group.create(groupData);

    if (!group) {
      return next(new ErrorHandler("Internal Error", 500));
    }

    res.status(201).json({
      success: true,
      message: "Group created successfully",
      group,
    });
  }
);

const fetchGroups = expressAsyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const groups = await Group.find({
      members: { $elemMatch: { $eq: req.user._id } },
    })
      .populate("members", "-password")
      .populate("admin", "-password")
      .sort({ updatedAt: -1 });

    res.status(200).json({
      success: true,
      message: "Groups fetched successfully",
      groups,
    });
  }
);

const fetchGroup = expressAsyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const groupId = req.params.id;

    const group = await Group.findById(groupId)
      .populate("members", "name avatar username headline")
      .populate("admin", "name avatar username headline")
      .populate("requests.user", "name avatar username headline");

    if (!group) {
      return next(new ErrorHandler("Group not found", 404));
    }

    const posts = await Post.find({ origin: groupId, isDeleted: false })
      .populate("userId", "name email avatar username bannerImage")
      .populate("likes", "name email avatar username bannerImage")
      .populate("comment", "name headline avatar username bannerImage")
      .populate("origin", "name headline avatar username bannerImage")
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      message: "Group fetched successfully",
      group,
      users: {
        admin: group.admin,
        requests: group.requests,
        members: group.members,
      },
      posts,
    });
  }
);

const deleteGroup = expressAsyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const groupId = req.params.id;

    const group = await Group.findById(groupId).populate("admin", "-password");

    if (!group) {
      return next(new ErrorHandler("Group not found", 404));
    }

    if (group.isDeleted) {
      return next(new ErrorHandler("Group already deleted", 404));
    }

    const isAdmin = group.admin.some(
      (admin) => admin._id.toString() === req.user._id.toString()
    );

    if (isAdmin) {
      return next(
        new ErrorHandler("You are not authorized to delete this group", 403)
      );
    }

    await group.deleteOne({ _id: groupId });

    res.status(200).json({
      success: true,
      message: "Group deleted successfully",
    });
  }
);

const updateGroup = expressAsyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const groupId = req.params.id;
    const { name, about, headline, website, location, email } = req.body;

    if (!name || !email) {
      return next(
        new ErrorHandler(`please provide ${!name ? "name" : "email"}`, 400)
      );
    }

    const groupData: any = {
      name,
      about,
      headline,
      website,
      location,
      email,
    };

    if (req.files) {
      const logo = req.files["logo"] ? req.files["logo"][0].path : null;
      const banner = req.files["banner"] ? req.files["banner"][0].path : null;

      if (logo) {
        const logoUpload = await cloudinary.uploader.upload(logo, {
          folder: "social/group/logo",
          resource_type: "image",
        });
        if (logoUpload) {
          groupData.avatar = {
            public_id: logoUpload.public_id,
            url: logoUpload.secure_url,
          };
        }
      }

      if (banner) {
        const bannerUpload = await cloudinary.uploader.upload(banner, {
          folder: "social/group/banner",
          resource_type: "image",
        });

        if (bannerUpload) {
          groupData.bannerImage = {
            public_id: bannerUpload.public_id,
            url: bannerUpload.secure_url,
          };
        }
      }
    }

    const group = await Group.findByIdAndUpdate(
      groupId,
      { ...groupData },
      { new: true, runValidators: true, useFindAndModify: false }
    );

    if (!group) {
      return next(new ErrorHandler("Group not found", 404));
    }

    res.status(200).json({
      success: true,
      message: "Group updated successfully",
      group,
    });
  }
);

const removeMember = expressAsyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const groupId = req.params.id;
    const { userId } = req.body;

    const group = await Group.findById(groupId).populate("admin");

    if (!group) {
      return next(new ErrorHandler("Group not found", 404));
    }

    const isAdmin = group.admin.some(
      (admin) => admin.toString() === req.user._id.toString()
    );

    if (!isAdmin) {
      return next(
        new ErrorHandler("You are not authorized to remove members", 403)
      );
    }

    group.members = group.members.filter(
      (member: any) => member.toString() !== userId.toString()
    );
    await group.save();

    res.status(200).json({
      success: true,
      message: "Member removed successfully",
      group,
    });
  }
);

const leaveGroup = expressAsyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const groupId = req.params.id;

    const group = await Group.findById(groupId);

    if (!group || group.isDeleted) {
      return next(new ErrorHandler("Group not found", 404));
    }

    group.members = group.members.filter(
      (member: any) => member.toString() !== req.user._id.toString()
    );

    await group.save();

    res.status(200).json({
      success: true,
      message: "Left group successfully",
      group,
    });
  }
);

// request to join group
const requestToJoinGroup = expressAsyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const groupId = req.params.id;
    const { message } = req.body;

    const group = await Group.findById(groupId).populate("admin", "-password");

    if (!group) {
      return next(new ErrorHandler("Group not found", 404));
    }

    if (group.members.includes(req.user._id)) {
      return next(
        new ErrorHandler("You are already a member of this group", 400)
      );
    }

    const isRequested = group.requests.some(
      (request: any) => request.user.toString() === req.user._id.toString()
    );

    if (isRequested) {
      group.requests.pull({ user: req.user._id });
    } else {
      group.requests.push({ user: req.user._id, message });
    }

    await group.save();

    res.status(200).json({
      success: true,
      message: isRequested
        ? "Request cancelled successfully"
        : "Request sent successfully",
      group,
      requested: !isRequested,
      user: req.user,
    });
  }
);

// accept group request
const updateGroupRequest = expressAsyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const groupId = req.params.id;
    const { userId, status } = req.body;

    if (!userId || !status) {
      return next(
        new ErrorHandler(`Please provide ${!userId ? "userId" : "status"}`, 400)
      );
    }

    const group = await Group.findById(groupId);

    if (!group) {
      return next(new ErrorHandler("Group not found", 404));
    }

    const isAdmin = group.admin.some(
      (admin) => admin.toString() === req.user._id.toString()
    );

    if (!isAdmin) {
      return next(
        new ErrorHandler("You are not authorized to accept requests", 403)
      );
    }

    if (status === "accepted") {
      group.members.push(userId);
    }

    group.requests.pull({ user: req.user._id });

    await group.save();

    if (status === "rejected") {
      return next(
        res.status(200).json({
          success: true,
          message: "Request rejected successfully",
          group,
        })
      );
    }

    let notification;
    try {
      notification = await Notification.create({
        sender: req.user._id,
        recipient: userId,
        group: group._id,
        type: "group",
        message: `You are now a member of the group ${group.name}`,
        url: `/group/${group._id}`,
      });

      await sendNotification(notification, userId);
    } catch (error) {}

    res.status(200).json({
      success: true,
      message: "Request accepted successfully",
      group,
      notification,
    });
  }
);

const getMembersWhoUserFollowed = expressAsyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const groupId = req.params.id;

    const group = await Group.findById(groupId).populate(
      "members",
      "-password"
    );

    if (!group) {
      return next(new ErrorHandler("Group not found", 404));
    }

    const isAdmin = group.admin.some(
      (admin) => admin._id.toString() === req.user._id.toString()
    );

    if (!isAdmin) {
      return next(
        new ErrorHandler("You are not authorized to get requests", 403)
      );
    }
    const members = group.members.filter(
      (member: any) =>
        member.followers && member.followers.includes(req.user._id)
    );
    res.status(200).json({
      success: true,
      message: "Members fetched successfully",
      members,
    });
  }
);

const getMembersWhoUserFollowedAndGroup = expressAsyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const groupId = req.params.id;

    const group = await Group.findById(groupId).populate(
      "members",
      "-password"
    );

    if (!group) {
      return next(new ErrorHandler("Group not found", 404));
    }

    const members = group.members.filter(
      (member: any) =>
        member.followers && member.followers.includes(req.user._id)
    );
    const membersWithGroup = members.map((member: any) => {
      return {
        ...member._doc,
        group: groupId,
      };
    });
    res.status(200).json({
      success: true,
      message: "Members fetched successfully",
      members: membersWithGroup,
    });
  }
);

const fetchRecommendedGroups = expressAsyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const { groupId } = req.query;

    let group;
    if (groupId) {
      group = await Group.findById(groupId);
    }

    // Find recommended groups based on similarity (not just exact match)
    // We'll use $text search if indexes exist, otherwise fallback to regex similarity
    let groups;
    if (group) {
      groups = await Group.find({
        _id: { $ne: group._id },
        $or: (() => {
          const orArr = [];
          if (group?.name) {
            orArr.push({
              name: {
                $regex: group.name.split(" ").join("|"),
                $options: "i",
              },
            });
          }
          if (group?.headline) {
            orArr.push({
              headline: {
                $regex: group.headline.split(" ").join("|"),
                $options: "i",
              },
            });
          }
          if (group?.location) {
            orArr.push({
              location: {
                $regex: (Array.isArray(group.location)
                  ? group.location.join(" ")
                  : group.location
                )
                  .split(" ")
                  .join("|"),
                $options: "i",
              },
            });
          }
          return orArr;
        })(),
      });
    } else {
      groups = await Group.find(
        req.user ? { members: { $in: [req.user._id] } } : {}
      ).sort({ createdAt: -1 });
    }

    res.status(200).json({
      success: true,
      message: "Recommended groups fetched successfully",
      groups,
    });
  }
);

export {
  createGroup,
  fetchGroups,
  fetchGroup,
  deleteGroup,
  updateGroup,
  removeMember,
  leaveGroup,
  //request
  requestToJoinGroup,
  updateGroupRequest,
  fetchRecommendedGroups,
};
