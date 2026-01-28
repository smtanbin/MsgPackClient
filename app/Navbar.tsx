'use client'

import { Upload, Home, Code, Download, Github, Settings, ChevronDown, X } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import logo from '../public/assets/SVG/logo.svg'


type HeaderProps = {
  onSaveAction: () => void
  onLoadAction: (json: unknown) => void
  onOpenEnvAction?: () => void
}

export default function Navbar({ onSaveAction, onLoadAction }: HeaderProps) {
  const [menuOpen, setMenuOpen] = useState(false)
  const [actionsOpen, setActionsOpen] = useState(false)
  const [mounted, setMounted] = useState(false)
  const menuRef = useRef<HTMLDivElement | null>(null)
  const actionsRef = useRef<HTMLDivElement | null>(null)

  useEffect(() => setMounted(true), [])

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (menuRef.current && e.target instanceof Node && !menuRef.current.contains(e.target)) {
        setMenuOpen(false)
      }
      if (actionsRef.current && e.target instanceof Node && !actionsRef.current.contains(e.target)) {
        setActionsOpen(false)
      }
    }
    function handleEsc(e: KeyboardEvent) {
      if (e.key === 'Escape') setMenuOpen(false)
    }

    document.addEventListener('click', handleClickOutside)
    document.addEventListener('keydown', handleEsc)
    return () => {
      document.removeEventListener('click', handleClickOutside)
      document.removeEventListener('keydown', handleEsc)
    }
  }, [])



  return (
    <header
      className="sticky  top-0 z-50 flex items-center justify-between px-8 py-4 md:py-5 w-full max-w-none rounded-none mx-0 bg-transparent backdrop-blur-2xl shadow-none"
      style={{ backgroundColor: 'var(--color-nav-bg)', boxShadow: 'var(--shadow-nav)' }}
    >
      <div className="flex items-center gap-3">
        <Link href="/" className="flex items-center gap-3 focus:outline-none" aria-label="Go to Home">
          <Image
            src={logo}
            alt="Pack Tester Logo"
            width={32}
            height={32}
            className="h-8 w-8 rounded-md"
          />
        </Link>
        <div className="flex flex-col leading-tight">
          <h1 className="text-[15px] md:text-[17px] text-primary font-semibold">Pack Tester</h1>
          <p className="text-[11px] md:text-[12px] text-gray-500">Encode & decode Pack Tester</p>
        </div>
      </div>

      <nav
        ref={menuRef}
        className={` max-md:absolute max-md:top-0 max-md:left-0 max-md:overflow-hidden items-center justify-center max-md:h-full max-md:w-0 transition-[width] flex-col md:flex-row flex gap-5 text-sm font-normal md:flex-1 md:justify-end ${menuOpen ? 'max-md:w-full' : 'max-md:w-0'
          }`}
      >
        <Link
          href="/client"
          onClick={() => setMenuOpen(false)}
          className="px-5 py-2 rounded-full text-sm font-medium bg-primary text-white hover:bg-primary/90 transition inline-flex items-center gap-2"
        >
          <Home className="w-4 h-4" />
          Client
        </Link>

        <Link href="/convector" onClick={() => setMenuOpen(false)} className="hover:text-primary inline-flex items-center gap-2">
          <Code className="w-4 h-4" />
          Converter
        </Link>

        <a href="https://github.com/smtanbin/pack-tester" target="_blank" rel="noreferrer" className="hover:text-primary inline-flex items-center gap-2">
          <Github className="w-4 h-4" />
          Project
        </a>

        <div className="relative" ref={actionsRef}>
          <button
            onClick={() => setActionsOpen(s => !s)}
            className="flex items-center gap-2 px-3 py-1 rounded-md text-sm hover:opacity-80"
            title="Settings"
            aria-expanded={actionsOpen}
          >
            <Settings className="w-4 h-4" />
            <span>Settings</span>
            <ChevronDown className={`w-4 h-4 transition-transform ${actionsOpen ? 'rotate-180' : ''}`} />
          </button>

          {actionsOpen && (
            <div className="absolute right-0 mt-2 w-44 bg-white rounded-md shadow-lg border border-gray-100 py-1 z-40">
              <label className="block w-full text-left px-3 py-2 text-sm text-zinc-700 hover:bg-gray-50 cursor-pointer flex items-center gap-2">
                <Download className="w-4 h-4" />
                <span>Import</span>
                <input
                  type="file"
                  accept="application/json"
                  className="absolute inset-0 opacity-0 w-full h-full cursor-pointer"
                  onChange={async (e) => {
                    const file = (e.target as HTMLInputElement).files?.[0]
                    if (!file) return
                    try {
                      const text = await file.text()
                      const parsed = JSON.parse(text)
                      onLoadAction(parsed)
                    } catch (err) {
                      console.error('Failed to load JSON', err)
                    } finally {
                      setActionsOpen(false)
                    }
                  }}
                />
              </label>

              <button
                onClick={() => {
                  onSaveAction()
                  setActionsOpen(false)
                }}
                className="w-full text-left px-3 py-2 text-sm text-primary flex items-center gap-2"
              >
                <Upload className="w-4 h-4 text-white" />
                Export
              </button>
            </div>
          )}
        </div>

        <button type="button" onClick={() => setMenuOpen(false)} className="md:hidden text-gray-600" aria-label="Close menu">
          <X className="w-6 h-6" />
        </button>
      </nav>

      {/* Theme toggle removed */}
    </header>
  )
}
