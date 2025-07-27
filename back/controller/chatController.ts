import { NextFunction, Request, Response } from "express";
import expressAsyncHandler from "express-async-handler";
import Chat from "../model/chatModel";
import ErrorHandler from "../utils/errorHandler";
import Message from "../model/messageModel";
import Group from "../model/groupModel";
import Notification from "../model/notificationModel";
import User from "../model/userModel";

const sendMessage = expressAsyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const { chat, userId, content, image, video, audio, document, reply } =
      req.body;

    // Ensure sender is provided and either chat or a direct recipient ID is provided
    if (!chat && !userId) {
      return next(
        new ErrorHandler("Sender and chat or userId are required", 403)
      );
    }

    let chatDoc: any;

    // If chat is provided, fetch and validate it
    if (chat) {
      chatDoc = await Chat.findById(chat);
      if (!chatDoc || chatDoc.isDeleted) {
        return next(new ErrorHandler("Chat not found", 404));
      }
    } else {
      // For direct messages, try to find an existing chat between req.user and userId
      chatDoc = await Chat.findOne({
        isGroupChat: false,
        $and: [
          { members: { $elemMatch: { $eq: req.user._id } } },
          { members: { $elemMatch: { $eq: userId } } },
        ],
      })
        .populate("members", "-password")
        .populate("lastMessage");

      // If no chat exists, create a new one and generate a notification
      if (!chatDoc) {
        chatDoc = await Chat.create({
          chatId: req.user._id + userId,
          members: [req.user._id, userId],
        });

        const notification = await Notification.create({
          sender: req.user._id,
          recipient: userId,
          type: "chat",
          message: `${req.user.name} started a chat with you`,
          relatedId: chatDoc._id,
        });

        if (!notification) {
          return next(new ErrorHandler("Notification not created", 500));
        }

        chatDoc = await chatDoc.populate("members", "-password");
      }
    }

    // Validate that there's message content or media
    if (!content && !image && !video && !audio && !document && !reply) {
      return next(
        new ErrorHandler("Please provide message content or media", 403)
      );
    }

    // Prepare message data based on provided fields
    const messageData: any = { sender: req.user._id, chat: chatDoc._id };
    if (content) messageData.content = content;
    if (image) messageData.image = image;
    if (video) messageData.video = video;
    if (audio) messageData.audio = audio;
    if (document) messageData.document = document;
    if (reply) messageData.reply = reply;

    // Create the message
    const message = await Message.create(messageData);
    if (!message) {
      return next(new ErrorHandler("Message not created", 500));
    }

    // Mark the message as read by the sender and update the chat's last message
    message.readBy.push(req.user._id);
    await message.save();

    chatDoc.lastMessage = message._id;
    await chatDoc.save();

    const populatedMessage = await Message.findById(message._id)
      .populate("sender", "name avatar username")
      .populate("chat", "members");

    res.status(200).json({
      success: true,
      message: populatedMessage,
      info: chat
        ? "Message sent in existing chat"
        : "Chat created and message sent",
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
  sendMessage,
  fetchChats,
  fetchChat,
  deleteChat,
  //
  readMessage,
  createReplyMessage,
};
