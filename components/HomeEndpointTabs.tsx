'use client'

import { useEffect, useState } from 'react'
import EndpointTabs from '@/app/client/EndpointTabs'
import { getItem, setItem } from '@/app/utils/db'

type Endpoint = { name: string; url?: string }

export default function HomeEndpointTabs() {
  const [endpoints, setEndpoints] = useState<Endpoint[]>([])
  const [activeIdx, setActiveIdx] = useState<number>(0)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    const loadState = async () => {
      try {
        const raw = await getItem('mpc-endpoints')
        const eps = raw ? JSON.parse(raw) : [{ name: 'Endpoint 1', url: '' }]
        setEndpoints(eps)
        const idx = Number(await getItem('mpc-active-ep') || '0')
        setActiveIdx(idx)
      } catch {
        setEndpoints([{ name: 'Endpoint 1', url: '' }])
        setActiveIdx(0)
      }
      setMounted(true)
    }
    loadState()
  }, [])

  useEffect(() => {
    if (!mounted) return
    const saveEndpoints = async () => {
      try { await setItem('mpc-endpoints', JSON.stringify(endpoints)) } catch {}
    }
    saveEndpoints()
  }, [endpoints, mounted])

  useEffect(() => {
    if (!mounted) return
    const saveActiveIdx = async () => {
      try { await setItem('mpc-active-ep', String(activeIdx)) } catch {}
    }
    saveActiveIdx()
  }, [activeIdx, mounted])

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
