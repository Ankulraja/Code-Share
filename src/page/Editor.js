import { useLocation, useParams } from "react-router-dom";
import CodeEditor from "../components/CodeEditor";
import Sidebar from "../components/Sidebar";
import EditorToolbar from "../components/EditorToolbar";
import ResetConfirmModal from "../components/ResetConfirmModal";
import { useEditorState } from "../hooks/useEditorState";
import { useSidebarResize } from "../hooks/useSidebarResize";
import { useClients } from "../hooks/useClients";
import { useRoomActions } from "../hooks/useRoomActions";
import { useResetConfirmation } from "../hooks/useResetConfirmation";
import { getAvatarColor, getInitials } from "../utils/avatarUtils";

const Editor = () => {
  const location = useLocation();
  const { roomId } = useParams();

  // Custom hooks for state management
  const username = location.state?.username;
  const { clients } = useClients(username);
  const { sidebarWidth, isDragging, startDrag } = useSidebarResize();
  const { handleCopyRoomId, handleLeaveRoom } = useRoomActions(roomId);

  // Editor state management
  const {
    code,
    theme,
    fontSize,
    language,
    setTheme,
    setFontSize,
    setLanguage,
    handleCodeChange,
    resetCode,
  } = useEditorState();

  // Reset confirmation
  const { showResetConfirm, requestReset, confirmReset, cancelReset } =
    useResetConfirmation(resetCode);

  return (
    <div className="flex h-screen bg-slate-900 text-slate-100 select-none">
      <Sidebar
        sidebarWidth={sidebarWidth}
        isDragging={isDragging}
        onStartDrag={startDrag}
        clients={clients}
        getAvatarColor={getAvatarColor}
        getInitials={getInitials}
        handleCopyRoomId={handleCopyRoomId}
        handleLeaveRoom={handleLeaveRoom}
      />

      <main className="flex-1 bg-slate-900 overflow-hidden flex flex-col">
        <EditorToolbar
          onRequestReset={requestReset}
          fontSize={fontSize}
          onFontSizeChange={setFontSize}
          theme={theme}
          onThemeChange={setTheme}
          language={language}
          onLanguageChange={setLanguage}
        />
        <div className="flex-1">
          <CodeEditor
            value={code}
            onCodeChange={handleCodeChange}
            theme={theme}
            fontSize={fontSize}
            language={language}
          />
        </div>
      </main>

      <ResetConfirmModal
        isOpen={showResetConfirm}
        onConfirm={confirmReset}
        onCancel={cancelReset}
      />
    </div>
  );
};

export default Editor;
