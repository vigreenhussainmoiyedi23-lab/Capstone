import React from "react";
import { Plus } from "lucide-react";

/**
 * DashboardHeader
 * Top greeting bar with user name, stats row, and "New Project" CTA.
 */
const DashboardHeader = ({ user, projectCount, onNewProject, isLoading }) => {
  const displayName =
    user?.username || user?.name || user?.email?.split("@")[0] || "Developer";

  return (
    <div className="mb-10">
      {/* Greeting Row */}
      <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
        <div>
          <p className="text-xs font-mono uppercase tracking-widest text-gold/70 mb-1">
            Forge AI Studio // Dashboard
          </p>
          <h1 className="text-2xl sm:text-3xl font-bold font-sans tracking-tight text-white">
            Welcome back,{" "}
            <span className="text-gold">{displayName}</span>
          </h1>
          <p className="mt-1.5 text-sm text-text-muted font-sans">
            {projectCount === 0
              ? "No projects yet — create your first sandbox below."
              : `${projectCount} project${projectCount !== 1 ? "s" : ""} in your workspace.`}
          </p>
        </div>

        {/* New Project CTA */}
        <button
          onClick={onNewProject}
          disabled={isLoading}
          className="shrink-0 flex items-center gap-2 px-5 h-10 rounded-xl font-semibold text-sm text-[#0a0e1a] cursor-pointer transition-all duration-200 shadow-md hover:shadow-[0_0_20px_rgba(201,168,76,0.4)] active:scale-[0.98] disabled:opacity-70 disabled:cursor-not-allowed"
          style={{
            background:
              "linear-gradient(135deg, #d4a435 0%, #c9a84c 50%, #b8922e 100%)",
          }}
        >
          <Plus className="w-4 h-4 text-[#0a0e1a]" />
          <span>New Project</span>
        </button>
      </div>

      {/* Divider */}
      <div className="mt-6 h-px bg-gradient-to-r from-transparent via-[rgba(201,168,76,0.2)] to-transparent" />
    </div>
  );
};

export default DashboardHeader;

