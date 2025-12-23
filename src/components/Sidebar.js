import logo from "../assets/logo.png";

const Sidebar = ({
  sidebarWidth,
  isDragging,
  onStartDrag,
  clients,
  getAvatarColor,
  getInitials,
  handleCopyRoomId,
  handleLeaveRoom,
  onCloseSidebar,
}) => {
  return (
    <>
      <aside
        className="flex flex-col border-r border-slate-700 bg-slate-800 h-full w-60 md:w-auto"
        style={{ width: sidebarWidth }}
      >
        <div className="border-b border-slate-700 p-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg border border-emerald-400/60 bg-white">
              <img
                src={logo}
                alt="Code sync logo"
                className="h-7 w-7 object-contain"
              />
            </div>
            <div>
              <p className="text-lg font-semibold leading-tight">Code sync</p>
              <p className="text-xs text-emerald-400">Realtime collaboration</p>
            </div>
          </div>
          {onCloseSidebar && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                onCloseSidebar();
              }}
              className="md:hidden p-2 rounded-lg hover:bg-slate-700 transition flex-shrink-0"
              aria-label="Close sidebar"
            >
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          )}
        </div>

        <div className="flex-1 overflow-y-auto p-4">
          <h3 className="mb-4 text-sm font-semibold text-slate-300">
            Connected
          </h3>
          <div className="space-y-3">
            {clients.map((client) => (
              <div key={client.id} className="flex items-center gap-3">
                <div
                  className={`flex h-10 w-10 items-center justify-center rounded-lg ${getAvatarColor(
                    client.username
                  )} text-sm font-bold text-white shadow-md`}
                >
                  {getInitials(client.username)}
                </div>
                <span className="text-sm font-medium text-slate-200">
                  {client.username}
                </span>
              </div>
            ))}
          </div>
        </div>

        <div className="space-y-3 border-t border-slate-700 p-4">
          <button
            onClick={handleCopyRoomId}
            className="w-full rounded-lg bg-slate-700 px-4 py-2.5 text-sm font-semibold text-slate-100 transition hover:bg-slate-600"
          >
            Copy ROOM ID
          </button>
          <button
            onClick={() => {
              handleLeaveRoom();
              onCloseSidebar?.();
            }}
            className="w-full rounded-lg bg-emerald-500 px-4 py-2.5 text-sm font-bold text-slate-900 transition hover:bg-emerald-400"
          >
            Leave
          </button>
        </div>
      </aside>

      <div
        className={`w-1 cursor-col-resize bg-slate-700/50 transition-colors duration-150 hover:bg-emerald-400/70 hidden md:block ${
          isDragging ? "bg-emerald-400/90" : ""
        }`}
        onMouseDown={onStartDrag}
        role="separator"
        aria-orientation="vertical"
        aria-label="Resize sidebar"
      />
    </>
  );
};

export default Sidebar;