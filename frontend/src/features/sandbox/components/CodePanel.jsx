import { useState, useEffect, useCallback } from "react";
import { motion } from "framer-motion";
import {
  ChevronRight,
  ChevronDown,
  Folder,
  FolderOpen,
  FileCode,
  FileJson,
  FileType,
  File,
  RefreshCw,
  Copy
} from "lucide-react";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { useSelector } from "react-redux";
import {
  listWorkspaceFiles,
  readWorkspaceFiles,
} from "../services/agent.api";
import { useParams } from "react-router-dom";
import { useSandbox } from "../hooks/useSandbox";




/**
 * Dark theme for syntax highlighter
 */
const FORGE_THEME = {
  'code[class*="language-"]': {
    color: "#c9c9d8",
    fontFamily: "'JetBrains Mono', 'Consolas', monospace",
    fontSize: "13px",
    lineHeight: "1.65",
    background: "transparent",
  },
  comment: { color: "#4a4a60", fontStyle: "italic" },
  punctuation: { color: "#7a7a90" },
  property: { color: "#c9a84c" },
  tag: { color: "#c9a84c" },
  boolean: { color: "#e07070" },
  number: { color: "#b5cea8" },
  constant: { color: "#c9a84c" },
  symbol: { color: "#c9a84c" },
  selector: { color: "#9a9aff" },
  "attr-name": { color: "#9cdcfe" },
  string: { color: "#89d185" },
  keyword: { color: "#569cd6" },
  function: { color: "#dcdcaa" },
  variable: { color: "#9cdcfe" },
};
const buildFileTree = (files) => {
  const root = new Map();

  files.forEach((filePath) => {
    const cleanPath = filePath
      .replace("/workspace/", "")
      .replace("/workspace", "");

    const parts = cleanPath.split("/").filter(Boolean);

    let current = root;

    parts.forEach((part, index) => {
      const isFile = index === parts.length - 1;

      if (!current.has(part)) {
        current.set(
          part,
          isFile
            ? { type: "file", path: cleanPath }
            : { type: "folder", children: new Map() }
        );
      }

      if (!isFile) {
        current = current.get(part).children;
      }
    });
  });

  return root;
};
/**
 * CodePanel — Displays real files from agent /workspace via agentUrl
 */
