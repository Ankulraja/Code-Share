import { useState } from "react";

export const useEditorState = () => {
  const [code, setCode] = useState("// Start coding here...\n");
  const [theme, setTheme] = useState("dracula");
  const [fontSize, setFontSize] = useState(14);
  const [language, setLanguage] = useState("javascript");

  const handleCodeChange = (newCode) => {
    setCode(newCode);
  };

  const resetCode = () => {
    setCode("// Start coding here...\n");
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
