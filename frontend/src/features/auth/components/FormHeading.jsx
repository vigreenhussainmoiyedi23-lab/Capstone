import React from "react";

const FormHeading = ({ title = "", subtitle = "" }) => {
  return (
    <div className="mb-6 text-center">
      <h1 className="text-2xl font-bold tracking-tight text-white mb-1.5 font-sans">
        {title}
      </h1>
      {subtitle && (
        <p className="text-sm text-text-muted leading-relaxed  mx-auto">
          {subtitle}
        </p>
      )}
    </div>
  );
};

export default FormHeading;
