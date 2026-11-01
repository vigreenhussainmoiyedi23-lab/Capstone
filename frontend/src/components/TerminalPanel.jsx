import { useEffect, useRef } from 'react'
import { motion } from 'framer-motion'
import { Terminal as XTerm } from '@xterm/xterm'
import { FitAddon } from '@xterm/addon-fit'
import { WebLinksAddon } from '@xterm/addon-web-links'

/* ── Dummy terminal session script ── */
const TERMINAL_SESSION = [
  { delay: 300,  text: '\x1b[90m# Forge AI — Terminal\x1b[0m' },
  { delay: 600,  text: '\x1b[38;5;220m❯\x1b[0m npm install' },
  { delay: 1000, text: '\x1b[32m✓\x1b[0m Resolved 291 packages' },
  { delay: 1200, text: '\x1b[32m✓\x1b[0m Added 147 packages in 26s' },
  { delay: 1500, text: '' },
  { delay: 1700, text: '\x1b[38;5;220m❯\x1b[0m npm run dev' },
  { delay: 2000, text: '' },
  { delay: 2200, text: '  \x1b[38;5;220m▲\x1b[0m \x1b[1mVite\x1b[0m \x1b[38;5;220mv8.3.5\x1b[0m' },
  { delay: 2400, text: '' },
  { delay: 2600, text: '  \x1b[32m➜\x1b[0m  \x1b[1mLocal\x1b[0m:   \x1b[36mhttp://localhost:5173/\x1b[0m' },
  { delay: 2800, text: '  \x1b[32m➜\x1b[0m  \x1b[1mNetwork\x1b[0m: \x1b[36mhttp://192.168.1.5:5173/\x1b[0m' },
  { delay: 3000, text: '' },
  { delay: 3200, text: '\x1b[90m  ready in 312ms\x1b[0m' },
  { delay: 3500, text: '' },
  { delay: 3700, text: '\x1b[38;5;220m❯\x1b[0m git status' },
  { delay: 4000, text: 'On branch \x1b[32mmain\x1b[0m' },
  { delay: 4200, text: 'Your branch is up to date with \x1b[36morigin/main\x1b[0m.' },
  { delay: 4400, text: '' },
  { delay: 4600, text: 'Changes to be committed:' },
  { delay: 4800, text: '  \x1b[32mnew file:   src/components/PreviewPanel.jsx\x1b[0m' },
  { delay: 5000, text: '  \x1b[32mnew file:   src/components/ChatPanel.jsx\x1b[0m' },
  { delay: 5200, text: '  \x1b[32mnew file:   src/components/TerminalPanel.jsx\x1b[0m' },
  { delay: 5400, text: '' },
]

/**
 * TerminalPanel — XTerm.js powered interactive terminal
 */
