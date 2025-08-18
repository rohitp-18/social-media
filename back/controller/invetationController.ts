import expressAsyncHandler from "express-async-handler";
import { NextFunction, Request, Response } from "express";
import Invitation from "../model/invitationModel";
import Notification from "../model/notificationModel";
import ErrorHandler from "../utils/errorHandler";
import Group from "../model/groupModel";
import User from "../model/userModel";
import Company from "../model/companyModel";

const createInvitation = expressAsyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const { recipientId, recipientUser, type, link, status, message } =
      req.body;

    const sender = req.user._id; // Assuming the sender is the authenticated user

    const invitation = await Invitation.create({
      sender,
      recipientId,
      recipientUser,
      type,
      status,
      message,
      link,
      createdAt: new Date(),
      expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // Set expiration to 7 days from now
    });

    if (!invitation) {
      return next(new Error("Invitation not created"));
    }

    res.status(201).json({
      success: true,
      invitation,
      message: "Invitation created successfully",
    });
  }
);

const getAllInvitations = expressAsyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const invitations = await Invitation.find({ recipientUser: req.user._id })
      .populate("sender", "name email username avatar headline")
      .populate("recipientUser", "name email username avatar headline")
      .populate("targetId", "name avatar headline username");

    if (!invitations) {
      return next(new Error("No invitations found"));
    }

    await Promise.all(
      invitations.map(async (invitation) => {
        invitation.unread = false;
        await invitation.save();
      })
    );

    res.status(200).json({
      success: true,
      invitations,
      message: "Invitations fetched successfully",
    });
  }
);

const getSingleInvitation = expressAsyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const invitationId = req.params.id;

    const invitation = await Invitation.findById(invitationId)
      .populate("sender", "name email")
      .populate("recipientUser", "name email");

    if (!invitation) {
      return next(new Error("Invitation not found"));
    }

    res.status(200).json({
      success: true,
      invitation,
      message: "Invitation fetched successfully",
    });
  }
);

const updateInvitation = expressAsyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const invitationId = req.params.id;
    const { status } = req.body;

    const invitation = await Invitation.findByIdAndUpdate(
      invitationId,
      { status },
      { new: true }
    );

    if (!invitation) {
      return next(new ErrorHandler("Invitation not found", 404));
    }

    if (status === "accepted" && invitation.sender) {
      await Notification.create({
        sender: req.user._id,
        recipient: invitation.sender,
        type: "invitation",
        message: `Your invitation has been accepted by ${req.user.name}`,
        url: `/u/${req.user.username}`,
        relatedId: invitation._id,
        refModel: "Invitation",
      });

      // If the invitation is accepted, you might want to perform additional actions,
      // such as adding the user to a group, following them, etc.
      if (invitation.type === "group") {
        // Add the user to the group
        await Group.findByIdAndUpdate(invitation.targetId, {
          $addToSet: { members: req.user._id },
        });
      }
      if (invitation.type === "connection") {
        // Add the user to the connections
        await User.findByIdAndUpdate(req.user._id, {
          $addToSet: { connections: invitation.sender },
        });
        await User.findByIdAndUpdate(invitation.sender, {
          $addToSet: { connections: req.user._id },
        });
      }

      if (invitation.type === "company") {
        // Add the user to the company
        await Company.findByIdAndUpdate(invitation.targetId, {
          $addToSet: { members: req.user._id },
        });
      }
    }
    if (status === "rejected") {
      await Notification.create({
        sender: req.user._id,
        recipient: invitation.sender,
        type: "invitation",
        message: `Your invitation has been rejected by ${req.user.name}`,
        url: `/u/${req.user.username}`,
        relatedId: invitation._id,
        refModel: "Invitation",
      });
    }

    res.status(200).json({
      success: true,
      invitation,
      message: "Invitation updated successfully",
    });
  }
);

const deleteInvitation = expressAsyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const invitationId = req.params.id;

    const invitation = await Invitation.findByIdAndDelete(invitationId);

    if (!invitation) {
      return next(new Error("Invitation not found"));
    }

    res.status(200).json({
      success: true,
      message: "Invitation deleted successfully",
    });
  }
);

const createInvitationForAll = expressAsyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const { recipientId, type, link, status, message, targetId, refModel } =
      req.body;

    const sender = req.user._id; // Assuming the sender is the authenticated user

    if (
      !recipientId ||
      !Array.isArray(recipientId) ||
      recipientId.length === 0
    ) {
      return next(
        new ErrorHandler(
          "Recipient email is required and should be an array",
          400
        )
      );
    }

    const invitations = await Invitation.create(
      recipientId.map((id: string) => ({
        sender,
        recipientUser: id,
        type,
        status,
        message,
        targetId,
        refModel,
        link,
        createdAt: new Date(),
        expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // Set expiration to 7 days from now
      }))
    );

    if (!invitations || invitations.length === 0) {
      return next(new ErrorHandler("Invitations not created", 400));
    }

    await Notification.create(
      recipientId.map((id) => ({
        sender,
        recipient: id,
        type: "invitation",
        message,
        url: link,
        relatedId: targetId,
        refModel,
      }))
    );

    if (!invitations || invitations.length === 0) {
      return next(new Error("Invitations not created"));
    }

    res.status(201).json({
      success: true,
      invitations,
      message: "Invitations created successfully",
    });
  }
);

export {
  createInvitation,
  getAllInvitations,
  getSingleInvitation,
  updateInvitation,
  deleteInvitation,
  createInvitationForAll,
};
