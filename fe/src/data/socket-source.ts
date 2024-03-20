import { io, Socket } from "socket.io-client";

const SOCKET_URL = ":3001";

export const createSocket = (): Socket =>
  io(SOCKET_URL, {
    path: "/api/socket/",
  });

export type SocketMessage = {
  readonly id: string;
  readonly controllerId: string;
};

export const newSocketSource = () => {
  const socket = createSocket();

  const sendMessage = (msg: SocketMessage) =>
    socket.emit("message_from_client", msg);

  return {
    sendMessage,
  };
};
