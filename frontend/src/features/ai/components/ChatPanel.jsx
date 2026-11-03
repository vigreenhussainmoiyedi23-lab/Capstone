import { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useSelector } from 'react-redux'

/* ── Dummy AI conversation data ── */
const INITIAL_MESSAGES = [
  {
    id: 1,
    role: 'assistant',
    content: "Welcome to **Forge**. I'm your AI co-pilot for building exceptional websites.\n\nDescribe what you want to build and I'll generate it for you in real time.",
    timestamp: '09:41',
  },
  {
    id: 2,
    role: 'user',
    content: 'Build me a luxury portfolio website with a dark hero section, animated text, and a gold accent color scheme.',
    timestamp: '09:42',
  },
  {
    id: 3,
    role: 'assistant',
    content: "Perfect — a dark luxury portfolio. I've generated:\n\n• Hero section with animated gradient text\n• Gold accent color system (`#C9A84C`)\n• Smooth scroll sections\n• Mobile-responsive layout\n\nCheck the **Preview** tab to see it live.",
    timestamp: '09:43',
  },
]

/* ── Simple markdown bold renderer ── */
const renderContent = (text) => {
  const parts = text.split(/(\*\*[^*]+\*\*|`[^`]+`)/)
  return parts.map((part, i) => {
    if (part.startsWith('**') && part.endsWith('**')) {
      return <strong key={i} style={{ color: 'var(--text-primary)', fontWeight: 600 }}>{part.slice(2, -2)}</strong>
    }
    if (part.startsWith('`') && part.endsWith('`')) {
      return <code key={i} style={{
        fontFamily: 'var(--font-mono)',
        fontSize: '11px',
        background: 'var(--gold-glow)',
        color: 'var(--gold)',
        padding: '1px 5px',
        borderRadius: '3px',
        border: '1px solid var(--border-subtle)',
      }}>{part.slice(1, -1)}</code>
    }
    return part.split('\n').map((line, j, arr) => (
      <span key={`${i}-${j}`}>
        {line}
        {j < arr.length - 1 && <br />}
      </span>
    ))
  })
}

/* ── Typing indicator ── */
const TypingIndicator = () => (
  <div style={{ display: 'flex', gap: '4px', alignItems: 'center', padding: '4px 0' }}>
    {[0, 1, 2].map(i => (
      <motion.div
        key={i}
        style={{
          width: '5px',
          height: '5px',
          borderRadius: '50%',
          background: 'var(--gold)',
        }}
        animate={{ opacity: [0.3, 1, 0.3], y: [0, -4, 0] }}
        transition={{ duration: 1, delay: i * 0.2, repeat: Infinity, ease: 'easeInOut' }}
      />
    ))}
  </div>
)

/**
 * ChatPanel — Left AI chat sidebar
 */
const ChatPanel = () => {
  const {messages:Messages} = useSelector((state)=>state.ai.messages)
  const [messages, setMessages] = useState(Messages)
  const [input, setInput] = useState('')
  const [isTyping, setIsTyping] = useState(false)
  const bottomRef = useRef(null)
  const textareaRef = useRef(null)
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, isTyping])

  const handleSend = () => {
    const text = input.trim()
    if (!text) return
    const now = new Date()
    const time = `${now.getHours().toString().padStart(2,'0')}:${now.getMinutes().toString().padStart(2,'0')}`

    setMessages(prev => [...prev, { id: Date.now(), role: 'user', content: text, timestamp: time }])
    setInput('')
    setIsTyping(true)

    // Simulate AI response
    setTimeout(() => {
      setIsTyping(false)
      setMessages(prev => [...prev, {
        id: Date.now() + 1,
        role: 'assistant',
        content: "I'm processing your request and updating the preview. You can see the changes in the **Preview** tab on the right.",
        timestamp: time,
      }])
    }, 1800)
  }

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      height: '100%',
      overflow: 'hidden',
      background: 'var(--bg-panel)',
      borderRight: '1px solid var(--border-default)',
    }}>
      {/* Header */}
      <div style={{
        padding: '14px 16px',
        borderBottom: '1px solid var(--border-subtle)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexShrink: 0,
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <div style={{
            width: '28px',
            height: '28px',
            borderRadius: '8px',
            background: 'var(--gold-glow)',
            border: '1px solid var(--border-accent)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="var(--gold)" strokeWidth="2">
              <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
            </svg>
          </div>
          <div>
            <div style={{ fontSize: '12px', fontWeight: 600, color: 'var(--text-primary)', lineHeight: 1 }}>AI Assistant</div>
            <div style={{ fontSize: '10px', color: '#3d8f5e', marginTop: '2px' }}>● Online</div>
          </div>
        </div>
        <button
          style={{
            width: '24px',
            height: '24px',
            borderRadius: '6px',
            background: 'transparent',
            border: '1px solid var(--border-subtle)',
            color: 'var(--text-muted)',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
          title="New conversation"
          id="new-chat-btn"
        >
          <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <line x1="12" y1="5" x2="12" y2="19"/>
            <line x1="5" y1="12" x2="19" y2="12"/>
          </svg>
        </button>
      </div>

      {/* Messages list */}
      <div style={{
        flex: 1,
        overflowY: 'auto',
        padding: '12px',
        display: 'flex',
        flexDirection: 'column',
        gap: '10px',
      }}>
        <AnimatePresence initial={false}>
          {messages.map((msg) => (
            <motion.div
              key={msg.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.25, ease: [0.4, 0, 0.2, 1] }}
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: msg.role === 'user' ? 'flex-end' : 'flex-start',
              }}
            >
              {/* Role label */}
              <div style={{
                fontSize: '9px',
                fontWeight: 700,
                letterSpacing: '0.1em',
                textTransform: 'uppercase',
                color: 'var(--text-muted)',
                marginBottom: '4px',
                paddingLeft: msg.role === 'user' ? 0 : '4px',
                paddingRight: msg.role === 'user' ? '4px' : 0,
              }}>
                {msg.role === 'user' ? 'You' : 'Forge AI'}
              </div>

              {/* Bubble */}
              <div style={{
                maxWidth: '90%',
                padding: '9px 12px',
                borderRadius: msg.role === 'user' ? '12px 4px 12px 12px' : '4px 12px 12px 12px',
                background: msg.role === 'user' ? 'var(--chat-user-bg)' : 'var(--chat-ai-bg)',
                border: `1px solid ${msg.role === 'user' ? 'var(--border-accent)' : 'var(--border-default)'}`,
                fontSize: '12.5px',
                lineHeight: '1.65',
                color: 'var(--text-secondary)',
                boxShadow: msg.role === 'user' ? '0 0 12px rgba(201, 168, 76, 0.06)' : 'none',
              }}>
                {renderContent(msg.content)}
              </div>

              {/* Timestamp */}
              <div style={{
                fontSize: '9px',
                color: 'var(--text-muted)',
                marginTop: '3px',
                paddingLeft: msg.role === 'user' ? 0 : '4px',
                paddingRight: msg.role === 'user' ? '4px' : 0,
              }}>
                {msg.timestamp}
              </div>
            </motion.div>
          ))}

          {isTyping && (
            <motion.div
              key="typing"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              style={{
                padding: '10px 12px',
                borderRadius: '4px 12px 12px 12px',
                background: 'var(--chat-ai-bg)',
                border: '1px solid var(--border-default)',
                alignSelf: 'flex-start',
                width: 'fit-content',
              }}
            >
              <TypingIndicator />
            </motion.div>
          )}
        </AnimatePresence>
        <div ref={bottomRef} />
      </div>

      {/* Suggestion chips */}
      <div style={{
        padding: '8px 12px 4px',
        display: 'flex',
        gap: '6px',
        flexWrap: 'wrap',
        borderTop: '1px solid var(--border-subtle)',
        flexShrink: 0,
      }}>
        {['Add animations', 'Dark mode', 'Mobile layout'].map((chip) => (
          <motion.button
            key={chip}
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            onClick={() => setInput(chip)}
            style={{
              padding: '4px 9px',
              borderRadius: '20px',
              border: '1px solid var(--border-default)',
              background: 'transparent',
              color: 'var(--text-muted)',
              fontSize: '10px',
              fontWeight: 500,
              cursor: 'pointer',
              transition: 'all 0.15s ease',
              fontFamily: 'var(--font-sans)',
            }}
            onMouseEnter={e => {
              e.currentTarget.style.borderColor = 'var(--border-accent)'
              e.currentTarget.style.color = 'var(--gold)'
            }}
            onMouseLeave={e => {
              e.currentTarget.style.borderColor = 'var(--border-default)'
              e.currentTarget.style.color = 'var(--text-muted)'
            }}
          >
            {chip}
          </motion.button>
        ))}
      </div>

      {/* Input area */}
      <div style={{
        padding: '10px 12px 12px',
        flexShrink: 0,
      }}>
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '8px',
          background: 'var(--bg-surface)',
          border: '1px solid var(--border-default)',
          borderRadius: '10px',
          padding: '10px 12px',
          transition: 'border-color 0.2s ease',
        }}
          onFocusCapture={e => {
            e.currentTarget.style.borderColor = 'var(--border-accent)'
            e.currentTarget.style.boxShadow = '0 0 0 1px rgba(201, 168, 76, 0.1)'
          }}
          onBlurCapture={e => {
            e.currentTarget.style.borderColor = 'var(--border-default)'
            e.currentTarget.style.boxShadow = 'none'
          }}
        >
          <textarea
            ref={textareaRef}
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Describe what to build…"
            rows={2}
            style={{
              background: 'transparent',
              border: 'none',
              outline: 'none',
              resize: 'none',
              color: 'var(--text-primary)',
              fontSize: '12.5px',
              lineHeight: '1.6',
              fontFamily: 'var(--font-sans)',
              width: '100%',
            }}
            id="chat-input"
          />
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div style={{ display: 'flex', gap: '6px' }}>
              <button
                style={{
                  padding: '3px',
                  background: 'transparent',
                  border: 'none',
                  color: 'var(--text-muted)',
                  cursor: 'pointer',
                }}
                title="Attach file"
              >
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M21.44 11.05l-9.19 9.19a6 6 0 0 1-8.49-8.49l9.19-9.19a4 4 0 0 1 5.66 5.66l-9.2 9.19a2 2 0 0 1-2.83-2.83l8.49-8.48"/>
                </svg>
              </button>
            </div>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleSend}
              disabled={!input.trim()}
              style={{
                width: '28px',
                height: '28px',
                borderRadius: '8px',
                background: input.trim() ? 'var(--gold)' : 'var(--bg-elevated)',
                border: 'none',
                cursor: input.trim() ? 'pointer' : 'not-allowed',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                transition: 'all 0.2s ease',
                flexShrink: 0,
              }}
              id="send-btn"
            >
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke={input.trim() ? '#0a0e1a' : 'var(--text-muted)'} strokeWidth="2.5">
                <line x1="22" y1="2" x2="11" y2="13"/>
                <polygon points="22 2 15 22 11 13 2 9 22 2"/>
              </svg>
            </motion.button>
          </div>
        </div>
        <div style={{
          marginTop: '6px',
          textAlign: 'center',
          fontSize: '9px',
          color: 'var(--text-muted)',
          letterSpacing: '0.02em',
        }}>
          Press Enter to send · Shift+Enter for new line
        </div>
      </div>
    </div>
  )
}

export default ChatPanel
