'use client'

import { useEffect, useState } from 'react'
import EndpointTabs from '@/app/home/EndpointTabs'

type Endpoint = { name: string; url?: string }

export default function HomeEndpointTabs() {
  const [endpoints, setEndpoints] = useState<Endpoint[]>(() => {
    try {
      const raw = localStorage.getItem('mpc-endpoints')
      return raw ? JSON.parse(raw) : [{ name: 'Endpoint 1', url: '' }]
    } catch {
      return [{ name: 'Endpoint 1', url: '' }]
    }
  })
  const [activeIdx, setActiveIdx] = useState<number>(() => {
    try { return Number(localStorage.getItem('mpc-active-ep') || '0') } catch { return 0 }
  })

  useEffect(() => {
    try { localStorage.setItem('mpc-endpoints', JSON.stringify(endpoints)) } catch {}
  }, [endpoints])
  useEffect(() => { try { localStorage.setItem('mpc-active-ep', String(activeIdx)) } catch {} }, [activeIdx])

  const handleSelect = (idx: number) => {
    setActiveIdx(idx)
  }
  const handleAdd = () => {
    setEndpoints((e) => {
      if (e.length >= 9) return e
      const newEp = { name: `Endpoint ${e.length + 1}`, url: '' }
      // Set active index to the new endpoint's index
      setActiveIdx(e.length)
      return [...e, newEp]
    })
  }
  const handleRename = (idx: number, name: string) => {
    setEndpoints((e) => {
      const copy = [...e]
      if (copy[idx]) copy[idx] = { ...copy[idx], name }
      return copy
    })
  }
  const handleRemove = (idx: number) => {
    setEndpoints((prev) => {
      // remove the item
      const next = prev.slice(0, idx).concat(prev.slice(idx + 1))
      // ensure at least one endpoint
      if (next.length === 0) {
        // reset to a default
        const defaultEp = { name: 'Endpoint 1', url: '' }
        setActiveIdx(0)
        return [defaultEp]
      }
      // adjust activeIdx based on removal
      setActiveIdx((current) => {
        if (idx < current) return Math.max(0, current - 1)
        if (idx === current) return Math.min(idx, next.length - 1)
        return current
      })
      return next
    })
  }

  return (
    <EndpointTabs
      endpoints={endpoints.map((e) => ({ name: e.name }))}
      activeIdx={activeIdx}
      onSelect={handleSelect}
      onAdd={handleAdd}
      onRename={handleRename}
      onRemove={handleRemove}
    />
  )
}
