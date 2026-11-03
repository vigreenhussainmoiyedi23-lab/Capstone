import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
    Sparkles,
    ChevronDown,
    ChevronRight,
    Check,
    Loader2,
    FileCode,
    CheckCircle2,
    Terminal,
} from "lucide-react";

/**
 * Helper to parse update text into action description and optional file badges.
 * E.g.: "reading files in the workspace...src/App.jsx,package.json,src/index.css"
 */
const parseStepText = (rawText) => {
    const text = (rawText || "").trim();

    if (text.includes("...")) {
        const parts = text.split("...");
        const action = parts[0].trim();
        const filesString = parts.slice(1).join("...").trim();

        if (filesString) {
            const files = filesString
                .split(",")
                .map((f) => f.trim())
                .filter(Boolean);
            return { action, files };
        }
        return { action, files: [] };
    }

    return { action: text, files: [] };
};

/**
 * Determines whether a step is a successful completion step.
 */
const isSuccessStep = (text = "") => {
    const lower = text.toLowerCase();
    return (
        lower.includes("successfully") ||
        lower.includes("success") ||
        lower.includes("completed") ||
        lower.includes("done")
    );
};

export const ThinkingProcess = ({
    updates = [],
    status = "complete",
    duration,
    currentStep,
}) => {
    const isStreaming = status === "streaming";
    // While streaming, keep expanded so user sees thoughts in real time; when complete, default to collapsed
    const [isExpanded, setIsExpanded] = useState(isStreaming);
    const [elapsed, setElapsed] = useState(0);
    const stepListRef = useRef(null);

    // Live counter while streaming
    useEffect(() => {
        if (!isStreaming) return;
        setIsExpanded(true);
        const startTime = Date.now();
        const interval = setInterval(() => {
            setElapsed(Math.max(1, Math.round((Date.now() - startTime) / 1000)));
        }, 1000);

        return () => clearInterval(interval);
    }, [isStreaming]);

    // Auto-scroll the step list to the latest step while streaming
    useEffect(() => {
        if (isStreaming && isExpanded && stepListRef.current) {
            stepListRef.current.scrollTop = stepListRef.current.scrollHeight;
        }
    }, [updates, isStreaming, isExpanded]);

    // If there are no updates and not streaming, do not render
    if ((!updates || updates.length === 0) && !isStreaming) {
        return null;
    }

    const totalSteps = updates.length;
    const timeDisplay = isStreaming
        ? `${elapsed}s`
        : duration
        ? `${duration}s`
        : elapsed > 0
        ? `${elapsed}s`
        : "";

    const summaryText = isStreaming
        ? `Thinking${timeDisplay ? ` (${timeDisplay})` : ""}…`
        : `Thought for ${timeDisplay || "a few seconds"} · ${totalSteps} step${totalSteps === 1 ? "" : "s"}`;

    const activeStepText =
        currentStep || (updates.length > 0 ? updates[updates.length - 1] : "Analyzing workspace…");

    return (
        <div
            style={{
                marginBottom: "10px",
                borderRadius: "8px",
                border: "1px solid var(--border-subtle)",
                background: "var(--bg-surface)",
                overflow: "hidden",
                transition: "border-color 0.2s ease, background 0.2s ease",
            }}
        >
            {/* Header / Toggle Bar */}
            <button
                type="button"
                onClick={() => setIsExpanded((prev) => !prev)}
                style={{
                    width: "100%",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    padding: "7px 11px",
                    background: "transparent",
                    border: "none",
                    cursor: "pointer",
                    textAlign: "left",
                    color: "var(--text-muted)",
                    fontSize: "11.5px",
                    fontFamily: "var(--font-sans)",
                    userSelect: "none",
                    gap: "8px",
                }}
                onMouseEnter={(e) => {
                    e.currentTarget.style.color = "var(--text-secondary)";
                    e.currentTarget.style.background = "var(--bg-elevated)";
                }}
                onMouseLeave={(e) => {
                    e.currentTarget.style.color = "var(--text-muted)";
                    e.currentTarget.style.background = "transparent";
                }}
                title={isExpanded ? "Collapse thought process" : "Expand thought process"}
            >
                <div style={{ display: "flex", alignItems: "center", gap: "7px", minWidth: 0, flex: 1 }}>
                    {isStreaming ? (
                        <Loader2
                            size={12}
                            style={{
                                color: "var(--gold)",
                                animation: "spin 1.2s linear infinite",
                                flexShrink: 0,
                            }}
                        />
                    ) : (
                        <Sparkles
                            size={12}
                            style={{
                                color: "var(--gold)",
                                flexShrink: 0,
                                opacity: 0.85,
                            }}
                        />
                    )}

                    <span
                        style={{
                            fontWeight: 500,
                            letterSpacing: "0.01em",
                            color: isStreaming ? "var(--gold)" : "var(--text-muted)",
                            whiteSpace: "nowrap",
                        }}
                    >
                        {summaryText}
                    </span>

                    {/* When collapsed and streaming, show preview of current action */}
                    {!isExpanded && isStreaming && activeStepText && (
                        <span
                            style={{
                                fontSize: "11px",
                                color: "var(--text-muted)",
                                opacity: 0.75,
                                overflow: "hidden",
                                textOverflow: "ellipsis",
                                whiteSpace: "nowrap",
                                minWidth: 0,
                            }}
                        >
                            · {activeStepText}
                        </span>
                    )}
                </div>

                <div style={{ display: "flex", alignItems: "center", gap: "4px", flexShrink: 0 }}>
                    {isExpanded ? (
                        <ChevronDown size={13} style={{ opacity: 0.7 }} />
                    ) : (
                        <ChevronRight size={13} style={{ opacity: 0.7 }} />
                    )}
                </div>
            </button>

            {/* Expanded Detailed Step Timeline */}
            <AnimatePresence initial={false}>
                {isExpanded && (
                    <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.2, ease: [0.4, 0, 0.2, 1] }}
                        style={{
                            borderTop: "1px solid var(--border-subtle)",
                            background: "rgba(0, 0, 0, 0.12)",
                        }}
                    >
                        <div
                            ref={stepListRef}
                            style={{
                                padding: "8px 12px 10px",
                                maxHeight: "190px",
                                overflowY: "auto",
                                display: "flex",
                                flexDirection: "column",
                                gap: "6px",
                            }}
                        >
                            {updates.length === 0 && isStreaming && (
                                <div
                                    style={{
                                        display: "flex",
                                        alignItems: "center",
                                        gap: "7px",
                                        fontSize: "11px",
                                        color: "var(--text-muted)",
                                        fontStyle: "italic",
                                        padding: "4px 0",
                                    }}
                                >
                                    <Loader2 size={11} style={{ animation: "spin 1.2s linear infinite", color: "var(--gold)" }} />
                                    Starting workspace analysis…
                                </div>
                            )}

                            {updates.map((step, idx) => {
                                const isLast = idx === updates.length - 1;
                                const isCurrentActive = isLast && isStreaming;
                                const isDone = isSuccessStep(step);
                                const { action, files } = parseStepText(step);

                                return (
                                    <motion.div
                                        key={idx}
                                        initial={{ opacity: 0, x: -4 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ duration: 0.18 }}
                                        style={{
                                            display: "flex",
                                            alignItems: "flex-start",
                                            gap: "8px",
                                            fontSize: "11px",
                                            lineHeight: "1.5",
                                            color: isCurrentActive
                                                ? "var(--text-primary)"
                                                : isDone
                                                ? "var(--text-secondary)"
                                                : "var(--text-muted)",
                                        }}
                                    >
                                        {/* Status icon for this step */}
                                        <div
                                            style={{
                                                marginTop: "2px",
                                                display: "flex",
                                                alignItems: "center",
                                                justifyContent: "center",
                                                width: "14px",
                                                height: "14px",
                                                flexShrink: 0,
                                            }}
                                        >
                                            {isCurrentActive ? (
                                                <Loader2
                                                    size={11}
                                                    style={{
                                                        color: "var(--gold)",
                                                        animation: "spin 1s linear infinite",
                                                    }}
                                                />
                                            ) : isDone ? (
                                                <Check
                                                    size={11}
                                                    style={{
                                                        color: "#3d8f5e",
                                                        strokeWidth: 2.5,
                                                    }}
                                                />
                                            ) : (
                                                <span
                                                    style={{
                                                        width: "4px",
                                                        height: "4px",
                                                        borderRadius: "50%",
                                                        background: "var(--gold-dim)",
                                                        opacity: 0.8,
                                                    }}
                                                />
                                            )}
                                        </div>

                                        {/* Text and badges */}
                                        <div style={{ flex: 1, minWidth: 0 }}>
                                            <span style={{ letterSpacing: "0.01em" }}>
                                                {action}
                                            </span>

                                            {/* File Badges */}
                                            {files.length > 0 && (
                                                <div
                                                    style={{
                                                        display: "flex",
                                                        flexWrap: "wrap",
                                                        gap: "4px",
                                                        marginTop: "3px",
                                                    }}
                                                >
                                                    {files.map((file, fileIdx) => (
                                                        <span
                                                            key={fileIdx}
                                                            style={{
                                                                display: "inline-flex",
                                                                alignItems: "center",
                                                                gap: "4px",
                                                                fontFamily: "var(--font-mono)",
                                                                fontSize: "10px",
                                                                background: "var(--gold-glow)",
                                                                color: "var(--gold)",
                                                                padding: "1px 6px",
                                                                borderRadius: "4px",
                                                                border: "1px solid var(--border-subtle)",
                                                                lineHeight: 1.4,
                                                            }}
                                                        >
                                                            <FileCode size={9} style={{ opacity: 0.8 }} />
                                                            {file}
                                                        </span>
                                                    ))}
                                                </div>
                                            )}
                                        </div>
                                    </motion.div>
                                );
                            })}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default ThinkingProcess;
