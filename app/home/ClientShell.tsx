'use client'

import React, { useState, useEffect } from 'react'
import Navbar from '../Navbar'
import Footer from '../Footer'
import EnvPanel from './EnvPanel'

export default function ClientShell({ children }: { children: React.ReactNode }) {
  const [envOpen, setEnvOpen] = useState(false)

  // manage baseUrl as state so EnvPanel can be editable
  const [baseUrl, setBaseUrl] = useState<string>(() => {
    try {
      return localStorage.getItem('mpc-base-url') || ''
    } catch {
      return ''
    }
  })

  useEffect(() => {
    try {
      localStorage.setItem('mpc-base-url', baseUrl)
      // notify other windows/components in same page that baseUrl changed
      try { window.dispatchEvent(new CustomEvent('mpc:baseUrl', { detail: baseUrl })) } catch { /* ignore */ }
    } catch {}
  }, [baseUrl])

  const handleOpenEnv = () => setEnvOpen(true)
  const handleCloseEnv = () => setEnvOpen(false)

  const handleSave = () => {
    try {
      const maybeCollector: unknown = (window as unknown as { __mpc_collect_state?: unknown }).__mpc_collect_state
      if (typeof maybeCollector !== 'function') {
        alert('No MsgPack client state collector found')
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
        alert('No MsgPack client loader found')
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
      <Navbar onSaveAction={handleSave} onLoadAction={handleLoad} onOpenEnvAction={handleOpenEnv} />
      <main>{children}</main>
      <Footer />

      {envOpen && (
        <EnvPanel baseUrl={baseUrl} vars={[]}
          onBaseUrlChange={(v) => { setBaseUrl(v) }}
          onAddVar={() => {}}
          onUpdateVar={() => {}}
          onRemoveVar={() => {}}
          onClose={handleCloseEnv}
        />
      )}
    </>
  )
}
