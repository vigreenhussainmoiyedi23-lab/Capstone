import React from "react";
import { Sparkles, Plus } from "lucide-react";

/**
 * EmptyProjectsState
 * Shown when the user has zero projects.
 */
const EmptyProjectsState = ({ onNewProject, isLoading }) => {
  return (
    <div className="flex flex-col items-center justify-center py-20 px-4 text-center">
      {/* Glowing Icon */}
      <div
        className="mb-6 w-20 h-20 rounded-2xl bg-gold/8 border border-gold/20 flex items-center justify-center shadow-[0_0_30px_rgba(201,168,76,0.12)]"
      >
        <Sparkles className="w-9 h-9 text-gold/70" />
      </div>

      {/* Heading */}
      <h2 className="text-xl font-bold font-sans text-white mb-2 tracking-tight">
        No projects yet
      </h2>

      {/* Subtitle */}
      <p className="max-w-[460px] mx-auto text-sm text-text-muted leading-relaxed mb-8 font-sans">
        Your workspace is ready. Create a new project to spin up an isolated
        AI-powered cloud sandbox with a live terminal, Monaco editor, and
        real-time preview.
      </p>

      {/* CTA */}
      <button
        onClick={onNewProject}
        disabled={isLoading}
        className="flex items-center gap-2 px-6 h-11 rounded-xl font-semibold text-sm text-[#0a0e1a] cursor-pointer transition-all duration-200 shadow-md hover:shadow-[0_0_24px_rgba(201,168,76,0.4)] active:scale-[0.98] disabled:opacity-70 disabled:cursor-not-allowed"
        style={{
          background:
            "linear-gradient(135deg, #d4a435 0%, #c9a84c 50%, #b8922e 100%)",
        }}
      >
        <Plus className="w-4 h-4 text-[#0a0e1a]" />
        <span>Create Your First Project</span>
      </button>

      {/* Fine print */}
      <p className="mt-4 text-[11px] font-mono text-text-muted tracking-wide">
        Container ready in under 5 seconds
      </p>
    </div>
  );
};

export default EmptyProjectsState;

