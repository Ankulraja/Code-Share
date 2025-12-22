import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

export const useRoomActions = (roomId) => {
  const navigate = useNavigate();

  const handleCopyRoomId = async () => {
    try {
      await navigator.clipboard.writeText(roomId);
      toast.success("Room ID copied to clipboard");
    } catch (error) {
      toast.error("Failed to copy Room ID");
    }
  };

  const handleLeaveRoom = () => {
    navigate("/");
  };

  return {
    handleCopyRoomId,
    handleLeaveRoom,
  };
};
