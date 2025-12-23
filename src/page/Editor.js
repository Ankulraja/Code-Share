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
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
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
          soketRef.current.on(ACTIONS.CODE_RESET, () => {
            resetCode();
            toast.success("Code has been reset");
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
        soketRef.current.off(ACTIONS.CODE_RESET);
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  const { showResetConfirm, requestReset, confirmReset, cancelReset } =
    useResetConfirmation(resetCode, socket, roomId);

  return (
    <div className="flex h-screen bg-slate-900 text-slate-100 select-none">
      {/* Mobile Overlay */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 z-40 md:hidden bg-black/50"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Sidebar - Hidden on mobile, visible on md and above */}
      <div
        className={`fixed md:static inset-y-0 left-0 z-50 transform transition-transform duration-300 md:transform-none ${
          isSidebarOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"
        }`}
      >
        <Sidebar
          sidebarWidth={sidebarWidth}
          isDragging={isDragging}
          onStartDrag={startDrag}
          clients={clients}
          getAvatarColor={getAvatarColor}
          getInitials={getInitials}
          handleCopyRoomId={handleCopyRoomId}
          handleLeaveRoom={handleLeaveRoom}
          onCloseSidebar={() => setIsSidebarOpen(false)}
        />
      </div>

      {/* Main Content */}
      <main className="flex-1 bg-slate-900 overflow-hidden flex flex-col w-full">
        {/* Mobile Header with Hamburger and Settings */}
        <div className="md:hidden flex items-center justify-between border-b border-slate-700 bg-slate-800 px-4 py-3">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              className="p-2 rounded-lg hover:bg-slate-700 transition"
              aria-label="Toggle sidebar"
            >
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16M4 18h16"
                />
              </svg>
            </button>
            <span className="text-sm font-medium">Code Share</span>
          </div>

          {/* Settings Icon */}
          <button
            onClick={() => setIsSettingsOpen(!isSettingsOpen)}
            className="p-2 rounded-lg hover:bg-slate-700 transition"
            aria-label="Toggle settings"
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
              />
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
              />
            </svg>
          </button>
        </div>

        <EditorToolbar
          onRequestReset={requestReset}
          fontSize={fontSize}
          onFontSizeChange={setFontSize}
          theme={theme}
          onThemeChange={setTheme}
          language={language}
          onLanguageChange={setLanguage}
          isSettingsOpen={isSettingsOpen}
          setIsSettingsOpen={setIsSettingsOpen}
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
