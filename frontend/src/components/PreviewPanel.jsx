import { motion } from 'framer-motion'

/* ── Dummy HTML for preview ── */
const PREVIEW_HTML = `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8"/>
<meta name="viewport" content="width=device-width, initial-scale=1.0"/>
<title>My Portfolio</title>
<link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&family=Playfair+Display:wght@400;600;700&display=swap" rel="stylesheet"/>
<style>
  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
  :root {
    --gold: #c9a84c;
    --bg: #0a0e1a;
    --surface: #141928;
    --text: #e8e8f0;
    --muted: #7a7a90;
  }
  html { scroll-behavior: smooth; }
  body {
    font-family: 'Inter', sans-serif;
    background: var(--bg);
    color: var(--text);
    min-height: 100vh;
    overflow-x: hidden;
  }

  /* Nav */
  nav {
    position: fixed; top: 0; left: 0; right: 0;
    display: flex; align-items: center; justify-content: space-between;
    padding: 16px 40px;
    background: rgba(10, 14, 26, 0.85);
    backdrop-filter: blur(20px);
    border-bottom: 1px solid rgba(201, 168, 76, 0.1);
    z-index: 100;
  }
  .nav-logo {
    font-family: 'Playfair Display', serif;
    font-size: 20px; font-weight: 700;
    color: var(--gold);
    letter-spacing: -0.02em;
  }
  .nav-links { display: flex; gap: 32px; }
  .nav-links a {
    text-decoration: none; color: var(--muted);
    font-size: 13px; font-weight: 500;
    transition: color 0.2s;
  }
  .nav-links a:hover { color: var(--text); }
  .nav-cta {
    padding: 8px 20px;
    border: 1px solid rgba(201, 168, 76, 0.4);
    border-radius: 6px;
    background: transparent;
    color: var(--gold);
    font-size: 12px; font-weight: 600;
    cursor: pointer;
    font-family: 'Inter', sans-serif;
    transition: all 0.2s;
  }
  .nav-cta:hover { background: rgba(201, 168, 76, 0.1); }

  /* Hero */
  .hero {
    min-height: 100vh;
    display: flex; flex-direction: column;
    align-items: center; justify-content: center;
    text-align: center;
    padding: 100px 40px 60px;
    position: relative;
    overflow: hidden;
  }
  .hero::before {
    content: '';
    position: absolute;
    top: -200px; left: 50%; transform: translateX(-50%);
    width: 600px; height: 600px;
    background: radial-gradient(ellipse at center, rgba(201, 168, 76, 0.06) 0%, transparent 70%);
    pointer-events: none;
  }
  .hero-badge {
    display: inline-flex; align-items: center; gap: 6px;
    padding: 5px 14px;
    border: 1px solid rgba(201, 168, 76, 0.3);
    border-radius: 20px;
    background: rgba(201, 168, 76, 0.05);
    font-size: 11px; font-weight: 600;
    color: var(--gold);
    letter-spacing: 0.06em;
    text-transform: uppercase;
    margin-bottom: 28px;
  }
  .hero-badge::before {
    content: '';
    width: 5px; height: 5px;
    border-radius: 50%;
    background: var(--gold);
    animation: pulse 2s ease-in-out infinite;
  }
  @keyframes pulse {
    0%, 100% { opacity: 1; transform: scale(1); }
    50% { opacity: 0.5; transform: scale(0.8); }
  }
  h1 {
    font-family: 'Playfair Display', serif;
    font-size: clamp(42px, 6vw, 72px);
    font-weight: 700;
    line-height: 1.1;
    letter-spacing: -0.03em;
    margin-bottom: 20px;
  }
  .gradient-text {
    background: linear-gradient(135deg, #e8e8f0 0%, #c9a84c 40%, #e8c06a 60%, #e8e8f0 100%);
    background-clip: text; -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-size: 200% 200%;
    animation: gradientShift 4s ease-in-out infinite;
  }
  @keyframes gradientShift {
    0%, 100% { background-position: 0% 50%; }
    50% { background-position: 100% 50%; }
  }
  .hero-sub {
    font-size: 16px; color: var(--muted); line-height: 1.7;
    max-width: 520px; margin: 0 auto 36px;
  }
  .hero-actions { display: flex; gap: 12px; justify-content: center; }
  .btn-primary {
    padding: 12px 28px;
    background: var(--gold);
    color: #0a0e1a;
    border: none; border-radius: 8px;
    font-size: 13px; font-weight: 700;
    cursor: pointer;
    font-family: 'Inter', sans-serif;
    transition: all 0.25s;
    letter-spacing: 0.02em;
  }
  .btn-primary:hover { transform: translateY(-2px); box-shadow: 0 8px 24px rgba(201, 168, 76, 0.3); }
  .btn-ghost {
    padding: 12px 28px;
    background: transparent;
    color: var(--text);
    border: 1px solid rgba(232, 232, 240, 0.15);
    border-radius: 8px;
    font-size: 13px; font-weight: 500;
    cursor: pointer;
    font-family: 'Inter', sans-serif;
    transition: all 0.25s;
  }
  .btn-ghost:hover { border-color: rgba(232, 232, 240, 0.3); background: rgba(232, 232, 240, 0.04); }

  /* Stats */
  .stats {
    display: flex; gap: 48px; margin-top: 60px;
    justify-content: center;
  }
  .stat { text-align: center; }
  .stat-number {
    font-family: 'Playfair Display', serif;
    font-size: 32px; font-weight: 700;
    color: var(--gold);
    line-height: 1;
  }
  .stat-label {
    font-size: 11px; color: var(--muted);
    margin-top: 4px; font-weight: 500;
    letter-spacing: 0.06em; text-transform: uppercase;
  }

  /* Work */
  .section {
    padding: 80px 40px;
    max-width: 1100px; margin: 0 auto;
  }
  .section-label {
    font-size: 11px; font-weight: 700;
    letter-spacing: 0.1em; text-transform: uppercase;
    color: var(--gold); margin-bottom: 8px;
  }
  .section-title {
    font-family: 'Playfair Display', serif;
    font-size: 36px; font-weight: 700;
    letter-spacing: -0.02em;
    margin-bottom: 40px;
    color: var(--text);
  }
  .grid {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 20px;
  }
  .card {
    background: var(--surface);
    border: 1px solid rgba(201, 168, 76, 0.1);
    border-radius: 12px;
    overflow: hidden;
    transition: all 0.3s;
    cursor: pointer;
  }
  .card:hover {
    transform: translateY(-4px);
    border-color: rgba(201, 168, 76, 0.25);
    box-shadow: 0 12px 32px rgba(0,0,0,0.4), 0 0 0 1px rgba(201,168,76,0.1);
  }
  .card-img {
    height: 160px;
    background: linear-gradient(135deg, #1a2035, #0d1722);
    display: flex; align-items: center; justify-content: center;
    font-size: 40px;
    position: relative; overflow: hidden;
  }
  .card-img::after {
    content: ''; position: absolute; inset: 0;
    background: linear-gradient(to bottom, transparent 60%, rgba(20, 25, 40, 0.8));
  }
  .card-body { padding: 16px; }
  .card-tag {
    font-size: 9px; font-weight: 700;
    letter-spacing: 0.1em; text-transform: uppercase;
    color: var(--gold); margin-bottom: 6px;
  }
  .card-title {
    font-size: 14px; font-weight: 600;
    color: var(--text); margin-bottom: 6px;
  }
  .card-desc {
    font-size: 12px; color: var(--muted); line-height: 1.6;
  }

  /* Footer */
  footer {
    text-align: center; padding: 40px;
    border-top: 1px solid rgba(201, 168, 76, 0.08);
    color: var(--muted); font-size: 12px;
  }
  footer span { color: var(--gold); }
</style>
</head>
<body>
<nav>
  <div class="nav-logo">Horizon</div>
  <div class="nav-links">
    <a href="#work">Work</a>
    <a href="#about">About</a>
    <a href="#contact">Contact</a>
  </div>
  <button class="nav-cta">Hire Me</button>
</nav>

<section class="hero">
  <div class="hero-badge">Available for work</div>
  <h1>
    <span class="gradient-text">Crafting Digital</span><br/>
    <span>Experiences</span>
  </h1>
  <p class="hero-sub">
    I design and build premium web experiences that combine elegant aesthetics with powerful engineering.
  </p>
  <div class="hero-actions">
    <button class="btn-primary">View Work</button>
    <button class="btn-ghost">Get in Touch</button>
  </div>
  <div class="stats">
    <div class="stat">
      <div class="stat-number">48+</div>
      <div class="stat-label">Projects</div>
    </div>
    <div class="stat">
      <div class="stat-number">6yr</div>
      <div class="stat-label">Experience</div>
    </div>
    <div class="stat">
      <div class="stat-number">32+</div>
      <div class="stat-label">Clients</div>
    </div>
  </div>
</section>

<div id="work" class="section">
  <div class="section-label">Selected Work</div>
  <div class="section-title">Recent Projects</div>
  <div class="grid">
    <div class="card">
      <div class="card-img">🏛️</div>
      <div class="card-body">
        <div class="card-tag">E-Commerce</div>
        <div class="card-title">Maison Luxury Store</div>
        <div class="card-desc">Premium fashion e-commerce with AR try-on and personalization engine.</div>
      </div>
    </div>
    <div class="card">
      <div class="card-img">📊</div>
      <div class="card-body">
        <div class="card-tag">SaaS Dashboard</div>
        <div class="card-title">Atlas Analytics</div>
        <div class="card-desc">Real-time data visualization platform with custom chart library.</div>
      </div>
    </div>
    <div class="card">
      <div class="card-img">🎨</div>
      <div class="card-body">
        <div class="card-tag">Creative Agency</div>
        <div class="card-title">Monolith Studio</div>
        <div class="card-desc">Award-winning agency website with immersive scroll animations.</div>
      </div>
    </div>
  </div>
</div>

<footer>
  Built with <span>♥</span> by Horizon · 2026
</footer>
</body>
</html>`

