import { useLocation, useParams, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
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
import { useEffect, useRef, useState } from "react";
import initSocket from "../socket";
import ACTIONS from "../utils/socketAction";

const Editor = () => {
  const soketRef = useRef(null);
  const [socket, setSocket] = useState(null);
  const navigate = useNavigate();
  const location = useLocation();
  const { roomId } = useParams();
  const username = location.state?.username;

  useEffect(() => {
    if (!username) {
      toast.error("Username is required");
      navigate("/");
    }
  }, [username, navigate]);
  const { clients } = useClients(username, socket);
  const { sidebarWidth, isDragging, startDrag } = useSidebarResize();
  const { handleCopyRoomId, handleLeaveRoom } = useRoomActions(roomId);
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
  useEffect(() => {
    const init = async () => {
      try {
        soketRef.current = await initSocket();
        if (soketRef.current) {
          soketRef.current.on("connect_error", (err) => {
            console.error("Socket connection error:", err);
            toast.error("Failed to connect to server");
            navigate("/");
          });

          soketRef.current.on("connect_failed", (err) => {
            console.error("Socket connection failed:", err);
            toast.error("Connection failed");
            navigate("/");
          });

          soketRef.current.emit(ACTIONS.JOIN, {
            roomId: roomId.trim(),
            username: username.trim(),
          });
          setSocket(soketRef.current);
          soketRef.current.on(ACTIONS.SYNC_CODE, ({ code: synced }) => {
            if (typeof synced === "string") {
              handleCodeChange(synced);
            }
          });
          soketRef.current.on(ACTIONS.CODE_CHANGE, ({ code: updated }) => {
            if (typeof updated === "string") {
              handleCodeChange(updated);
            }
          });
        }
      } catch (error) {
        console.error("Socket initialization error:", error);
        toast.error("Failed to initialize connection");
        navigate("/");
      }
    };

    init();

    return () => {
      if (soketRef.current) {
        soketRef.current.disconnect();
        soketRef.current.off("connect_error");
        soketRef.current.off("connect_failed");
        soketRef.current.off(ACTIONS.SYNC_CODE);
        soketRef.current.off(ACTIONS.CODE_CHANGE);
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
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
            onCodeChange={(newCode) => {
              handleCodeChange(newCode);
              if (soketRef.current) {
                try {
                  soketRef.current.emit(ACTIONS.CODE_CHANGE, {
                    roomId: roomId.trim(),
                    code: newCode,
                  });
                } catch (e) {
                  // ignore emit errors
                }
              }
            }}
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
