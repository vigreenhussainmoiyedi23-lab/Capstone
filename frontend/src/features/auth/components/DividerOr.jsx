import React from "react";

const DividerOr = () => {
  return (
    <div className="flex items-center gap-3 my-5">
      <div className="flex-1 h-px bg-gradient-to-r from-transparent to-[rgba(201,168,76,0.2)]" />
      <span className="text-[11px] font-mono tracking-widest text-text-muted uppercase">
        or continue with
      </span>
      <div className="flex-1 h-px bg-gradient-to-l from-transparent to-[rgba(201,168,76,0.2)]" />
    </div>
  );
};

export default DividerOr;