const CodePanel = ({ theme = "dark" }) => {
  const { projectId } = useParams()
  const { fetchFiles, getFileContent } = useSandbox()
  const allTerminalFiles = useSelector((state) => state.sandbox.allFiles)
  const codeFiles = useSelector((state) => state.sandbox.codeFiles)
  const [activeFile, setActiveFile] = useState("src/App.jsx");
  const [copied, setCopied] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [fileList, setFileList] = useState(new Map());
  const [expandedFolders, setExpandedFolders] = useState(new Set(["root"]));
  const [contentToBeShown, setContentToBeShown] = useState("")
  const toggleFolder = (path) => {
    setExpandedFolders((prev) => {
      const updated = new Set(prev);

      if (updated.has(path)) {
        updated.delete(path);
      } else {
        updated.add(path);
      }

      return updated;
    });
  };

  const getFileIcon = (name) => {
    const ext = name.split(".").pop()?.toLowerCase();

    const icons = {
      jsx: <FileCode size={15} color="#61dafb" />,
      tsx: <FileCode size={15} color="#3178c6" />,
      js: <FileCode size={15} color="#e8d44d" />,
      ts: <FileCode size={15} color="#3178c6" />,
      json: <FileJson size={15} color="#dcb67a" />,
      css: <FileType size={15} color="#42a5f5" />,
      html: <FileCode size={15} color="#e44d26" />,
      md: <File size={15} color="#8b9bb4" />,
    };

    return icons[ext] || <File size={15} color="#a0a0a0" />;
  };

  const renderTree = (tree, parentPath = "", depth = 0) => {
    return Array.from(tree.entries()).map(([name, node]) => {
      const fullPath = parentPath
        ? `${parentPath}/${name}`
        : name;

      const isFolder = node.type === "folder";
      const isExpanded = expandedFolders.has(fullPath);
      const isActive = activeFile === node.path;

      return (
        <div key={fullPath}>
          <button
            type="button"
            onClick={() =>
              isFolder
                ? toggleFolder(fullPath)
                : openFile(node.path)
            }
            className="hover:bg-obsidian-500!  w-full flex items-center h-[23px] text-left text-[0.06] transition-colors"
            style={{
              paddingLeft: `${8 + depth * 12}px`,
              paddingRight: "8px",
              background: isActive
                ? "var(--color-obsidian-400)"
                : "transparent",
              color: isActive
                ? "#ffffff"
                : "#cccccc",
            }}
          >
            {isFolder ? (
              <>
                {isExpanded ? (
                  <ChevronDown size={14} className="text-[#858585] shrink-0" />
                ) : (
                  <ChevronRight size={14} className="text-[#858585] shrink-0" />
                )}

                {isExpanded ? (
                  <FolderOpen
                    size={15}
                    color="#dcb67a"
                    className="mx-1.5 shrink-0"
                  />
                ) : (
                  <Folder
                    size={15}
                    color="#dcb67a"
                    className="mx-1.5 shrink-0"
                  />
                )}
              </>
            ) : (
              <>
                <span className="w-[14px] shrink-0" />
                <span className="mx-1.5 shrink-0">
                  {getFileIcon(name)}
                </span>
              </>
            )}

            <span className="truncate">{name}</span>
          </button>

          {isFolder && isExpanded && (
            <div>
              {renderTree(node.children, fullPath, depth + 1)}
            </div>
          )}
        </div>
      );
    });
  };
  const openFile = async (path) => {
    setActiveFile(path)
    if (codeFiles[path]) {
      setContentToBeShown(codeFiles[path])
    } else {
      const content = await getFileContent({ path, projectId })
      setContentToBeShown(content)
    }

  }

  useEffect(() => {
    if (!allTerminalFiles?.length) {
      setFileList(new Map());
      return;
    }

    setFileList(buildFileTree(allTerminalFiles));
  }, [allTerminalFiles]);



  useEffect(() => {
    if (!projectId) return
    fetchFiles(projectId);
  }, [fetchFiles]);

  const currentFile = {
    language: "text",
    code: "// File empty or loading...",
  };

  const handleCopy = () => {
    navigator.clipboard?.writeText(currentFile.code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "row",
        overflow: "hidden",
        background: "var(--bg-base)",
      }}
    >
      {/* File Tabs */}
      <div
        style={{
          gap: "2px",
          overflowY: "auto",
          background: "var(--bg-surface)",
          borderBottom: "1px solid var(--border-subtle)",
          width: "20%"
        }}
      >
        <div className="w-full h-full ">
          <h3 className="bg-navy-900 p-1.25 text-center">Explorer</h3>

          <div className=" w-full mt-5">
            {renderTree(fileList)}
          </div>
        </div>

        <div style={{ flex: 1 }} />

        {/* Refresh Files Button */}
        {projectId && (
          <button
            onClick={() => fetchFiles(projectId)}
            type="button"
            disabled={isLoading}
            style={{
              padding: "4px 8px",
              background: "transparent",
              border: "none",
              color: "var(--text-muted)",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              gap: "4px",
              fontSize: "10px",
            }}
            title="Refresh workspace files"
          >
            <RefreshCw
              size={11}
              style={{
                animation: isLoading ? "spin 1s linear infinite" : "none",
              }}
            />
          </button>
        )}

        {/* Copy Button */}
        <button
          onClick={handleCopy}
          type="button"
          style={{
            padding: "4px 8px",
            background: "transparent",
            border: "none",
            color: copied ? "var(--gold)" : "var(--text-muted)",
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            gap: "4px",
            fontSize: "10px",
          }}
          title="Copy file content"
        >
          {copied ? <Check size={11} /> : <Copy size={11} />}
          {copied ? "Copied" : "Copy"}
        </button>
      </div>

      {/* Code Viewer */}
      <div style={{ flex: 1, overflow: "auto", background: "var(--bg-base)" }}>
        <SyntaxHighlighter
          language={currentFile.language}
          style={FORGE_THEME}
          showLineNumbers
          lineNumberStyle={{
            color: "var(--text-muted)",
            fontSize: "11px",
            userSelect: "none",
            paddingRight: "16px",
            minWidth: "36px",
            textAlign: "right",
            opacity: 0.5,
          }}
          customStyle={{
            margin: 0,
            padding: "16px 0",
            background: "transparent",
            fontSize: "12.5px",
            lineHeight: "1.65",
            fontFamily: "'JetBrains Mono', 'Consolas', monospace",
            minHeight: "100%",
          }}
          wrapLongLines={false}
        >
          {contentToBeShown}
        </SyntaxHighlighter>
        {/* Footer Info */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "12px",
            padding: "4px 14px",
            background: "var(--bg-surface)",
            borderTop: "1px solid var(--border-subtle)",
            flexShrink: 0,
            fontSize: "10px",
            color: "var(--text-muted)",
            fontFamily: "var(--font-mono)",
          }}
        >
          <span>{currentFile.language.toUpperCase()}</span>
          <span>{currentFile.code.split("\n").length} lines</span>
          <div style={{ flex: 1 }} />
          <span style={{ color: projectId ? "#3d8f5e" : "var(--gold)" }}>
            {projectId ? "● Connected to /workspace" : "Local Workspace"}
          </span>
        </div>
      </div>

    </div>
  );
};

export default CodePanel;
