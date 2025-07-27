import React, { createContext, useState, useContext, ReactNode } from "react";
import { Socket } from "socket.io-client";

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

  const connectSocket = (socket: Socket) => {
    setState({ isConnected: true, socket, error: null });
  };

  const disconnectSocket = () => {
    setState({ isConnected: false, socket: null, error: null });
  };

  const setError = (error: string) => {
    setState((prevState) => ({ ...prevState, error }));
  };

  return (
    <SocketContext.Provider
      value={{ ...state, connectSocket, disconnectSocket, setError }}
    >
      {children}
    </SocketContext.Provider>
  );
};

export const useSocket = () => useContext(SocketContext);
