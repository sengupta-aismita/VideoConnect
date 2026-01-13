import { io } from "socket.io-client";

const SOCKET_URL =
  import.meta.env.VITE_SOCKET_URL || "http://localhost:8080"; // change port if needed

const socket = io(SOCKET_URL, {
  transports: ["websocket"],
  withCredentials: true,
  autoConnect: true,
});

export default socket;
