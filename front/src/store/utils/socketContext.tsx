import React, {
  createContext,
  useState,
  useContext,
  ReactNode,
  useEffect,
  useCallback,
} from "react";
import { io, Socket } from "socket.io-client";
import { AppDispatch, RootState } from "../store";
import { useDispatch, useSelector } from "react-redux";
import { chat } from "../chat/typeChat";
import { InheritUser } from "../user/typeUser";
import { toast } from "sonner";
import {
  notificationT,
  updateChatNotifications,
  updateInvitations,
  updateNotificationCount,
} from "../user/notificationSlice";
import CustomNotification from "@/components/CustomNotification";

interface SocketState {
  isConnected: boolean;
  error: string | null;
  socket: Socket | null;
}

interface SocketContextProps extends SocketState {
  connectSocket: (socket: Socket) => void;
  disconnectSocket: () => void;
  setError: (error: string) => void;
  selectedChat: chat | null;
  setSelectedChat: (chat: chat | null) => void;
  selectedUser: InheritUser | null;
  setSelectedUser: (user: InheritUser | null) => void;
}

const initialState: SocketState = {
  isConnected: false,
  error: null,
  socket: null,
};

const SocketContext = createContext<SocketContextProps>({
  ...initialState,
  connectSocket: () => {},
  disconnectSocket: () => {},
  setError: () => {},
  selectedChat: null,
  setSelectedChat: () => {},
  selectedUser: null,
  setSelectedUser: () => {},
});

export const SocketProvider = ({ children }: { children: ReactNode }) => {
  const [state, setState] = useState<SocketState>(initialState);
  const [selectedUser, setSelectedUser] = useState<InheritUser | null>(null);
  const [selectedChat, setSelectedChat] = useState<chat | null>(null);
  const [show, setShow] = useState(false);
  const [notificationData, setNotificationData] =
    useState<notificationT | null>(null);

  const dispatch = useDispatch<AppDispatch>();
  const { user } = useSelector((state: RootState) => state.user);
  const { totalChats, totalInvitations, totalNotifications } = useSelector(
    (state: RootState) => state.notification
  );

  const connectSocket = (socket: Socket) => {
    setState({ ...state, isConnected: true, socket, error: null });
  };

  const disconnectSocket = () => {
    setState({ ...state, isConnected: false, socket: null, error: null });
  };

  const setError = (error: string) => {
    setState((prevState) => ({ ...prevState, error }));
  };

  async function handleNewMessage(newMessage: any) {
    if (!selectedChat || selectedChat._id !== newMessage.chat._id) {
      toast.message(newMessage.content, {
        position: "bottom-right",
      });
      dispatch(updateChatNotifications(totalChats + 1));
    }
  }

  const newNotification = useCallback((data: notificationT) => {
    if (data.type === "invitation") {
      dispatch(updateInvitations(totalInvitations + 1));
    } else if (data.type === "chat") {
      dispatch(updateChatNotifications(totalChats + 1));
    } else {
      dispatch(updateNotificationCount(totalNotifications + 1));
    }

    setShow(true);
    setNotificationData(data);

    toast.success(data.message, {
      position: "bottom-left",
    });
  }, []);

  useEffect(() => {
    if (!user) return;
    if (state.socket) return;
    let newSocket = io("ws://localhost:5000", {
      query: { selectedUser: user._id },
      transports: ["websocket"],
    });
    newSocket.connect();
    newSocket.on("connect", () => {
      newSocket.emit("register_user", user._id);
    });
    connectSocket(newSocket);

    newSocket.on("disconnect", () => {});
  }, [user, state.socket]);

  // handle new messages
  useEffect(() => {
    if (!user || !state.socket) return;
    const { socket } = state;

    socket.on("new_message", handleNewMessage);

    return () => {
      socket.off("new_message", handleNewMessage);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user, state.socket, selectedChat]);

  // handle new messages
  useEffect(() => {
    if (!user || !state.socket) return;
    const { socket } = state;

    socket.on("receive_notification", newNotification);

    return () => {
      socket.off("receive_notification", () => {});
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user, state.socket, selectedChat]);

  useEffect(() => {
    if (show && notificationData) {
      const timer = setTimeout(() => {
        setShow(false);
        setNotificationData(null);
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [show, notificationData]);

  return (
    <SocketContext.Provider
      value={{
        ...state,
        connectSocket,
        disconnectSocket,
        setError,
        selectedChat,
        setSelectedChat,
        selectedUser,
        setSelectedUser,
      }}
    >
      {show && notificationData && (
        <CustomNotification
          data={notificationData}
          onClose={() => setShow(false)}
        />
      )}
      {children}
    </SocketContext.Provider>
  );
};

export const useSocket = () => useContext(SocketContext);
