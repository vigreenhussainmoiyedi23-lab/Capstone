import { useState } from 'react'
import { motion } from 'framer-motion'
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter'

/* ── Dummy source code to display ── */
const DUMMY_CODE = {
  'index.html': {
    language: 'html',
    code: `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8"/>
  <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
  <title>Horizon — Portfolio</title>
  <link rel="stylesheet" href="styles.css"/>
</head>
<body>
  <nav class="navbar">
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
      <span class="gradient-text">Crafting Digital</span>
      Experiences
    </h1>
    <p class="hero-sub">
      I design and build premium web experiences that combine
      elegant aesthetics with powerful engineering.
    </p>
    <div class="hero-actions">
      <button class="btn-primary">View Work</button>
      <button class="btn-ghost">Get in Touch</button>
    </div>
  </section>

  <section id="work" class="section">
    <div class="section-label">Selected Work</div>
    <h2 class="section-title">Recent Projects</h2>
    <div class="grid">
      <!-- Project cards -->
    </div>
  </section>

  <footer>
    Built with ♥ by Horizon · 2026
  </footer>

  <script src="app.js"></script>
</body>
</html>`,
  },
  'styles.css': {
    language: 'css',
    code: `:root {
  --gold:    #c9a84c;
  --bg:      #0a0e1a;
  --surface: #141928;
  --text:    #e8e8f0;
  --muted:   #7a7a90;
}

* {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}

body {
  font-family: 'Inter', sans-serif;
  background: var(--bg);
  color: var(--text);
  min-height: 100vh;
}

/* ── Navigation ── */
.navbar {
  position: fixed;
  top: 0; left: 0; right: 0;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 16px 40px;
  background: rgba(10, 14, 26, 0.85);
  backdrop-filter: blur(20px);
  border-bottom: 1px solid rgba(201, 168, 76, 0.1);
  z-index: 100;
}

.nav-logo {
  font-family: 'Playfair Display', serif;
  font-size: 20px;
  font-weight: 700;
  color: var(--gold);
}

/* ── Hero ── */
.hero {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
  padding: 100px 40px 60px;
}

.gradient-text {
  background: linear-gradient(
    135deg,
    #e8e8f0 0%,
    #c9a84c 40%,
    #e8c06a 100%
  );
  background-clip: text;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}

/* ── Buttons ── */
.btn-primary {
  padding: 12px 28px;
  background: var(--gold);
  color: #0a0e1a;
  border: none;
  border-radius: 8px;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.25s;
}

.btn-primary:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 24px rgba(201, 168, 76, 0.3);
}`,
  },
  'app.js': {
    language: 'javascript',
    code: `// ── Forge AI — Generated Portfolio JS ──

// Smooth scroll behavior
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', (e) => {
    e.preventDefault();
    const target = document.querySelector(anchor.getAttribute('href'));
    if (target) {
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  });
});

// Intersection Observer for card animations
const observer = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.style.opacity = '1';
        entry.target.style.transform = 'translateY(0)';
      }
    });
  },
  { threshold: 0.1 }
);

document.querySelectorAll('.card').forEach((card) => {
  card.style.opacity = '0';
  card.style.transform = 'translateY(20px)';
  card.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
  observer.observe(card);
});

// Hero badge pulse
const badge = document.querySelector('.hero-badge');
if (badge) {
  setInterval(() => {
    badge.style.boxShadow =
      badge.style.boxShadow
        ? ''
        : '0 0 20px rgba(201, 168, 76, 0.3)';
  }, 2000);
}

console.log('✨ Forge AI — Portfolio loaded');`,
  },
}

/* ── Dark theme for syntax highlighter ── */
const FORGE_THEME = {
  'code[class*="language-"]': {
    color: '#c9c9d8',
    fontFamily: "'JetBrains Mono', 'Consolas', monospace",
    fontSize: '13px',
    lineHeight: '1.65',
    background: 'transparent',
  },
  comment: { color: '#4a4a60', fontStyle: 'italic' },
  prolog: { color: '#4a4a60' },
  doctype: { color: '#4a4a60' },
  cdata: { color: '#4a4a60' },
  punctuation: { color: '#7a7a90' },
  property: { color: '#c9a84c' },
  tag: { color: '#c9a84c' },
  boolean: { color: '#e07070' },
  number: { color: '#b5cea8' },
  constant: { color: '#c9a84c' },
  symbol: { color: '#c9a84c' },
  selector: { color: '#9a9aff' },
  'attr-name': { color: '#9cdcfe' },
  string: { color: '#89d185' },
  char: { color: '#89d185' },
  builtin: { color: '#89d185' },
  operator: { color: '#d4d4d4' },
  entity: { color: '#c9a84c', cursor: 'help' },
  url: { color: '#d4d4d4' },
  'attr-value': { color: '#89d185' },
  keyword: { color: '#569cd6' },
  regex: { color: '#d16969' },
  important: { color: '#569cd6', fontWeight: 'bold' },
  bold: { fontWeight: 'bold' },
  italic: { fontStyle: 'italic' },
  'class-name': { color: '#4ec9b0' },
  function: { color: '#dcdcaa' },
  variable: { color: '#9cdcfe' },
}

