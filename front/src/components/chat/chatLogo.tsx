"use client";
import React, { useEffect } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { CheckCheck } from "lucide-react";
import { useSelector } from "react-redux";
import { RootState } from "@/store/store";
import { useSocket } from "@/store/utils/socketContext";
import { chat } from "@/store/chat/typeChat";

function ChatLogo({
  chat,
  handleChatSelection,
}: {
  chat: chat;
  handleChatSelection?: any;
}) {
  const [msgReaded, setMsgReaded] = React.useState(true);

  const { user } = useSelector((state: RootState) => state.user);
  const chatUser = chat.members.find((member) => member._id !== user?._id);

  const { selectedChat, selectedUser } = useSocket();

  useEffect(() => {
    if (chat) {
      if (chat.lastMessage) {
        setMsgReaded(
          chat.members.every((member) =>
            chat.lastMessage?.readBy.includes(member._id)
          )
        );
      }
    }
  }, [chat, user, chat.lastMessage?.readBy, chat.members, chat.lastMessage]);

  if (!user) return null;

  return (
    <div
      key={chat._id}
      className={`flex items-center gap-3 w-full p-2 rounded-lg transition-colors cursor-pointer focus:outline-none hover:bg-gray-100 dark:hover:bg-gray-700 ${
        selectedChat?._id === chat._id ? "bg-gray-200 dark:bg-gray-600" : ""
      }`}
      onClick={() => handleChatSelection(chat, chatUser)}
    >
      <div className="flex items-center gap-3 w-full overflow-hidden">
        <Avatar>
          <AvatarImage src={chatUser?.avatar?.url} />
          <AvatarFallback>
            {chat.isGroup
              ? chat.group?.name.charAt(0)
              : chatUser?.name.charAt(0)}
          </AvatarFallback>
        </Avatar>
        <div className="flex-1 text-left">
          <h3 className="font-semibold truncate flex items-center gap-2">
            {chat.isGroup ? chat.group?.name : chatUser?.name}
          </h3>
          <p className="text-sm text-gray-500 truncate flex gap-1 items-center">
            {chat.lastMessage
              ? typeof chat.lastMessage?.sender === "object"
                ? chat.lastMessage?.sender._id === user?._id && (
                    <CheckCheck
                      className={`w-4 h-4 ${
                        msgReaded ? "text-green-500" : "text-gray-400"
                      }`}
                    />
                  )
                : chat.lastMessage?.sender === user?._id && (
                    <CheckCheck
                      className={`w-4 h-4 ${
                        msgReaded ? "text-green-500" : "text-gray-400"
                      }`}
                    />
                  )
              : null}
            {chat.lastMessage
              ? chat.lastMessage?.content || "No messages yet"
              : "No messages yet"}
          </p>
        </div>
      </div>
      {chat.unreadCount > 0 &&
        chat.lastMessage?.readBy.includes(user._id) &&
        typeof chat.lastMessage.sender === "object" &&
        chat.lastMessage.sender._id !== user._id && (
          <span className="ml-2 inline-flex items-center justify-center px-2 py-0.5 rounded-full text-xs font-bold bg-red-500 text-white">
            {chat.unreadCount}
          </span>
        )}
    </div>
  );
}

export default ChatLogo;
