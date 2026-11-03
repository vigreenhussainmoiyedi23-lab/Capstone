import { useState } from "react";
import { Copy, Check } from "lucide-react";

/**
 * Renders inline Markdown tokens: **bold**, `code`, *italic*, [link](url)
 */
const renderInlineTokens = (text) => {
    if (!text) return null;

    // Pattern matches:
    // 1. **bold**
    // 2. `code`
    // 3. *italic*
    // 4. [label](url)
    const regex = /(\*\*[^*]+\*\*|`[^`]+`|\*[^*]+\*|\[[^\]]+\]\([^)]+\))/g;
    const tokens = [];
    let lastIndex = 0;
    let match;

    while ((match = regex.exec(text)) !== null) {
        if (match.index > lastIndex) {
            tokens.push(text.slice(lastIndex, match.index));
        }

        const token = match[0];

        if (token.startsWith("**") && token.endsWith("**")) {
            tokens.push(
                <strong
                    key={match.index}
                    style={{
                        color: "var(--text-primary)",
                        fontWeight: 700,
                    }}
                >
                    {token.slice(2, -2)}
                </strong>
            );
        } else if (token.startsWith("`") && token.endsWith("`")) {
            tokens.push(
                <code
                    key={match.index}
                    style={{
                        fontFamily: "var(--font-mono)",
                        fontSize: "11px",
                        background: "var(--gold-glow)",
                        color: "var(--gold)",
                        padding: "1px 5px",
                        borderRadius: "3px",
                        border: "1px solid var(--border-subtle)",
                        verticalAlign: "baseline",
                    }}
                >
                    {token.slice(1, -1)}
                </code>
            );
        } else if (token.startsWith("*") && token.endsWith("*")) {
            tokens.push(
                <em
                    key={match.index}
                    style={{
                        fontStyle: "italic",
                        color: "var(--text-secondary)",
                    }}
                >
                    {token.slice(1, -1)}
                </em>
            );
        } else if (token.startsWith("[") && token.includes("](") && token.endsWith(")")) {
            const labelEnd = token.indexOf("](");
            const label = token.slice(1, labelEnd);
            const url = token.slice(labelEnd + 2, -1);
            tokens.push(
                <a
                    key={match.index}
                    href={url}
                    target="_blank"
                    rel="noreferrer"
                    style={{
                        color: "var(--gold)",
                        textDecoration: "underline",
                        textUnderlineOffset: "2px",
                    }}
                >
                    {label}
                </a>
            );
        }

        lastIndex = regex.lastIndex;
    }

    if (lastIndex < text.length) {
        tokens.push(text.slice(lastIndex));
    }

    return tokens;
};

/**
 * Syntax-styled code block with copy button
 */
const CodeBlock = ({ language, code }) => {
    const [copied, setCopied] = useState(false);

    const handleCopy = () => {
        navigator.clipboard?.writeText(code);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <div
            style={{
                margin: "8px 0",
                borderRadius: "6px",
                overflow: "hidden",
                border: "1px solid var(--border-default)",
                background: "var(--bg-base)",
            }}
        >
            <div
                style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    padding: "4px 10px",
                    background: "var(--bg-surface)",
                    borderBottom: "1px solid var(--border-subtle)",
                    fontSize: "10.5px",
                    fontFamily: "var(--font-mono)",
                    color: "var(--text-muted)",
                }}
            >
                <span>{language || "code"}</span>
                <button
                    type="button"
                    onClick={handleCopy}
                    style={{
                        background: "transparent",
                        border: "none",
                        color: copied ? "var(--gold)" : "var(--text-muted)",
                        cursor: "pointer",
                        display: "flex",
                        alignItems: "center",
                        gap: "4px",
                        fontSize: "10px",
                        fontFamily: "var(--font-sans)",
                    }}
                >
                    {copied ? <Check size={11} /> : <Copy size={11} />}
                    {copied ? "Copied" : "Copy"}
                </button>
            </div>
            <pre
                style={{
                    padding: "10px 12px",
                    margin: 0,
                    overflowX: "auto",
                    fontSize: "11.5px",
                    fontFamily: "var(--font-mono)",
                    lineHeight: 1.5,
                    color: "var(--text-primary)",
                }}
            >
                <code>{code}</code>
            </pre>
        </div>
    );
};

/**
 * MarkdownRenderer — Parses Markdown paragraphs, lists, bold, inline code, and code fences.
 */
export const MarkdownRenderer = ({ content }) => {
    if (!content) return null;

    // First split blocks by fenced code blocks: ```lang ... ```
    const codeBlockRegex = /```([a-zA-Z0-9_-]*)\n([\s\S]*?)```/g;
    const blocks = [];
    let lastIndex = 0;
    let match;

    while ((match = codeBlockRegex.exec(content)) !== null) {
        if (match.index > lastIndex) {
            blocks.push({
                type: "markdown",
                text: content.slice(lastIndex, match.index),
            });
        }
        blocks.push({
            type: "code",
            language: match[1] || "",
            code: match[2].trim(),
        });
        lastIndex = codeBlockRegex.lastIndex;
    }

    if (lastIndex < content.length) {
        blocks.push({
            type: "markdown",
            text: content.slice(lastIndex),
        });
    }

    return (
        <div
            style={{
                display: "flex",
                flexDirection: "column",
                gap: "8px",
                fontSize: "12.5px",
                lineHeight: "1.65",
                color: "var(--text-primary)",
            }}
        >
            {blocks.map((block, blockIdx) => {
                if (block.type === "code") {
                    return (
                        <CodeBlock
                            key={blockIdx}
                            language={block.language}
                            code={block.code}
                        />
                    );
                }

                // Parse markdown block into paragraphs, headings, bullet lists
                const lines = block.text.split("\n");
                const elements = [];
                let currentList = [];

                const flushList = () => {
                    if (currentList.length > 0) {
                        const items = [...currentList];
                        elements.push(
                            <ul
                                key={`list-${elements.length}`}
                                style={{
                                    margin: "4px 0",
                                    padding: 0,
                                    listStyle: "none",
                                    display: "flex",
                                    flexDirection: "column",
                                    gap: "6px",
                                }}
                            >
                                {items.map((itemText, i) => (
                                    <li
                                        key={i}
                                        style={{
                                            display: "flex",
                                            alignItems: "flex-start",
                                            gap: "8px",
                                            lineHeight: "1.6",
                                        }}
                                    >
                                        <span
                                            style={{
                                                width: "4px",
                                                height: "4px",
                                                borderRadius: "50%",
                                                background: "var(--gold)",
                                                marginTop: "8px",
                                                flexShrink: 0,
                                            }}
                                        />
                                        <div style={{ flex: 1, minWidth: 0, color: "var(--text-primary)" }}>
                                            {renderInlineTokens(itemText)}
                                        </div>
                                    </li>
                                ))}
                            </ul>
                        );
                        currentList = [];
                    }
                };

                for (let i = 0; i < lines.length; i++) {
                    const line = lines[i];
                    const trimmed = line.trim();

                    // Blank line
                    if (!trimmed) {
                        flushList();
                        continue;
                    }

                    // Bullet item: "- " or "* " or "• "
                    if (
                        trimmed.startsWith("- ") ||
                        trimmed.startsWith("* ") ||
                        trimmed.startsWith("• ")
                    ) {
                        currentList.push(trimmed.slice(2).trim());
                        continue;
                    }

                    // Otherwise flush any active list
                    flushList();

                    // Headings: ###, ##, #
                    if (trimmed.startsWith("### ")) {
                        elements.push(
                            <h4
                                key={`h4-${i}`}
                                style={{
                                    fontSize: "13px",
                                    fontWeight: 700,
                                    color: "var(--text-primary)",
                                    margin: "6px 0 2px",
                                }}
                            >
                                {renderInlineTokens(trimmed.slice(4))}
                            </h4>
                        );
                    } else if (trimmed.startsWith("## ")) {
                        elements.push(
                            <h3
                                key={`h3-${i}`}
                                style={{
                                    fontSize: "14px",
                                    fontWeight: 700,
                                    color: "var(--gold)",
                                    margin: "8px 0 2px",
                                }}
                            >
                                {renderInlineTokens(trimmed.slice(3))}
                            </h3>
                        );
                    } else if (trimmed.startsWith("# ")) {
                        elements.push(
                            <h2
                                key={`h2-${i}`}
                                style={{
                                    fontSize: "15px",
                                    fontWeight: 700,
                                    color: "var(--gold)",
                                    margin: "10px 0 3px",
                                }}
                            >
                                {renderInlineTokens(trimmed.slice(2))}
                            </h2>
                        );
                    } else {
                        // Regular paragraph
                        elements.push(
                            <p
                                key={`p-${i}`}
                                style={{
                                    margin: "2px 0",
                                    color: "var(--text-primary)",
                                    lineHeight: "1.65",
                                }}
                            >
                                {renderInlineTokens(trimmed)}
                            </p>
                        );
                    }
                }

                flushList();

                return <div key={blockIdx}>{elements}</div>;
            })}
        </div>
    );
};

export default MarkdownRenderer;