const LIGHT_FORGE_THEME = {
  'code[class*="language-"]': {
    color: '#24292e',
    fontFamily: "'JetBrains Mono', 'Consolas', monospace",
    fontSize: '13px',
    lineHeight: '1.65',
    background: 'transparent',
  },
  comment: { color: '#6a737d', fontStyle: 'italic' },
  punctuation: { color: '#586069' },
  property: { color: '#9a7620' },
  tag: { color: '#9a7620' },
  keyword: { color: '#005cc5' },
  string: { color: '#22863a' },
  number: { color: '#005cc5' },
  function: { color: '#6f42c1' },
  'class-name': { color: '#6f42c1' },
  'attr-name': { color: '#005cc5' },
  'attr-value': { color: '#22863a' },
  operator: { color: '#24292e' },
  boolean: { color: '#005cc5' },
  constant: { color: '#9a7620' },
  selector: { color: '#22863a' },
  variable: { color: '#e36209' },
}

/**
 * CodePanel — Syntax-highlighted source code viewer
 */
const CodePanel = ({ theme }) => {
  const [activeFile, setActiveFile] = useState('index.html')
  const currentFile = DUMMY_CODE[activeFile]

  return (
    <div style={{
      width: '100%',
      height: '100%',
      display: 'flex',
      flexDirection: 'column',
      overflow: 'hidden',
    }}>
      {/* File tabs */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        padding: '0 16px',
        gap: '2px',
        background: 'var(--bg-surface)',
        borderBottom: '1px solid var(--border-subtle)',
        flexShrink: 0,
        overflowX: 'auto',
      }}>
        {Object.keys(DUMMY_CODE).map((file) => (
          <motion.button
            key={file}
            onClick={() => setActiveFile(file)}
            whileHover={{ backgroundColor: 'var(--bg-elevated)' }}
            style={{
              padding: '9px 14px',
              background: activeFile === file ? 'var(--bg-elevated)' : 'transparent',
              border: 'none',
              borderBottom: `2px solid ${activeFile === file ? 'var(--gold)' : 'transparent'}`,
              color: activeFile === file ? 'var(--text-primary)' : 'var(--text-muted)',
              fontSize: '11.5px',
              fontWeight: activeFile === file ? 600 : 400,
              cursor: 'pointer',
              fontFamily: 'var(--font-mono)',
              transition: 'all 0.15s ease',
              whiteSpace: 'nowrap',
              borderRadius: '4px 4px 0 0',
              marginBottom: '-1px',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
            }}
          >
            {/* File icon */}
            <span style={{ fontSize: '10px' }}>
              {file.endsWith('.html') ? '📄' : file.endsWith('.css') ? '🎨' : '⚡'}
            </span>
            {file}
          </motion.button>
        ))}

        <div style={{ flex: 1 }} />

        {/* Copy button */}
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => navigator.clipboard?.writeText(currentFile.code)}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '5px',
            padding: '5px 10px',
            background: 'transparent',
            border: '1px solid var(--border-subtle)',
            borderRadius: '5px',
            color: 'var(--text-muted)',
            fontSize: '10px',
            fontWeight: 500,
            cursor: 'pointer',
            fontFamily: 'var(--font-sans)',
            marginLeft: '8px',
            flexShrink: 0,
          }}
        >
          <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <rect x="9" y="9" width="13" height="13" rx="2" ry="2"/>
            <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/>
          </svg>
          Copy
        </motion.button>
      </div>

      {/* Line numbers + code */}
      <div style={{ flex: 1, overflow: 'auto', background: 'var(--bg-base)' }}>
        <SyntaxHighlighter
          language={currentFile.language}
          style={theme === 'dark' ? FORGE_THEME : LIGHT_FORGE_THEME}
          showLineNumbers
          lineNumberStyle={{
            color: 'var(--text-muted)',
            fontSize: '11px',
            userSelect: 'none',
            paddingRight: '16px',
            minWidth: '40px',
            textAlign: 'right',
            opacity: 0.5,
          }}
          customStyle={{
            margin: 0,
            padding: '16px 0',
            background: 'transparent',
            fontSize: '13px',
            lineHeight: '1.65',
            fontFamily: "'JetBrains Mono', 'Consolas', monospace",
            minHeight: '100%',
          }}
          wrapLongLines={false}
          id="code-viewer"
        >
          {currentFile.code}
        </SyntaxHighlighter>
      </div>

      {/* Status bar */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: '16px',
        padding: '4px 16px',
        background: 'var(--bg-surface)',
        borderTop: '1px solid var(--border-subtle)',
        flexShrink: 0,
      }}>
        <span style={{ fontSize: '10px', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>
          {currentFile.language.toUpperCase()}
        </span>
        <span style={{ fontSize: '10px', color: 'var(--text-muted)' }}>
          {currentFile.code.split('\n').length} lines
        </span>
        <div style={{ flex: 1 }} />
        <span style={{ fontSize: '10px', color: 'var(--gold)' }}>
          ✓ Forge AI Generated
        </span>
      </div>
    </div>
  )
}

export default CodePanel
