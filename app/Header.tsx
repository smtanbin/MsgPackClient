'use client'

import logo from "../public/assets/144ppi/logo.png";
import Image from "next/image";
import { Plus, Upload, MoreHorizontal, Home, Code, SlidersHorizontal } from 'lucide-react' 
import { useEffect, useRef, useState } from 'react'
import Link from 'next/link'

type HeaderProps = {
    onSaveAction: () => void
    onLoadAction: (json: unknown) => void
    onOpenEnvAction?: () => void
}

export default function Header({ onSaveAction, onLoadAction, onOpenEnvAction }: HeaderProps) {
    const [menuOpen, setMenuOpen] = useState(false)
    const menuRef = useRef<HTMLDivElement | null>(null)

    useEffect(() => {
        function onDoc(e: MouseEvent) {
            if (!menuRef.current) return
            if (e.target instanceof Node && !menuRef.current.contains(e.target)) {
                setMenuOpen(false)
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

    return (
        <header className="sticky top-0 z-30 bg-white/60 backdrop-blur-md border-b border-gray-200 px-4 py-3 flex items-center justify-between shadow-sm">
            <div className="flex items-center gap-3">
                <button
                  type="button"
                  aria-label="Go to Home"
                  onClick={() => window.location.href = '/home'}
                  className="focus:outline-none"
                  tabIndex={0}
                  style={{ background: 'none', border: 'none', padding: 0, margin: 0 }}
                >
                  <Image src={logo} alt="MsgPack Logo" className="h-8 w-8 rounded-md" />
                </button>
                <div className="flex flex-col leading-tight">
                    <h1 className="text-[17px] font-semibold text-zinc-900">MsgPack Tester</h1>
                    <p className="text-[12px] text-zinc-500">Encode & decode MessagePack</p>
                </div>
            </div>

            {/* Desktop controls */}
            <div className="hidden md:flex items-center gap-2">
                <Link href="/home" className="px-3 py-1 rounded-md text-sm text-zinc-700 bg-white/60 border border-gray-200 hover:bg-gray-50 flex items-center">
                    <Home className="w-4 h-4 mr-2 text-zinc-700" />
                    Home
                </Link>

                <Link href="/encoder-decoder" className="px-3 py-1 rounded-md text-sm text-zinc-700 bg-white/60 border border-gray-200 hover:bg-gray-50 flex items-center">
                    <Code className="w-4 h-4 mr-2 text-zinc-700" />
                    Encoder/Decoder
                </Link>



                <label className="relative inline-flex items-center px-3 py-1 rounded-md text-sm text-zinc-700 bg-white/60 border border-gray-200 hover:bg-gray-50 cursor-pointer">
                    <Upload className="w-4 h-4 mr-2" />
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
                            }
                        }}
                    />
                </label>

                <button
                    onClick={onSaveAction}
                    className="px-3 py-1 rounded-md text-sm font-medium text-white bg-primary hover:bg-white active:translate-y-px transition-transform shadow-md flex items-center"
                >
                    <Plus className="w-4 h-4 mr-2" />
                    Export
                </button>
            </div>

            {/* Mobile: three-dot menu */}
            <div className="md:hidden relative" ref={menuRef}>
                <button
                    onClick={() => setMenuOpen((s) => !s)}
                    aria-label="Open menu"
                    aria-expanded={menuOpen}
                    className="p-2 rounded-md hover:bg-gray-100 transition-colors"
                >
                    <MoreHorizontal className="w-5 h-5" />
                </button>

                {menuOpen && (
                    <div className="absolute right-0 mt-2 w-44 bg-white rounded-lg shadow-lg border border-gray-100 py-1">
                        <Link
                            href="/home"
                            onClick={() => setMenuOpen(false)}
                            className="w-full text-left px-3 py-2 text-sm text-zinc-700 hover:bg-gray-50 flex items-center"
                        >
                            <Home className="w-4 h-4 mr-2 text-zinc-700" />
                            Home
                        </Link>

                        <Link
                            href="/encoder-decoder"
                            onClick={() => setMenuOpen(false)}
                            className="w-full text-left px-3 py-2 text-sm text-zinc-700 hover:bg-gray-50 flex items-center"
                        >
                            <Code className="w-4 h-4 mr-2 text-zinc-700" />
                            Encoder/Decoder
                        </Link>

                        {onOpenEnvAction && (
                          <button
                            type="button"
                            onClick={() => { onOpenEnvAction(); setMenuOpen(false) }}
                            className="w-full text-left px-3 py-2 text-sm text-zinc-700 hover:bg-gray-50 flex items-center"
                          >
                            <SlidersHorizontal className="w-4 h-4 mr-2 text-zinc-700" />
                            Environment
                          </button>
                        )}

                        <label className="w-full text-left px-3 py-2 text-sm text-zinc-700 hover:bg-gray-50 flex items-center cursor-pointer">
                            <Upload className="w-4 h-4 mr-2" />
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
                    </div>
                )}
            </div>
        </header>
    )
}
