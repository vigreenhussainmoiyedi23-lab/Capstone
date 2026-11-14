import React from "react";
import { Link } from "react-router-dom";

const BrandHeader = () => {
  return (
    <div className="flex flex-col items-center mb-6 text-center">
      <Link to="/" className="group flex items-center gap-3 mb-2 transition-transform duration-200 hover:scale-105">
        <div
          className="w-10 h-10 rounded-xl flex items-center justify-center shadow-lg"
          style={{
            background: "linear-gradient(135deg, #d4a435 0%, #c9a84c 50%, #9a7620 100%)",
            boxShadow: "0 0 20px rgba(201, 168, 76, 0.4)",
          }}
        >
          <svg
            width="20"
            height="20"
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
        <div className="flex flex-col text-left">
          <span className="font-serif font-bold text-2xl tracking-tight text-white flex items-center gap-1.5">
            Forge <span className="text-gold font-sans text-xs tracking-widest uppercase font-semibold px-1.5 py-0.5 rounded bg-gold/10 border border-gold/30">AI</span>
          </span>
          <span className="text-[10px] tracking-widest uppercase text-text-muted font-mono">
            Autonomous Studio
          </span>
        </div>
      </Link>
    </div>
  );
};

export default BrandHeader;