const TerminalPanel = () => {
  const containerRef = useRef(null)
  const termRef = useRef(null)
  const fitAddonRef = useRef(null)
  const inputBufferRef = useRef('')

  useEffect(() => {
    if (!containerRef.current || termRef.current) return

    const term = new XTerm({
      theme: {
        background:    '#0a0e1a',
        foreground:    '#c9c9d8',
        cursor:        '#c9a84c',
        cursorAccent:  '#0a0e1a',
        selectionBackground: 'rgba(201, 168, 76, 0.2)',
        black:         '#1a2035',
        red:           '#c43d3d',
        green:         '#3d8f5e',
        yellow:        '#c9a84c',
        blue:          '#4d79c9',
        magenta:       '#9d5cbf',
        cyan:          '#3d9faf',
        white:         '#c9c9d8',
        brightBlack:   '#4a4a60',
        brightRed:     '#e07070',
        brightGreen:   '#70bf8f',
        brightYellow:  '#e0c06a',
        brightBlue:    '#7a9fe0',
        brightMagenta: '#c07ad4',
        brightCyan:    '#6acfe0',
        brightWhite:   '#e8e8f0',
      },
      fontFamily: "'JetBrains Mono', 'Consolas', monospace",
      fontSize:   13,
      lineHeight: 1.6,
      cursorBlink: true,
      cursorStyle: 'bar',
      scrollback: 1000,
      convertEol: true,
      allowTransparency: true,
    })

    const fitAddon = new FitAddon()
    const webLinksAddon = new WebLinksAddon()

    term.loadAddon(fitAddon)
    term.loadAddon(webLinksAddon)
    term.open(containerRef.current)
    fitAddon.fit()

    termRef.current = term
    fitAddonRef.current = fitAddon

    /* ── Welcome banner ── */
    term.writeln('\x1b[38;5;220m┌─────────────────────────────────────────┐\x1b[0m')
    term.writeln('\x1b[38;5;220m│\x1b[0m  \x1b[1mForge AI Studio\x1b[0m — Interactive Terminal  \x1b[38;5;220m│\x1b[0m')
    term.writeln('\x1b[38;5;220m└─────────────────────────────────────────┘\x1b[0m')
    term.writeln('')

    /* ── Play dummy session ── */
    TERMINAL_SESSION.forEach(({ delay, text }) => {
      setTimeout(() => {
        term.writeln(text)
        fitAddon.fit()
      }, delay)
    })

    /* ── Interactive prompt after session ── */
    setTimeout(() => {
      term.writeln('')
      writePrompt(term)

      term.onData((data) => {
        const code = data.charCodeAt(0)

        if (code === 13) {
          // Enter
          term.writeln('')
          const cmd = inputBufferRef.current.trim()
          if (cmd) {
            handleCommand(term, cmd)
          }
          inputBufferRef.current = ''
          writePrompt(term)
        } else if (code === 127) {
          // Backspace
          if (inputBufferRef.current.length > 0) {
            inputBufferRef.current = inputBufferRef.current.slice(0, -1)
            term.write('\b \b')
          }
        } else if (code >= 32) {
          // Printable char
          inputBufferRef.current += data
          term.write(data)
        }
      })
    }, 6000)

    /* ── Resize observer ── */
    const ro = new ResizeObserver(() => fitAddon.fit())
    ro.observe(containerRef.current)

    return () => {
      ro.disconnect()
      term.dispose()
      termRef.current = null
    }
  }, [])

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
      style={{
        width: '100%',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden',
      }}
    >
      {/* Terminal toolbar */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: '10px',
        padding: '8px 14px',
        background: 'var(--bg-surface)',
        borderBottom: '1px solid var(--border-subtle)',
        flexShrink: 0,
      }}>
        {/* Traffic lights */}
        <div style={{ display: 'flex', gap: '5px' }}>
          {['#c43d3d', '#c9a84c', '#3d8f5e'].map((c, i) => (
            <div key={i} style={{ width: '8px', height: '8px', borderRadius: '50%', background: c, opacity: 0.7 }} />
          ))}
        </div>

        {/* Tab label */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '6px',
          padding: '3px 10px',
          background: 'var(--bg-elevated)',
          border: '1px solid var(--border-subtle)',
          borderRadius: '4px',
          cursor: 'pointer',
        }}>
          <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="var(--gold)" strokeWidth="2">
            <polyline points="4 17 10 11 4 5"/>
            <line x1="12" y1="19" x2="20" y2="19"/>
          </svg>
          <span style={{ fontSize: '11px', color: 'var(--text-secondary)', fontFamily: 'var(--font-mono)' }}>
            zsh — forge
          </span>
        </div>

        <div style={{ flex: 1 }} />

        {/* Clear button */}
        <button
          onClick={() => termRef.current?.clear()}
          style={{
            padding: '3px 9px',
            background: 'transparent',
            border: '1px solid var(--border-subtle)',
            borderRadius: '4px',
            color: 'var(--text-muted)',
            fontSize: '10px',
            cursor: 'pointer',
            fontFamily: 'var(--font-sans)',
          }}
          id="clear-terminal-btn"
        >
          Clear
        </button>
      </div>

      {/* XTerm container */}
      <div
        ref={containerRef}
        style={{
          flex: 1,
          overflow: 'hidden',
          padding: '4px',
        }}
      />
    </motion.div>
  )
}

/* ── Helpers ── */
function writePrompt(term) {
  term.write('\x1b[38;5;220m❯\x1b[0m ')
}

function handleCommand(term, cmd) {
  const lower = cmd.toLowerCase()

  if (lower === 'clear' || lower === 'cls') {
    term.clear()
  } else if (lower === 'help') {
    term.writeln('\x1b[38;5;220mAvailable commands:\x1b[0m')
    term.writeln('  \x1b[36mhelp\x1b[0m       — Show this help')
    term.writeln('  \x1b[36mclear\x1b[0m      — Clear terminal')
    term.writeln('  \x1b[36mls\x1b[0m         — List files')
    term.writeln('  \x1b[36mdate\x1b[0m       — Show current date')
    term.writeln('  \x1b[36mnpm run dev\x1b[0m — Start dev server')
  } else if (lower === 'ls' || lower === 'ls -la') {
    term.writeln('\x1b[36msrc/\x1b[0m')
    term.writeln('  \x1b[36mcomponents/\x1b[0m')
    term.writeln('    ChatPanel.jsx')
    term.writeln('    CodePanel.jsx')
    term.writeln('    Navbar.jsx')
    term.writeln('    PreviewPanel.jsx')
    term.writeln('    RightPanel.jsx')
    term.writeln('    TerminalPanel.jsx')
    term.writeln('  App.jsx')
    term.writeln('  index.css')
    term.writeln('  main.jsx')
    term.writeln('package.json')
    term.writeln('vite.config.js')
  } else if (lower === 'date') {
    term.writeln(new Date().toString())
  } else if (lower === 'npm run dev') {
    term.writeln('\x1b[32m✓\x1b[0m Starting dev server...')
    term.writeln('  \x1b[38;5;220m▲\x1b[0m \x1b[1mVite v8.3.5\x1b[0m')
    term.writeln('  \x1b[32m➜\x1b[0m  \x1b[1mLocal\x1b[0m: \x1b[36mhttp://localhost:5173/\x1b[0m')
  } else {
    term.writeln(`\x1b[31mcommand not found:\x1b[0m ${cmd}`)
    term.writeln('\x1b[90mType "help" to see available commands\x1b[0m')
  }
}

export default TerminalPanel
