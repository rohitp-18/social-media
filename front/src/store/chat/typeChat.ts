import { Group } from "../group/typeGroup";
import { InheritUser } from "../user/typeUser";

interface message {
  _id: string;
  sender: InheritUser;
  content?: string;
  timestamp: Date;
  chat: chat;
  readBy: InheritUser[];
  image?: string;
  video?: string;
  audio?: string;
  document?: string;
  replyTo?: message;
}

interface chat {
  _id: string;
  members: InheritUser[];
  isGroupChat: boolean;
  latestMessage: message | null;
  group: Group | null;
  createdAt: Date;
  isDeleted: boolean;
}

interface chatState {
  chats: chat[];
  loading: boolean;
  error: string | null;
  message: string | null;
  deleted: boolean;
  newChat: chat | null;
}

export type { chat, chatState, message };
