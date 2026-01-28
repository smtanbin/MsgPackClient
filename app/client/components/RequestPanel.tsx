import { encode } from '@msgpack/msgpack'
import { FileCode, Braces, Binary, Copy } from 'lucide-react'

type Props = {
  requestText: string
  onChange: (value: string) => void
}

function bytesToHex(bytes: Uint8Array) {
  return Array.from(bytes)
    .map((b) => b.toString(16).padStart(2, '0'))
    .join(' ')
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

export default function RequestPanel({ requestText, onChange }: Props) {
  let msgpackHex = ''
  let hexSize = 0
  let jsonSize = 0
  try {
    if (requestText.trim()) {
      const parsed = JSON.parse(requestText)
      const encoded = encode(parsed)
      msgpackHex = bytesToHex(encoded)
      hexSize = encoded.length
      jsonSize = new Blob([requestText]).size
    }
  } catch {
    // Invalid JSON, don't show msgpack
  }
  const reduction = jsonSize > 0 ? ((jsonSize - hexSize) / jsonSize) * 100 : 0

  const formatJson = () => {
    try {
      const parsed = JSON.parse(requestText)
      onChange(JSON.stringify(parsed, null, 2))
    } catch {
      // Invalid JSON, ignore
    }
  }

  return (
    <div className="flex flex-col rounded-2xl bg-white/80 backdrop-blur-xl border border-black/5 ring-1 ring-black/5 shadow-sm">
      {/* Header */}
      <div className="flex items-center justify-between px-5 py-3 border-b border-black/5">
        <div className="flex items-center gap-3">
          <div className="p-1.5 rounded-lg bg-primary/10">
            <FileCode className="w-4 h-4 text-primary" />
          </div>
          <strong className="text-[15px] font-semibold tracking-tight text-zinc-800">
            Request Body
          </strong>
        </div>

        <button
          onClick={formatJson}
          className="flex items-center gap-1.5 px-3 py-1 bg-zinc-100 hover:bg-zinc-200 text-zinc-600 rounded-lg text-xs font-semibold transition-all active:scale-95"
        >
          <Braces className="w-3.5 h-3.5" />
          Format JSON
        </button>
      </div>

      {/* Content */}
      <div className="flex flex-col flex-1 p-4 gap-4 animate-in fade-in slide-in-from-top-2 duration-300">
        <div className="flex-1 flex flex-col">
          <textarea
            className="flex-1 min-h-[220px] w-full bg-zinc-50/50 border border-black/5 rounded-xl px-4 py-4 text-[13px] font-mono text-zinc-800 shadow-inner focus:outline-none focus:ring-4 focus:ring-primary/10 focus:border-primary/20 focus:shadow-lg focus:shadow-primary/20 transition-all custom-scrollbar"
            value={requestText}
            onChange={(e) => onChange(e.target.value)}
            placeholder='{ "key": "value" }'
          />
        </div>

        {msgpackHex && (
          <div className="space-y-3 pt-2 border-t border-black/5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-zinc-500">
                <Binary className="w-3.5 h-3.5" />
                <span className="text-[12px] font-medium uppercase tracking-wider">Encoded msgpack (hex)</span>
                <span className="text-[10px] bg-zinc-100 px-1.5 py-0.5 rounded text-zinc-600 font-mono">
                  {formatSize(hexSize)}
                </span>
                <span className="text-[10px] bg-zinc-100 px-1.5 py-0.5 rounded text-zinc-600 font-mono">
                  {formatSize(jsonSize)}
                </span>
                <span className={reduction > 0 ? 'text-green-600' : reduction < 0 ? 'text-rose-600' : ''}>
                  {jsonSize > 0 ? `Size change: ${reduction > 0 ? '-' : ''}${Math.abs(reduction).toFixed(1)}%` : ''}
                </span>
                <button
                  className="ml-2 px-2 py-0.5 rounded bg-primary/10 text-primary text-xs font-bold hover:bg-primary/20 transition flex items-center gap-1"
                  onClick={() => copyToClipboard(msgpackHex)}
                  title="Copy Hex"
                >
                  <Copy className="w-3 h-3" /> Copy
                </button>
              </div>
            </div>
            <pre className="bg-zinc-900/5 border border-black/5 rounded-xl px-4 py-3 text-[12px] font-mono text-zinc-700 max-h-32 overflow-auto whitespace-pre-wrap leading-relaxed shadow-inner">
              {msgpackHex}
            </pre>
          </div>
        )}
      </div>
    </div>
  )
}
