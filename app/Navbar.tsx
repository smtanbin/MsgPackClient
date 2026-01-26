'use client'

// Use SVG logos (light/dark) directly
import { Plus, Upload, MoreHorizontal, Home, Code, FileJson, Github, Download, Settings, Sun, Moon, ChevronDown } from 'lucide-react' 
import { useEffect, useRef, useState } from 'react'
import Link from 'next/link'

type HeaderProps = {
    onSaveAction: () => void
    onLoadAction: (json: unknown) => void
    onOpenEnvAction?: () => void
}

export default function Navbar({ onSaveAction, onLoadAction, onOpenEnvAction }: HeaderProps) {
    const [menuOpen, setMenuOpen] = useState(false)
    const menuRef = useRef<HTMLDivElement | null>(null)
    const [pagesOpen, setPagesOpen] = useState(false)
    const pagesRef = useRef<HTMLDivElement | null>(null)

    // Actions dropdown state (Import / Export)
    const [actionsOpen, setActionsOpen] = useState(false)
    const actionsRef = useRef<HTMLDivElement | null>(null)

    const [theme, setTheme] = useState<'light' | 'dark'>(() => {
      try {
        return (localStorage.getItem('mpc-theme') as 'light' | 'dark') || 'light'
      } catch { return 'light' }
    })

    const iconColor = theme === 'dark' ? 'text-white' : 'text-primary'
    const textTone = theme === 'dark' ? 'text-white' : 'text-zinc-800'

    useEffect(() => {
        function onDoc(e: MouseEvent) {
            if (menuRef.current && e.target instanceof Node && !menuRef.current.contains(e.target)) {
                setMenuOpen(false)
            }
            if (pagesRef.current && e.target instanceof Node && !pagesRef.current.contains(e.target)) {
                setPagesOpen(false)
            }
            if (actionsRef.current && e.target instanceof Node && !actionsRef.current.contains(e.target)) {
                setActionsOpen(false)
            }
        }
        function onKey(e: KeyboardEvent) {
            if (e.key === 'Escape') setMenuOpen(false)
        }
        document.addEventListener('click', onDoc)
        document.addEventListener('keydown', onKey)
        return () => {
            document.removeEventListener('click', onDoc)
            document.removeEventListener('keydown', onKey)
        }
    }, [])

    // Apply theme on mount and when it changes
    useEffect(() => {
      try {
        if (theme === 'dark') {
          document.documentElement.classList.add('dark')
          localStorage.setItem('mpc-theme', 'dark')
        } else {
          document.documentElement.classList.remove('dark')
          localStorage.setItem('mpc-theme', 'light')
        }
      } catch {}
    }, [theme])

    return (
        <header className="sticky top-0 h-[70px] w-full px-6 md:px-16 lg:px-24 xl:px-32 flex items-center justify-between z-40 transition-all border-b border-white/10 bg-white/80 dark:bg-black/80 backdrop-blur-xl">
            <div className="flex items-center gap-3">
                <a href="/home" aria-label="Go to Home" className="flex items-center gap-3 focus:outline-none">
                  {/* Theme-aware SVG logo: use light/dark variants from /assets/SVG */}
                  <img src={theme === 'dark' ? '/assets/SVG/logo-dark.svg' : '/assets/SVG/logo-light.svg'} alt="MsgPack Logo" className="h-8 w-8 rounded-md" />
                </a>
                <div className="flex flex-col leading-tight text-primary">
                    <h1 className="text-[17px] font-semibold">MsgPack Tester</h1>
                    <p className="text-[12px] text-primary/80">Encode & decode MessagePack</p>
                </div>
            </div>

            {/* Desktop controls */}
            <div className="hidden md:flex items-center gap-6">
                <Link href="/home" className="hidden md:inline-flex  bg-primary dark:text-white text-sm hover:opacity-90 active:scale-95 transition-all w-36 h-10 rounded-full items-center justify-center px-3 py-2">
                  Client
                </Link>

                <div className="relative" ref={pagesRef}>
                  <button
                    onClick={() => setPagesOpen(s => !s)}
                    aria-expanded={pagesOpen}
                    className={`${textTone} px-3 py-1 rounded-md text-sm hover:opacity-80 flex items-center`}
                    title="Documents"
                  >
                    <FileJson className={`w-5 h-5 ${iconColor}`} />
                  </button>
                  {pagesOpen && (
                    <div className="absolute right-0 mt-2 w-40 bg-white rounded-md shadow-lg border border-gray-100 py-1 z-40 dark:bg-zinc-900 dark:border-zinc-800">
                      <Link href="/convator" className="block px-3 py-2 text-sm text-zinc-700 dark:text-zinc-200 hover:bg-gray-50 dark:hover:bg-zinc-800 flex items-center gap-2" title="Converter">
                        <Code className={`w-4 h-4 ${iconColor}`} />
                        Converter
                      </Link>
                      <a href="https://github.com/smtanbin/MsgPackClient" target="_blank" rel="noreferrer" className="block px-3 py-2 text-sm text-zinc-700 dark:text-zinc-200 hover:bg-gray-50 dark:hover:bg-zinc-800 flex items-center gap-2" title="Project">
                        <Github className={`w-4 h-4 ${iconColor}`} />
                        Project
                      </a>
                    </div>
                  )}
                </div>

                <div className="relative" ref={actionsRef}>
                  <button
                    onClick={() => setActionsOpen(s => !s)}
                    aria-expanded={actionsOpen}
                    className={`${textTone} px-3 py-1 rounded-md text-sm hover:opacity-80 flex items-center`}
                    title="Actions"
                  >
                    <Settings className={`w-5 h-5 ${iconColor}`} />
                  </button>
                  {actionsOpen && (
                    <div className="absolute right-0 mt-2 w-44 bg-white rounded-md shadow-lg border border-gray-100 py-1 z-40 dark:bg-zinc-900 dark:border-zinc-800">
                      <label className="block w-full text-left px-3 py-2 text-sm text-zinc-700 dark:text-zinc-200 hover:bg-gray-50 dark:hover:bg-zinc-800 cursor-pointer flex items-center gap-2">
                        <Download className={`w-4 h-4 ${iconColor}`} />
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

                      <button onClick={() => { onSaveAction(); setActionsOpen(false) }} className="w-full text-left px-3 py-2 text-sm text-white dark:text-zinc-200 bg-primary dark:bg-primary/20 hover:bg-primary/90 dark:hover:bg-primary/30 flex items-center gap-2">
                        <Upload className={`w-4 h-4 ${theme === 'dark' ? 'text-white' : 'text-white'}`} />
                        Export
                      </button>
                    </div>
                  )}
                </div>

                <button
                  onClick={() => setTheme(t => t === 'dark' ? 'light' : 'dark')}
                  className={`px-2 py-1 rounded-md text-sm transition-colors flex items-center ${theme === 'dark' ? 'text-white/80 border border-white/20 hover:text-white' : 'text-zinc-700 border border-zinc-200 hover:text-zinc-900'}`}
                  title="Toggle theme"
                >
                  {theme === 'dark' ? <Sun className={`w-4 h-4 ${iconColor}`}/> : <Moon className={`w-4 h-4 ${iconColor}`}/>}
                </button>
            </div>

            {/* Mobile: three-dot menu */}
            <div className="md:hidden relative" ref={menuRef}>
                <button
                    onClick={() => setMenuOpen((s) => !s)}
                    aria-label="Open menu"
                    aria-expanded={menuOpen}
                className={`p-2 rounded-md hover:bg-white/10 transition-colors ${textTone}`}
                >
                <MoreHorizontal className={`w-5 h-5 ${iconColor}`} />
                </button>

                {menuOpen && (
                    <div className="absolute top-[70px] left-0 w-full p-4 z-40 border-b border-white/10 bg-white/90 dark:bg-black/80 backdrop-blur-xl">
                      <ul className="flex flex-col space-y-3 text-white">
                        <li>
                          <Link href="/home" onClick={() => setMenuOpen(false)} className="block text-white text-sm hover:opacity-80 flex items-center gap-2">
                            <Home className={`w-4 h-4 ${iconColor}`} />
                          </Link>
                        </li>
                        <li>
                          <Link href="/convator" onClick={() => setMenuOpen(false)} className="block text-white text-sm hover:opacity-80 flex items-center gap-2">
                            <Code className={`w-4 h-4 ${iconColor}`} />
                          </Link>
                        </li>
                        <li>
                          <a href="https://github.com/smtanbin/MsgPackClient" target="_blank" rel="noreferrer" className="block text-white text-sm hover:opacity-80 flex items-center gap-2">
                            <Github className={`w-4 h-4 ${iconColor}`} />
                          </a>
                        </li>
                        {onOpenEnvAction && (
                          <li>
                            <button type="button" onClick={() => { onOpenEnvAction(); setMenuOpen(false) }} className="block text-white text-sm hover:opacity-80 flex items-center gap-2">
                              <Settings className={`w-4 h-4 ${iconColor}`} />
                            </button>
                          </li>
                        )}

                        <li className="border-t border-white/20 pt-3">
                          <div className="flex flex-col gap-3">
                            <button onClick={() => { onSaveAction(); setMenuOpen(false) }} className="w-full text-left px-3 py-2 text-sm text-white bg-white/10 hover:bg-white/20 dark:bg-white/5 dark:hover:bg-white/10 rounded-md flex items-center gap-2">
                              <Upload className={`w-4 h-4 ${iconColor}`} />
                              Export
                            </button>

                            <label className="block w-full text-left px-3 py-2 text-sm text-white hover:opacity-90 cursor-pointer bg-white/10 hover:bg-white/20 dark:bg-white/5 dark:hover:bg-white/10 rounded-md relative flex items-center gap-2">
                              <Download className={`w-4 h-4 ${iconColor}`} />
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
                                        setMenuOpen(false)
                                    }
                                }}
                              />
                            </label>

                            <button onClick={() => setTheme(t => t === 'dark' ? 'light' : 'dark')} className="w-full text-left px-3 py-2 text-sm text-white bg-white/10 hover:bg-white/20 dark:bg-white/5 dark:hover:bg-white/10 rounded-md flex items-center gap-2">
                              {theme === 'dark' ? <Sun className={`w-4 h-4 ${iconColor}`} /> : <Moon className={`w-4 h-4 ${iconColor}`} />}
                              <span>{theme === 'dark' ? 'Light' : 'Dark'}</span>
                            </button>
                          </div>
                        </li>
                      </ul>
                    </div>
                )}
            </div>
        </header>
    )
}
