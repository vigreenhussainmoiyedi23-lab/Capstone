import React from "react";
import { AlertCircle } from "lucide-react";

const ShowError = ({ error }) => {
  if (!error || typeof error !== "string" || error.trim() === "") {
    return null;
  }

  return (
    <div className="flex items-center gap-2 p-2.5 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-xs text-left animate-fade-in">
      <AlertCircle className="w-4 h-4 shrink-0 text-red-400" />
      <span className="leading-tight">{error}</span>
    </div>
  );
};

export default ShowError;
