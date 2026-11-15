import React, { useRef, useEffect } from "react";
import { X, FolderPlus, Loader2, ArrowRight } from "lucide-react";

/**
 * NewProjectModal
 * A minimal overlay modal for creating a new project.
 * Props:
 *   open: boolean
 *   onClose: () => void
 *   onSubmit: (title: string) => void
 *   isLoading: boolean
 *   error: string | null
 */
const NewProjectModal = ({ open, onClose, onSubmit, isLoading, error }) => {
  const inputRef = useRef(null);
  const [title, setTitle] = React.useState("");

  // Auto-focus input when modal opens
  useEffect(() => {
    if (open) {
      setTitle("");
      setTimeout(() => inputRef.current?.focus(), 80);
    }
  }, [open]);

  // Close on Escape
  useEffect(() => {
    const handler = (e) => {
      if (e.key === "Escape") onClose();
    };
    if (open) window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [open, onClose]);

  const handleSubmit = (e) => {
    e.preventDefault();
    const trimmed = title.trim();
    if (!trimmed || isLoading) return;
    onSubmit(trimmed);
  };

  if (!open) return null;

  return (
    /* Backdrop */
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#0a0e1a]/80 backdrop-blur-md"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      {/* Modal Panel */}
      <div
        className="relative w-full max-w-[480px] sm:w-[480px] bg-[#0f1422] border border-[rgba(201,168,76,0.25)] rounded-2xl p-7 shadow-[0_24px_60px_rgba(0,0,0,0.75),0_0_40px_rgba(201,168,76,0.07)]"
        style={{ backdropFilter: "blur(16px)" }}
      >
        {/* Top shimmer */}
        <div
          className="absolute top-0 left-0 right-0 h-px rounded-t-2xl"
          style={{
            background:
              "linear-gradient(90deg, transparent, rgba(201,168,76,0.4), transparent)",
          }}
        />

        {/* Close Button */}
        <button
          onClick={onClose}
          disabled={isLoading}
          className="absolute top-4 right-4 w-7 h-7 rounded-lg bg-[#141928] border border-[rgba(201,168,76,0.15)] flex items-center justify-center text-text-muted hover:text-white hover:border-gold/40 transition-all cursor-pointer"
          aria-label="Close"
        >
          <X className="w-3.5 h-3.5" />
        </button>

        {/* Icon + Title */}
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-xl bg-gold/10 border border-gold/30 flex items-center justify-center">
            <FolderPlus className="w-5 h-5 text-gold" />
          </div>
          <div>
            <h2 className="text-base font-bold font-sans text-white tracking-tight">
              New Project
            </h2>
            <p className="text-xs text-text-muted font-sans mt-0.5">
              Provision a new isolated studio workspace
            </p>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          {/* Title Input */}
          <div className="flex flex-col gap-1.5">
            <label
              htmlFor="project-title"
              className="text-[11px] font-mono uppercase tracking-widest text-text-secondary font-medium"
            >
              Project Title
            </label>
            <input
              ref={inputRef}
              id="project-title"
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. my-fullstack-app"
              maxLength={80}
              disabled={isLoading}
              className="h-11 px-3.5 rounded-xl bg-[#0a0e1a]/80 text-text-primary text-sm font-sans placeholder:text-text-muted/60 border border-[rgba(201,168,76,0.18)] focus:border-gold focus:ring-1 focus:ring-gold/30 outline-none transition-all duration-200 disabled:opacity-60"
            />
          </div>

          {/* Error */}
          {error && (
            <p className="text-xs text-red-400 font-sans bg-red-500/10 border border-red-500/20 px-3 py-2 rounded-lg">
              {error}
            </p>
          )}

          {/* Actions */}
          <div className="flex gap-3 mt-1">
            <button
              type="button"
              onClick={onClose}
              disabled={isLoading}
              className="flex-1 h-10 rounded-xl border border-[rgba(201,168,76,0.18)] bg-[#141928]/80 hover:bg-[#1a2035] text-text-primary hover:text-white font-medium text-sm font-sans transition-all disabled:opacity-60 cursor-pointer"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={isLoading || !title.trim()}
              className="flex-1 h-10 rounded-xl font-semibold text-sm text-[#0a0e1a] flex items-center justify-center gap-2 cursor-pointer transition-all duration-200 hover:shadow-[0_0_18px_rgba(201,168,76,0.4)] active:scale-[0.98] disabled:opacity-60 disabled:cursor-not-allowed font-sans"
              style={{
                background:
                  "linear-gradient(135deg, #d4a435 0%, #c9a84c 50%, #b8922e 100%)",
              }}
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin text-[#0a0e1a]" />
                  <span>Creating...</span>
                </>
              ) : (
                <>
                  <span>Create &amp; Launch</span>
                  <ArrowRight className="w-4 h-4 text-[#0a0e1a]" />
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default NewProjectModal;

