import React from "react";
import { Play, FolderOpen, Clock } from "lucide-react";

/**
 * ProjectCard
 * A single project card — clicking the launch button calls `onLaunch(project._id)`.
 */
const ProjectCard = ({ project, onLaunch, isLoading }) => {
  const { _id, title, createdAt } = project;

  // Format relative date
  const formatDate = (dateStr) => {
    if (!dateStr) return "Recently created";
    const d = new Date(dateStr);
    const now = new Date();
    const diffMs = now - d;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMins / 60);
    const diffDays = Math.floor(diffHours / 24);

    if (diffMins < 1) return "Just now";
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;
    return d.toLocaleDateString("en-US", { month: "short", day: "numeric" });
  };

  // Derive short project ID snippet for monospace label
  const shortId = _id ? _id.slice(-8) : "--------";

  return (
    <div
      className="group relative flex flex-col bg-[#0f1422] border border-[rgba(201,168,76,0.18)] rounded-2xl p-5 transition-all duration-300 hover:border-[rgba(201,168,76,0.4)] hover:shadow-[0_0_28px_rgba(201,168,76,0.1)] overflow-hidden"
    >
      {/* Top shimmer accent line */}
      <div
        className="absolute top-0 left-0 right-0 h-px opacity-0 group-hover:opacity-100 transition-opacity duration-300"
        style={{
          background:
            "linear-gradient(90deg, transparent, rgba(201,168,76,0.4), transparent)",
        }}
      />

      {/* Card Header */}
      <div className="flex items-start justify-between gap-3 mb-4">
        <div className="flex items-center gap-3">
          {/* Icon */}
          <div className="w-9 h-9 rounded-xl bg-gold/10 border border-gold/25 flex items-center justify-center shrink-0">
            <FolderOpen className="w-4 h-4 text-gold" />
          </div>

          {/* Title */}
          <div>
            <h3 className="font-semibold text-sm text-white leading-tight font-sans line-clamp-1">
              {title || "Untitled Project"}
            </h3>
            <p className="text-[11px] font-mono text-text-muted mt-0.5 tracking-wide">
              #{shortId}
            </p>
          </div>
        </div>

        {/* Status Dot */}
        <div className="flex items-center gap-1.5 shrink-0 mt-0.5">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
          <span className="text-[10px] font-mono text-text-muted uppercase tracking-widest">
            Ready
          </span>
        </div>
      </div>

      {/* Spacer */}
      <div className="flex-1" />

      {/* Footer Row */}
      <div className="flex items-center justify-between gap-3 mt-4 pt-4 border-t border-[rgba(201,168,76,0.1)]">
        {/* Timestamp */}
        <div className="flex items-center gap-1.5 text-[11px] text-text-muted font-mono">
          <Clock className="w-3 h-3" />
          <span>{formatDate(createdAt)}</span>
        </div>

        {/* Launch Button */}
        <button
          onClick={() => onLaunch(_id)}
          disabled={isLoading}
          className="flex items-center gap-1.5 px-3.5 h-8 rounded-lg text-xs font-semibold font-sans text-[#0a0e1a] cursor-pointer transition-all duration-200 hover:shadow-[0_0_14px_rgba(201,168,76,0.4)] active:scale-[0.97] disabled:opacity-60 disabled:cursor-not-allowed"
          style={{
            background:
              "linear-gradient(135deg, #d4a435 0%, #c9a84c 50%, #b8922e 100%)",
          }}
        >
          <Play className="w-3 h-3 fill-[#0a0e1a] text-[#0a0e1a]" />
          <span>Launch Studio</span>
        </button>
      </div>
    </div>
  );
};

export default ProjectCard;

