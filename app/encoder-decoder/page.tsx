'use client'

import { useState, useMemo } from 'react'
import { ArrowLeft, Binary, FileJson, Hash, Copy } from 'lucide-react'
import { encode, decode } from '@msgpack/msgpack'

function bytesToHex(bytes: Uint8Array) {
  return Array.from(bytes)
    .map((b) => b.toString(16).padStart(2, '0'))
    .join(' ')
}

function hexToBytes(hex: string): Uint8Array | null {
  const continuous = hex.replace(/\s+/g, '')
  if (!/^[0-9a-fA-F]*$/.test(continuous) || continuous.length % 2 !== 0) return null
  const out = new Uint8Array(continuous.length / 2)
  for (let i = 0; i < continuous.length; i += 2) {
    out[i / 2] = parseInt(continuous.slice(i, i + 2), 16)
  }
  return out
}

function formatSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(2)} KB`
  if (bytes < 1024 * 1024 * 1024) return `${(bytes / (1024 * 1024)).toFixed(2)} MB`
  return `${(bytes / (1024 * 1024 * 1024)).toFixed(2)} GB`
}

function copyToClipboard(text: string) {
  if (navigator.clipboard) {
    navigator.clipboard.writeText(text)
  } else {
    const textarea = document.createElement('textarea')
    textarea.value = text
    document.body.appendChild(textarea)
    textarea.select()
    document.execCommand('copy')
    document.body.removeChild(textarea)
  }
}

export default function EncoderDecoderPage() {
  const [jsonInput, setJsonInput] = useState('{\n  "message": "Hello MessagePack"\n}')
  const [hexInput, setHexInput] = useState('')

  // 1. Deriving Hex Output from JSON Input
  const { hexOutput, encodeError, jsonSize, hexSize } = useMemo(() => {
    if (!jsonInput.trim()) return { hexOutput: '', encodeError: null, jsonSize: 0, hexSize: 0 }
    try {
      const parsed = JSON.parse(jsonInput)
      const encoded = encode(parsed)
      const hexStr = bytesToHex(encoded)
      return {
        hexOutput: hexStr,
        encodeError: null,
        jsonSize: new Blob([jsonInput]).size,
        hexSize: encoded.length
      }
    } catch (e) {
      return { hexOutput: '', encodeError: 'JSON Error: ' + (e instanceof Error ? e.message : String(e)), jsonSize: new Blob([jsonInput]).size, hexSize: 0 }
    }
  }, [jsonInput])

  // 2. Deriving JSON Output from Hex Input
  const { jsonOutput, decodeError } = useMemo(() => {
    if (!hexInput.trim()) return { jsonOutput: '', decodeError: null }
    try {
      const bytes = hexToBytes(hexInput)
      if (!bytes) return { jsonOutput: '', decodeError: 'Invalid Hex format' }
      const decoded = decode(bytes)
      return { jsonOutput: JSON.stringify(decoded, null, 2), decodeError: null }
    } catch (e) {
      return { jsonOutput: '', decodeError: 'Decode Error: ' + (e instanceof Error ? e.message : String(e)) }
    }
  }, [hexInput])

  // Calculate reduction percentage for encoder
  const reduction = jsonSize > 0 ? ((jsonSize - hexSize) / jsonSize) * 100 : 0

  // Calculate sizes for decoder
  const hexInputSize = hexInput ? hexInput.replace(/\s+/g, '').length / 2 : 0
  const jsonOutputSize = jsonOutput ? new Blob([jsonOutput]).size : 0
  const reductionDecode = hexInputSize > 0 ? ((hexInputSize - jsonOutputSize) / hexInputSize) * 100 : 0

  // Aggregate errors to show in the UI
  const activeError = encodeError || decodeError

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 space-y-8">
      {/* Header section */}
      <div className="flex items-center justify-between">
        <h1 className="text-3xl  leading-tight tracking-tight font-extralight color-primary">
          Convertor
        </h1>
      </div>

      {activeError && (
        <div className="p-4 bg-rose-50 border border-rose-100 rounded-xl text-rose-700 text-sm font-medium animate-in fade-in slide-in-from-top-2 text-center">
          {activeError}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* ENCODER CARD */}
        <div className="flex flex-col rounded-2xl bg-white/80 backdrop-blur-xl border border-black/5 ring-1 ring-black/5 shadow-sm overflow-hidden">
          <div className="flex items-center justify-between px-5 py-3 border-b border-black/5 bg-zinc-50/50">
            <div className="flex items-center gap-2">
              <FileJson className="w-4 h-4 text-primary" />
              <strong className="text-sm font-semibold text-zinc-800">JSON to MsgPack Hex</strong>
            </div>
            <div className="flex gap-2 items-center text-xs font-mono text-primary bg-primary/10 px-2 py-0.5 rounded-full">
              <span>JSON: {formatSize(jsonSize)}</span>

            </div>
          </div>
          <div className="p-4 flex flex-col gap-4">
            <textarea
              className="w-full h-48 bg-zinc-50/50 border border-black/5 rounded-xl px-4 py-4 text-[13px] font-mono text-zinc-800 shadow-inner focus:outline-none focus:ring-4 focus:ring-primary/10 focus:border-primary/20 transition-all resize-none custom-scrollbar"
              value={jsonInput}
              onChange={(e) => setJsonInput(e.target.value)}
              placeholder='{ "key": "value" }'
            />
            <div className="flex gap-4 text-xs text-zinc-500 font-mono">
              {/*<span>JSON size: {formatSize(jsonSize)}</span>*/}
              <span>Hex size: {formatSize(hexSize)}</span>
              <span className={reduction > 0 ? 'text-green-600' : reduction < 0 ? 'text-rose-600' : ''}>
                {jsonSize > 0 ? `Size change: ${reduction > 0 ? '-' : ''}${Math.abs(reduction).toFixed(1)}%` : ''}
              </span>
            </div>
            {hexOutput && (
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-zinc-500">
                  <Hash className="w-3.5 h-3.5" />
                  <span className="text-[11px] font-medium uppercase tracking-wider">Hex Output</span>
                  <div className="flex-1" />
                  <button
                    className="ml-2 px-2 py-0.5 rounded bg-primary/10 text-primary text-xs font-bold hover:bg-primary/20 transition flex items-center gap-1"
                    onClick={() => copyToClipboard(hexOutput)}
                    title="Copy Hex"
                    aria-label="Copy Hex"
                  >
                    <Copy className="w-4 h-4 color-primary" />
                  </button>
                </div>
                <pre className="bg-zinc-900/5 border border-black/5 rounded-xl px-4 py-3 text-[12px] font-mono text-zinc-700 max-h-32 overflow-auto whitespace-pre-wrap leading-relaxed">
                  {hexOutput}
                </pre>

              </div>

            )}
          </div>
        </div>

        {/* DECODER CARD */}
        <div className="flex flex-col rounded-2xl bg-white/80 backdrop-blur-xl border border-black/5 ring-1 ring-black/5 shadow-sm overflow-hidden">
          <div className="flex items-center justify-between px-5 py-3 border-b border-black/5 bg-zinc-50/50">
            <div className="flex items-center gap-2">
              <Binary className="w-4 h-4 text-primary" />
              <strong className="text-sm font-semibold text-zinc-800">MsgPack Hex to JSON</strong>
            </div>
            <div className="flex gap-2 items-center text-xs font-mono text-primary bg-primary/10 px-2 py-0.5 rounded-full">
              <span>Hex: {formatSize(hexInputSize)}</span>

            </div>

          </div>
          <div className="p-4 flex flex-col gap-4">
            <textarea
              className="w-full h-48 bg-zinc-50/50 border border-black/5 rounded-xl px-4 py-4 text-[13px] font-mono text-zinc-800 shadow-inner focus:outline-none focus:ring-4 focus:ring-primary/10 focus:border-primary/20 transition-all resize-none custom-scrollbar"
              value={hexInput}
              onChange={(e) => setHexInput(e.target.value)}
              placeholder="Paste hex here (e.g. 81 a5 68 65 6c 6c 6f a5 77 6f 72 6c 64)"
            />
            <div className="flex gap-4 text-xs text-zinc-500 font-mono">


              <span className={reductionDecode > 0 ? 'text-green-600' : reductionDecode < 0 ? 'text-rose-600' : ''}>
                {hexInputSize > 0 ? `Size change: ${reductionDecode > 0 ? '-' : ''}${Math.abs(reductionDecode).toFixed(1)}%` : ''}
              </span>

            </div>
            {jsonOutput && (
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-zinc-500">
                  <FileJson className="w-3.5 h-3.5" />
                  <span className="text-[11px] font-medium uppercase tracking-wider">Decoded JSON</span>
                  <div className="flex-1" />
                  <button
                    className="ml-2 px-2 py-0.5 rounded bg-primary/10 text-primary text-xs font-bold hover:bg-primary/20 transition flex items-center gap-1"
                    onClick={() => copyToClipboard(jsonOutput)}
                    title="Copy JSON"
                    aria-label="Copy JSON"
                  >
                    <Copy className="w-4 h-4 color-primary" />
                  </button>
                </div>
                <pre className="bg-zinc-900/5 border border-black/5 rounded-xl px-4 py-3 text-[12px] font-mono text-zinc-700 max-h-32 overflow-auto whitespace-pre-wrap leading-relaxed">
                  {jsonOutput}
                </pre>
              </div>
            )}

          </div>
        </div>
      </div>
    </div>
  )
}
