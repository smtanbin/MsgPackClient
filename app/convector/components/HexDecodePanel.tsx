/* eslint-disable @typescript-eslint/no-explicit-any */
import { useMemo, useState, useEffect } from 'react'
import { decode } from '@msgpack/msgpack'
import { getItem, setItem } from '@/app/utils/db'

function hexToBytes(input: string): { bytes: Uint8Array | null; error: string | null } {
  const trimmed = input.trim()
  if (!trimmed) return { bytes: new Uint8Array(), error: null }
  // Remove non-hex characters except whitespace, then pair
  const continuous = trimmed.replace(/\s+/g, '')
  if (!/^[0-9a-fA-F]*$/.test(continuous)) {
    return { bytes: null, error: 'Invalid hex: contains non-hex characters' }
  }
  if (continuous.length % 2 !== 0) {
    return { bytes: null, error: 'Invalid hex: odd number of digits' }
  }
  const out = new Uint8Array(continuous.length / 2)
  for (let i = 0; i < continuous.length; i += 2) {
    out[i / 2] = parseInt(continuous.slice(i, i + 2), 16)
  }
  return { bytes: out, error: null }
}

export default function HexDecodePanel() {
  const [hexText, setHexText] = useState('')
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    const loadHex = async () => {
      try {
        const stored = await getItem('mpc-hex')
        if (stored) setHexText(stored)
      } catch {}
      setMounted(true)
    }
    loadHex()
  }, [])

  const { bytes, error: parseErr } = useMemo(() => hexToBytes(hexText), [hexText])
  const { decoded, decodeErr } = useMemo(() => {
    if (parseErr || !bytes) return { decoded: null as any, decodeErr: null as string | null }
    try {
      return { decoded: decode(bytes), decodeErr: null }
    } catch (e: unknown) {
      return { decoded: null as any, decodeErr: 'Decode error: ' + String(e) }
    }
  }, [bytes, parseErr])
  const byteCount = bytes ? bytes.length : 0

  // Persist hex text
  useEffect(() => {
    if (!mounted) return
    const saveHex = async () => {
      try {
        await setItem('mpc-hex', hexText)
      } catch {}
    }
    saveHex()
  }, [hexText, mounted])

  const prettyJson = (obj: unknown) => {
    try {
      return JSON.stringify(obj, null, 2)
    } catch {
      return String(obj)
    }
  }

  return (
    <div className="flex flex-col gap-4 h-full">
      <div className="flex items-center justify-between">
        <strong className="text-[15px] font-semibold text-dark">Decode from Hex (Convector)</strong>
        <span className="text-[11px] text-gray font-mono">{byteCount} bytes</span>
      </div>

      <textarea
        className="flex-1 min-h-[220px] w-full bg-white/60 border border-black/10 rounded-xl px-4 py-3 text-[13px] font-mono text-dark shadow-sm resize-none focus:outline-none focus:border-blue focus:ring-2 focus:ring-blue/20"
        value={hexText}
        onChange={(e) => setHexText(e.target.value)}
        placeholder="Paste hex here (e.g. 82 a5 68 65 6c 6c 6f a5 77 6f 72 6c 64)"
      />

      {(parseErr || decodeErr) && (
        <div className="bg-red/10 border border-red/30 rounded-xl px-4 py-3 text-[12px] text-red">
          {parseErr || decodeErr}
        </div>
      )}

      {!(parseErr || decodeErr) && decoded !== null && (
        <div className="pt-3 border-t border-black/[0.08]">
          <strong className="text-[13px] font-medium text-gray">Decoded JSON</strong>
          <pre className="bg-white/60 border border-black/10 rounded-xl px-4 py-3 text-[12px] font-mono text-dark max-h-48 overflow-auto whitespace-pre-wrap shadow-sm">
            {prettyJson(decoded)}
          </pre>
        </div>
      )}
    </div>
  )
}
