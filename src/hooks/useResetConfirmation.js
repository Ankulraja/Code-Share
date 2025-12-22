import { useState } from "react";

export const useResetConfirmation = (onReset) => {
  const [showResetConfirm, setShowResetConfirm] = useState(false);

  const requestReset = () => setShowResetConfirm(true);

  const confirmReset = () => {
    onReset();
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
