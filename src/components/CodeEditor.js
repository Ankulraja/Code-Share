import CodeMirror from "@uiw/react-codemirror";
import { javascript } from "@codemirror/lang-javascript";
import { cpp } from "@codemirror/lang-cpp";
import { java } from "@codemirror/lang-java";
import { python } from "@codemirror/lang-python";
import { dracula } from "@uiw/codemirror-theme-dracula";

const languageMap = {
  javascript: javascript({ jsx: true }),
  cpp: cpp(),
  c: cpp(),
  java: java(),
  python: python(),
};

const themeMap = {
  dracula,
  light: undefined,
};

const CodeEditor = ({
  value,
  onCodeChange,
  language = "javascript",
  theme = "dracula",
  fontSize = 14,
}) => {
  const extensions = languageMap[language]
    ? [languageMap[language]]
    : [javascript({ jsx: true })];
  const cmTheme = themeMap[theme] ?? dracula;

  return (
    <div className="h-full" style={{ fontSize }}>
      <CodeMirror
        value={value}
        height="100%"
        theme={cmTheme}
        extensions={extensions}
        onChange={(val) => onCodeChange && onCodeChange(val)}
        basicSetup={{
          lineNumbers: true,
          highlightActiveLineGutter: true,
          highlightSpecialChars: true,
          foldGutter: true,
          drawSelection: true,
          dropCursor: true,
          allowMultipleSelections: true,
          indentOnInput: true,
          bracketMatching: true,
          closeBrackets: true,
          autocompletion: true,
          rectangularSelection: true,
          crosshairCursor: true,
          highlightActiveLine: true,
          highlightSelectionMatches: true,
          closeBracketsKeymap: true,
          searchKeymap: true,
          foldKeymap: true,
          completionKeymap: true,
          lintKeymap: true,
        }}
      />
    </div>
  );
};

export default CodeEditor;
