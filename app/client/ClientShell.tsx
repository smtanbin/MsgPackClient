'use client'

import React, { useState, useEffect, useLayoutEffect, createContext, useContext } from 'react'
import Navbar from '../Navbar'
import Footer from '../Footer'
import { useRouter } from 'next/navigation'
import { getItem, setItem } from '@/app/utils/db'



export default function ClientShell({ children }: { children: React.ReactNode }) {
  const router = useRouter()

  // manage baseUrl as state so EnvPanel can be editable
  const [baseUrl, setBaseUrl] = useState<string>('')

  // manage header variables
  const [headerVars, setHeaderVars] = useState<Array<{ key: string; value: string }>>([])

  useEffect(() => {
    const loadBaseUrl = async () => {
      try {
        const stored = await getItem('mpc-base-url')
        if (stored) setBaseUrl(stored)
      } catch {}
    }
    loadBaseUrl()
  }, [])

  useEffect(() => {
    const saveBaseUrl = async () => {
      try {
        await setItem('mpc-base-url', baseUrl)
        try { window.dispatchEvent(new CustomEvent('mpc:baseUrl', { detail: baseUrl })) } catch {}
      } catch {}
    }
    saveBaseUrl()
  }, [baseUrl])

  useEffect(() => {
    const loadHeaderVars = async () => {
      try {
        const stored = await getItem('mpc-header-vars')
        if (stored) setHeaderVars(JSON.parse(stored))
      } catch {}
    }
    loadHeaderVars()
  }, [])

  useEffect(() => {
    const saveHeaderVars = async () => {
      try {
        await setItem('mpc-header-vars', JSON.stringify(headerVars))
        try { window.dispatchEvent(new CustomEvent('mpc:headerVars', { detail: headerVars })) } catch {}
      } catch {}
    }
    saveHeaderVars()
  }, [headerVars])

  const handleAddVar = () => {
    setHeaderVars(prev => [...prev, { key: '', value: '' }])
  }

  const handleUpdateVar = (index: number, kv: { key: string; value: string }) => {
    setHeaderVars(prev => prev.map((v, i) => i === index ? kv : v))
  }

  const handleRemoveVar = (index: number) => {
    setHeaderVars(prev => prev.filter((_, i) => i !== index))
  }

  const handleSave = () => {
    try {
      const maybeCollector: unknown = (window as unknown as { __mpc_collect_state?: unknown }).__mpc_collect_state
      if (typeof maybeCollector !== 'function') {
        alert('No Pack Tester state collector found')
        return
      }
      const state = (maybeCollector as () => unknown)()
      const blob = new Blob([JSON.stringify(state, null, 2)], { type: 'application/json' })
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = 'mpc-state.json'
      document.body.appendChild(a)
      a.click()
      a.remove()
      URL.revokeObjectURL(url)
    } catch (e) {
      console.error(e)
      alert('Failed to save state')
    }
  }

  const handleLoad = (json: unknown) => {
    try {
      const maybeLoader: unknown = (window as unknown as { __mpc_load_state?: unknown }).__mpc_load_state
      if (typeof maybeLoader !== 'function') {
        alert('No Pack Tester loader found')
        return
      }
      ;(maybeLoader as (v: unknown) => void)(json)
    } catch (e) {
      console.error(e)
      alert('Failed to load state')
    }
  }

  return (
    <>
      <Navbar
        onSaveAction={handleSave}
        onLoadAction={handleLoad}
        onOpenEnvAction={() => router.push('/env')}
      />
      {children}
      <Footer />
    </>
  )
}
