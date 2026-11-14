import React from "react";
import { useSelector as useAppSelector } from "react-redux";
import Unauthorzed from "../commonComponents/Unauthorzed";
import { Loader2 } from "lucide-react";

const ProtectedLayout = ({ children }) => {
  const { user, isLoading } = useAppSelector((state) => state.auth);

  // If restoring initial session
  if (isLoading && !user) {
    return (
      <div className="min-h-screen bg-[#0a0e1a] flex flex-col items-center justify-center gap-3">
        <Loader2 className="w-8 h-8 animate-spin text-gold" />
        <span className="text-xs font-mono tracking-widest uppercase text-text-muted">
          Verifying Forge AI credentials...
        </span>
      </div>
    );
  }

  if (!user) {
    return <Unauthorzed />;
  }

  return <>{children}</>;
};

export default ProtectedLayout;
