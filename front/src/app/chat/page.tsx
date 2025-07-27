"use client";

import Chatbox from "@/components/chat/chatbox";
import NoChat from "@/components/chat/noChat";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Separator } from "@/components/ui/separator";
import Navbar from "@/components/userNavbar";
import IntroNavbar from "@/components/introNavbar";
import axios from "@/store/axios";
import { AppDispatch, RootState } from "@/store/store";
import { CheckCheck, MoreHorizontal, X } from "lucide-react";
import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
import React, {
  use,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";
import { useDispatch, useSelector } from "react-redux";
import { io } from "socket.io-client";
import { readMessage } from "@/store/chat/chatSlice";
import ChatLogo from "@/components/chat/chatLogo";
import { useSocket } from "@/store/utils/socketContext";

function Page() {
  const [selectedChat, setSelectedChat] = useState<any>();
  const [selectedUser, setSelectedUser] = useState<any>();
  const [isGroup, setIsGroup] = useState(false);
  const [chats, setChats] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [allMessages, setAllMessages] = useState<any[]>([]);
  // count the fetch chats
  const [fetchCount, setFetchCount] = useState(0);

  const { user } = useSelector((state: RootState) => state.user);
  const { chats: chatState } = useSelector((state: RootState) => state.chats);
  const { socket } = useSocket();
  const dispatch = useDispatch<AppDispatch>();
  const searchParams = useSearchParams();
  const pathname = usePathname();

  // check if the user is in a group chat
  const fetchChats = async () => {
    setLoading(true);
    try {
      setLoading(true);
      const { data } = await axios.get(`/chat/fetch`);
      setChats(data.chats);
      setFetchCount((prev) => prev + 1);
    } catch (error) {
      console.error("Error fetching chats:", error);
    } finally {
      setLoading(false);
    }
  };

  // update the chats when a new message is received or read the message
  function setUpdatedChats(message: any) {
    setChats((prevChats) => {
      const updatedChats = prevChats.map((chat) => {
        if (chat._id === message.chat._id) {
          return {
            ...chat,
            lastMessage: message,
          };
        }
        return chat;
      });
      return updatedChats;
    });
  }

  const handleChatSelection = useCallback(
    (chat: any, user: any) => {
      setSelectedUser(user);
      setSelectedChat(chat);
      setChats((prev: any) =>
        prev.map((p: any) =>
          p._id === chat._id ? p : { ...p, unreadCount: 0 }
        )
      );
      if (chat.unreadCount > 0) {
        chat.unreadCount = 0;
      }
      window.history.replaceState(
        {},
        "",
        `/chat?selectedUser=${user._id}&chatId=${chat._id}&isGroup=${
          chat.isGroup || false
        }`
      );
      // socket.emit("all_read_messages", {
      //   chatId: chat._id,
      //   userId: user._id,
      //   senderId: user._id,
      //   unreadCount: chat.unreadCount || 0,
      // });
      // setAllMessages([]);
    },
    [user, socket]
  );

  const handleRemoveChatSelection = useCallback(() => {
    setSelectedUser("");
    setSelectedChat("");
    setIsGroup(false);
    window.history.replaceState({}, "", `/chat`);
  }, []);

  const handleNewMessage = (newMessage: any) => {
    console.log("New message received:", newMessage);
    if (selectedChat && selectedChat._id === newMessage.chat._id) {
      setAllMessages((prev) => [...prev, newMessage]);
      if (newMessage.sender._id !== user._id) {
        dispatch(
          readMessage({
            chatId: newMessage.chat._id,
            messageId: newMessage._id,
          })
        );
        socket &&
          socket.emit("read_message", {
            chatId: newMessage.chat._id,
            message: newMessage,
            userId: newMessage.sender._id,
            senderId: user._id,
          });

        setUpdatedChats({
          ...newMessage,
          readBy: [...(newMessage.readBy || []), user._id],
        });
      }
    } else {
      setChats((prevChats) =>
        prevChats.map((chat) => {
          if (chat._id === newMessage.chat._id) {
            return {
              ...chat,
              lastMessage: newMessage,
              unreadCount: (chat.unreadCount || 0) + 1,
            };
          }
          return chat;
        })
      );
    }
  };

  // socket stablish connects
  useEffect(() => {
    if (!user) return;
    if (!socket) return;
    socket.emit("register_user", user._id);

    socket.on("connect", () => {
      console.log("Connected to socket server");
    });

    return () => {};
  }, [user]);

  // handle chat selection from URL params
  useEffect(() => {
    if (!searchParams || !chats) return;
    const chatId = searchParams.get("chatId");
    const userId = searchParams.get("selectedUser");
    const isGroupParam = searchParams.get("isGroup");

    if (chatId && userId) {
      const chat = chats.find((c) => c._id === chatId);
      const user = chat?.members.find((m: any) => m._id === userId);
      if (chat && user) {
        setSelectedChat(chat);
        setSelectedUser(user);
        setIsGroup(isGroupParam === "true");
        handleChatSelection(chat, user);
      }
    } else {
      handleRemoveChatSelection();
    }
  }, [searchParams, fetchCount]);

  // handle new messages
  useEffect(() => {
    if (!user || !socket) return;

    socket.on("new_message", handleNewMessage);

    return () => {
      socket.off("new_message", handleNewMessage);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user, socket, selectedChat]);

  // fetch all chats
  useEffect(() => {
    if (!user) return;
    if (chats.length === 0) {
      fetchChats();
    }
  }, [user]);

  // read message socket.on
  useEffect(() => {
    if (!user || !socket) return;

    socket.on("message_read", (data: any) => {
      console.log("message_read", data, data.userId);
      if (selectedChat && selectedChat._id === data.chatId) {
        setAllMessages((prevMessages) =>
          prevMessages.map((msg) => ({
            ...msg,
            readBy: [...msg.readBy, data.senderId],
          }))
        );
      }
      setUpdatedChats({
        ...data.message,
        readBy: [...(data.message.readBy || []), data.senderId],
      });
    });
    return () => {
      if (socket) {
        socket.off("message_read");
      }
    };
  }, [user, socket, selectedChat]);

  return (
    <main className="h-screen overflow-hidden">
      {user ? <Navbar /> : <IntroNavbar />}
      <main className="bg-[#f2f6f8] dark:bg-[#151515] w-full h-[calc(100%-70px)] overflow-hidden">
        <section className="container max-w-[1170px] h-full mx-auto py-5">
          {user && chats && chats.length > 0 ? (
            <Card
              className={`md:grid ${
                selectedUser
                  ? "md:grid-cols-[250px_1fr] lg:grid-cols-[320px_1fr]"
                  : "md:grid-cols-[320px_1fr]"
              } flex-1 my-3 mx-1 w-full h-full`}
            >
              <div
                className={`md:flex ${
                  selectedChat ? "hidden" : ""
                } flex-col gap-2 pt-3 pb-2 px-1.5`}
              >
                <div className="mb-4 px-2">
                  <h1 className="text-xl md:text-2xl font-bold text-gray-800 dark:text-gray-100">
                    Chats
                  </h1>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Stay connected with your friends and colleagues.
                  </p>
                </div>
                <Separator className="mb-1.5" />
                <div className="flex flex-col gap-2">
                  {chats.map((chat) => (
                    <ChatLogo
                      chat={chat}
                      key={chat._id}
                      selectedUser={selectedUser}
                      handleChatSelection={handleChatSelection}
                      selectedChat={selectedChat}
                    />
                  ))}
                </div>
              </div>
              {selectedChat && selectedChat._id ? (
                <div
                  className={`md:flex flex-col h-full ${
                    selectedUser ? "" : "hidden"
                  }`}
                >
                  <div className="flex w-full justify-between items-center h-[65px] gap-3 p-3 border-b border-gray-200 dark:border-gray-700">
                    <div className="flex gap-2 items-center">
                      <Avatar className="h-10 w-10">
                        <AvatarImage
                          src={
                            isGroup
                              ? selectedChat.group.avatar?.url
                              : selectedUser.avatar?.url || ""
                          }
                        />
                        <AvatarFallback>
                          {isGroup
                            ? selectedChat.group.name
                            : selectedUser.name?.charAt(0) || "C"}
                        </AvatarFallback>
                      </Avatar>
                      <h2 className="text-lg font-semibold">
                        {selectedUser.name || "Chat"}
                      </h2>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button
                        className=""
                        size={"icon"}
                        variant="ghost"
                        onClick={handleRemoveChatSelection}
                      >
                        <X className="w-5 h-5" />
                      </Button>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button
                            size={"icon"}
                            variant="ghost"
                            className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                            aria-label="Chat options"
                          >
                            <MoreHorizontal className="w-5 h-5" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuLabel>Chat Options</DropdownMenuLabel>
                          <DropdownMenuGroup>
                            <DropdownMenuItem asChild>
                              <Link
                                href={`/u/${selectedChat.username}`}
                                passHref
                              >
                                View Profile{" "}
                              </Link>
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                              Mute Conversation
                            </DropdownMenuItem>
                            {/* <DropdownMenuItem>Archive Chat</DropdownMenuItem>
                            <DropdownMenuItem className="text-red-600">
                              Delete Chat
                            </DropdownMenuItem>
                            <DropdownMenuItem>Mark as Unread</DropdownMenuItem>
                            <DropdownMenuItem onClick={() => {}}>
                              Pin Chat
                            </DropdownMenuItem> */}
                          </DropdownMenuGroup>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </div>
                  <Chatbox
                    socket={socket}
                    selectedUser={selectedUser}
                    isGroup={isGroup}
                    selectedChat={selectedChat}
                    allMessages={allMessages}
                    setAllMessages={setAllMessages}
                    setUpdatedChats={setUpdatedChats}
                  />
                </div>
              ) : (
                <NoChat />
              )}
            </Card>
          ) : (
            <div className="flex flex-col items-center justify-center h-full py-20">
              <h2 className="text-2xl font-semibold mb-2">
                {user ? "No Chats Yet" : "Please log in to view your chats"}
              </h2>
              <p className="text-gray-500 mb-6 text-center max-w-md">
                {user
                  ? `You don't have any conversations yet. Start chatting with
                your friends or colleagues to see your messages here.`
                  : `Please log in to see your messages.`}
              </p>
              <Link
                href={
                  user
                    ? `/u/${user.username}/connections`
                    : `/login?back=${pathname}`
                }
                passHref
              >
                <Button className="px-6 py-2" asChild>
                  <span>{user ? "Start New Chat" : "Login"}</span>
                </Button>
              </Link>
            </div>
          )}
        </section>
      </main>
    </main>
  );
}

export default Page;
