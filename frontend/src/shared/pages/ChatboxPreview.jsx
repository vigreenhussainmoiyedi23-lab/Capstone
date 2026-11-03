import { useState, useCallback, useEffect } from 'react'
import { motion } from 'framer-motion'
import Navbar from '../components/Navbar'
import ChatPanel from '../../features/ai/components/ChatPanel'

import RightPanel from "../../features/sandbox/components/RightPanel";
/**
 * App — Root layout for Forge AI Studio
 *
 * Layout:
 *   ┌────────────────────────────────────────────┐
 *   │              Navbar (52px)                 │
 *   ├───────────┬────────────────────────────────┤
 *   │           │                        │ Files │
 *   │ ChatPanel │       RightPanel       │  Panel│
 *   │  (~15%)   │ Preview / Code         │ (~15%)|
 *   │           │         (~70% width)   |(like vs code)│
 *   │           │   (height ~85%-52px)   │       │
     │           │─────────────────────── │       │
     │           │terminal (height ~15%)  │       │
     └───────────┴────────────────────────┴───────┘

*/  
const MIN_CHAT_WIDTH  = 240   // px
const MAX_CHAT_WIDTH  = 480   // px
const DEFAULT_CHAT_PX = 320   // px (~20% at 1440px)

const ChatboxPreview = () => {
  const [theme, setTheme]       = useState('dark')
  const [chatWidth, setChatWidth] = useState(DEFAULT_CHAT_PX)
  const [isDragging, setIsDragging] = useState(false)

  /* ── Apply theme to document ── */
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme)
  }, [theme])

  const toggleTheme = useCallback(() => {
    setTheme(t => t === 'dark' ? 'light' : 'dark')
  }, [])

  /* ── Resize handle drag logic ── */
  const handleMouseDown = useCallback((e) => {
    e.preventDefault()
    setIsDragging(true)

    const startX     = e.clientX
    const startWidth = chatWidth

    const onMove = (moveEvent) => {
      const delta   = moveEvent.clientX - startX
      const newWidth = Math.min(MAX_CHAT_WIDTH, Math.max(MIN_CHAT_WIDTH, startWidth + delta))
      setChatWidth(newWidth)
    }

    const onUp = () => {
      setIsDragging(false)
      window.removeEventListener('mousemove', onMove)
      window.removeEventListener('mouseup', onUp)
    }

    window.addEventListener('mousemove', onMove)
    window.addEventListener('mouseup', onUp)
  }, [chatWidth])

  return (
    <div
      data-theme={theme}
      style={{
        width: '100vw',
        height: '100dvh',
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden',
        background: 'var(--bg-base)',
        color: 'var(--text-primary)',
        fontFamily: 'var(--font-sans)',
        userSelect: isDragging ? 'none' : 'auto',
        cursor: isDragging ? 'col-resize' : 'auto',
      }}
    >
      {/* ── Top navigation bar ── */}
      <Navbar theme={theme} onToggleTheme={toggleTheme} />

      {/* ── Main content area ── */}
      <div style={{
        flex: 1,
        display: 'flex',
        overflow: 'hidden',
        minHeight: 0,
      }}>
        {/* ── Left: Chat panel (resizable) ── */}
        <motion.div
          style={{
            width: chatWidth,
            minWidth: chatWidth,
            maxWidth: chatWidth,
            height: '100%',
            overflow: 'hidden',
            flexShrink: 0,
          }}
          animate={{ width: chatWidth }}
          transition={{ duration: isDragging ? 0 : 0.1 }}
        >
          <ChatPanel />
        </motion.div>

        {/* ── Resize handle ── */}
        <div
          className="resize-handle"
          onMouseDown={handleMouseDown}
          title="Drag to resize"
          style={{
            cursor: 'col-resize',
            width: '4px',
            background: isDragging ? 'var(--border-accent)' : 'var(--border-subtle)',
            flexShrink: 0,
            transition: 'background 0.15s ease',
            position: 'relative',
            zIndex: 10,
          }}
        >
          {/* Visual grip dots */}
          <div style={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            display: 'flex',
            flexDirection: 'column',
            gap: '3px',
            opacity: isDragging ? 1 : 0.4,
            transition: 'opacity 0.2s',
          }}>
            {[0,1,2].map(i => (
              <div key={i} style={{
                width: '3px',
                height: '3px',
                borderRadius: '50%',
                background: 'var(--gold)',
              }} />
            ))}
          </div>
        </div>

        {/* ── Right: Preview / Code / Terminal (fills remaining space) ── */}
        <div style={{ flex: 1, height: '100%', minWidth: 0, overflow: 'hidden' }}>
          <RightPanel theme={theme} />
        </div>
      </div>
    </div>
  )
}

export default ChatboxPreview