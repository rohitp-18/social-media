import expressAsyncHandler from "express-async-handler";
import { NextFunction, Request, Response } from "express";
import Invitation from "../model/invitationModel";

const createInvitation = expressAsyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const { recipientEmail, recipientUser, type, status, message } = req.body;

    const sender = req.user._id; // Assuming the sender is the authenticated user

    const invitation = await Invitation.create({
      sender,
      recipientEmail,
      recipientUser,
      type,
      status,
      message,
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
      .populate("sender", "name email")
      .populate("recipientUser", "name email");

    if (!invitations) {
      return next(new Error("No invitations found"));
    }

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
    )
      .populate("sender", "name email")
      .populate("recipientUser", "name email");

    if (!invitation) {
      return next(new Error("Invitation not found"));
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

export {
  createInvitation,
  getAllInvitations,
  getSingleInvitation,
  updateInvitation,
  deleteInvitation,
};
