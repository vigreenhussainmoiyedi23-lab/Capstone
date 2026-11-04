import { useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { Terminal as XTerm } from "@xterm/xterm";
import { FitAddon } from "@xterm/addon-fit";
import { WebLinksAddon } from "@xterm/addon-web-links";
import { useDispatch, useSelector } from "react-redux";

import { clearTerminalMessages } from "../../ai/ai.slice";

/* ── Terminal Welcome Banner ── */

const DUMMY_WELCOME = [
  "\x1b[38;5;220m┌─────────────────────────────────────────┐\x1b[0m",
  "\x1b[38;5;220m│\x1b[0m  \x1b[1mForge AI Studio\x1b[0m — Interactive Terminal  \x1b[38;5;220m│\x1b[0m",
  "\x1b[38;5;220m└─────────────────────────────────────────┘\x1b[0m",
  "",
];

/* ── Terminal Component ── */

const TerminalPanel = ({ sendCommand, isConnected = false }) => {
  // Redux
  const dispatch = useDispatch();

  const terminalMessages = useSelector((state) => state.ai.terminalMessages);

  // Refs
  const containerRef = useRef(null);
  const termRef = useRef(null);
  const inputBufferRef = useRef("");
  const lastRenderedCountRef = useRef(0);
  const sendCommandRef = useRef(sendCommand);

  /* ── Initialize XTerm ── */

  useEffect(() => {
    if (!containerRef.current || termRef.current) return;

    const term = new XTerm({
      theme: {
        background: "#0a0e1a",
        foreground: "#c9c9d8",
        cursor: "#c9a84c",
        cursorAccent: "#0a0e1a",
        selectionBackground: "rgba(201, 168, 76, 0.2)",
        black: "#1a2035",
        red: "#c43d3d",
        green: "#3d8f5e",
        yellow: "#c9a84c",
        blue: "#4d79c9",
        magenta: "#9d5cbf",
        cyan: "#3d9faf",
        white: "#c9c9d8",
        brightBlack: "#4a4a60",
        brightRed: "#e07070",
        brightGreen: "#70bf8f",
        brightYellow: "#e0c06a",
        brightBlue: "#7a9fe0",
        brightMagenta: "#c07ad4",
        brightCyan: "#6acfe0",
        brightWhite: "#e8e8f0",
      },

      fontFamily: "'JetBrains Mono', 'Consolas', monospace",
      fontSize: 13,
      lineHeight: 1.6,
      cursorBlink: true,
      cursorStyle: "bar",
      scrollback: 1000,
      convertEol: true,
      allowTransparency: true,
    });

    const fitAddon = new FitAddon();
    const webLinksAddon = new WebLinksAddon();

    term.loadAddon(fitAddon);
    term.loadAddon(webLinksAddon);

    term.open(containerRef.current);
    fitAddon.fit();

    termRef.current = term;

    // Welcome banner
    DUMMY_WELCOME.forEach((line) => {
      term.writeln(line);
    });

    term.writeln("\x1b[90mSandbox ready. Enter commands below:\x1b[0m");

    term.write("\x1b[38;5;220m❯\x1b[0m ");

    /* ── Terminal Input ── */

    const inputDisposable = term.onData((data) => {
      sendCommandRef.current?.(data);
    });
    /* ── Terminal Resize ── */

    const resizeObserver = new ResizeObserver(() => {
      fitAddon.fit();
    });

    resizeObserver.observe(containerRef.current);

    /* ── Cleanup ── */

    return () => {
      inputDisposable.dispose();

      resizeObserver.disconnect();

      term.dispose();

      termRef.current = null;

      inputBufferRef.current = "";

      lastRenderedCountRef.current = 0;
    };
  }, []);

  /* ── Render Redux Terminal Output ── */

  useEffect(() => {
    const term = termRef.current;

    if (!term) return;

    // Detect terminal clear / message reset
    if (terminalMessages.length < lastRenderedCountRef.current) {
      term.clear();

      lastRenderedCountRef.current = 0;
    }

    // Get only newly received messages
    const newMessages = terminalMessages.slice(lastRenderedCountRef.current);

    newMessages.forEach((message) => {
      const output =
        typeof message === "string"
          ? message
          : (message?.data ?? message?.output ?? "");

      if (output) term.write(String(output));
    });
    lastRenderedCountRef.current = terminalMessages.length;
  }, [terminalMessages]);

  /* ── Clear Terminal ── */

  const handleClear = () => {
    termRef.current?.clear();

    inputBufferRef.current = "";

    lastRenderedCountRef.current = 0;

    dispatch(clearTerminalMessages());
  };

  /* ── UI ── */

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{
        duration: 0.3,
        ease: [0.4, 0, 0.2, 1],
      }}
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        overflow: "hidden",
        background: "#0a0e1a",
      }}
    >
      {/* Terminal Toolbar */}

      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "10px",
          padding: "8px 14px",
          background: "var(--bg-surface)",
          borderBottom: "1px solid var(--border-subtle)",
          flexShrink: 0,
        }}
      >
        {/* Traffic Lights */}

        <div style={{ display: "flex", gap: "5px" }}>
          {["#c43d3d", "#c9a84c", "#3d8f5e"].map((color, i) => (
            <div
              key={i}
              style={{
                width: "8px",
                height: "8px",
                borderRadius: "50%",
                background: color,
                opacity: 0.7,
              }}
            />
          ))}
        </div>

        {/* Connection Status */}

        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "6px",
            padding: "3px 10px",
            background: "var(--bg-elevated)",
            border: "1px solid var(--border-subtle)",
            borderRadius: "4px",
          }}
        >
          <span
            style={{
              width: "5px",
              height: "5px",
              borderRadius: "50%",
              background: isConnected ? "#3d8f5e" : "var(--gold)",
              boxShadow: isConnected
                ? "0 0 6px #3d8f5e"
                : "0 0 6px var(--gold)",
            }}
          />

          <span
            style={{
              fontSize: "11px",
              color: "var(--text-secondary)",
              fontFamily: "var(--font-mono)",
            }}
          >
            {isConnected ? "bash (live sandbox)" : "bash (ready)"}
          </span>
        </div>

        <div style={{ flex: 1 }} />

        {/* Clear Button */}

        <button
          onClick={handleClear}
          style={{
            padding: "3px 9px",
            background: "transparent",
            border: "1px solid var(--border-subtle)",
            borderRadius: "4px",
            color: "var(--text-muted)",
            fontSize: "10px",
            cursor: "pointer",
            fontFamily: "var(--font-sans)",
          }}
          id="clear-terminal-btn"
        >
          Clear
        </button>
      </div>

      {/* XTerm Container */}

      <div
        ref={containerRef}
        style={{
          flex: 1,
          overflow: "hidden",
          padding: "4px",
        }}
      />
    </motion.div>
  );
};

export default TerminalPanel;
