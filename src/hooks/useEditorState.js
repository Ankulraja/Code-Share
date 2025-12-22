import { useState } from "react";
import ACTIONS from "../utils/socketAction";
import toast from "react-hot-toast";

export const useEditorState = () => {
  const [code, setCode] = useState("// Start coding here...\n");
  const [theme, setTheme] = useState("dracula");
  const [fontSize, setFontSize] = useState(14);
  const [language, setLanguage] = useState("javascript");

  const handleCodeChange = (newCode) => {
    setCode(newCode);
  };

  const resetCode = (socket, roomId) => {
    setCode("// Start coding here...\n");
    if (socket && roomId) {
      try {
        socket.emit(ACTIONS.CODE_RESET, { roomId: roomId.trim() });
        toast.success("Code reset for all users");
      } catch (e) {
        toast.error("Failed to reset code for other users");
      }
    }
  };

  return {
    code,
    theme,
    fontSize,
    language,
    setTheme,
    setFontSize,
    setLanguage,
    handleCodeChange,
    resetCode,
  };
};
