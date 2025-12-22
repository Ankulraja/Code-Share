import { useEffect, useRef, useState } from "react";
import toast from "react-hot-toast";
import ACTIONS from "../utils/socketAction";

export const useClients = (username, socket) => {
  const [clients, setClients] = useState([]);
  const prevClientsRef = useRef([]);

  useEffect(() => {
    if (username && clients.length === 0) {
      setClients([{ id: "self", username }]);
    }
  }, [username, clients.length]);

  useEffect(() => {
    if (!socket) return;

    const handleJoined = ({ username: joinedUsername, users }) => {
      const mappedRaw = users.map((u) => ({
        id: u.socketId,
        username: u.username,
      }));
      const seen = new Map();
      const mapped = mappedRaw.filter((u) => {
        if (seen.has(u.id)) return false;
        seen.set(u.id, true);
        return true;
      });
      setClients(mapped);
      if (joinedUsername && joinedUsername !== username) {
        toast.success(`${joinedUsername} joined the room`);
      }
      prevClientsRef.current = mapped;
    };

    const handleDisconnected = ({ socketId, users }) => {
      const mapped = users.map((u) => ({
        id: u.socketId,
        username: u.username,
      }));
      const leftUser = prevClientsRef.current.find((c) => c.id === socketId);
      setClients(mapped);
      if (leftUser) {
        toast(`${leftUser.username} left the room`, { icon: "👋" });
      }
      prevClientsRef.current = mapped;
    };

    socket.on(ACTIONS.JOINED, handleJoined);
    socket.on(ACTIONS.DISCONNECTED, handleDisconnected);

    return () => {
      socket.off(ACTIONS.JOINED, handleJoined);
      socket.off(ACTIONS.DISCONNECTED, handleDisconnected);
    };
  }, [socket, username]);

  return { clients };
};
