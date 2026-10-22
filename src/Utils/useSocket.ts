import { useContext } from "react";
import { SocketContext } from "../Provider/SocketContext";

export const useSocket = () => {
  const { socket } = useContext(SocketContext);

  if (!socket) {
    throw new Error("useSocket must be used inside SocketProvider");
  }

  return socket;
};
