import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { Terminal as XTerm } from "@xterm/xterm";
import { FitAddon } from "@xterm/addon-fit";
import { WebLinksAddon } from "@xterm/addon-web-links";
import { useDispatch, useSelector } from "react-redux";
import { clearTerminalMessages } from "../../ai/ai.slice";

/* ── Fallback simulated session when agent server is not yet connected ── */
const DUMMY_WELCOME = [
  "\x1b[38;5;220m┌─────────────────────────────────────────┐\x1b[0m",
  "\x1b[38;5;220m│\x1b[0m  \x1b[1mForge AI Studio\x1b[0m — Interactive Terminal  \x1b[38;5;220m│\x1b[0m",
  "\x1b[38;5;220m└─────────────────────────────────────────┘\x1b[0m",
  "",
];

/**
 * TerminalPanel — Real-time PTY terminal connected via Socket.io to the agent sandbox,
 * with fallback to local interactive shell.
 */
const TerminalPanel = ({ sendCommand }) => {
  const dispatch = useDispatch();

  const terminalMessages = useSelector((state) => state.ai.terminalMessages);

  const inputBufferRef = useRef("");
  const lastRenderedCountRef = useRef(0);
  const sendCommandRef = useRef(sendCommand);
  const clearTerminal = () => {
    termRef.current?.clear();
    lastRenderedCountRef.current = 0;
    inputBufferRef.current = "";

    dispatch(clearTerminalMessages());
  };
  useEffect(() => {
    sendCommandRef.current = sendCommand;
  }, [sendCommand]);

  const containerRef = useRef(null);
  const termRef = useRef(null);
  const fitAddonRef = useRef(null);
  const socketRef = useRef(null);
  const [isConnected, setIsConnected] = useState(false);

  const sandbox = useSelector((state) => state.sandbox);
  const agentUrl = sandbox?.agentUrl;

  useEffect(() => {
    if (!containerRef.current || termRef.current) return;
    const terminalMessages = useSelector((state) => state.ai.terminalMessages);
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
    const dispatch = useDispatch();
    function clearTerminal() {
      term.clear();
      dispatch(clearTerminalMessages());
    }
    const fitAddon = new FitAddon();
    const webLinksAddon = new WebLinksAddon();

    term.loadAddon(fitAddon);
    term.loadAddon(webLinksAddon);
    term.open(containerRef.current);
    fitAddon.fit();

    termRef.current = term;
    fitAddonRef.current = fitAddon;

    // Display banner
    DUMMY_WELCOME.forEach((line) => term.writeln(line));

    // Local fallback shell if no socket / socket not connected
    term.writeln("\x1b[90mSandbox ready. Enter commands below:\x1b[0m\r\n");
    term.write("\x1b[38;5;220m❯\x1b[0m ");

    const inputDisposable = term.onData((data) => {
      const code = data.charCodeAt(0);

      // Enter
      if (code === 13) {
        term.write("\r\n");

        const command = inputBufferRef.current.trim();

        if (command) {
          sendCommandRef.current?.(command);
        }

        inputBufferRef.current = "";
      }

      // Backspace
      else if (code === 127) {
        if (inputBufferRef.current.length > 0) {
          inputBufferRef.current = inputBufferRef.current.slice(0, -1);

          term.write("\b \b");
        }
      }

      // Normal characters
      else if (code >= 32) {
        inputBufferRef.current += data;
        term.write(data);
      }
    });

    const ro = new ResizeObserver(() => fitAddon.fit());
    ro.observe(containerRef.current);

    return () => {
      fallbackDataDisposable.dispose();
      ro.disconnect();
      if (socketRef.current) {
        socketRef.current.disconnect();
        socketRef.current = null;
      }
      term.dispose();
      termRef.current = null;
    };
  }, [agentUrl]);
  useEffect(() => {
    const term = termRef.current;

    if (!term) return;

    // Detect Redux terminal clear
    if (terminalMessages.length < lastRenderedCountRef.current) {
      term.clear();
      lastRenderedCountRef.current = 0;
    }

    // Render only newly received output
    const newMessages = terminalMessages.slice(lastRenderedCountRef.current);

    newMessages.forEach((message) => {
      const output =
        typeof message === "string"
          ? message
          : (message.data ?? message.output ?? "");

      term.write(output);
    });

    lastRenderedCountRef.current = terminalMessages.length;
  }, [terminalMessages]);
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
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
        {/* Traffic lights */}
        <div style={{ display: "flex", gap: "5px" }}>
          {["#c43d3d", "#c9a84c", "#3d8f5e"].map((c, i) => (
            <div
              key={i}
              style={{
                width: "8px",
                height: "8px",
                borderRadius: "50%",
                background: c,
                opacity: 0.7,
              }}
            />
          ))}
        </div>

        {/* Status label */}
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
          onClick={() => termRef.current?.clear()}
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
