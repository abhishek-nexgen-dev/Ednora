import { createContext } from "react";
import { Socket } from "socket.io-client";

export interface SocketContextType {
  socket: Socket | null;
}

export const SocketContext = createContext<SocketContextType>({
  socket: null,
});
