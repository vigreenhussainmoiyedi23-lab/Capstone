import React from "react";
import { ShieldOff, LogIn, ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";

const Unauthorzed = () => {
  return (
    <div className="min-h-screen bg-[#0a0e1a] relative flex items-center justify-center p-4 overflow-hidden">
      {/* Ambient glows */}
      <div
        className="absolute -top-40 left-1/2 -translate-x-1/2 w-[600px] h-[400px] rounded-full blur-[150px] opacity-20 pointer-events-none"
        style={{
          background:
            "radial-gradient(circle, #c9a84c 0%, #1e2540 55%, transparent 100%)",
        }}
      />
      <div
        className="absolute bottom-0 right-1/4 w-[450px] h-[350px] rounded-full blur-[150px] opacity-15 pointer-events-none"
        style={{
          background:
            "radial-gradient(circle, #2c529f 0%, #0a0e1a 70%, transparent 100%)",
        }}
      />

      {/* Card */}
      <div
        className="relative z-10 w-full max-w-[440px] sm:w-[440px] bg-[#0f1422]/90 border border-[rgba(201,168,76,0.22)] rounded-2xl px-8 py-10 text-center shadow-[0_24px_60px_rgba(0,0,0,0.75)]"
        style={{ backdropFilter: "blur(16px)" }}
      >
        {/* Top shimmer accent */}
        <div
          className="absolute top-0 left-0 right-0 h-px rounded-t-2xl"
          style={{
            background:
              "linear-gradient(90deg, transparent, rgba(201,168,76,0.45), transparent)",
          }}
        />

        {/* Brand Logo */}
        <Link to="/" className="inline-flex items-center gap-2.5 mb-7 group">
          <div
            className="w-9 h-9 rounded-xl flex items-center justify-center shadow-md"
            style={{
              background:
                "linear-gradient(135deg, #d4a435 0%, #c9a84c 50%, #9a7620 100%)",
              boxShadow: "0 0 14px rgba(201, 168, 76, 0.35)",
            }}
          >
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="#0a0e1a"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
            </svg>
          </div>
          <span className="font-serif font-bold text-lg tracking-tight text-white group-hover:text-gold transition-colors">
            Forge AI
          </span>
        </Link>

        {/* Shield Icon */}
        <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-2xl bg-[rgba(201,168,76,0.08)] border border-[rgba(201,168,76,0.25)] shadow-[0_0_20px_rgba(201,168,76,0.12)]">
          <ShieldOff className="h-8 w-8 text-gold" strokeWidth={1.5} />
        </div>

        {/* Title */}
        <h1 className="text-xl font-bold font-sans tracking-tight text-white mb-2">
          Authentication Required
        </h1>

        {/* Description */}
        <p className="text-sm text-text-muted leading-relaxed font-sans mb-7 max-w-xs mx-auto">
          This page is protected. Sign in to your Forge AI account to access
          your studio workspaces and projects.
        </p>

        {/* CTA Buttons */}
        <div className="flex flex-col gap-3">
          <Link
            to="/login"
            className="w-full h-11 rounded-xl font-semibold text-sm text-[#0a0e1a] flex items-center justify-center gap-2 cursor-pointer transition-all duration-200 shadow-md hover:shadow-[0_0_20px_rgba(201,168,76,0.4)] active:scale-[0.98]"
            style={{
              background:
                "linear-gradient(135deg, #d4a435 0%, #c9a84c 50%, #b8922e 100%)",
            }}
          >
            <LogIn className="w-4 h-4 text-[#0a0e1a]" />
            <span>Sign In to Studio</span>
          </Link>

          <Link
            to="/"
            className="w-full h-11 rounded-xl border border-[rgba(201,168,76,0.18)] bg-[#141928]/80 hover:bg-[#1a2035] text-text-secondary hover:text-white font-medium text-sm flex items-center justify-center gap-2 transition-all duration-200 active:scale-[0.98]"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Home</span>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Unauthorzed;
