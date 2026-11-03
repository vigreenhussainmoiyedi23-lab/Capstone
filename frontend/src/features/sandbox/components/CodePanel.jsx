import { useState, useEffect, useCallback } from 'react'
import { motion } from 'framer-motion'
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter'
import { useSelector } from 'react-redux'
import { FileCode, RefreshCw, Copy, Check } from 'lucide-react'
import { listWorkspaceFiles, readWorkspaceFiles } from '../services/sandbox.api'

/* ── Fallback code files when workspace is offline ── */
const DEFAULT_CODE = {
  'src/App.jsx': {
    language: 'jsx',
    code: `import React from 'react';\n\nexport default function App() {\n  return (\n    <div className="min-h-screen bg-slate-900 text-white flex items-center justify-center">\n      <h1 className="text-3xl font-bold">Forge AI Workspace</h1>\n    </div>\n  );\n}`,
  },
  'package.json': {
    language: 'json',
    code: `{\n  "name": "sandbox-app",\n  "private": true,\n  "version": "1.0.0",\n  "scripts": {\n    "dev": "vite",\n    "build": "vite build"\n  }\n}`,
  },
}

const getLanguageFromFile = (filename = '') => {
  if (filename.endsWith('.jsx')) return 'jsx'
  if (filename.endsWith('.js') || filename.endsWith('.mjs')) return 'javascript'
  if (filename.endsWith('.tsx')) return 'tsx'
  if (filename.endsWith('.ts')) return 'typescript'
  if (filename.endsWith('.html')) return 'html'
  if (filename.endsWith('.css')) return 'css'
  if (filename.endsWith('.json')) return 'json'
  if (filename.endsWith('.md')) return 'markdown'
  return 'text'
}

/**
 * Dark theme for syntax highlighter
 */
const FORGE_THEME = {
  'code[class*="language-"]': {
    color: '#c9c9d8',
    fontFamily: "'JetBrains Mono', 'Consolas', monospace",
    fontSize: '13px',
    lineHeight: '1.65',
    background: 'transparent',
  },
  comment: { color: '#4a4a60', fontStyle: 'italic' },
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
  keyword: { color: '#569cd6' },
  function: { color: '#dcdcaa' },
  variable: { color: '#9cdcfe' },
}

/**
 * CodePanel — Displays real files from agent /workspace via agentUrl
 */
