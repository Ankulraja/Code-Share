const EditorToolbar = ({
  onRequestReset,
  fontSize,
  onFontSizeChange,
  theme,
  onThemeChange,
  language,
  onLanguageChange,
}) => {
  return (
    <div className="flex items-center gap-3 border-b border-slate-700 bg-slate-800 px-4 py-3">
      <div className="flex items-center gap-2">
        <button
          onClick={onRequestReset}
          className="rounded-lg bg-slate-700 px-3 py-2 text-sm font-semibold text-slate-100 transition hover:bg-slate-600"
        >
          Reset code
        </button>
      </div>

      <div className="flex items-center gap-2">
        <label className="text-xs text-slate-300">Font</label>
        <select
          value={fontSize}
          onChange={(e) => onFontSizeChange(Number(e.target.value))}
          className="rounded-md border border-slate-600 bg-slate-900 px-2 py-1 text-xs text-slate-100"
        >
          {[12, 14, 16, 18, 20].map((size) => (
            <option key={size} value={size}>
              {size}px
            </option>
          ))}
        </select>
      </div>

      <div className="flex items-center gap-2">
        <label className="text-xs text-slate-300">Theme</label>
        <select
          value={theme}
          onChange={(e) => onThemeChange(e.target.value)}
          className="rounded-md border border-slate-600 bg-slate-900 px-2 py-1 text-xs text-slate-100"
        >
          <optgroup label="Dark Themes">
            <option value="dracula">Dracula</option>
            <option value="monokai">Monokai</option>
            <option value="githubDark">GitHub Dark</option>
            <option value="solarizedDark">Solarized Dark</option>
            <option value="vscodeDark">VS Code Dark</option>
            <option value="tokyoNight">Tokyo Night</option>
          </optgroup>
          <optgroup label="Light Themes">
            <option value="githubLight">GitHub Light</option>
            <option value="solarizedLight">Solarized Light</option>
            <option value="vscodeLight">VS Code Light</option>
          </optgroup>
        </select>
      </div>

      <div className="flex items-center gap-2">
        <label className="text-xs text-slate-300">Language</label>
        <select
          value={language}
          onChange={(e) => onLanguageChange(e.target.value)}
          className="rounded-md border border-slate-600 bg-slate-900 px-2 py-1 text-xs text-slate-100"
        >
          <option value="javascript">JavaScript</option>
          <option value="cpp">C / C++</option>
          <option value="java">Java</option>
          <option value="python">Python</option>
        </select>
      </div>
    </div>
  );
};

export default EditorToolbar;
