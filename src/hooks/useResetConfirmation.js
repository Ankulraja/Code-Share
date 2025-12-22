import { useState } from "react";

export const useResetConfirmation = (onReset, socket, roomId) => {
  const [showResetConfirm, setShowResetConfirm] = useState(false);

  const requestReset = () => setShowResetConfirm(true);

  const confirmReset = () => {
    onReset(socket, roomId);
    setShowResetConfirm(false);
  };

  const cancelReset = () => setShowResetConfirm(false);

  return {
    showResetConfirm,
    requestReset,
    confirmReset,
    cancelReset,
  };
};