/**
 * PreviewPanel — Live website preview in an iframe
 */
const PreviewPanel = () => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.4, ease: [0.4, 0, 0.2, 1] }}
      style={{
        width: '100%',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden',
        position: 'relative',
      }}
    >
      {/* Browser chrome */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: '8px',
        padding: '8px 14px',
        background: 'var(--bg-surface)',
        borderBottom: '1px solid var(--border-subtle)',
        flexShrink: 0,
      }}>
        {/* Traffic lights */}
        <div style={{ display: 'flex', gap: '5px' }}>
          {['#c43d3d', '#c9a84c', '#3d8f5e'].map((color, i) => (
            <div key={i} style={{
              width: '8px', height: '8px',
              borderRadius: '50%',
              background: color,
              opacity: 0.7,
            }} />
          ))}
        </div>

        {/* URL bar */}
        <div style={{
          flex: 1,
          display: 'flex',
          alignItems: 'center',
          gap: '6px',
          padding: '4px 10px',
          background: 'var(--bg-elevated)',
          border: '1px solid var(--border-subtle)',
          borderRadius: '5px',
        }}>
          <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="var(--text-muted)" strokeWidth="2">
            <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
            <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
          </svg>
          <span style={{ fontSize: '11px', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>
            localhost:5173/preview
          </span>
        </div>

        {/* Refresh */}
        <button style={{
          width: '24px', height: '24px',
          background: 'transparent', border: 'none',
          color: 'var(--text-muted)', cursor: 'pointer',
          borderRadius: '4px', display: 'flex',
          alignItems: 'center', justifyContent: 'center',
        }}>
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <polyline points="23 4 23 10 17 10"/>
            <path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10"/>
          </svg>
        </button>
      </div>

      {/* iframe */}
      <iframe
        srcDoc={PREVIEW_HTML}
        title="Live Preview"
        style={{
          flex: 1,
          width: '100%',
          border: 'none',
          background: '#0a0e1a',
        }}
        sandbox="allow-scripts allow-same-origin"
        id="preview-iframe"
      />
    </motion.div>
  )
}

export default PreviewPanel
