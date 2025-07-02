"use client";

import React, { useCallback, useEffect, useState } from "react";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { CheckCheck, Reply, Send, User2 } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import axios from "@/store/axios";
import { toast } from "sonner";
import { useSelector } from "react-redux";
import { RootState } from "@/store/store";

function Chatbox({
  selectedUser,
  socket,
  selectedChat,
  isGroup,
  allMessages,
  setAllMessages,
  setUpdatedChats,
}: {
  selectedUser: string;
  socket: any;
  selectedChat: any;
  isGroup?: boolean;
  allMessages: any[];
  setAllMessages: any;
  setUpdatedChats?: any;
}) {
  const [loading, setLoading] = useState<boolean>(false);
  const [message, setMessage] = useState<string>("");
  const [replyTo, setReplyTo] = useState<any>(null);

  const { user } = useSelector((state: RootState) => state.user);

  async function fetchMessages() {
    try {
      setLoading(true);
      const { data } = await axios.get(`/chat/fetch/${selectedChat._id}`);

      setAllMessages(data.messages || []);
      if (data.messages && data.messages.length > 0) {
        const lastMessage = data.messages[data.messages.length - 1];
        if (socket) {
          socket.emit("joinChat", selectedChat._id);
          socket.emit("read_message", {
            chatId: selectedChat._id,
            message: lastMessage,
            userId: lastMessage.sender._id,
            senderId: user._id,
          });
        }
      }
      if (data.messages && data.messages[data.messages.length - 1]) {
        const lastMessage = data.messages[data.messages.length - 1];
        if (lastMessage.sender._id !== user._id) return;
        if (lastMessage.readBy.includes(user._id)) {
          setUpdatedChats({
            ...lastMessage,
            readBy: [...lastMessage.readBy, user._id],
          });
        }
      }
    } catch (error: any) {
      toast.error(error.response?.data.message || "Internal error", {
        position: "top-center",
      });
    } finally {
      setLoading(false);
    }
  }

  const handleFormSubmit = useCallback(
    async (e: any) => {
      e.preventDefault();
      if (!message.trim()) return;
      try {
        setLoading(true);

        const { data } = replyTo
          ? await axios.post("/chat/create/reply", {
              content: message,
              chatId: selectedChat._id,
              messageId: replyTo._id,
            })
          : await axios.post("/chat/create/message", {
              content: message,
              sender: user._id,
              chat: selectedChat._id,
            });
        if (!data.message) return;
        setAllMessages((prev: any) => [...prev, data.message]);
        setMessage("");
        socket.emit("send_message", data.message);
        setUpdatedChats(data.message);
      } catch (error: any) {
        console.log(error);
        toast.error(error.response?.data.message || "Internal Error", {
          position: "top-center",
        });
      } finally {
        setLoading(false);
      }
    },
    [message, allMessages, loading]
  );

  useEffect(() => {
    if (selectedChat) {
      fetchMessages();
    }
  }, [selectedChat]);

  return (
    <div className="flex flex-col justify-between relative w-full bg-white dark:bg-gray-800 rounded-lg p-3">
      {/* Messages container */}
      <div
        style={{ scrollbarWidth: "thin" }}
        className="h-[calc(100vh-261px)] overflow-y-auto pr-2"
        ref={(el) => {
          if (el) {
            el.scrollTop = el.scrollHeight;
          }
        }}
      >
        {allMessages.length > 0 ? (
          allMessages.map((msg, index) => {
            const isOwn = msg.sender._id === user._id;
            const prevMsg = allMessages[index - 1];
            const currDate = new Date(msg.createdAt);
            const prevDate = prevMsg ? new Date(prevMsg.createdAt) : null;
            const isNewDay =
              !prevDate ||
              currDate.getDate() !== prevDate.getDate() ||
              currDate.getMonth() !== prevDate.getMonth() ||
              currDate.getFullYear() !== prevDate.getFullYear();

            // Show avatar only if next message is from a different sender or it's the last message
            const nextMsg = allMessages[index + 1];
            const showAvatar =
              !nextMsg || nextMsg.sender._id !== msg.sender._id;
            const otherMembers = msg.chat.members.filter(
              (member: any) => member !== user._id
            );
            const msgReaded = otherMembers.every((member: any) =>
              msg.readBy.includes(member)
            );

            return (
              <React.Fragment key={index}>
                {isNewDay && (
                  <div className="flex justify-center my-2">
                    <span className="bg-gray-300 dark:bg-gray-700 text-gray-700 dark:text-gray-200 px-3 py-1 rounded-full text-xs font-medium">
                      {currDate.toLocaleDateString(undefined, {
                        year: "numeric",
                        month: "short",
                        day: "numeric",
                      })}
                    </span>
                  </div>
                )}
                <div
                  className={`flex items-end gap-2 py-1 ${
                    isOwn ? "justify-end" : "justify-start"
                  } group relative`}
                >
                  {!isOwn && showAvatar ? (
                    <Avatar>
                      <AvatarImage src={msg.sender?.avatar?.url} />
                      <AvatarFallback>
                        {msg.sender.name.charAt(0).toUpperCase() || (
                          <User2 className="w-6 h-6" />
                        )}
                      </AvatarFallback>
                    </Avatar>
                  ) : (
                    <span className="w-10"></span>
                  )}
                  <div className="flex flex-col max-w-xs">
                    <div
                      className={`px-4 py-2 rounded-2xl text-sm shadow relative ${
                        isOwn
                          ? "bg-blue-600 text-white rounded-br-none"
                          : "bg-gray-200 text-gray-900 rounded-bl-none"
                      }`}
                    >
                      {/* Reply preview */}
                      {msg.replyTo && (
                        <div className="mb-1 px-2 py-1 rounded bg-gray-100 dark:bg-gray-700 text-xs text-gray-700 dark:text-gray-200 border-l-4 border-blue-400">
                          <span className="font-semibold">
                            {msg.replyTo.sender?.name || "Unknown"}:
                          </span>
                          {msg.replyTo.content}
                        </div>
                      )}
                      <span className="flex-1 h-[18.5px]">{msg.content}</span>
                      <span
                        className={`${
                          isOwn ? "pr-[64px]" : "pr-[42px]"
                        } inline-block h-[18.5px]`}
                      ></span>
                      <span
                        className={`absolute bottom-1.5 right-1 flex ${
                          isOwn ? "w-[64px]" : "w-[42px]"
                        } gap-1 text-xs opacity-80 mt-1`}
                      >
                        <span className="text-[10px] opacity-70 whitespace-nowrap">
                          {currDate.toLocaleTimeString([], {
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </span>
                        {isOwn && msg.sender && (
                          <span
                            className="items-center"
                            title={msgReaded ? "Read" : "Delivered"}
                          >
                            <CheckCheck
                              className={`w-3.5 h-3.5 inline ${
                                msgReaded ? "text-black" : "text-blue-100"
                              }`}
                            />
                            <br />
                          </span>
                        )}
                      </span>
                      {/* React/Reply buttons */}
                      <div className="absolute -top-7 right-0 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        {/* Reaction button */}
                        <button
                          type="button"
                          className="bg-white dark:bg-gray-700 border rounded-full p-1 shadow hover:bg-gray-100 dark:hover:bg-gray-600"
                          title="React"
                          onClick={() => {
                            // Simple emoji reaction example
                            const emoji = prompt("React with emoji:");
                            if (emoji) {
                              // You can implement a more robust reaction system as needed
                              setAllMessages((prev: any[]) =>
                                prev.map((m, i) =>
                                  i === index
                                    ? {
                                        ...m,
                                        reactions: [
                                          ...(m.reactions || []),
                                          { user: user._id, emoji },
                                        ],
                                      }
                                    : m
                                )
                              );
                            }
                          }}
                        >
                          <span role="img" aria-label="React">
                            😊
                          </span>
                        </button>
                        {/* Reply button */}
                        <button
                          type="button"
                          className="bg-white dark:bg-gray-700 border rounded-full p-1 shadow hover:bg-gray-100 dark:hover:bg-gray-600"
                          title="Reply"
                          onClick={() => {
                            setReplyTo(msg);
                          }}
                        >
                          <Reply className="w-4 h-4" />
                        </button>
                      </div>
                      {/* Show reactions */}
                      {msg.reactions && msg.reactions.length > 0 && (
                        <div className="flex gap-1 mt-1">
                          {msg.reactions.map((r: any, i: number) => (
                            <span
                              key={i}
                              className="inline-block px-1 py-0.5 rounded bg-gray-200 dark:bg-gray-600 text-xs"
                            >
                              {r.emoji}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                  {isOwn && showAvatar ? (
                    <Avatar>
                      <AvatarImage src={msg.sender?.avatar?.url} />
                      <AvatarFallback>
                        {msg.sender.name.charAt(0).toUpperCase() || (
                          <User2 className="w-6 h-6" />
                        )}
                      </AvatarFallback>
                    </Avatar>
                  ) : (
                    <span className="w-10"></span>
                  )}
                </div>
              </React.Fragment>
            );
          })
        ) : (
          <div className="flex flex-col items-center justify-center h-full py-10 text-gray-400 dark:text-gray-500">
            <span className="text-2xl mb-2">No messages yet</span>
            <span className="text-sm">Start the conversation!</span>
          </div>
        )}
      </div>
      {/* Input at the bottom */}
      {socket && (
        <form
          className="mt-2 flex gap-2 w-full relative"
          onSubmit={handleFormSubmit}
        >
          {replyTo && (
            <div className="flex gap-2 h-5 justify-start absolute -top-5 left-0 w-full">
              <h3 className="font-medium text-sm">
                {replyTo.sender?.avatar?.url || replyTo.sender.name}
              </h3>
            </div>
          )}
          <Input
            type="text"
            placeholder="Type your message..."
            className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            disabled={loading}
            autoComplete="off"
            autoFocus
          />
          <Button
            type="submit"
            disabled={loading || !message.trim()}
            className="flex items-center justify-center"
          >
            <Send className="w-5 h-5" />
          </Button>
        </form>
      )}
    </div>
  );
}

export default Chatbox;
