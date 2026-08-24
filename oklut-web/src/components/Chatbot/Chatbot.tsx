import { useState, useEffect, useRef, useCallback } from 'react'
import { useFocusTrap } from '../../lib/useFocusTrap'
import {
  WELCOME_MESSAGE,
  QUICK_ACTIONS,
  getChatResponse,
} from '../../lib/chatKnowledge'

type Message = {
  id: string
  role: 'user' | 'assistant'
  content: string
}

type View = 'closed' | 'open' | 'minimized'

let idCounter = 0
const nextId = (prefix: string) => `${prefix}-${++idCounter}`

export const Chatbot = () => {
  const [view, setView] = useState<View>('closed')
  const [messages, setMessages] = useState<Message[]>([
    { id: nextId('welcome'), role: 'assistant', content: WELCOME_MESSAGE },
  ])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)

  const panelRef = useRef<HTMLDivElement>(null)
  const messagesRef = useRef<HTMLDivElement>(null)
  const textareaRef = useRef<HTMLTextAreaElement>(null)
  const toggleRef = useRef<HTMLButtonElement>(null)

  useFocusTrap(panelRef, view === 'open', toggleRef)

  const hasConversation = messages.some((m) => m.role === 'user')

  const scrollToBottom = useCallback(() => {
    const el = messagesRef.current
    if (el) el.scrollTo({ top: el.scrollHeight })
  }, [])

  useEffect(() => {
    if (view === 'open') {
      scrollToBottom()
      const t = window.setTimeout(() => textareaRef.current?.focus(), 60)
      return () => window.clearTimeout(t)
    }
  }, [view, scrollToBottom])

  useEffect(() => {
    scrollToBottom()
  }, [messages, loading, scrollToBottom])

  useEffect(() => {
    if (view !== 'open') return
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setView('closed')
    }
    document.addEventListener('keydown', onKeyDown)
    return () => document.removeEventListener('keydown', onKeyDown)
  }, [view])

  const openChat = () => {
    setView('open')
  }

  const minimizeChat = () => {
    setView('minimized')
  }

  const closeChat = () => {
    setView('closed')
  }

  const expandChat = () => {
    setView('open')
  }

  const resetChat = () => {
    setMessages([{ id: nextId('welcome'), role: 'assistant', content: WELCOME_MESSAGE }])
    setInput('')
  }

  const appendMessage = (role: 'user' | 'assistant', content: string) => {
    setMessages((prev) => [...prev, { id: nextId(role), role, content }])
  }

  const sendMessage = useCallback(
    async (raw: string) => {
      const text = raw.trim()
      if (!text || loading) return

      appendMessage('user', text)
      setInput('')
      setLoading(true)

      try {
        const controller = new AbortController()
        const timer = window.setTimeout(() => controller.abort(), 12000)
        let res: Response
        try {
          res = await fetch('/api/chat', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ message: text }),
            signal: controller.signal,
          })
        } finally {
          window.clearTimeout(timer)
        }

        const data = await res.json().catch(() => null)
        if (!res.ok || !data || data.error) {
          throw new Error(data?.error || 'Request failed')
        }

        appendMessage('assistant', data.response)
      } catch {
        const local = await getChatResponse(text)
        appendMessage('assistant', local)
      } finally {
        setLoading(false)
      }
    },
    [loading],
  )

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    sendMessage(input)
  }

  const handleTextareaKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      sendMessage(input)
    }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInput(e.target.value)
    const el = e.target
    el.style.height = 'auto'
    el.style.height = `${Math.min(el.scrollHeight, 112)}px`
  }

  const canSend = input.trim().length > 0 && !loading

  return (
    <div className="chatbot-root">
      {view === 'closed' && (
        <>
          <span className="chatbot-label" aria-hidden="true">
            Chat with Oklut AI
          </span>
          <button
            ref={toggleRef}
            type="button"
            className="chatbot-toggle"
            onClick={openChat}
            aria-label="Open the Oklut AI Assistant chat"
            title="Chat with the Oklut AI Assistant"
          >
            <svg
              className="chatbot-toggle-icon"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z" />
              <path d="M12 11.5v.01" />
              <path d="M16 11.5v.01" />
              <path d="M8 11.5v.01" />
            </svg>
            <span className="chatbot-toggle-badge" aria-hidden="true">
              AI
            </span>
          </button>
        </>
      )}

      {view !== 'closed' && (
        <>
          <div
            ref={panelRef}
            className={`chatbot-panel${view === 'minimized' ? ' chatbot-panel-minimized' : ''}`}
            role={view === 'minimized' ? undefined : 'dialog'}
            aria-modal={view === 'minimized' ? undefined : 'true'}
            aria-labelledby={view === 'minimized' ? undefined : 'chatbot-title'}
          >
            <header className="chatbot-header">
              <div className="chatbot-header-brand">
                <img src="/img/logo.jpg" alt="" className="chatbot-header-logo" />
                <div className="chatbot-header-text">
                  <h2 id="chatbot-title">Oklut AI Assistant</h2>
                  <span className="chatbot-status">
                    <span className="chatbot-status-dot" aria-hidden="true" />
                    Online
                  </span>
                </div>
              </div>

              <div className="chatbot-header-actions">
                {view === 'minimized' ? (
                  <button
                    type="button"
                    className="chatbot-header-btn"
                    onClick={expandChat}
                    aria-label="Expand the chatbot"
                    title="Expand"
                  >
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                      <path d="M18 15l-6-6-6 6" />
                    </svg>
                  </button>
                ) : (
                  <button
                    type="button"
                    className="chatbot-header-btn"
                    onClick={minimizeChat}
                    aria-label="Minimize the chatbot"
                    title="Minimize"
                  >
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                      <path d="M6 9l6 6 6-6" />
                    </svg>
                  </button>
                )}
                <button
                  type="button"
                  className="chatbot-header-btn"
                  onClick={closeChat}
                  aria-label="Close the chatbot"
                  title="Close"
                >
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                    <path d="M18 6L6 18M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </header>

            {view === 'open' && (
              <>
                <div className="chatbot-messages" ref={messagesRef} aria-live="polite">
                  {messages.map((msg) => (
                    <div
                      key={msg.id}
                      className={`chatbot-message ${msg.role === 'user' ? 'chatbot-message-user' : 'chatbot-message-assistant'}`}
                    >
                      {msg.role === 'assistant' && (
                        <span className="chatbot-avatar" aria-hidden="true">
                          <img src="/img/logo.jpg" alt="" />
                        </span>
                      )}
                      <p className="chatbot-message-content">{msg.content}</p>
                    </div>
                  ))}

                  {loading && (
                    <div className="chatbot-message chatbot-message-assistant" aria-label="Oklut AI is typing">
                      <span className="chatbot-avatar" aria-hidden="true">
                        <img src="/img/logo.jpg" alt="" />
                      </span>
                      <span className="typing-indicator">
                        <span className="dot" />
                        <span className="dot" />
                        <span className="dot" />
                      </span>
                    </div>
                  )}
                </div>

                {!hasConversation && (
                  <div className="chatbot-quick-actions">
                    <p className="chatbot-quick-title">Popular topics</p>
                    <div className="chatbot-quick-list">
                      {QUICK_ACTIONS.map((action) => (
                        <button
                          key={action.value}
                          type="button"
                          className="chatbot-quick-btn"
                          onClick={() => sendMessage(action.value)}
                        >
                          {action.label}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                <form className="chatbot-input-area" onSubmit={handleSubmit}>
                  <div className="chatbot-input-box">
                    <textarea
                      ref={textareaRef}
                      value={input}
                      onChange={handleInputChange}
                      onKeyDown={handleTextareaKeyDown}
                      placeholder="Ask me about Oklut..."
                      maxLength={500}
                      rows={1}
                      autoComplete="off"
                      aria-label="Message the Oklut AI Assistant"
                      className="chatbot-input"
                    />
                    <button
                      type="submit"
                      className="chatbot-send"
                      disabled={!canSend}
                      aria-label="Send message"
                      title="Send message"
                    >
                      <svg className="chatbot-send-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                        <path d="M22 2L1 12" />
                        <path d="M2 22L22 12" />
                        <path d="M22 2L15 22l-3-7-7-3z" />
                      </svg>
                    </button>
                  </div>
                  <div className="chatbot-input-foot">
                    <span>Enter to send · Shift+Enter for a new line</span>
                    {hasConversation && (
                      <button type="button" className="chatbot-reset" onClick={resetChat}>
                        New chat
                      </button>
                    )}
                  </div>
                </form>
              </>
            )}
          </div>

          <div className="chatbot-overlay" onClick={closeChat} aria-hidden="true" />
        </>
      )}
    </div>
  )
}
