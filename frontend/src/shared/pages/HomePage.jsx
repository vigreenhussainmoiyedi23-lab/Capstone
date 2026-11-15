import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { useSandbox } from "../../features/sandbox/hooks/useSandbox.js";
import PublicNavbar from "../components/PublicNavbar.jsx";
import {
  Sparkles,
  ArrowRight,
  Terminal,
  Cpu,
  Code2,
  Zap,
  Loader2,
} from "lucide-react";
1
const HomePage = () => {
  const { user, isAuthenticated } = useSelector((state) => state.auth);
  const { createSandbox, isLoading } = useSandbox();
  const navigate = useNavigate();
  const [errorMsg, setErrorMsg] = useState(null);

  const handleLaunchSandbox = async () => {
    // If user is not authenticated, prompt to sign in
    if (!isAuthenticated || !user) {
      navigate("/login");
      return;
    }

    try {
      setErrorMsg(null);
      const sandbox = await createSandbox();
      const sandboxId = sandbox?.id || sandbox?.sandboxId;
      if (sandboxId) {
        navigate(`/chats/${sandboxId}`);
      }
    } catch (err) {
      setErrorMsg("Failed to initialize sandbox environment. Please try again.");
    }
  };

  return (
    <div className="min-h-screen bg-[#0a0e1a] text-white flex flex-col selection:bg-gold/30 selection:text-white relative overflow-x-hidden">
      {/* Top Navigation */}
      <PublicNavbar />

      {/* Ambient Radial Lights */}
      <div
        className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[500px] rounded-full blur-[180px] opacity-20 pointer-events-none"
        style={{
          background: "radial-gradient(circle, #c9a84c 0%, #1e2540 60%, transparent 100%)",
        }}
      />
      <div
        className="absolute top-[800px] right-0 w-[500px] h-[500px] rounded-full blur-[180px] opacity-15 pointer-events-none"
        style={{
          background: "radial-gradient(circle, #2c529f 0%, #0a0e1a 70%, transparent 100%)",
        }}
      />

      {/* Hero Section */}
      <section className="relative z-10 pt-16 pb-20 px-4 md:px-8 max-w-6xl mx-auto flex flex-col items-center text-center">
        {/* Release Tag */}
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#0f1422] border border-[rgba(201,168,76,0.25)] text-xs text-text-secondary mb-8 shadow-sm hover:border-gold/50 transition-colors">
          <span className="w-2 h-2 rounded-full bg-gold animate-pulse" />
          <span className="font-mono text-[11px] uppercase tracking-wider text-gold font-semibold">
            Forge AI Studio 2.0
          </span>
          <span className="text-text-muted">|</span>
          <span className="text-text-primary text-[11px]">Autonomous Cloud Development</span>
        </div>

        {/* Monumental Headline */}
        <h1 className="text-4xl sm:text-6xl md:text-7xl font-bold font-serif tracking-tight text-white max-w-4xl leading-[1.1] mb-6">
          Architect, Code & Deploy with{" "}
          <span
            className="text-transparent bg-clip-text"
            style={{
              backgroundImage: "linear-gradient(135deg, #f2d98f 0%, #c9a84c 50%, #9a7620 100%)",
            }}
          >
            Autonomous Intelligence
          </span>
        </h1>

        {/* Subtitle */}
        <p className="text-base sm:text-lg md:text-xl text-text-secondary md:px-3 leading-relaxed mb-10 font-sans font-light">
          Forge AI pairs streaming agentic reasoning with sub-second container sandboxes, bidirectional PTY terminals, and VS Code-grade editing in one unified studio.
        </p>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row items-center gap-4 w-full sm:w-auto">
          <button
            onClick={handleLaunchSandbox}
            disabled={isLoading}
            className="w-full sm:w-auto px-8 h-13 rounded-xl font-semibold text-sm tracking-wide text-[#0a0e1a] flex items-center justify-center gap-2.5 cursor-pointer transition-all duration-200 shadow-lg hover:shadow-[0_0_30px_rgba(201,168,76,0.4)] active:scale-[0.98] disabled:opacity-75 disabled:cursor-not-allowed"
            style={{
              background: "linear-gradient(135deg, #d4a435 0%, #c9a84c 50%, #b8922e 100%)",
            }}
          >
            {isLoading ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin text-[#0a0e1a]" />
                <span>Spinning Up Isolated Sandbox...</span>
              </>
            ) : (
              <>
                <Zap className="w-4 h-4 fill-current text-[#0a0e1a]" />
                <span>{isAuthenticated ? "Launch New Sandbox" : "Get Started — Free"}</span>
                <ArrowRight className="w-4 h-4 text-[#0a0e1a]" />
              </>
            )}
          </button>

          {isAuthenticated ? (
            <Link
              to="/dashboard"
              className="w-full sm:w-auto px-6 h-13 rounded-xl border border-[rgba(201,168,76,0.25)] bg-[#0f1422] hover:bg-[#141928] text-text-primary hover:text-white font-medium text-sm flex items-center justify-center gap-2 transition-all active:scale-[0.98]"
            >
              <span>Go to Dashboard</span>
            </Link>
          ) : (
            <Link
              to="/login"
              className="w-full sm:w-auto px-6 h-13 rounded-xl border border-[rgba(201,168,76,0.25)] bg-[#0f1422] hover:bg-[#141928] text-text-primary hover:text-white font-medium text-sm flex items-center justify-center gap-2 transition-all active:scale-[0.98]"
            >
              <span>Sign In</span>
            </Link>
          )}
        </div>

        {errorMsg && (
          <p className="mt-4 text-xs text-red-400 font-mono bg-red-500/10 border border-red-500/20 px-3 py-1.5 rounded-lg">
            {errorMsg}
          </p>
        )}

        {/* Hero Interactive IDE Mockup */}
        <div className="mt-16 w-full max-w-5xl rounded-2xl border border-[rgba(201,168,76,0.2)] bg-[#0a0e1a]/90 backdrop-blur-xl shadow-[0_20px_80px_rgba(0,0,0,0.8)] overflow-hidden text-left">
          {/* Mock Window Titlebar */}
          <div className="h-10 bg-[#0f1422] border-b border-[rgba(201,168,76,0.12)] px-4 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-[#ff5f56]/80 inline-block" />
              <span className="w-3 h-3 rounded-full bg-[#ffbd2e]/80 inline-block" />
              <span className="w-3 h-3 rounded-full bg-[#27c93f]/80 inline-block" />
              <span className="ml-3 font-mono text-[11px] text-text-muted">
                forge-ai // studio-workspace-preview
              </span>
            </div>
            <div className="flex items-center gap-2 font-mono text-[11px] text-gold/80">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
              <span>LIVE CLOUD CONTAINER</span>
            </div>
          </div>

          {/* Mock Panels Split */}
          <div className="grid grid-cols-1 md:grid-cols-12 min-h-[380px] bg-[#070913]">
            {/* Left AI Chat / Thoughts */}
            <div className="md:col-span-4 border-r border-[rgba(201,168,76,0.1)] p-4 flex flex-col justify-between bg-[#0a0e1a]/70">
              <div className="space-y-3 font-sans">
                <div className="flex items-center gap-2 text-xs font-mono text-gold">
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>AGENT GRAPH ACTIVE</span>
                </div>
                <div className="p-3 rounded-xl bg-[#141928] border border-[rgba(201,168,76,0.15)] text-xs text-text-secondary leading-relaxed">
                  <p className="text-white font-medium mb-1">User Prompt</p>
                  "Build an interactive dashboard with real-time analytics and authentication."
                </div>
                <div className="p-3 rounded-xl bg-[#0f1422] border border-white/5 text-xs text-text-muted space-y-1.5 font-mono text-[11px]">
                  <p className="text-gold font-semibold flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-gold" />
                    Thinking & Patching
                  </p>
                  <p className="text-emerald-400">✓ Generating fullstack schema</p>
                  <p className="text-emerald-400">✓ Initializing Vite development server</p>
                  <p className="text-gold/90 animate-pulse">→ Streaming component patches via SSE...</p>
                </div>
              </div>

              <div className="pt-3 border-t border-[rgba(201,168,76,0.1)] text-[11px] font-mono text-text-muted flex items-center justify-between">
                <span>Latency: 42ms</span>
                <span className="text-gold">SSE Connected</span>
              </div>
            </div>

            {/* Right Editor & Terminal Mock */}
            <div className="md:col-span-8 flex flex-col bg-[#0d111d]">
              {/* Tab Header */}
              <div className="h-9 bg-[#0a0e1a] border-b border-[rgba(201,168,76,0.1)] px-4 flex items-center gap-4 text-xs font-mono">
                <span className="text-gold border-b-2 border-gold pb-1.5 pt-1 font-semibold flex items-center gap-1.5">
                  <Code2 className="w-3.5 h-3.5" /> App.jsx
                </span>
                <span className="text-text-muted hover:text-white transition-colors cursor-pointer">
                  Dashboard.jsx
                </span>
                <span className="text-text-muted hover:text-white transition-colors cursor-pointer">
                  package.json
                </span>
              </div>

              {/* Code lines */}
              <div className="p-4 font-mono text-xs text-text-secondary leading-relaxed overflow-x-auto">
                <p><span className="text-purple-400">import</span> React, &#123; useState, useEffect &#125; <span className="text-purple-400">from</span> <span className="text-emerald-300">'react'</span>;</p>
                <p><span className="text-purple-400">import</span> &#123; createSandboxEnvironment &#125; <span className="text-purple-400">from</span> <span className="text-emerald-300">'@forge/sandbox'</span>;</p>
                <p className="text-text-muted">// Autonomous workspace configuration</p>
                <p><span className="text-blue-400">export default function</span> <span className="text-yellow-300">ForgeStudioApp</span>() &#123;</p>
                <p className="pl-4"><span className="text-blue-400">const</span> [workspace, setWorkspace] = <span className="text-yellow-300">useState</span>(<span className="text-blue-400">null</span>);</p>
                <p className="pl-4"><span className="text-purple-400">return</span> (</p>
                <p className="pl-8 text-gold">&lt;<span className="text-red-400">SandboxLiveProvider</span> host=<span className="text-emerald-300">"forge.cloud"</span>&gt;</p>
                <p className="pl-12 text-white">&lt;<span className="text-cyan-400">PTYTerminalStream</span> socket=&#123;socket&#125; /&gt;</p>
                <p className="pl-8 text-gold">&lt;/<span className="text-red-400">SandboxLiveProvider</span>&gt;</p>
                <p className="pl-4">);</p>
                <p>&#125;</p>
              </div>

              {/* Terminal Bottom Mock */}
              <div className="mt-auto border-t border-[rgba(201,168,76,0.12)] bg-[#070913] p-3 font-mono text-[11px]">
                <div className="flex items-center gap-2 text-text-muted mb-1">
                  <Terminal className="w-3.5 h-3.5 text-gold" />
                  <span>PTY TERMINAL (zsh)</span>
                </div>
                <p className="text-emerald-400">
                  forge-container:~$ vite v6.0 ready in 180 ms ➜ Network: http://localhost:5173/
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Feature Grid */}
      <section className="relative z-10 py-16 px-4 md:px-8 max-w-6xl mx-auto w-full">
        <div className="text-center mb-12">
          <h2 className="text-2xl sm:text-3xl font-bold font-serif text-white mb-3">
            Engineered for High-Velocity Software Creation
          </h2>
          <p className="text-text-muted text-sm  mx-auto">
            Everything you need to conceptualize, iterate, and run full-stack software 
            <br />
            directly in your browser.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
          {/* Card 1 */}
          <div className="p-6 rounded-2xl bg-[#0f1422]/80 border border-[rgba(201,168,76,0.15)] hover:border-gold/40 transition-all duration-300 group shadow-sm hover:shadow-[0_0_20px_rgba(201,168,76,0.1)]">
            <div className="w-10 h-10 rounded-xl bg-gold/10 border border-gold/30 flex items-center justify-center text-gold mb-4 group-hover:scale-105 transition-transform">
              <Zap className="w-5 h-5" />
            </div>
            <h3 className="text-base font-semibold text-white mb-2 font-sans">
              Instant Cloud Sandboxes
            </h3>
            <p className="text-xs text-text-muted leading-relaxed">
              Sub-second container provisioning with isolated environments and live hot-reloading iframe previews.
            </p>
          </div>

          {/* Card 2 */}
          <div className="p-6 rounded-2xl bg-[#0f1422]/80 border border-[rgba(201,168,76,0.15)] hover:border-gold/40 transition-all duration-300 group shadow-sm hover:shadow-[0_0_20px_rgba(201,168,76,0.1)]">
            <div className="w-10 h-10 rounded-xl bg-gold/10 border border-gold/30 flex items-center justify-center text-gold mb-4 group-hover:scale-105 transition-transform">
              <Cpu className="w-5 h-5" />
            </div>
            <h3 className="text-base font-semibold text-white mb-2 font-sans">
              Autonomous SSE Graph
            </h3>
            <p className="text-xs text-text-muted leading-relaxed">
              Real-time streaming reasoning and automated patch diffs streamed seamlessly over Server-Sent Events.
            </p>
          </div>

          {/* Card 3 */}
          <div className="p-6 rounded-2xl bg-[#0f1422]/80 border border-[rgba(201,168,76,0.15)] hover:border-gold/40 transition-all duration-300 group shadow-sm hover:shadow-[0_0_20px_rgba(201,168,76,0.1)]">
            <div className="w-10 h-10 rounded-xl bg-gold/10 border border-gold/30 flex items-center justify-center text-gold mb-4 group-hover:scale-105 transition-transform">
              <Code2 className="w-5 h-5" />
            </div>
            <h3 className="text-base font-semibold text-white mb-2 font-sans">
              Monaco Code Engine
            </h3>
            <p className="text-xs text-text-muted leading-relaxed">
              Full VS Code editor with tab caching, workspace directory tree, and instantaneous workspace persistence.
            </p>
          </div>

          {/* Card 4 */}
          <div className="p-6 rounded-2xl bg-[#0f1422]/80 border border-[rgba(201,168,76,0.15)] hover:border-gold/40 transition-all duration-300 group shadow-sm hover:shadow-[0_0_20px_rgba(201,168,76,0.1)]">
            <div className="w-10 h-10 rounded-xl bg-gold/10 border border-gold/30 flex items-center justify-center text-gold mb-4 group-hover:scale-105 transition-transform">
              <Terminal className="w-5 h-5" />
            </div>
            <h3 className="text-base font-semibold text-white mb-2 font-sans">
              Real PTY Shell
            </h3>
            <p className="text-xs text-text-muted leading-relaxed">
              Direct websocket-driven Linux shell terminal with full ANSI formatting, package installs, and process controls.
            </p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="mt-auto border-t border-[rgba(201,168,76,0.12)] bg-[#070913] py-8 px-4 md:px-8 text-center text-xs text-text-muted font-sans">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="font-serif font-bold text-sm text-gold">Forge AI</span>
            <span>— The Autonomous Developer Studio</span>
          </div>
          <div className="flex items-center gap-6">
            <Link to="/" className="hover:text-gold transition-colors">Home</Link>
            <Link to="/login" className="hover:text-gold transition-colors">Sign In</Link>
            <Link to="/register" className="hover:text-gold transition-colors">Register</Link>
          </div>
          <div>
            © {new Date().getFullYear()} Forge AI. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
};

export default HomePage;

