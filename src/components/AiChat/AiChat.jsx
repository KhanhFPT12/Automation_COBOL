import { useState, useRef, useEffect } from 'react'
import './AiChat.css'

const SYSTEM_PROMPT = `You are an AI assistant embedded in ALS (Application Legacy System) — a platform for migrating legacy COBOL/PL/I mainframe applications to modern Java.

You help users with:
- Understanding migration patterns (PERFORM, MOVE, CALL, EVALUATE, etc.)
- Interpreting reverse engineering results and failed patterns
- Explaining Java expressions generated from COBOL source
- Guidance on sprint planning and task management
- Configuration of Spring Boot, MyBatis, Oracle JDBC
- Build (Forge), validation (vAlid), and run pipeline questions

Be concise and practical. When referencing code, use code blocks. Respond in the same language as the user (Vietnamese or English).`

const SUGGESTIONS = [
  'PERFORM pattern là gì?',
  'Tại sao pattern bị Failed?',
  'Cách cấu hình kết nối Oracle?',
  'Spring Boot phiên bản nào phù hợp?',
]

export default function AiChat() {
  const [open, setOpen] = useState(false)
  const [messages, setMessages] = useState([
    {
      role: 'assistant',
      content: 'Xin chào! Tôi là AI assistant của **ALS**. Tôi có thể giúp bạn về migration patterns, cấu hình framework, hoặc bất kỳ câu hỏi nào về quá trình migrate legacy code sang Java.',
    },
  ])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const bottomRef = useRef(null)
  const inputRef = useRef(null)

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, loading])

  useEffect(() => {
    if (open) setTimeout(() => inputRef.current?.focus(), 100)
  }, [open])

  const apiKey = import.meta.env.VITE_ANTHROPIC_API_KEY

  const send = async (text) => {
    const content = (text || input).trim()
    if (!content || loading) return
    if (!apiKey) {
      setError('Chưa có API key. Thêm VITE_ANTHROPIC_API_KEY vào file .env rồi restart server.')
      return
    }

    setError('')
    const userMsg = { role: 'user', content }
    const nextMessages = [...messages, userMsg]
    setMessages(nextMessages)
    setInput('')
    setLoading(true)

    try {
      const res = await fetch('https://api.anthropic.com/v1/messages', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': apiKey,
          'anthropic-version': '2023-06-01',
          'anthropic-dangerous-direct-browser-access': 'true',
        },
        body: JSON.stringify({
          model: 'claude-haiku-4-5-20251001',
          max_tokens: 1024,
          system: SYSTEM_PROMPT,
          messages: nextMessages.map((m) => ({ role: m.role, content: m.content })),
        }),
      })

      if (!res.ok) {
        const err = await res.json()
        throw new Error(err.error?.message || `HTTP ${res.status}`)
      }

      const data = await res.json()
      setMessages((prev) => [
        ...prev,
        { role: 'assistant', content: data.content[0].text },
      ])
    } catch (e) {
      setError(`Lỗi: ${e.message}`)
    } finally {
      setLoading(false)
    }
  }

  const handleKey = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      send()
    }
  }

  const clearChat = () =>
    setMessages([
      { role: 'assistant', content: 'Cuộc trò chuyện mới bắt đầu. Tôi có thể giúp gì cho bạn?' },
    ])

  return (
    <>
      <button
        className={`chat-fab ${open ? 'fab-open' : ''}`}
        onClick={() => setOpen((o) => !o)}
        title="AI Assistant"
      >
        {open ? '✕' : '✦'}
      </button>

      {open && (
        <div className="chat-panel">
          <div className="chat-header">
            <div className="chat-header-left">
              <div className="chat-avatar-sm">✦</div>
              <div>
                <p className="chat-title">ALS AI Assistant</p>
                <p className="chat-status">
                  {loading ? 'Đang trả lời...' : apiKey ? 'Claude · Sẵn sàng' : '⚠ Chưa có API key'}
                </p>
              </div>
            </div>
            <div className="chat-header-actions">
              <button className="chat-icon-btn" onClick={clearChat} title="Xóa hội thoại">↺</button>
              <button className="chat-icon-btn" onClick={() => setOpen(false)}>✕</button>
            </div>
          </div>

          <div className="chat-messages">
            {messages.map((m, i) => (
              <div key={i} className={`chat-row ${m.role}`}>
                {m.role === 'assistant' && (
                  <div className="chat-avatar">✦</div>
                )}
                <div className="msg-bubble">
                  <SimpleMarkdown text={m.content} />
                </div>
              </div>
            ))}

            {loading && (
              <div className="chat-row assistant">
                <div className="chat-avatar">✦</div>
                <div className="msg-bubble typing-bubble">
                  <span /><span /><span />
                </div>
              </div>
            )}

            {error && (
              <div className="chat-error">{error}</div>
            )}

            {messages.length === 1 && !loading && (
              <div className="suggestions">
                {SUGGESTIONS.map((s) => (
                  <button key={s} className="suggestion-chip" onClick={() => send(s)}>
                    {s}
                  </button>
                ))}
              </div>
            )}

            <div ref={bottomRef} />
          </div>

          <div className="chat-footer">
            <div className="chat-input-wrap">
              <textarea
                ref={inputRef}
                className="chat-input"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKey}
                placeholder="Nhập câu hỏi... (Enter để gửi)"
                rows={1}
                disabled={loading}
              />
              <button
                className="send-btn"
                onClick={() => send()}
                disabled={loading || !input.trim()}
              >
                ➤
              </button>
            </div>
            <p className="chat-hint">Powered by Claude · Enter để gửi · Shift+Enter xuống dòng</p>
          </div>
        </div>
      )}
    </>
  )
}

function SimpleMarkdown({ text }) {
  const lines = text.split('\n')
  const elements = []
  let codeBlock = []
  let inCode = false

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i]
    if (line.startsWith('```')) {
      if (inCode) {
        elements.push(<pre key={i}><code>{codeBlock.join('\n')}</code></pre>)
        codeBlock = []
        inCode = false
      } else {
        inCode = true
      }
      continue
    }
    if (inCode) { codeBlock.push(line); continue }

    const parsed = line
      .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
      .replace(/`(.+?)`/g, '<code style="background:#f3f4f6;padding:1px 5px;border-radius:3px;font-size:12px">$1</code>')
      .replace(/\*(.+?)\*/g, '<em>$1</em>')

    if (line.startsWith('- ') || line.startsWith('• ')) {
      elements.push(<li key={i} dangerouslySetInnerHTML={{ __html: parsed.replace(/^[-•]\s/, '') }} />)
    } else if (line.startsWith('## ')) {
      elements.push(<h4 key={i} style={{ margin: '8px 0 4px', fontSize: 13, fontWeight: 700 }}>{line.slice(3)}</h4>)
    } else if (line === '') {
      elements.push(<br key={i} />)
    } else {
      elements.push(<p key={i} dangerouslySetInnerHTML={{ __html: parsed }} />)
    }
  }

  return <div className="md-content">{elements}</div>
}
