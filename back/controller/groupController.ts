import { NextFunction, Request, Response } from "express";
import expressAsyncHandler from "express-async-handler";
import ErrorHandler from "../utils/errorHandler";
import Group from "../model/groupModel";
import { v2 as cloudinary } from "cloudinary";
import Notification from "../model/notificationModel";

const createGroup = expressAsyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const { groupName, groupDescription } = req.body;

    if (!groupName || !groupDescription) {
      return next(new ErrorHandler("Please provide all fields", 400));
    }

    let groupImage;

    if (req.file) {
      const b64 = Buffer.from(req.file.buffer).toString("base64");
      let dataURI = "data:" + req.file.mimetype + ";base64," + b64;
      try {
        const data = await cloudinary.uploader.upload(dataURI, {
          folder: `vip/user/${name}`,
          height: 200,
          crop: "pad",
        });
        groupImage = { public_id: data.public_id, url: data.secure_url };
      } catch (error: any | unknown) {
        return next(new ErrorHandler(error, 501));
      }
    }

    const group = await Group.create({
      groupName,
      groupDescription,
      groupImage,
      members: [req.user._id],
    });

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
      .populate("members", "-password")
      .populate("admin", "-password")
      .sort({ updatedAt: -1 });

    if (!group) {
      return next(new ErrorHandler("Group not found", 404));
    }

    res.status(200).json({
      success: true,
      message: "Group fetched successfully",
      group,
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

    if (group.deleted) {
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
    const { groupName, groupDescription } = req.body;

    if (!groupName || !groupDescription) {
      return next(new ErrorHandler("Please provide all fields", 400));
    }

    let groupImage;

    if (req.file) {
      const b64 = Buffer.from(req.file.buffer).toString("base64");
      let dataURI = "data:" + req.file.mimetype + ";base64," + b64;
      try {
        const data = await cloudinary.uploader.upload(dataURI, {
          folder: `vip/user/${name}`,
          height: 200,
          crop: "pad",
        });
        groupImage = { public_id: data.public_id, url: data.secure_url };
      } catch (error: any | unknown) {
        return next(new ErrorHandler(error, 501));
      }
    }

    const group = await Group.findByIdAndUpdate(
      groupId,
      { groupName, groupDescription, groupImage },
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

const addMember = expressAsyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const groupId = req.params.id;
    const { userId } = req.body;

    if (!userId) {
      return next(new ErrorHandler("Please provide all fields", 400));
    }

    const group = await Group.findById(groupId).populate("admin", "-password");

    if (!group) {
      return next(new ErrorHandler("Group not found", 404));
    }

    const isAdmin = group.admin.some(
      (admin) => admin._id.toString() === req.user._id.toString()
    );

    if (!isAdmin) {
      return next(
        new ErrorHandler("You are not authorized to add members", 403)
      );
    }

    group.members.push(userId);
    await group.save();

    res.status(200).json({
      success: true,
      message: "Member added successfully",
      group,
    });
  }
);

const removeMember = expressAsyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const groupId = req.params.id;

    const group = await Group.findById(groupId).populate("admin", "-password");

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
      (member: any) => member.toString() !== req.user._id.toString()
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

    const group = await Group.findById(groupId).populate("admin", "-password");

    if (!group || group.deleted) {
      return next(new ErrorHandler("Group not found", 404));
    }

    group.members = group.members.filter(
      (member: any) => member.toString() !== req.user._id.toString()
    );

    if (group.members.length === 0) {
      await group.deleteOne({ _id: groupId });
      return next(
        res.status(200).json({
          success: true,
          message: "Left and deleted group successfully",
        })
      );
    }
    await group.save();

    res.status(200).json({
      success: true,
      message: "Left group successfully",
      group,
    });
  }
);

const deleteGroupImage = expressAsyncHandler(
  async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const groupId = req.params.id;

    const group = await Group.findById(groupId).populate("admin", "-password");

    if (!group) {
      return next(new ErrorHandler("Group not found", 404));
    }

    if (!group.avatar?.public_id) {
      return next(new ErrorHandler("Group image not found", 404));
    }

    await cloudinary.uploader.destroy(group.avatar.public_id);

    group.avatar = undefined;
    await group.save();

    res.status(200).json({
      success: true,
      message: "Group image deleted successfully",
      group,
    });
  }
);

const deleteBannerImage = expressAsyncHandler(
  async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const groupId = req.params.id;

    const group = await Group.findById(groupId).populate("admin", "-password");

    if (!group) {
      return next(new ErrorHandler("Group not found", 404));
    }

    if (!group.bannerImage?.public_id) {
      return next(new ErrorHandler("Group banner image not found", 404));
    }

    await cloudinary.uploader.destroy(group.bannerImage.public_id);

    group.bannerImage = undefined;
    await group.save();

    res.status(200).json({
      success: true,
      message: "Group banner image deleted successfully",
      group,
    });
  }
);

