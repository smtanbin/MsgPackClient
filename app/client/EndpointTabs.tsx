'use client'

import { useState, useRef, useEffect } from 'react'
import { Trash2 } from 'lucide-react'

type Endpoint = { name: string }

type Props = {
  endpoints: Endpoint[]
  activeIdx: number
  onSelect: (index: number) => void
  onAdd: () => void
  onRename: (index: number, name: string) => void
  onRemove: (index: number) => void
}

export default function EndpointTabs({ endpoints, activeIdx, onSelect, onAdd, onRename, onRemove }: Props) {
  const [editingIdx, setEditingIdx] = useState<number | null>(null)
  const [draftName, setDraftName] = useState<string>('')
  const tabsRef = useRef<Array<HTMLButtonElement | null>>([])

  const startEdit = (idx: number, current: string) => {
    setEditingIdx(idx)
    setDraftName(current)
  }

  const commitEdit = () => {
    if (editingIdx === null) return
    const name = draftName.trim()
    if (name.length) onRename(editingIdx, name)
    setEditingIdx(null)
    setDraftName('')
  }

  const cancelEdit = () => {
    setEditingIdx(null)
    setDraftName('')
  }

  const onTabKeyDown = (e: React.KeyboardEvent, idx: number) => {
    if (editingIdx !== null) return
    const key = e.key
    const last = endpoints.length - 1

    if (key === 'ArrowRight') {
      e.preventDefault()
      const next = idx === last ? 0 : idx + 1
      tabsRef.current[next]?.focus()
      onSelect(next)
    } else if (key === 'ArrowLeft') {
      e.preventDefault()
      const prev = idx === 0 ? last : idx - 1
      tabsRef.current[prev]?.focus()
      onSelect(prev)
    } else if (key === 'Home') {
      e.preventDefault()
      tabsRef.current[0]?.focus()
      onSelect(0)
    } else if (key === 'End') {
      e.preventDefault()
      tabsRef.current[last]?.focus()
      onSelect(last)
    }
  }

  useEffect(() => {
    tabsRef.current = tabsRef.current.slice(0, endpoints.length)
  }, [endpoints.length])

  const handleRemoveClick = (idx: number) => {
    const ok = confirm(`Delete endpoint "${endpoints[idx]?.name || `Endpoint ${idx + 1}`}"?`)
    if (!ok) return
    onRemove(idx)
  }

  return (
    <div className="bg-white/60 rounded-lg border border-black/10 px-4 py-3 overflow-hidden">
      {/* pill-style tab row */}
      <div role="tablist" aria-label="Endpoints" className="flex gap-2 items-center overflow-x-auto">
        {endpoints.map((ep, idx) => {
          const isActive = activeIdx === idx
          return (
            <div key={idx} className="relative">
              <div className="inline-flex items-center">
                {editingIdx === idx ? (
                  <div className="flex items-center gap-2">
                    <input
                      autoFocus
                      value={draftName}
                      onChange={(e) => setDraftName(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') commitEdit()
                        if (e.key === 'Escape') cancelEdit()
                      }}
                      className="px-3 py-1 text-[13px] rounded-full bg-error border border-gray-200 text-dark font-medium"
                    />
                    <button
                      onClick={commitEdit}
                      className="p-1 bg-black text-white hover:bg-gray-600 rounded-full transition-all active:scale-95 shadow-sm hover:shadow-md"
                      title="Save name"
                    >
                      <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    </button>
                    <button
                      onClick={cancelEdit}
                      className="p-1 text-zinc-400 hover:text-zinc-600 rounded-full transition-all active:scale-95"
                      title="Cancel"
                    >
                      <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </div>
                ) : (
                  <button
                    id={`endpoint-tab-${idx}`}
                    role="tab"
                    aria-selected={isActive}
                    aria-controls={`endpoint-panel-${idx}`}
                    tabIndex={isActive ? 0 : -1}
                    ref={(el) => { tabsRef.current[idx] = el; return undefined }}
                    className={`inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-[13px] font-medium transition ${isActive ? 'text-white shadow' : 'bg-white border border-gray-200 text-zinc-700 hover:bg-gray-50'}`}
                    onClick={() => onSelect(idx)}
                    onDoubleClick={() => startEdit(idx, ep.name || `Endpoint ${idx + 1}`)}
                    onKeyDown={(e) => onTabKeyDown(e, idx)}
                    style={isActive ? { background: 'var(--color-primary)' } : undefined}
                  >
                    <span className="truncate max-w-40">{ep.name || `Endpoint ${idx + 1}`}</span>
                    {isActive && (
                      <button
                        aria-label="Delete endpoint"
                        onClick={(e) => { e.stopPropagation(); handleRemoveClick(idx) }}
                        className="ml-2 text-red-400 hover:text-red-600 p-1 rounded-full"
                        title="Delete"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                  </button>
                )}
              </div>
            </div>
          )
        })}

        {/* New button */}
        <div className="flex-none">
          <button
            className={`h-10 px-4 text-sm rounded-full ${endpoints.length >= 9 ? 'text-gray-300 cursor-not-allowed' : 'text-gray hover:text-dark bg-white border border-gray-200 hover:bg-gray-50'}`}
            onClick={() => { if (endpoints.length < 9) onAdd() }}
            aria-label="Add endpoint"
            aria-disabled={endpoints.length >= 9}
            title={endpoints.length >= 9 ? 'Maximum 9 endpoints' : 'Add endpoint'}
            disabled={endpoints.length >= 9}
          >
            + New
          </button>
        </div>
      </div>

      {/* panels */}
      <div className="mt-4 p-4 bg-white rounded-md">
        {endpoints.map((ep, idx) => (
          <div
            key={idx}
            id={`endpoint-panel-${idx}`}
            role="tabpanel"
            aria-labelledby={`endpoint-tab-${idx}`}
            aria-hidden={activeIdx !== idx}
            className={`${activeIdx === idx ? 'block' : 'hidden'}`}
          >
            <h3 className="text-sm font-semibold text-zinc-900">{ep.name || `Endpoint ${idx + 1}`}</h3>
          </div>
        ))}
      </div>
    </div>
  )
}
