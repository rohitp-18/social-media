"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Button } from "./ui/button";
import { X } from "lucide-react";
import { notificationT } from "@/store/user/notificationSlice";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";

interface NotificationProps {
  data: notificationT;
  onClose: (id: string) => void;
}

const CustomNotification: React.FC<NotificationProps> = ({ data, onClose }) => {
  const [isVisible, setIsVisible] = useState(true);
  const [isExiting, setIsExiting] = useState(false);

  const handleClose = () => {
    setIsExiting(true);
    setTimeout(() => {
      setIsVisible(false);
      onClose(data._id);
    }, 300);
  };

  if (!isVisible) return null;

  return (
    <Link
      href={data.url || "#"}
      className={`fixed bottom-4 right-4 bg-white border z-[1000] border-gray-200 rounded-lg shadow-lg p-4 max-w-sm w-full transition-all duration-300 ease-in-out ${
        isExiting
          ? "opacity-0 translate-x-full"
          : "opacity-100 translate-x-0 animate-in slide-in-from-right"
      } ${
        data.url
          ? "hover:shadow-xl cursor-pointer transform hover:scale-105"
          : ""
      }`}
    >
      <div className="flex items-start gap-3">
        {data.sender?.avatar?.url && (
          <Avatar className="flex-shrink-0">
            <AvatarImage src={data.sender.avatar.url} />
            <AvatarFallback>
              {data.sender.name.charAt(0).toUpperCase()}
            </AvatarFallback>
          </Avatar>
        )}
        <div className="flex-1 min-w-0">
          <h4 className="text-sm font-semibold text-gray-900 truncate">
            {data.sender.name}
          </h4>
          <p className="text-sm text-gray-600 mt-1 line-clamp-2">
            {data.message}
          </p>
        </div>
        <Button
          variant={"outline"}
          size={"icon"}
          className="flex-shrink-0 h-6 w-6 hover:bg-gray-100"
          onClick={(e) => {
            e.stopPropagation();
            handleClose();
          }}
        >
          <X className="h-3 w-3" />
        </Button>
      </div>
    </Link>
  );
};

export default CustomNotification;
