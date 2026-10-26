import { io, Socket } from "socket.io-client";

let socket: Socket | null = null;

export const connectSocket = (token?: string): Socket => {
  if (socket?.connected) return socket;

  const socketUrl = import.meta.env.VITE_SOCKET_URL || "https://ednora-backend.onrender.com";

  socket = io(socketUrl, {
    transports: ["websocket", "polling"],
    autoConnect: true,
    withCredentials: true,
    auth: {
      token,
    },
  });

  return socket;
};

export const getSocket = () => socket;

export const disconnectSocket = () => {
  if (socket) {
    socket.disconnect();
    socket = null;
  }
};
