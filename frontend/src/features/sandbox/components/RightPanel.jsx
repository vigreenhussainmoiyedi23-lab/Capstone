import { useEffect, useRef, useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Terminal as TerminalIcon,
  Code2,
  Globe,
  Monitor,
  Smartphone,
  ChevronDown,
  ChevronUp,
  Maximize2,
  Minimize2,
  Share2,
  Check,
} from "lucide-react";
import PreviewPanel from "./PreviewPanel.jsx";
import CodePanel from "./CodePanel.jsx";
import TerminalPanel from "./TerminalPanel.jsx";

const TABS = [
  {
    id: "preview",
    label: "Preview",
    icon: Globe,
  },
  {
    id: "code",
    label: "Code",
    icon: Code2,
  },
];

/**
 * RightPanel — Main Workspace panel with fluid resizable split between
 * Top (Preview / Code) and Bottom (Terminal).
 */
const RightPanel = ({ theme = "dark", projectId, socket }) => {
  const [activeTab, setActiveTab] = useState("preview");
  const [deviceMode, setDeviceMode] = useState("desktop"); // 'desktop' | 'mobile'
  const [isCopiedShare, setIsCopiedShare] = useState(false);
  const socketRef = useRef(socket);
  // Always keep the latest socket
  socketRef.current = socket;

  // Terminal & Split Layout State
  const [topHeight, setTopHeight] = useState(68); // percentage
  const [isTerminalOpen, setIsTerminalOpen] = useState(true);
  const [isTerminalMaximized, setIsTerminalMaximized] = useState(false);
  const [isDragging, setIsDragging] = useState(false);

  const containerRef = useRef(null);

  const sendCommand = (command) => {
    const socket = socketRef.current;
    if (!socket?.connected) {
      console.warn("Socket is not connected");
      return;
    }
    socket.emit("terminal-input", command);
  };

  /**
   * Resizing logic with iframe pointer-event shield
   */
  const handleMouseDown = useCallback((e) => {
    e.preventDefault();
    setIsDragging(true);

    const container = containerRef.current;
    if (!container) return;

    const rect = container.getBoundingClientRect();

    const handleMouseMove = (moveEvent) => {
      const offsetFromTop = moveEvent.clientY - rect.top;
      const newPercentage = (offsetFromTop / rect.height) * 100;

      // Fluid bounds: between 18% and 88%
      const clamped = Math.min(88, Math.max(18, newPercentage));
      setTopHeight(clamped);
    };

    const handleMouseUp = () => {
      setIsDragging(false);
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
    };

    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseup", handleMouseUp);
  }, []);

  const handleToggleTerminal = () => {
    if (isTerminalMaximized) {
      setIsTerminalMaximized(false);
      setIsTerminalOpen(true);
    } else {
      setIsTerminalOpen((prev) => !prev);
    }
  };

  const handleToggleMaximize = () => {
    setIsTerminalMaximized((prev) => !prev);
    if (!isTerminalOpen) setIsTerminalOpen(true);
  };

  const handleResetSplit = () => {
    setTopHeight(68);
    setIsTerminalOpen(true);
    setIsTerminalMaximized(false);
  };

  const handleShare = () => {
    navigator.clipboard?.writeText(window.location.href);
    setIsCopiedShare(true);
    setTimeout(() => setIsCopiedShare(false), 2000);
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
      {/* ── Top Workspace Tab Bar ── */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          height: "42px",
          background: "var(--bg-panel)",
          borderBottom: "1px solid var(--border-default)",
          flexShrink: 0,
          padding: "0 10px",
          gap: "4px",
          userSelect: "none",
        }}
      >
        {/* Workspace Mode Tabs (Preview / Code) */}
        <div style={{ display: "flex", alignItems: "center", gap: "2px" }}>
          {TABS.map((tab) => {
            const isActive = activeTab === tab.id;
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => {
                  setActiveTab(tab.id);
                  if (isTerminalMaximized) setIsTerminalMaximized(false);
                }}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "6px",
                  padding: "6px 14px",
                  background: isActive ? "var(--bg-elevated)" : "transparent",
                  border: "1px solid",
                  borderColor: isActive
                    ? "var(--border-accent)"
                    : "transparent",
                  borderRadius: "6px",
                  color: isActive ? "var(--text-primary)" : "var(--text-muted)",
                  fontSize: "12px",
                  fontWeight: isActive ? 600 : 400,
                  cursor: "pointer",
                  fontFamily: "var(--font-sans)",
                  transition: "all 0.15s ease",
                }}
                id={`tab-${tab.id}`}
              >
                <Icon
                  size={13}
                  style={{
                    color: isActive ? "var(--gold)" : "currentColor",
                    opacity: isActive ? 1 : 0.7,
                  }}
                />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Terminal Toggle Button in Main Tab Bar */}
        <button
          type="button"
          onClick={handleToggleTerminal}
          style={{
            display: "flex",
            alignItems: "center",
            gap: "5px",
            padding: "6px 12px",
            background: isTerminalOpen ? "var(--gold-glow)" : "transparent",
            border: "1px solid",
            borderColor: isTerminalOpen
              ? "var(--border-accent)"
              : "var(--border-subtle)",
            borderRadius: "6px",
            color: isTerminalOpen ? "var(--gold)" : "var(--text-muted)",
            fontSize: "12px",
            fontWeight: isTerminalOpen ? 600 : 400,
            cursor: "pointer",
            fontFamily: "var(--font-sans)",
            marginLeft: "4px",
            transition: "all 0.15s ease",
          }}
          title={
            isTerminalOpen ? "Collapse Terminal panel" : "Show Terminal panel"
          }
        >
          <TerminalIcon size={12} />
          <span>Terminal</span>
          <span
            style={{
              width: "5px",
              height: "5px",
              borderRadius: "50%",
              background: isTerminalOpen ? "var(--gold)" : "#3d8f5e",
            }}
          />
        </button>

        <div style={{ flex: 1 }} />

        {/* Right-Side Tools */}
        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
          {/* Responsive device viewport toggle (Active in Preview mode) */}
          {activeTab === "preview" && (
            <div
              style={{
                display: "flex",
                alignItems: "center",
                background: "var(--bg-surface)",
                padding: "2px",
                borderRadius: "6px",
                border: "1px solid var(--border-subtle)",
              }}
            >
              <button
                type="button"
                onClick={() => setDeviceMode("desktop")}
                style={{
                  padding: "4px 8px",
                  borderRadius: "4px",
                  background:
                    deviceMode === "desktop"
                      ? "var(--bg-elevated)"
                      : "transparent",
                  border: "none",
                  color:
                    deviceMode === "desktop"
                      ? "var(--gold)"
                      : "var(--text-muted)",
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  gap: "4px",
                  fontSize: "11px",
                }}
                title="Desktop View (100%)"
              >
                <Monitor size={12} />
                <span className="hidden sm:inline">Desktop</span>
              </button>

              <button
                type="button"
                onClick={() => setDeviceMode("mobile")}
                style={{
                  padding: "4px 8px",
                  borderRadius: "4px",
                  background:
                    deviceMode === "mobile"
                      ? "var(--bg-elevated)"
                      : "transparent",
                  border: "none",
                  color:
                    deviceMode === "mobile"
                      ? "var(--gold)"
                      : "var(--text-muted)",
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  gap: "4px",
                  fontSize: "11px",
                }}
                title="Mobile View (390px)"
              >
                <Smartphone size={12} />
                <span className="hidden sm:inline">Mobile</span>
              </button>
            </div>
          )}

          {/* Share Link Button */}
          <button
            type="button"
            onClick={handleShare}
            style={{
              display: "flex",
              alignItems: "center",
              gap: "5px",
              padding: "5px 10px",
              background: isCopiedShare
                ? "rgba(61, 143, 94, 0.2)"
                : "var(--bg-surface)",
              border: "1px solid",
              borderColor: isCopiedShare ? "#3d8f5e" : "var(--border-subtle)",
              borderRadius: "6px",
              color: isCopiedShare ? "#4ade80" : "var(--text-muted)",
              fontSize: "11px",
              fontWeight: 500,
              cursor: "pointer",
              fontFamily: "var(--font-sans)",
              transition: "all 0.15s ease",
            }}
            title="Copy project share URL"
          >
            {isCopiedShare ? <Check size={11} /> : <Share2 size={11} />}
            <span>{isCopiedShare ? "Copied" : "Share"}</span>
          </button>
        </div>
      </div>

      {/* ── Main Workspace Body (Top Editor/Preview + Resizer + Bottom Terminal) ── */}
      <div
        ref={containerRef}
        id="right-panel-content"
        style={{
          flex: 1,
          minHeight: 0,
          display: "flex",
          flexDirection: "column",
          overflow: "hidden",
          position: "relative",
        }}
      >
        {/* Iframe Shield Overlay during mouse dragging */}
        {isDragging && (
          <div
            style={{
              position: "absolute",
              inset: 0,
              zIndex: 9999,
              cursor: "row-resize",
              background: "transparent",
            }}
          />
        )}

        {/* ── Top Area: Preview or Code (Hidden if Terminal is Maximized) ── */}
        {!isTerminalMaximized && (
          <div
            style={{
              height: isTerminalOpen ? `${topHeight}%` : "100%",
              overflow: "hidden",
              flexShrink: 0,
              transition: isDragging
                ? "none"
                : "height 0.18s cubic-bezier(0.4, 0, 0.2, 1)",
              display: "flex",
              flexDirection: "column",
              background: "var(--bg-base)",
            }}
          >
            <AnimatePresence mode="wait" initial={false}>
              <motion.div
                key={activeTab}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.15 }}
                style={{
                  width: "100%",
                  height: "100%",
                  display: "flex",
                  flexDirection: "column",
                  alignItems:
                    deviceMode === "mobile" && activeTab === "preview"
                      ? "center"
                      : "stretch",
                  justifyContent:
                    deviceMode === "mobile" && activeTab === "preview"
                      ? "center"
                      : "flex-start",
                  padding:
                    deviceMode === "mobile" && activeTab === "preview"
                      ? "16px 0"
                      : "0",
                  background:
                    deviceMode === "mobile" && activeTab === "preview"
                      ? "#060911"
                      : "transparent",
                  overflow: "hidden",
                }}
              >
                {activeTab === "preview" && (
                  <div
                    style={{
                      width: deviceMode === "mobile" ? "390px" : "100%",
                      height: "100%",
                      borderRadius: deviceMode === "mobile" ? "16px" : "0",
                      overflow: "hidden",
                      border:
                        deviceMode === "mobile"
                          ? "1px solid var(--border-default)"
                          : "none",
                      boxShadow:
                        deviceMode === "mobile"
                          ? "0 12px 48px rgba(0,0,0,0.6)"
                          : "none",
                      transition: "all 0.2s ease",
                    }}
                  >
                    <PreviewPanel projectId={projectId} />
                  </div>
                )}

                {activeTab === "code" && <CodePanel theme={theme} />}
              </motion.div>
            </AnimatePresence>
          </div>
        )}

        {/* ── Fluid Adjustable Divider (Shown when Terminal is Open and not Maximized) ── */}
        {isTerminalOpen && !isTerminalMaximized && (
          <div
            onMouseDown={handleMouseDown}
            onDoubleClick={handleResetSplit}
            style={{
              height: "8px",
              flexShrink: 0,
              cursor: "row-resize",
              background: isDragging ? "var(--gold)" : "var(--bg-surface)",
              borderTop: "1px solid var(--border-subtle)",
              borderBottom: "1px solid var(--border-subtle)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              zIndex: 30,
              position: "relative",
              userSelect: "none",
              transition: "background 0.15s ease",
            }}
            title="Drag to resize · Double-click to reset (68/32)"
          >
            {/* Grab handle indicator pill */}
            <div
              style={{
                width: "36px",
                height: "3px",
                borderRadius: "999px",
                background: isDragging ? "#000" : "var(--gold)",
                opacity: isDragging ? 0.9 : 0.6,
                transition: "all 0.15s ease",
              }}
            />

            {/* Quick action buttons on divider hover */}
            <div
              style={{
                position: "absolute",
                right: "12px",
                display: "flex",
                alignItems: "center",
                gap: "4px",
              }}
            >
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  handleToggleMaximize();
                }}
                style={{
                  background: "transparent",
                  border: "none",
                  color: isDragging ? "#000" : "var(--text-muted)",
                  cursor: "pointer",
                  padding: "1px",
                  display: "flex",
                  alignItems: "center",
                }}
                title="Maximize Terminal"
              >
                <Maximize2 size={10} />
              </button>

              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  setIsTerminalOpen(false);
                }}
                style={{
                  background: "transparent",
                  border: "none",
                  color: isDragging ? "#000" : "var(--text-muted)",
                  cursor: "pointer",
                  padding: "1px",
                  display: "flex",
                  alignItems: "center",
                }}
                title="Collapse Terminal"
              >
                <ChevronDown size={11} />
              </button>
            </div>
          </div>
        )}

        {/* ── Bottom Area: Terminal Panel ── */}
        {isTerminalOpen ? (
          <div
            style={{
              flex: 1,
              minHeight: 0,
              overflow: "hidden",
              display: "flex",
              flexDirection: "column",
              background: "#0a0e1a",
              position: "relative",
            }}
          >
            {/* Terminal Top Control Strip if maximized */}
            {isTerminalMaximized && (
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  background: "var(--bg-surface)",
                  borderBottom: "1px solid var(--border-subtle)",
                  flexShrink: 0,
                  fontSize: "11px",
                  color: "var(--text-muted)",
                }}
              >
                <span style={{ fontWeight: 600, color: "var(--gold)" }}>
                  Terminal (Maximized)
                </span>
                <button
                  type="button"
                  onClick={handleToggleMaximize}
                  style={{
                    background: "transparent",
                    border: "none",
                    color: "var(--text-primary)",
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                    gap: "4px",
                    fontSize: "11px",
                  }}
                >
                  <Minimize2 size={11} />
                  <span>Restore View</span>
                </button>
              </div>
            )}

            <TerminalPanel sendCommand={sendCommand} />
          </div>
        ) : (
          /* ── Minimal Bottom Dock when Terminal is Collapsed ── */
          <div
            onClick={() => setIsTerminalOpen(true)}
            style={{
              height: "28px",
              flexShrink: 0,
              background: "var(--bg-surface)",
              borderTop: "1px solid var(--border-default)",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",

              cursor: "pointer",
              userSelect: "none",
              color: "var(--text-muted)",
              fontSize: "11px",
              transition: "background 0.15s ease",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = "var(--bg-elevated)";
              e.currentTarget.style.color = "var(--text-primary)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = "var(--bg-surface)";
              e.currentTarget.style.color = "var(--text-muted)";
            }}
            title="Click to expand Terminal"
          >
            <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
              <TerminalIcon size={12} style={{ color: "var(--gold)" }} />
              <span style={{ fontFamily: "var(--font-mono)" }}>Terminal</span>
              <span style={{ color: "#3d8f5e" }}>● ready</span>
            </div>

            <div style={{ display: "flex", alignItems: "center", gap: "4px" }}>
              <span>Show</span>
              <ChevronUp size={12} />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default RightPanel;
