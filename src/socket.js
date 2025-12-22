import { io } from "socket.io-client";

export const initSocket = () => {
  const options = {
    forceNew: true,
    reconnectionAttempts: Infinity,
    timeout: 10000,
    transports: ["websocket"],
  };

  const URL = process.env.REACT_APP_BACKEND_URL || "http://localhost:4000";
  return io(URL, options);
};

export default initSocket;
