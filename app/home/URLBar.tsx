import { useState, useRef, useEffect } from 'react'
import { SendHorizontal } from "lucide-react";

type Props = {
  method: string
  url: string
  baseUrl?: string
  loading: boolean
  onMethodChange: (value: string) => void
  onUrlChange: (value: string) => void
  onSend: () => void
}

export default function URLBar({ method, url, baseUrl, loading, onMethodChange, onUrlChange, onSend }: Props) {
  const methods = ['GET', 'POST', 'PUT', 'DELETE', 'HEAD'] as const
  const [open, setOpen] = useState(false)
  const btnRef = useRef<HTMLButtonElement | null>(null)
  const menuRef = useRef<HTMLUListElement | null>(null)

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (!open) return
      const target = e.target as Node | null
      if (btnRef.current?.contains(target)) return
      if (menuRef.current?.contains(target)) return
      setOpen(false)
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [open])

  const methodColors = {
    GET: 'bg-green-500 text-white',
    POST: 'bg-blue-500 text-white',
    PUT: 'bg-orange-500 text-white',
    DELETE: 'bg-red-500 text-white',
    HEAD: 'bg-purple-500 text-white',
  }

  return (
      <div className="rounded-2xl bg-white/80 backdrop-blur border border-gray-200 p-3 relative z-10">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center">

          {/* Top row (mobile): Method + Send */}
          <div className="flex items-center gap-2 sm:gap-3">
            <div className="relative">
              <button
                  ref={btnRef}
                  onClick={() => setOpen(v => !v)}
                  className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 rounded-lg text-sm font-medium focus:ring-2 focus:ring-blue-500"
              >
                <span className={`w-2.5 h-2.5 rounded-full ${methodColors[method as keyof typeof methodColors]?.split(' ')[0] || 'bg-gray-400'}`} />
                {method}
                <svg className={`w-4 h-4 transition-transform ${open ? 'rotate-180' : ''}`} viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>

              {open && (
                  <ul
                      ref={menuRef}
                      className="absolute left-0 mt-2 w-44 bg-white border border-gray-200 rounded-xl shadow-xl z-50 overflow-hidden"
                  >
                    {methods.map((m) => (
                        <li key={m}>
                          <button
                              onClick={() => { onMethodChange(m); setOpen(false) }}
                              className={`w-full px-4 py-3 text-left text-sm flex items-center gap-3 hover:bg-gray-50 ${
                                  m === method ? 'bg-blue-50 text-blue-700' : ''
                              }`}
                          >
                            <span className={`w-2.5 h-2.5 rounded-full ${methodColors[m]?.split(' ')[0]}`} />
                            {m}
                          </button>
                        </li>
                    ))}
                  </ul>
              )}
            </div>

            <button
                onClick={onSend}
                disabled={loading}
                className="ml-auto sm:hidden inline-flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg font-semibold disabled:opacity-50"
            >
              <SendHorizontal className={`w-4 h-4 ${loading ? 'animate-pulse' : ''}`} />
            </button>
          </div>

          {/* URL Input */}
          <div className="flex-1 flex items-center gap-2 bg-white border border-gray-300 rounded-lg px-3 py-2">
            <div className={`px-2 py-1 text-xs font-semibold rounded ${methodColors[method as keyof typeof methodColors] || 'bg-gray-400 text-white'}`}>
              {method}
            </div>

            {baseUrl && (
                <span className="hidden sm:inline px-2 py-1 text-xs text-gray-500 bg-gray-100 rounded">
              {baseUrl}
            </span>
            )}

            <input
                value={url}
                onChange={(e) => onUrlChange(e.target.value)}
                placeholder={baseUrl ? '/users' : 'https://api.example.com'}
                className="flex-1 bg-transparent text-sm outline-none"
            />
          </div>

          {/* Desktop Send Button */}
          <button
              onClick={onSend}
              disabled={loading}
              className="hidden sm:inline-flex items-center gap-2 px-5 py-2 bg-primary text-white rounded-lg font-semibold disabled:opacity-50"
          >
            <SendHorizontal className={`w-4 h-4 ${loading ? 'animate-pulse' : ''}`} />
            {loading ? 'Sending' : 'Send'}
          </button>
        </div>
      </div>
  )
}
