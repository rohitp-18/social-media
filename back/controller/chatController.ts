import { NextFunction, Request, Response } from "express";
import expressAsyncHandler from "express-async-handler";
import Chat from "../model/chatModel";
import ErrorHandler from "../utils/errorHandler";
import { v2 as cloudinary } from "cloudinary";
import Message from "../model/messageModel";
import Group from "../model/groupModel";
import Notification from "../model/notificationModel";

const createChat = expressAsyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const { userId } = req.body;

    const chat = await Chat.findOne({
      isGroupChat: false,
      $or: [
        { members: { $elemMatch: { $eq: req.user._id } } },
        { members: { $elemMatch: { $eq: userId } } },
      ],
    })
      .populate("members", "-password")
      .populate("lastMessage");

    if (chat) {
      const notification = await Notification.create({
        sender: req.user._id,
        recipient: userId,
        type: "chat",
        message: `${req.user.name} started a chat with you`,
        relatedId: chat._id,
      });

      return next(
        res.status(200).json({
          success: true,
          chat,
          message: "Chat already exists",
        })
      );
    }

    // create notfication

    const newChat = await Chat.create({
      chatId: req.user._id + userId,
      members: [req.user._id, userId],
    });

    if (!newChat) {
      return next(new ErrorHandler("Chat not created", 500));
    }

    const notification = await Notification.create({
      sender: req.user._id,
      recipient: userId,
      type: "chat",
      message: `${req.user.name} started a chat with you`,
      relatedId: newChat._id,
    });

    if (!notification) {
      return next(new ErrorHandler("Notification not created", 500));
    }

    const populatedChat = await newChat.populate("members", "-password");

    res.status(200).json({
      success: true,
      chat: populatedChat,
      message: "Chat created successfully",
    });
  }
);

const fetchChats = expressAsyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const chats = await Chat.find({
      members: { $elemMatch: { $eq: req.user._id } },
    })
      .populate("members", "-password")
      .populate("lastMessage")
      .sort({ updatedAt: -1 });

    res.status(200).json({
      success: true,
      chats,
      message: "Chats fetched successfully",
    });
  }
);

const fetchChat = expressAsyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const chatId = req.params.id;

    const chat = await Chat.findById(chatId)
      .populate("members", "-password")
      .populate("lastMessage")
      .sort({ updatedAt: -1 });

    if (!chat || chat.isDeleted) {
      return next(new ErrorHandler("Chat not found", 404));
    }

    const messages = await Message.find({ chat: chatId })
      .populate("sender", "-password")
      .populate("chat")
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      chat,
      message: "Chat fetched successfully",
      messages,
    });
  }
);

const deleteChat = expressAsyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const chatId = req.params.id;

    const chat = await Chat.findById(chatId).populate("group");

    if (!chat || chat.isDeleted) {
      return next(new ErrorHandler("Chat not found", 404));
    }

    const group = await Group.findById(chat.group).populate(
      "admin",
      "-password"
    );

    if (!group) {
      return next(new ErrorHandler("Group not found", 404));
    }

    // check if user is admin of group or not
    const isAdmin = group.admin.some(
      (admin) => admin._id.toString() === req.user._id.toString()
    );

    if (chat.isGroupChat && isAdmin) {
      return next(
        new ErrorHandler(
          "You are not authorized to delete this group chat",
          403
        )
      );
    }

    res.status(200).json({
      success: true,
      message: "Chat deleted successfully",
    });
  }
);

const createMessage = expressAsyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const { sender, chat, content, image, video, audio, document, reply } =
      req.body;
    if (!sender || !chat) {
      return next(new ErrorHandler("cannot send a message", 403));
    }

    if (!content && !image && !video && !audio && !document) {
      return next(new ErrorHandler("Please fill all required fields", 403));
    }

    // check message is text content or image or video or audio or document
    let message: any;
    if (content) {
      message = await Message.create({ sender, chat, content });
    }
    if (image) {
      message = await Message.create({ sender, chat, image });
    }
    if (video) {
      message = await Message.create({ sender, chat, video });
    }
    if (audio) {
      message = await Message.create({ sender, chat, audio });
    }
    if (document) {
      message = await Message.create({ sender, chat, document });
    }
    if (reply) {
      message = await Message.create({ sender, chat, reply });
    }
  }
);

export {
  createChat,
  fetchChats,
  fetchChat,
  deleteChat,
  //
  createMessage,
};
