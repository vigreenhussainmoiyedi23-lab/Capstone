import React from "react";
import { Link } from "react-router-dom";

const Redirect = ({ title = "", to = "", subtitle = "" }) => {
  return (
    <div className="mt-6 pt-4 border-t border-[rgba(201,168,76,0.1)] text-center">
      <p className="text-xs text-text-muted flex items-center justify-center gap-1.5 font-sans">
        <span>{subtitle}</span>
        <Link
          to={to}
          className="font-semibold text-gold hover:text-gold-bright transition-colors hover:underline tracking-tight"
        >
          {title}
        </Link>
      </p>
    </div>
  );
};

export default Redirect;