const CodePanel = ({ theme = 'dark' }) => {
  const sandbox = useSelector((state) => state.sandbox)
  const agentUrl = sandbox?.agentUrl

  const [filesMap, setFilesMap] = useState(DEFAULT_CODE)
  const [activeFile, setActiveFile] = useState('src/App.jsx')
  const [copied, setCopied] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  const fetchFiles = useCallback(async () => {
    if (!agentUrl) return
    setIsLoading(true)
    try {
      const { files } = await listWorkspaceFiles(agentUrl)
      if (Array.isArray(files) && files.length > 0) {
        // Fetch contents for first few files
        const filesToFetch = files.slice(0, 10)
        const contentsList = await readWorkspaceFiles(agentUrl, filesToFetch)

        const newMap = {}
        contentsList.forEach((item) => {
          const [fullPath, content] = Object.entries(item)[0]
          // Strip /workspace/
          const relativeName = fullPath.replace('/workspace/', '').replace('/workspace', '')
          newMap[relativeName] = {
            language: getLanguageFromFile(relativeName),
            code: content,
          }
        })

        if (Object.keys(newMap).length > 0) {
          setFilesMap(newMap)
          if (!newMap[activeFile]) {
            setActiveFile(Object.keys(newMap)[0])
          }
        }
      }
    } catch (err) {
      console.error('Error fetching workspace files:', err)
    } finally {
      setIsLoading(false)
    }
  }, [agentUrl, activeFile])

  useEffect(() => {
    fetchFiles()
  }, [fetchFiles])

  const fileKeys = Object.keys(filesMap)
  const currentFile = filesMap[activeFile] || { language: 'text', code: '// File empty or loading...' }

  const handleCopy = () => {
    navigator.clipboard?.writeText(currentFile.code)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div
      style={{
        width: '100%',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden',
        background: 'var(--bg-base)',
      }}
    >
      {/* File Tabs */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          padding: '0 12px',
          gap: '2px',
          background: 'var(--bg-surface)',
          borderBottom: '1px solid var(--border-subtle)',
          flexShrink: 0,
          overflowX: 'auto',
        }}
      >
        {fileKeys.map((file) => {
          const isActive = activeFile === file
          return (
            <button
              key={file}
              onClick={() => setActiveFile(file)}
              type="button"
              style={{
                padding: '8px 12px',
                background: isActive ? 'var(--bg-elevated)' : 'transparent',
                border: 'none',
                borderBottom: `2px solid ${isActive ? 'var(--gold)' : 'transparent'}`,
                color: isActive ? 'var(--text-primary)' : 'var(--text-muted)',
                fontSize: '11px',
                fontWeight: isActive ? 600 : 400,
                cursor: 'pointer',
                fontFamily: 'var(--font-mono)',
                whiteSpace: 'nowrap',
                display: 'flex',
                alignItems: 'center',
                gap: '5px',
              }}
            >
              <FileCode size={11} style={{ color: isActive ? 'var(--gold)' : 'var(--text-muted)' }} />
              {file}
            </button>
          )
        })}

        <div style={{ flex: 1 }} />

        {/* Refresh Files Button */}
        {agentUrl && (
          <button
            onClick={fetchFiles}
            type="button"
            disabled={isLoading}
            style={{
              padding: '4px 8px',
              background: 'transparent',
              border: 'none',
              color: 'var(--text-muted)',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '4px',
              fontSize: '10px',
            }}
            title="Refresh workspace files"
          >
            <RefreshCw size={11} style={{ animation: isLoading ? 'spin 1s linear infinite' : 'none' }} />
          </button>
        )}

        {/* Copy Button */}
        <button
          onClick={handleCopy}
          type="button"
          style={{
            padding: '4px 8px',
            background: 'transparent',
            border: 'none',
            color: copied ? 'var(--gold)' : 'var(--text-muted)',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '4px',
            fontSize: '10px',
          }}
          title="Copy file content"
        >
          {copied ? <Check size={11} /> : <Copy size={11} />}
          {copied ? 'Copied' : 'Copy'}
        </button>
      </div>

      {/* Code Viewer */}
      <div style={{ flex: 1, overflow: 'auto', background: 'var(--bg-base)' }}>
        <SyntaxHighlighter
          language={currentFile.language}
          style={FORGE_THEME}
          showLineNumbers
          lineNumberStyle={{
            color: 'var(--text-muted)',
            fontSize: '11px',
            userSelect: 'none',
            paddingRight: '16px',
            minWidth: '36px',
            textAlign: 'right',
            opacity: 0.5,
          }}
          customStyle={{
            margin: 0,
            padding: '16px 0',
            background: 'transparent',
            fontSize: '12.5px',
            lineHeight: '1.65',
            fontFamily: "'JetBrains Mono', 'Consolas', monospace",
            minHeight: '100%',
          }}
          wrapLongLines={false}
        >
          {currentFile.code}
        </SyntaxHighlighter>
      </div>

      {/* Footer Info */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '12px',
          padding: '4px 14px',
          background: 'var(--bg-surface)',
          borderTop: '1px solid var(--border-subtle)',
          flexShrink: 0,
          fontSize: '10px',
          color: 'var(--text-muted)',
          fontFamily: 'var(--font-mono)',
        }}
      >
        <span>{currentFile.language.toUpperCase()}</span>
        <span>{currentFile.code.split('\n').length} lines</span>
        <div style={{ flex: 1 }} />
        <span style={{ color: agentUrl ? '#3d8f5e' : 'var(--gold)' }}>
          {agentUrl ? '● Connected to /workspace' : 'Local Workspace'}
        </span>
      </div>
    </div>
  )
}

export default CodePanel
