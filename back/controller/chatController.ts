import { NextFunction, Request, Response } from "express";
import expressAsyncHandler from "express-async-handler";
import Chat from "../model/chatModel";
import ErrorHandler from "../utils/errorHandler";
import { v2 as cloudinary } from "cloudinary";
import Message from "../model/messageModel";
import Group from "../model/groupModel";
import Notification from "../model/notificationModel";
import User from "../model/userModel";

const createChat = expressAsyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const { userId } = req.body;

    const chat = await Chat.findOne({
      isGroupChat: false,
      $and: [
        { members: { $elemMatch: { $eq: req.user._id } } },
        { members: { $elemMatch: { $eq: userId } } },
      ],
    })
      .populate("members", "-password")
      .populate("lastMessage");
    console.log(23, "Chat search");

    if (chat) {
      console.log(26, "Chat already exists", chat);

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

    console.log(44, newChat);
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
      .populate("members", "name email avatar headline")
      .populate("group", "name avatar")
      .populate("lastMessage", "-chat")
      .sort({ updatedAt: -1 })
      .lean();

    // Count unread messages for each chat without relying on the last message timestamp
    const chatsWithUnread = await Promise.all(
      chats.map(async (chat) => {
        const unreadCount = await Message.countDocuments({
          chat: chat._id,
          readBy: { $ne: req.user._id },
        });
        return {
          ...chat,
          unreadCount,
        };
      })
    );

    res.status(200).json({
      success: true,
      chats: chatsWithUnread,
      message: "Chats fetched successfully",
    });
  }
);

const fetchChat = expressAsyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const chatId = req.params.id;

    const chat = await Chat.findById(chatId)
      .populate("members", "name avatar email username")
      .populate("lastMessage")
      .sort({ updatedAt: -1 });

    if (!chat || chat.isDeleted) {
      return next(new ErrorHandler("Chat not found", 404));
    }

    const messages = await Message.find({ chat: chatId })
      .populate("sender", "name avatar username")
      .populate("chat")
      .populate("replyTo")
      .sort({ createdAt: 1 });

    if (!messages) {
      return next(new ErrorHandler("messages not found", 404));
    }

    const allMessages = await Promise.all(
      messages.map(async (message: any) => {
        if (
          !message.readBy.some(
            (user: any) => user._id.toString() === req.user._id.toString()
          )
        ) {
          message.readBy.push(req.user._id);
          await message.save();
        }
        if (message.replyTo) {
          return await User.populate(message, {
            path: "replyTo.sender",
            select: "name avatar username",
          });
        }
        return message;
      })
    );

    res.status(200).json({
      success: true,
      chat,
      message: "Chat fetched successfully",
      messages: allMessages,
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

    // check if chat exists
    const chatExists = await Chat.findById(chat);
    if (!chatExists || chatExists.isDeleted) {
      return next(new ErrorHandler("Chat not found", 404));
    }

    if (!chatExists.members.includes(sender)) {
      return next(new ErrorHandler("You are not a member of this chat", 403));
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

    if (!message) {
      return next(new ErrorHandler("Message not created", 500));
    }

    message.readBy.push(sender);
    await message.save();

    chatExists.lastMessage = message._id;
    await chatExists.save();

    const populatedMessage = await Message.findById(message._id)
      .populate("sender", "name avatar username")
      .populate("chat", "members");

    res.status(200).json({
      message: populatedMessage,
      success: true,
    });
  }
);

const readMessage = expressAsyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const { chatId, messageId } = req.body;
    if (!chatId || !messageId) {
      return next(new ErrorHandler("Chat ID and Message ID are required", 400));
    }

    const chat = await Chat.findById(chatId);

    if (!chat || chat.isDeleted) {
      return next(new ErrorHandler("Chat not found", 404));
    }

    const message = await Message.findById(messageId)
      .populate("sender", "name avatar username")
      .populate("chat", "members");

    if (!message) {
      return next(new ErrorHandler("Message not found", 404));
    }

    if (
      !message.readBy.some(
        (user) => user._id.toString() === req.user._id.toString()
      )
    ) {
      message.readBy.push(req.user._id);
      await message.save();
    }

    res.status(200).json({
      success: true,
      message: "Message read successfully",
      data: message,
    });
  }
);

const createReplyMessage = expressAsyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const { chatId, messageId, content } = req.body;

    if (!chatId || !messageId || !content) {
      return next(
        new ErrorHandler(
          "Chat ID, Message ID and Reply content are required",
          400
        )
      );
    }

    const chat = await Chat.findById(chatId);
    if (!chat || chat.isDeleted) {
      return next(new ErrorHandler("Chat not found", 404));
    }

    const message = await Message.findById(messageId);
    if (!message) {
      return next(new ErrorHandler("Message not found", 404));
    }

    const replyMessage = await Message.create({
      sender: req.user._id,
      chat: chatId,
      content: content,
      replyTo: message._id,
    });

    if (!replyMessage) {
      return next(new ErrorHandler("Reply message not created", 500));
    }

    replyMessage.readBy.push(req.user._id);
    await replyMessage.save();

    chat.lastMessage = replyMessage._id as typeof chat.lastMessage;
    await chat.save();

    const populatedReplyMessage = await Message.findById(replyMessage._id)
      .populate("sender", "name avatar username")
      .populate("chat", "members");

    res.status(200).json({
      success: true,
      message: "Reply message created successfully",
      data: populatedReplyMessage,
    });
  }
);

export {
  createChat,
  fetchChats,
  fetchChat,
  deleteChat,
  //
  createMessage,
  readMessage,
  createReplyMessage,
};
