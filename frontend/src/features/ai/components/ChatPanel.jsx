import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Sparkles,
  Send,
  Square,
  Copy,
  Check,
  RotateCcw,
  AlertCircle,
  Plus,
  Bot,
  User,
} from "lucide-react";
import { useAI } from "../hooks/useAI";
import ThinkingProcess from "./ThinkingProcess";
import MarkdownRenderer from "./MarkdownRenderer";

/* ── Quick prompt suggestions ── */
const SUGGESTION_CHIPS = [
  "Build FlowBoard Kanban",
  "Dark luxury portfolio",
  "Add Pomodoro timer",
  "Mobile responsive layout",
];

/**
 * Animated typing shimmer shown before final content starts arriving
 */
const GeneratingIndicator = () => (
  <div
    style={{
      display: "flex",
      alignItems: "center",
      gap: "6px",
      padding: "4px 0",
      color: "var(--text-muted)",
      fontSize: "11.5px",
      fontStyle: "italic",
    }}
  >
    <span>Generating response</span>
    <div style={{ display: "flex", gap: "3px", alignItems: "center" }}>
      {[0, 1, 2].map((i) => (
        <motion.div
          key={i}
          style={{
            width: "4px",
            height: "4px",
            borderRadius: "50%",
            background: "var(--gold)",
          }}
          animate={{ opacity: [0.3, 1, 0.3], y: [0, -3, 0] }}
          transition={{
            duration: 0.9,
            delay: i * 0.18,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
      ))}
    </div>
  </div>
);

/**
 * ChatPanel — AI Assistant Sidebar with real backend SSE streaming
 */
const ChatPanel = ({ projectId }) => {
  const {
    messages = [],
    isStreaming,
    invokeAI,
    stopStreaming,
    resetChat,
  } = useAI();
  const [input, setInput] = useState("");
  const [copiedId, setCopiedId] = useState(null);
  const bottomRef = useRef(null);
  const textareaRef = useRef(null);

  const safeMessages = Array.isArray(messages) ? messages : [];

  // Auto-scroll when messages or updates change
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [safeMessages, isStreaming]);

  const handleSend = () => {
    const text = input.trim();
    if (!text || isStreaming) return;

    setInput("");
    invokeAI({ prompt: text ,projectId});

    // Reset textarea height
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleCopy = (id, content) => {
    if (!content) return;
    navigator.clipboard?.writeText(content);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleRetry = (promptText) => {
    if (!promptText || isStreaming) return;
    invokeAI({ prompt: promptText, projectId });
  };

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        height: "100%",
        overflow: "hidden",
        background: "var(--bg-panel)",
        borderRight: "1px solid var(--border-default)",
      }}
    >
      {/* Header */}
      <div
        style={{
          padding: "12px 14px",
          borderBottom: "1px solid var(--border-subtle)",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          flexShrink: 0,
          background: "var(--bg-panel)",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
          <div
            style={{
              width: "28px",
              height: "28px",
              borderRadius: "8px",
              background: "var(--gold-glow)",
              border: "1px solid var(--border-accent)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Sparkles size={14} style={{ color: "var(--gold)" }} />
          </div>
          <div>
            <div
              style={{
                fontSize: "12.5px",
                fontWeight: 600,
                color: "var(--text-primary)",
                lineHeight: 1.2,
              }}
            >
              Forge AI
            </div>
            <div
              style={{
                fontSize: "10px",
                color: isStreaming ? "var(--gold)" : "#3d8f5e",
                marginTop: "1px",
                display: "flex",
                alignItems: "center",
                gap: "4px",
              }}
            >
              <span
                style={{
                  width: "5px",
                  height: "5px",
                  borderRadius: "50%",
                  background: isStreaming ? "var(--gold)" : "#3d8f5e",
                  display: "inline-block",
                  boxShadow: isStreaming
                    ? "0 0 6px var(--gold)"
                    : "0 0 6px #3d8f5e",
                }}
              />
              {isStreaming ? "Working…" : "Online"}
            </div>
          </div>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
          <button
            onClick={resetChat}
            type="button"
            style={{
              width: "26px",
              height: "26px",
              borderRadius: "6px",
              background: "transparent",
              border: "1px solid var(--border-subtle)",
              color: "var(--text-muted)",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              transition: "all 0.15s ease",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.color = "var(--text-primary)";
              e.currentTarget.style.borderColor = "var(--border-accent)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.color = "var(--text-muted)";
              e.currentTarget.style.borderColor = "var(--border-subtle)";
            }}
            title="New conversation"
            id="new-chat-btn"
          >
            <Plus size={13} />
          </button>
        </div>
      </div>

      {/* Messages Scroll Area */}
      <div
        style={{
          flex: 1,
          overflowY: "auto",
          padding: "12px",
          display: "flex",
          flexDirection: "column",
          gap: "14px",
        }}
      >
        <AnimatePresence initial={false}>
          {safeMessages.map((msg, index) => {
            const isUser = msg.role === "user";
            const hasUpdates =
              Array.isArray(msg.updates) && msg.updates.length > 0;
            const isMessageStreaming = msg.status === "streaming";
            const isError = msg.status === "error";

            // Find preceding user prompt if this message had an error (for retry)
            const prevPrompt =
              !isUser && index > 0 && safeMessages[index - 1]?.role === "user"
                ? safeMessages[index - 1]?.content
                : null;

            return (
              <motion.div
                key={msg.id || index}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.22, ease: [0.4, 0, 0.2, 1] }}
                style={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: isUser ? "flex-end" : "flex-start",
                  maxWidth: "100%",
                }}
              >
                {/* Role Header Badge */}
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "4px",
                    fontSize: "9.5px",
                    fontWeight: 700,
                    letterSpacing: "0.08em",
                    textTransform: "uppercase",
                    color: isUser ? "var(--gold)" : "var(--text-muted)",
                    marginBottom: "4px",
                    paddingLeft: isUser ? 0 : "2px",
                    paddingRight: isUser ? "2px" : 0,
                  }}
                >
                  {isUser ? (
                    <>
                      <span>You</span>
                      <User size={10} />
                    </>
                  ) : (
                    <>
                      <Bot size={10} style={{ color: "var(--gold)" }} />
                      <span>Forge AI</span>
                    </>
                  )}
                </div>

                {/* Bubble */}
                <div
                  style={{
                    width: isUser ? "auto" : "100%",
                    maxWidth: isUser ? "88%" : "100%",
                    padding: "10px 13px",
                    borderRadius: isUser
                      ? "12px 4px 12px 12px"
                      : "4px 12px 12px 12px",
                    background: isUser
                      ? "var(--chat-user-bg)"
                      : "var(--chat-ai-bg)",
                    border: `1px solid ${
                      isUser
                        ? "var(--border-accent)"
                        : isError
                          ? "rgba(196, 61, 61, 0.3)"
                          : "var(--border-default)"
                    }`,
                    fontSize: "12.5px",
                    lineHeight: "1.65",
                    color: "var(--text-primary)",
                    boxShadow: isUser
                      ? "0 0 12px rgba(201, 168, 76, 0.08)"
                      : "0 2px 10px rgba(0, 0, 0, 0.1)",
                    overflow: "hidden",
                  }}
                >
                  {/* 1. Assistant: What AI is thinking and doing (light text, collapsible accordion) */}
                  {!isUser && (hasUpdates || isMessageStreaming) && (
                    <ThinkingProcess
                      updates={msg.updates || []}
                      status={msg.status}
                      duration={msg.duration}
                      currentStep={msg.currentStep}
                    />
                  )}

                  {/* 2. Content rendering */}
                  {isUser ? (
                    <div
                      style={{
                        whiteSpace: "pre-wrap",
                        wordBreak: "break-word",
                      }}
                    >
                      {msg.content}
                    </div>
                  ) : (
                    <>
                      {/* Final Message bold & clear */}
                      {msg.content ? (
                        <div style={{ marginTop: hasUpdates ? "4px" : 0 }}>
                          <MarkdownRenderer content={msg.content} />
                        </div>
                      ) : isMessageStreaming ? (
                        <GeneratingIndicator />
                      ) : null}

                      {/* Error Box if request failed */}
                      {isError && (
                        <div
                          style={{
                            display: "flex",
                            alignItems: "flex-start",
                            gap: "8px",
                            padding: "8px 10px",
                            marginTop: "6px",
                            borderRadius: "6px",
                            background: "rgba(196, 61, 61, 0.1)",
                            border: "1px solid rgba(196, 61, 61, 0.25)",
                            color: "#e88080",
                            fontSize: "11.5px",
                          }}
                        >
                          <AlertCircle
                            size={14}
                            style={{ flexShrink: 0, marginTop: "2px" }}
                          />
                          <div style={{ flex: 1 }}>
                            <div style={{ fontWeight: 600 }}>
                              Connection Error
                            </div>
                            <div
                              style={{
                                fontSize: "11px",
                                opacity: 0.9,
                                marginTop: "2px",
                              }}
                            >
                              {msg.error ||
                                "Could not reach AI backend server."}
                            </div>
                            {prevPrompt && (
                              <button
                                type="button"
                                onClick={() => handleRetry(prevPrompt)}
                                style={{
                                  display: "inline-flex",
                                  alignItems: "center",
                                  gap: "4px",
                                  marginTop: "6px",
                                  padding: "3px 8px",
                                  borderRadius: "4px",
                                  background: "rgba(196, 61, 61, 0.2)",
                                  border: "1px solid rgba(196, 61, 61, 0.4)",
                                  color: "#ffffff",
                                  fontSize: "10.5px",
                                  cursor: "pointer",
                                }}
                              >
                                <RotateCcw size={10} />
                                Retry request
                              </button>
                            )}
                          </div>
                        </div>
                      )}
                    </>
                  )}
                </div>

                {/* Message Footer: Timestamp and Copy Action */}
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "8px",
                    marginTop: "3px",
                    paddingLeft: isUser ? 0 : "4px",
                    paddingRight: isUser ? "4px" : 0,
                    fontSize: "9.5px",
                    color: "var(--text-muted)",
                  }}
                >
                  <span>{msg.timestamp}</span>

                  {!isUser && msg.content && (
                    <button
                      type="button"
                      onClick={() => handleCopy(msg.id, msg.content)}
                      style={{
                        display: "inline-flex",
                        alignItems: "center",
                        gap: "3px",
                        background: "transparent",
                        border: "none",
                        color:
                          copiedId === msg.id
                            ? "var(--gold)"
                            : "var(--text-muted)",
                        cursor: "pointer",
                        padding: "1px 4px",
                        borderRadius: "3px",
                        fontSize: "9.5px",
                        fontFamily: "var(--font-sans)",
                        transition: "color 0.15s ease",
                      }}
                      onMouseEnter={(e) => {
                        if (copiedId !== msg.id)
                          e.currentTarget.style.color = "var(--text-primary)";
                      }}
                      onMouseLeave={(e) => {
                        if (copiedId !== msg.id)
                          e.currentTarget.style.color = "var(--text-muted)";
                      }}
                      title="Copy message"
                    >
                      {copiedId === msg.id ? (
                        <>
                          <Check size={10} />
                          <span>Copied</span>
                        </>
                      ) : (
                        <>
                          <Copy size={10} />
                          <span>Copy</span>
                        </>
                      )}
                    </button>
                  )}
                </div>
              </motion.div>
            );
          })}
        </AnimatePresence>
        <div ref={bottomRef} />
      </div>

      {/* Quick Suggestion Chips */}
      <div
        style={{
          padding: "8px 12px 4px",
          display: "flex",
          gap: "6px",
          flexWrap: "wrap",
          borderTop: "1px solid var(--border-subtle)",
          flexShrink: 0,
          background: "var(--bg-panel)",
        }}
      >
        {SUGGESTION_CHIPS.map((chip) => (
          <motion.button
            key={chip}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => setInput(chip)}
            disabled={isStreaming}
            style={{
              padding: "3px 8px",
              borderRadius: "14px",
              border: "1px solid var(--border-default)",
              background: "transparent",
              color: "var(--text-muted)",
              fontSize: "10.5px",
              fontWeight: 500,
              cursor: isStreaming ? "not-allowed" : "pointer",
              transition: "all 0.15s ease",
              fontFamily: "var(--font-sans)",
              opacity: isStreaming ? 0.5 : 1,
            }}
            onMouseEnter={(e) => {
              if (!isStreaming) {
                e.currentTarget.style.borderColor = "var(--border-accent)";
                e.currentTarget.style.color = "var(--gold)";
              }
            }}
            onMouseLeave={(e) => {
              if (!isStreaming) {
                e.currentTarget.style.borderColor = "var(--border-default)";
                e.currentTarget.style.color = "var(--text-muted)";
              }
            }}
          >
            {chip}
          </motion.button>
        ))}
      </div>

      {/* Input Box */}
      <div
        style={{
          padding: "8px 12px 12px",
          flexShrink: 0,
          background: "var(--bg-panel)",
        }}
      >
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "6px",
            background: "var(--bg-surface)",
            border: "1px solid var(--border-default)",
            borderRadius: "10px",
            padding: "8px 10px",
            transition: "border-color 0.2s ease, box-shadow 0.2s ease",
          }}
          onFocusCapture={(e) => {
            e.currentTarget.style.borderColor = "var(--border-accent)";
            e.currentTarget.style.boxShadow =
              "0 0 0 1px rgba(201, 168, 76, 0.12)";
          }}
          onBlurCapture={(e) => {
            e.currentTarget.style.borderColor = "var(--border-default)";
            e.currentTarget.style.boxShadow = "none";
          }}
        >
          <textarea
            ref={textareaRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={
              isStreaming
                ? "Forge AI is generating…"
                : "Describe what to build or update…"
            }
            rows={2}
            disabled={isStreaming}
            style={{
              background: "transparent",
              border: "none",
              outline: "none",
              resize: "none",
              color: "var(--text-primary)",
              fontSize: "12.5px",
              lineHeight: "1.5",
              fontFamily: "var(--font-sans)",
              width: "100%",
              opacity: isStreaming ? 0.7 : 1,
            }}
            id="chat-input"
          />

          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <span
              style={{
                fontSize: "9.5px",
                color: "var(--text-muted)",
                letterSpacing: "0.02em",
              }}
            >
              {isStreaming ? (
                <span style={{ color: "var(--gold)" }}>Streaming updates…</span>
              ) : (
                "Enter to send · Shift+Enter for new line"
              )}
            </span>

            {isStreaming ? (
              /* Stop button while streaming */
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={stopStreaming}
                style={{
                  height: "26px",
                  padding: "0 9px",
                  borderRadius: "6px",
                  background: "rgba(196, 61, 61, 0.2)",
                  border: "1px solid rgba(196, 61, 61, 0.4)",
                  color: "#f87171",
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  gap: "5px",
                  fontSize: "11px",
                  fontWeight: 600,
                }}
                title="Stop generation"
              >
                <Square size={10} style={{ fill: "#f87171" }} />
                Stop
              </motion.button>
            ) : (
              /* Send button */
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleSend}
                disabled={!input.trim()}
                style={{
                  width: "28px",
                  height: "28px",
                  borderRadius: "7px",
                  background: input.trim()
                    ? "var(--gold)"
                    : "var(--bg-elevated)",
                  border: "none",
                  cursor: input.trim() ? "pointer" : "not-allowed",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  transition: "all 0.18s ease",
                  flexShrink: 0,
                }}
                id="send-btn"
                title="Send prompt"
              >
                <Send
                  size={12}
                  style={{
                    color: input.trim() ? "#0a0e1a" : "var(--text-muted)",
                    strokeWidth: 2.2,
                  }}
                />
              </motion.button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatPanel;