const addGroupBannerImage = expressAsyncHandler(
  async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const groupId = req.params.id;

    const group = await Group.findById(groupId).populate("admin", "-password");

    if (!group || group.deleted) {
      return next(new ErrorHandler("Group not found", 404));
    }

    const isAdmin = group.admin.some(
      (admin) => admin._id.toString() === req.user._id.toString()
    );

    if (!isAdmin) {
      return next(
        new ErrorHandler("You are not authorized to add banner image", 403)
      );
    }

    if (!req.file) {
      return next(new ErrorHandler("Please provide a banner image", 400));
    }

    const b64 = Buffer.from(req.file.buffer).toString("base64");
    let dataURI = "data:" + req.file.mimetype + ";base64," + b64;
    let bannerImage;
    try {
      const data = await cloudinary.uploader.upload(dataURI, {
        folder: `vip/user/${group.name}`,
        height: 200,
        crop: "pad",
      });
      bannerImage = { public_id: data.public_id, url: data.secure_url };
    } catch (error: any | unknown) {
      return next(new ErrorHandler(error, 501));
    }

    group.bannerImage = bannerImage;
    await group.save();

    res.status(200).json({
      success: true,
      message: "Group banner image added successfully",
      group,
    });
  }
);

const addGroupImage = expressAsyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const groupId = req.params.id;

    const group = await Group.findById(groupId).populate("admin", "-password");

    if (!group || group.deleted) {
      return next(new ErrorHandler("Group not found", 404));
    }

    const isAdmin = group.admin.some(
      (admin) => admin._id.toString() === req.user._id.toString()
    );

    if (!isAdmin) {
      return next(
        new ErrorHandler("You are not authorized to add group image", 403)
      );
    }

    if (!req.file) {
      return next(new ErrorHandler("Please provide a group image", 400));
    }

    const b64 = Buffer.from(req.file.buffer).toString("base64");
    let dataURI = "data:" + req.file.mimetype + ";base64," + b64;
    let groupImage;
    try {
      const data = await cloudinary.uploader.upload(dataURI, {
        folder: `vip/user/${group.name}`,
        height: 200,
        crop: "pad",
      });
      groupImage = { public_id: data.public_id, url: data.secure_url };
    } catch (error: any | unknown) {
      return next(new ErrorHandler(error, 501));
    }

    group.avatar = groupImage;
    await group.save();

    res.status(200).json({
      success: true,
      message: "Group image added successfully",
      group,
    });
  }
);

// request to join group
const requestToJoinGroup = expressAsyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const groupId = req.params.id;

    const group = await Group.findById(groupId).populate("admin", "-password");

    if (!group) {
      return next(new ErrorHandler("Group not found", 404));
    }

    if (group.members.includes(req.user._id)) {
      return next(
        new ErrorHandler("You are already a member of this group", 400)
      );
    }

    if (group.requests.includes(req.user._id)) {
      return next(new ErrorHandler("You have already sent a request", 400));
    }

    group.requests.push(req.user._id);

    await group.save();

    res.status(200).json({
      success: true,
      message: "Request sent successfully",
      group,
    });
  }
);

// accept group request
const acceptGroupRequest = expressAsyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const groupId = req.params.id;
    const { userId } = req.body;

    if (!userId) {
      return next(new ErrorHandler("Please provide all fields", 400));
    }

    const group = await Group.findById(groupId).populate("admin", "-password");

    if (!group) {
      return next(new ErrorHandler("Group not found", 404));
    }

    const isAdmin = group.admin.some(
      (admin) => admin._id.toString() === req.user._id.toString()
    );

    if (!isAdmin) {
      return next(
        new ErrorHandler("You are not authorized to accept requests", 403)
      );
    }

    group.members.push(userId);
    group.requests.pull(userId);

    await group.save();

    try {
      group.admin.forEach(async (admin) => {
        await Notification.create({
          sender: req.user._id,
          recipient: admin._id,
          group: group._id,
          type: "group",
          message: `${req.user.name} has accepted ${userId} to join the group ${group.name}`,
          url: req.user.url,
        });
      });
    } catch (error) {}

    try {
      Notification.create({
        sender: req.user._id,
        recipient: userId,
        group: group._id,
        type: "group",
        message: `You have been accepted to join the group ${group.name}`,
        url: group.url,
      });
    } catch (error) {}

    res.status(200).json({
      success: true,
      message: "Request accepted successfully",
      group,
    });
  }
);

// reject group request
const rejectGroupRequest = expressAsyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const groupId = req.params.id;
    const { userId } = req.body;

    if (!userId) {
      return next(new ErrorHandler("Please provide all fields", 400));
    }

    const group = await Group.findById(groupId).populate("admin", "-password");

    if (!group) {
      return next(new ErrorHandler("Group not found", 404));
    }

    const isAdmin = group.admin.some(
      (admin) => admin._id.toString() === req.user._id.toString()
    );

    if (!isAdmin) {
      return next(
        new ErrorHandler("You are not authorized to reject requests", 403)
      );
    }

    group.requests.pull(userId);

    await group.save();

    try {
      Notification.create({
        sender: req.user._id,
        recipient: userId,
        url: group.url,
        group: group._id,
        type: "group",
        message: `You have been rejected from joining the group ${group.name}`,
      });
    } catch (error) {}

    res.status(200).json({
      success: true,
      message: "Request rejected successfully",
      group,
    });
  }
);

// get all requests
const getAllRequests = expressAsyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const groupId = req.params.id;

    const group = await Group.findById(groupId).populate(
      "request",
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

    res.status(200).json({
      success: true,
      message: "Requests fetched successfully",
      requests: group.requests,
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

export {
  createGroup,
  fetchGroups,
  fetchGroup,
  deleteGroup,
  updateGroup,
  addMember,
  removeMember,
  leaveGroup,
  deleteGroupImage,
  deleteBannerImage,
  addGroupBannerImage,
  addGroupImage,
  //request
  requestToJoinGroup,
  acceptGroupRequest,
  rejectGroupRequest,
  getAllRequests,
};
