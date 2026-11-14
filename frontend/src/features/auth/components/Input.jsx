import React, { useState } from "react";
import { Eye, EyeOff } from "lucide-react";

const Input = ({
  register,
  name,
  type = "text",
  placeholder,
  icon,
}) => {
  const [show, setShow] = useState(false);
  const isPassword = type === "password";
  const inputType = isPassword ? (show ? "text" : "password") : type;
  const isEmail = type === "email";

  // Friendly label formatting
  const formattedLabel = name
    ? name
        .replace(/([A-Z])/g, " $1")
        .replace(/^./, (str) => str.toUpperCase())
    : "";

  return (
    <div className="flex flex-col gap-1.5 w-full text-left">
      <label
        htmlFor={name}
        className="text-[11px] font-mono uppercase tracking-wider text-text-secondary font-medium ml-0.5"
      >
        {formattedLabel}
      </label>
      <div className="relative flex items-center w-full group">
        {icon && (
          <span className="absolute left-3.5 text-text-muted group-focus-within:text-gold transition-colors duration-200 pointer-events-none flex items-center justify-center">
            {icon}
          </span>
        )}
        <input
          id={name}
          {...register(name)}
          type={inputType}
          placeholder={placeholder}
          minLength={isPassword ? 6 : isEmail ? 5 : 2}
          required={true}
          className={`w-full h-11 rounded-xl bg-[#0a0e1a]/80 text-text-primary text-sm font-sans placeholder:text-text-muted/60 border border-[rgba(201,168,76,0.16)] focus:border-gold focus:ring-1 focus:ring-gold/30 outline-none transition-all duration-200 shadow-inner ${
            icon ? "pl-10" : "pl-3.5"
          } ${isPassword ? "pr-11" : "pr-3.5"}`}
        />
        {isPassword && (
          <button
            type="button"
            onClick={() => setShow((p) => !p)}
            className="absolute right-3.5 text-text-muted hover:text-text-secondary transition-colors p-1 rounded cursor-pointer"
            tabIndex={-1}
            aria-label={show ? "Hide password" : "Show password"}
          >
            {show ? (
              <EyeOff className="w-4 h-4 text-text-muted" />
            ) : (
              <Eye className="w-4 h-4 text-text-muted" />
            )}
          </button>
        )}
      </div>
    </div>
  );
};

export default Input;
