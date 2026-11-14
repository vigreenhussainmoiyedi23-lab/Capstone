import React from "react";

const Bg = () => {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
      {/* Deep dark gradient foundation */}
      <div className="absolute inset-0 bg-[#0a0e1a]" />

      {/* Gold luminous ambient aura */}
      <div
        className="absolute -top-32 left-1/2 -translate-x-1/2 w-[600px] h-[400px] rounded-full blur-[140px] opacity-20"
        style={{
          background: "radial-gradient(circle, #c9a84c 0%, #1e2540 60%, transparent 100%)",
        }}
      />

      {/* Subtle deep navy glow at the bottom */}
      <div
        className="absolute -bottom-40 left-1/4 w-[500px] h-[400px] rounded-full blur-[160px] opacity-25"
        style={{
          background: "radial-gradient(circle, #2c529f 0%, #0a0e1a 70%, transparent 100%)",
        }}
      />

      {/* Subtle grid pattern overlay */}
      <div
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage:
            "linear-gradient(rgba(201, 168, 76, 0.4) 1px, transparent 1px), linear-gradient(90deg, rgba(201, 168, 76, 0.4) 1px, transparent 1px)",
          backgroundSize: "40px 40px",
        }}
      />
    </div>
  );
};

export default Bg;
