import { useSocketContext } from "../Provider/SocketContext";

export function useSocket() {
  const { socket } = useSocketContext();
  return socket;
}
