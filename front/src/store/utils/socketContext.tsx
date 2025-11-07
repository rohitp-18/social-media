import React, {
  createContext,
  useState,
  useContext,
  ReactNode,
  useEffect,
} from "react";
import { io, Socket } from "socket.io-client";
import { RootState } from "../store";
import { useSelector } from "react-redux";

interface SocketState {
  isConnected: boolean;
  error: string | null;
  socket: Socket | null;
}

interface SocketContextProps extends SocketState {
  connectSocket: (socket: Socket) => void;
  disconnectSocket: () => void;
  setError: (error: string) => void;
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
});

export const SocketProvider = ({ children }: { children: ReactNode }) => {
  const [state, setState] = useState<SocketState>(initialState);
  const { user } = useSelector((state: RootState) => state.user);

  const connectSocket = (socket: Socket) => {
    setState({ isConnected: true, socket, error: null });
  };

  const disconnectSocket = () => {
    setState({ isConnected: false, socket: null, error: null });
  };

  const setError = (error: string) => {
    setState((prevState) => ({ ...prevState, error }));
  };

  useEffect(() => {
    if (!user) return;
    if (state.socket) return;
    let newSocket = io("ws://api.192.168.43.34.nip.io", {
      query: { selectedUser: user._id },
      transports: ["websocket"],
    });
    newSocket.connect();
    newSocket.on("connect", () => {
      console.log("connected");
    });
    connectSocket(newSocket);

    newSocket.on("disconnect", () => {});
  }, [user, state.socket]);

  return (
    <SocketContext.Provider
      value={{ ...state, connectSocket, disconnectSocket, setError }}
    >
      {children}
    </SocketContext.Provider>
  );
};

export const useSocket = () => useContext(SocketContext);
