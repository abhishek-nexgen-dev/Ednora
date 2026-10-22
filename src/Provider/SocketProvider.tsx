import { useEffect, useMemo } from "react";
import { connectSocket, disconnectSocket } from "../config/socket";
import { SocketContext } from "./SocketContext";

export function SocketProvider({ children }: { children: React.ReactNode }) {
  const socket = useMemo(() => connectSocket(), []);

  useEffect(() => {
    return () => disconnectSocket();
  }, []);

  return <SocketContext.Provider value={{ socket }}>{children}</SocketContext.Provider>;
}
