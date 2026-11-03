import { useState } from "react";
import { motion } from "framer-motion";
import { useSelector } from "react-redux";
import { ExternalLink, RefreshCw, Globe, Play } from "lucide-react";

/**
 * PreviewPanel — Live website preview in an iframe using the sandbox previewUrl
 */
const PreviewPanel = ({ projectId }) => {
  const [refreshKey, setRefreshKey] = useState(0);

  const handleRefresh = () => {
    setRefreshKey((prev) => prev + 1);
  };

  const previewUrl = `http://${projectId}.preview.localhost/`;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.35, ease: [0.4, 0, 0.2, 1] }}
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        overflow: "hidden",
        position: "relative",
        background: "var(--bg-base)",
      }}
    >
      {/* Browser Chrome Header */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "8px",
          padding: "8px 14px",
          background: "var(--bg-surface)",
          borderBottom: "1px solid var(--border-subtle)",
          flexShrink: 0,
        }}
      >
        {/* Traffic lights */}
        <div style={{ display: "flex", gap: "5px" }}>
          {["#c43d3d", "#c9a84c", "#3d8f5e"].map((color, i) => (
            <div
              key={i}
              style={{
                width: "8px",
                height: "8px",
                borderRadius: "50%",
                background: color,
                opacity: 0.8,
              }}
            />
          ))}
        </div>

        {/* URL Bar */}
        <div
          style={{
            flex: 1,
            display: "flex",
            alignItems: "center",
            gap: "6px",
            padding: "4px 10px",
            background: "var(--bg-elevated)",
            border: "1px solid var(--border-subtle)",
            borderRadius: "5px",
            overflow: "hidden",
          }}
        >
          <Globe
            size={11}
            style={{
              color: previewUrl ? "var(--gold)" : "var(--text-muted)",
              flexShrink: 0,
            }}
          />
          <span
            style={{
              fontSize: "11px",
              color: previewUrl ? "var(--text-primary)" : "var(--text-muted)",
              fontFamily: "var(--font-mono)",
              overflow: "hidden",
              textOverflow: "ellipsis",
              whiteSpace: "nowrap",
            }}
          >
            {previewUrl}
          </span>
        </div>

        {/* Refresh Button */}
        <button
          onClick={handleRefresh}
          type="button"
          style={{
            width: "24px",
            height: "24px",
            background: "transparent",
            border: "none",
            color: "var(--text-muted)",
            cursor: "pointer",
            borderRadius: "4px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            transition: "color 0.15s ease",
          }}
          onMouseEnter={(e) =>
            (e.currentTarget.style.color = "var(--text-primary)")
          }
          onMouseLeave={(e) =>
            (e.currentTarget.style.color = "var(--text-muted)")
          }
          title="Refresh preview"
        >
          <RefreshCw size={12} />
        </button>

        {/* Open in New Tab Button */}
        {previewUrl && (
          <a
            href={previewUrl}
            target="_blank"
            rel="noreferrer"
            style={{
              width: "24px",
              height: "24px",
              color: "var(--text-muted)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              borderRadius: "4px",
              textDecoration: "none",
              transition: "color 0.15s ease",
            }}
            onMouseEnter={(e) => (e.currentTarget.style.color = "var(--gold)")}
            onMouseLeave={(e) =>
              (e.currentTarget.style.color = "var(--text-muted)")
            }
            title="Open in new window"
          >
            <ExternalLink size={12} />
          </a>
        )}
      </div>

      {/* Real Preview iframe */}
      <div
        style={{ flex: 1, width: "100%", height: "100%", position: "relative" }}
      >
        <iframe
          key={refreshKey}
          src={previewUrl || undefined}
          title="Sandbox Live Preview"
          style={{
            width: "100%",
            height: "100%",
            border: "none",
            background: "#0a0e1a",
          }}
          sandbox="allow-scripts allow-same-origin allow-forms allow-popups allow-modals"
          id="preview-iframe"
        />
      </div>
    </motion.div>
  );
};

export default PreviewPanel;
