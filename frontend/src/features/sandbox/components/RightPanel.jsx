import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import PreviewPanel from "./PreviewPanel.jsx";
import CodePanel from "./CodePanel.jsx";
import TerminalPanel from "./TerminalPanel.jsx";

const TABS = [
  {
    id: "preview",
    label: "Preview",
    icon: (
      <svg
        width="13"
        height="13"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
      >
        <rect x="2" y="3" width="20" height="14" rx="2" ry="2" />
        <line x1="8" y1="21" x2="16" y2="21" />
        <line x1="12" y1="17" x2="12" y2="21" />
      </svg>
    ),
  },
  {
    id: "code",
    label: "Code",
    icon: (
      <svg
        width="13"
        height="13"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
      >
        <polyline points="16 18 22 12 16 6" />
        <polyline points="8 6 2 12 8 18" />
      </svg>
    ),
  },
  {
    id: "terminal",
    label: "Terminal",
    icon: (
      <svg
        width="13"
        height="13"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
      >
        <polyline points="4 17 10 11 4 5" />
        <line x1="12" y1="19" x2="20" y2="19" />
      </svg>
    ),
  },
];

/**
 * RightPanel — Tab switcher for Preview / Code / Terminal
 */
const RightPanel = ({ theme, projectId, socket }) => {
  const [activeTab, setActiveTab] = useState("preview");
  const sendCommand = (command) => {
    if (!socket?.connected) {
      console.error("Socket is not connected");
      return;
    }
    socket.emit("terminal-input", command);
    dispatch(addTerminalMessage(command));
  };
  return (
    <div
      style={{
        flex: 1,
        display: "flex",
        flexDirection: "column",
        height: "100%",
        overflow: "hidden",
        background: "var(--bg-base)",
      }}
    >
      {/* Tab bar */}
      <div
        style={{
          display: "flex",
          alignItems: "stretch",
          height: "44px",
          background: "var(--bg-panel)",
          borderBottom: "1px solid var(--border-default)",
          flexShrink: 0,
          padding: "0 8px",
          gap: "2px",
        }}
      >
        {TABS.map((tab) => {
          const isActive = activeTab === tab.id;
          return (
            <motion.button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "7px",
                padding: "0 16px",
                background: "transparent",
                border: "none",
                borderBottom: `2px solid ${isActive ? "var(--gold)" : "transparent"}`,
                color: isActive ? "var(--text-primary)" : "var(--text-muted)",
                fontSize: "12.5px",
                fontWeight: isActive ? 600 : 400,
                cursor: "pointer",
                fontFamily: "var(--font-sans)",
                transition: "color 0.2s ease",
                whiteSpace: "nowrap",
                position: "relative",
              }}
              whileHover={{ color: "var(--text-primary)" }}
              id={`tab-${tab.id}`}
            >
              <span
                style={{
                  opacity: isActive ? 1 : 0.6,
                  transition: "opacity 0.2s",
                  display: "flex",
                  alignItems: "center",
                }}
              >
                {tab.icon}
              </span>
              {tab.label}

              {/* Active gold indicator */}
              {isActive && (
                <motion.div
                  layoutId="active-tab-indicator"
                  style={{
                    position: "absolute",
                    bottom: 0,
                    left: 0,
                    right: 0,
                    height: "2px",
                    background: "var(--gold)",
                    borderRadius: "2px 2px 0 0",
                  }}
                  transition={{ duration: 0.25, ease: [0.4, 0, 0.2, 1] }}
                />
              )}
            </motion.button>
          );
        })}

        <div style={{ flex: 1 }} />

        {/* Right-side actions */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "8px",
            paddingRight: "4px",
          }}
        >
          {/* Responsive sizing toggle */}
          <div style={{ display: "flex", gap: "3px" }}>
            {[
              {
                id: "desktop",
                icon: "M20 3H4a1 1 0 0 0-1 1v12a1 1 0 0 0 1 1h7v2H9v2h6v-2h-2v-2h7a1 1 0 0 0 1-1V4a1 1 0 0 0-1-1z",
              },
              {
                id: "mobile",
                icon: "M12 20h.01M7 2h10a2 2 0 0 1 2 2v16a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2z",
              },
            ].map(({ id, icon }) => (
              <button
                key={id}
                style={{
                  width: "26px",
                  height: "26px",
                  borderRadius: "5px",
                  background:
                    id === "desktop" ? "var(--gold-glow)" : "transparent",
                  border: `1px solid ${id === "desktop" ? "var(--border-accent)" : "var(--border-subtle)"}`,
                  color: id === "desktop" ? "var(--gold)" : "var(--text-muted)",
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <svg
                  width="12"
                  height="12"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <path d={icon} />
                </svg>
              </button>
            ))}
          </div>

          {/* Share button */}
          <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            style={{
              display: "flex",
              alignItems: "center",
              gap: "5px",
              padding: "5px 10px",
              background: "var(--gold-glow)",
              border: "1px solid var(--border-accent)",
              borderRadius: "5px",
              color: "var(--gold)",
              fontSize: "11px",
              fontWeight: 600,
              cursor: "pointer",
              fontFamily: "var(--font-sans)",
            }}
            id="share-btn"
          >
            <svg
              width="10"
              height="10"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
            >
              <circle cx="18" cy="5" r="3" />
              <circle cx="6" cy="12" r="3" />
              <circle cx="18" cy="19" r="3" />
              <line x1="8.59" y1="13.51" x2="15.42" y2="17.49" />
              <line x1="15.41" y1="6.51" x2="8.59" y2="10.49" />
            </svg>
            Share
          </motion.button>
        </div>
      </div>

      {/* Panel content */}
      <div style={{ flex: 1, overflow: "hidden", position: "relative" }}>
        <AnimatePresence mode="wait" initial={false}>
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -4 }}
            transition={{ duration: 0.2, ease: [0.4, 0, 0.2, 1] }}
            style={{ width: "100%", height: "100%" }}
          >
            {activeTab === "preview" && <PreviewPanel projectId={projectId} />}
            {activeTab === "code" && (
              <CodePanel theme={theme}  />
            )}
            {activeTab === "terminal" && <TerminalPanel sendCommand={sendCommand} />}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
};

export default RightPanel;
