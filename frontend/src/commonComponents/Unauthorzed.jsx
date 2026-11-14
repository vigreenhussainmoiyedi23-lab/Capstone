import React from "react";
import { Lock, ArrowLeft, LogIn } from "lucide-react";
import { Link } from "react-router-dom";
import BrandHeader from "../features/auth/components/BrandHeader";

const Unauthorzed = () => {
  return (
    <div className="min-h-screen bg-[#0a0e1a] relative flex items-center justify-center p-4 overflow-hidden">
      {/* Luminous ambient glow */}
      <div
        className="absolute -top-32 left-1/2 -translate-x-1/2 w-[550px] h-[350px] rounded-full blur-[140px] opacity-20 pointer-events-none"
        style={{
          background: "radial-gradient(circle, #c9a84c 0%, #1e2540 60%, transparent 100%)",
        }}
      />
      <div
        className="absolute -bottom-20 right-1/4 w-[400px] h-[300px] rounded-full blur-[140px] opacity-20 pointer-events-none"
        style={{
          background: "radial-gradient(circle, #2c529f 0%, #0a0e1a 70%, transparent 100%)",
        }}
      />

      <div className="relative z-10 w-full  rounded-2xl border border-[rgba(201,168,76,0.2)] bg-[#0f1422]/90 backdrop-blur-xl p-8 shadow-[0_20px_60px_rgba(0,0,0,0.7)] text-center">
        <BrandHeader />

        {/* Lock Icon Emblem */}
        <div className="mx-auto my-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-gold/10 border border-gold/30 shadow-[0_0_20px_rgba(201,168,76,0.15)]">
          <Lock className="h-8 w-8 text-gold" />
        </div>

        {/* Heading */}
        <h1 className="mt-4 text-2xl font-bold tracking-tight text-white font-sans">
          Authentication Required
        </h1>

        {/* Subtitle / Description */}
        <p className="mt-2.5 text-sm text-text-muted leading-relaxed font-sans">
          This page requires authentication to access. Please sign in to your Forge AI account or return to the home page.
        </p>

        {/* Action Buttons */}
        <div className="mt-8 flex flex-col gap-3 font-sans">
          <Link
            to="/login"
            className="w-full h-11 rounded-xl font-semibold text-sm text-[#0a0e1a] flex items-center justify-center gap-2 cursor-pointer transition-all duration-200 shadow-md hover:shadow-[0_0_20px_rgba(201,168,76,0.35)] active:scale-[0.99]"
            style={{
              background: "linear-gradient(135deg, #d4a435 0%, #c9a84c 50%, #b8922e 100%)",
            }}
          >
            <LogIn className="w-4 h-4 text-[#0a0e1a]" />
            <span>Go to Login Page</span>
          </Link>

          <Link
            to="/"
            className="w-full h-11 rounded-xl border border-[rgba(201,168,76,0.2)] bg-[#141928]/80 hover:bg-[#1a2035] text-text-primary hover:text-white font-medium text-sm flex items-center justify-center gap-2 transition-all duration-200 active:scale-[0.99]"
          >
            <ArrowLeft className="w-4 h-4 text-text-muted" />
            <span>Back to Home</span>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Unauthorzed;
