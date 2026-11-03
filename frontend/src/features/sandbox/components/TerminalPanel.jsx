import { useEffect, useRef, useState } from 'react'
import { motion } from 'framer-motion'
import { Terminal as XTerm } from '@xterm/xterm'
import { FitAddon } from '@xterm/addon-fit'
import { WebLinksAddon } from '@xterm/addon-web-links'
import { useSelector } from 'react-redux'
import { io } from 'socket.io-client'

/* ── Fallback simulated session when agent server is not yet connected ── */
const DUMMY_WELCOME = [
  '\x1b[38;5;220m┌─────────────────────────────────────────┐\x1b[0m',
  '\x1b[38;5;220m│\x1b[0m  \x1b[1mForge AI Studio\x1b[0m — Interactive Terminal  \x1b[38;5;220m│\x1b[0m',
  '\x1b[38;5;220m└─────────────────────────────────────────┘\x1b[0m',
  '',
]

/**
 * TerminalPanel — Real-time PTY terminal connected via Socket.io to the agent sandbox,
 * with fallback to local interactive shell.
 */
const TerminalPanel = () => {
  const containerRef = useRef(null)
  const termRef = useRef(null)
  const fitAddonRef = useRef(null)
  const socketRef = useRef(null)
  const inputBufferRef = useRef('')
  const [isConnected, setIsConnected] = useState(false)

  const sandbox = useSelector((state) => state.sandbox)
  const agentUrl = sandbox?.agentUrl

  useEffect(() => {
    if (!containerRef.current || termRef.current) return

    const term = new XTerm({
      theme: {
        background: '#0a0e1a',
        foreground: '#c9c9d8',
        cursor: '#c9a84c',
        cursorAccent: '#0a0e1a',
        selectionBackground: 'rgba(201, 168, 76, 0.2)',
        black: '#1a2035',
        red: '#c43d3d',
        green: '#3d8f5e',
        yellow: '#c9a84c',
        blue: '#4d79c9',
        magenta: '#9d5cbf',
        cyan: '#3d9faf',
        white: '#c9c9d8',
        brightBlack: '#4a4a60',
        brightRed: '#e07070',
        brightGreen: '#70bf8f',
        brightYellow: '#e0c06a',
        brightBlue: '#7a9fe0',
        brightMagenta: '#c07ad4',
        brightCyan: '#6acfe0',
        brightWhite: '#e8e8f0',
      },
      fontFamily: "'JetBrains Mono', 'Consolas', monospace",
      fontSize: 13,
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

    // Display banner
    DUMMY_WELCOME.forEach((line) => term.writeln(line))

    let socket = null

    if (agentUrl) {
      term.writeln(`\x1b[90mConnecting to sandbox terminal at ${agentUrl}…\x1b[0m`)
      try {
        socket = io(agentUrl, {
          transports: ['websocket', 'polling'],
          timeout: 10000,
        })
        socketRef.current = socket

        socket.on('connect', () => {
          setIsConnected(true)
          term.writeln('\x1b[32m✓ Connected to real sandbox PTY (bash)\x1b[0m\r\n')
          // Send initial size
          const dims = fitAddon.proposeDimensions()
          if (dims) {
            socket.emit('terminal-resize', { cols: dims.cols, rows: dims.rows })
          }
        })

        socket.on('terminal-output', (data) => {
          term.write(data)
        })

        socket.on('disconnect', () => {
          setIsConnected(false)
          term.writeln('\r\n\x1b[33m! Disconnected from sandbox terminal\x1b[0m')
        })

        socket.on('connect_error', () => {
          setIsConnected(false)
        })

        // Forward user keystrokes to real PTY
        const dataDisposable = term.onData((data) => {
          if (socket && socket.connected) {
            socket.emit('terminal-input', data)
          }
        })

        const resizeDisposable = term.onResize(({ cols, rows }) => {
          if (socket && socket.connected) {
            socket.emit('terminal-resize', { cols, rows })
          }
        })

        return () => {
          dataDisposable.dispose()
          resizeDisposable.dispose()
          if (socket) {
            socket.disconnect()
            socketRef.current = null
          }
        }
      } catch (err) {
        console.error('Socket init error:', err)
      }
    }

    // Local fallback shell if no socket / socket not connected
    term.writeln('\x1b[90mSandbox ready. Enter commands below:\x1b[0m\r\n')
    term.write('\x1b[38;5;220m❯\x1b[0m ')

    const fallbackDataDisposable = term.onData((data) => {
      if (socketRef.current && socketRef.current.connected) return

      const code = data.charCodeAt(0)
      if (code === 13) {
        term.writeln('')
        const cmd = inputBufferRef.current.trim()
        if (cmd) {
          if (cmd.toLowerCase() === 'clear' || cmd.toLowerCase() === 'cls') {
            term.clear()
          } else if (cmd === 'help') {
            term.writeln('\x1b[36mAvailable commands:\x1b[0m help, clear, ls, date')
          } else if (cmd === 'ls') {
            term.writeln('\x1b[36msrc/ package.json vite.config.js README.md\x1b[0m')
          } else if (cmd === 'date') {
            term.writeln(new Date().toString())
          } else {
            term.writeln(`\x1b[90mExecuted:\x1b[0m ${cmd}`)
          }
        }
        inputBufferRef.current = ''
        term.write('\x1b[38;5;220m❯\x1b[0m ')
      } else if (code === 127) {
        if (inputBufferRef.current.length > 0) {
          inputBufferRef.current = inputBufferRef.current.slice(0, -1)
          term.write('\b \b')
        }
      } else if (code >= 32) {
        inputBufferRef.current += data
        term.write(data)
      }
    })

    const ro = new ResizeObserver(() => fitAddon.fit())
    ro.observe(containerRef.current)

    return () => {
      fallbackDataDisposable.dispose()
      ro.disconnect()
      if (socketRef.current) {
        socketRef.current.disconnect()
        socketRef.current = null
      }
      term.dispose()
      termRef.current = null
    }
  }, [agentUrl])

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
        background: '#0a0e1a',
      }}
    >
      {/* Terminal Toolbar */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '10px',
          padding: '8px 14px',
          background: 'var(--bg-surface)',
          borderBottom: '1px solid var(--border-subtle)',
          flexShrink: 0,
        }}
      >
        {/* Traffic lights */}
        <div style={{ display: 'flex', gap: '5px' }}>
          {['#c43d3d', '#c9a84c', '#3d8f5e'].map((c, i) => (
            <div
              key={i}
              style={{
                width: '8px',
                height: '8px',
                borderRadius: '50%',
                background: c,
                opacity: 0.7,
              }}
            />
          ))}
        </div>

        {/* Status label */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            padding: '3px 10px',
            background: 'var(--bg-elevated)',
            border: '1px solid var(--border-subtle)',
            borderRadius: '4px',
          }}
        >
          <span
            style={{
              width: '5px',
              height: '5px',
              borderRadius: '50%',
              background: isConnected ? '#3d8f5e' : 'var(--gold)',
              boxShadow: isConnected ? '0 0 6px #3d8f5e' : '0 0 6px var(--gold)',
            }}
          />
          <span
            style={{
              fontSize: '11px',
              color: 'var(--text-secondary)',
              fontFamily: 'var(--font-mono)',
            }}
          >
            {isConnected ? 'bash (live sandbox)' : 'bash (ready)'}
          </span>
        </div>

        <div style={{ flex: 1 }} />

        {/* Clear Button */}
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

      {/* XTerm Container */}
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

export default TerminalPanel
