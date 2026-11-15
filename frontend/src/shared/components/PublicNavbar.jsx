import React from "react";
import { Link, useLocation } from "react-router-dom";
import { useSelector } from "react-redux";
import { useAuth } from "../../features/auth/hooks/useAuth";
import { LogOut, LayoutDashboard, Sparkles, Terminal } from "lucide-react";

const PublicNavbar = () => {
  const { user, isAuthenticated } = useSelector((state) => state.auth);
  const { LogoutHandler } = useAuth();
  const location = useLocation();

  const isAuthPage =
    location.pathname === "/login" ||
    location.pathname === "/register" ||
    location.pathname === "/verifyOtp" ||
    location.pathname === "/forgot-password";

  return (
    <header className="sticky top-0 z-50 w-full h-14 border-b border-[rgba(201,168,76,0.14)] bg-[#0a0e1a]/85 backdrop-blur-md px-4 md:px-8 flex items-center justify-between transition-all">
      {/* Left: Brand */}
      <Link
        to="/"
        className="flex items-center gap-2.5 group transition-transform duration-200 hover:scale-102"
      >
        <div
          className="w-8 h-8 rounded-lg flex items-center justify-center shadow-md"
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
        <div className="flex items-baseline gap-1.5">
          <Link
            to="/"
            className={`transition-colors hover:text-gold ${
              location.pathname === "/"
                ? "text-gold font-medium"
                : "text-text-secondary"
            }`}
          >
            <span className="font-serif font-bold text-lg tracking-tight text-white">
              Forge
            </span>
            <span className="text-[10px] font-mono uppercase tracking-widest text-gold font-semibold px-1 py-0.5 rounded bg-gold/10 border border-gold/25">
              AI Studio
            </span>
          </Link>
        </div>
      </Link>

      {/* Center Links (Visible on desktop) */}
      <nav className="hidden md:flex items-center gap-6 text-sm font-sans">
        {isAuthenticated && user && (
          <Link
            to="/dashboard"
            className={`flex items-center gap-1.5 transition-colors hover:text-gold ${
              location.pathname === "/dashboard"
                ? "text-gold font-medium"
                : "text-text-secondary"
            }`}
          >
            <LayoutDashboard className="w-3.5 h-3.5" />
            <span>Dashboard</span>
          </Link>
        )}
      </nav>

      {/* Right: Auth & CTAs */}
      <div className="flex items-center gap-3">
        {isAuthenticated && user ? (
          <div className="flex items-center gap-3">
            <Link
              to="/dashboard"
              className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-lg bg-[#141928] border border-[rgba(201,168,76,0.2)] text-xs text-text-primary hover:border-gold hover:text-white transition-all"
            >
              <div className="w-5 h-5 rounded-full bg-gold/20 flex items-center justify-center text-[10px] font-bold text-gold uppercase">
                {(user.username || user.email || "U")[0]}
              </div>
              <span className="max-w-[120px] truncate">
                {user.username || user.email}
              </span>
            </Link>

            <button
              onClick={LogoutHandler}
              className="p-2 rounded-lg bg-[#141928]/80 hover:bg-red-500/10 border border-white/5 hover:border-red-500/30 text-text-muted hover:text-red-400 text-xs flex items-center gap-1.5 transition-all cursor-pointer"
              title="Sign Out"
            >
              <LogOut className="w-4 h-4" />
              <span className="hidden sm:inline">Sign Out</span>
            </button>
          </div>
        ) : (
          <div className="flex items-center gap-2 sm:gap-3">
            <Link
              to="/login"
              className={`px-3.5 py-1.5 rounded-lg text-xs font-medium transition-all ${
                location.pathname === "/login"
                  ? "text-gold bg-gold/10 border border-gold/30"
                  : "text-text-secondary hover:text-white hover:bg-white/5"
              }`}
            >
              Sign In
            </Link>
            <Link
              to="/register"
              className="px-3.5 py-1.5 rounded-lg text-xs font-semibold text-[#0a0e1a] shadow-sm hover:shadow-[0_0_15px_rgba(201,168,76,0.3)] transition-all active:scale-[0.98]"
              style={{
                background:
                  "linear-gradient(135deg, #d4a435 0%, #c9a84c 50%, #b8922e 100%)",
              }}
            >
              Get Started
            </Link>
          </div>
        )}
      </div>
    </header>
  );
};

export default PublicNavbar;
