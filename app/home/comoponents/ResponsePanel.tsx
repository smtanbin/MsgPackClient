import { useState } from 'react'
import { Minimize2, Maximize2, Copy, Check, FileJson, Hash } from 'lucide-react'

type Props = {
  statusLine: string
  error: string | null
  responseDecoded: unknown | null
  responseRaw: string
}

function prettyJson(obj: unknown) {
  try {
    return JSON.stringify(obj, null, 2)
  } catch (e) {
    return String(e)
  }
}

export default function ResponsePanel({ statusLine, error, responseDecoded, responseRaw }: Props) {
  const [isMinimized, setIsMinimized] = useState(false)
  const [copiedType, setCopiedType] = useState<'json' | 'hex' | null>(null)

  const copyToClipboard = (text: string, type: 'json' | 'hex') => {
    navigator.clipboard.writeText(text)
    setCopiedType(type)
    setTimeout(() => setCopiedType(null), 2000)
  }

  const getStatusInfo = (status: string) => {
    if (status.startsWith('2')) return { bg: 'bg-emerald-50', text: 'text-emerald-700', border: 'border-emerald-200' }
    if (status.startsWith('4') || status.startsWith('5')) return { bg: 'bg-rose-50', text: 'text-rose-700', border: 'border-rose-200' }
    return { bg: 'bg-amber-50', text: 'text-amber-700', border: 'border-amber-200' }
  }

  const statusInfo = statusLine ? getStatusInfo(statusLine) : null

  return (
    <div className={`flex flex-col rounded-2xl transition-all duration-300 shadow-sm border ${
      isMinimized 
        ? 'bg-primary border-primary ring-4 ring-primary/10' 
        : 'bg-white/80 backdrop-blur-xl border-black/5 ring-1 ring-black/5'
    }`}>
      {/* Header */}
      <div className={`flex items-center justify-between px-5 py-3 transition-colors ${
        isMinimized 
          ? 'border-none' 
          : 'border-b border-black/5'
      }`}>
        <div className="flex items-center gap-3">
          <div className={`p-1.5 rounded-lg ${isMinimized ? 'bg-white/20' : 'bg-primary/10'}`}>
            <FileJson className={`w-4 h-4 ${isMinimized ? 'text-white' : 'text-primary'}`} />
          </div>
          <strong className={`text-[15px] font-semibold tracking-tight ${
            isMinimized ? 'text-white' : 'text-zinc-800'
          }`}>
            Response
          </strong>

          {statusLine && !isMinimized && (
            <div className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full border ${statusInfo?.bg} ${statusInfo?.text} ${statusInfo?.border}`}>
              <div className={`w-1.5 h-1.5 rounded-full ${statusInfo?.text.replace('text', 'bg')}`} />
              <span className="text-[11px] font-bold uppercase tracking-wider">{statusLine}</span>
            </div>
          )}
        </div>

        <button
          onClick={() => setIsMinimized(!isMinimized)}
          className={`flex items-center justify-center w-8 h-8 rounded-full transition-all active:scale-90 ${
            isMinimized 
              ? 'bg-white text-primary hover:bg-white/90 shadow-lg' 
              : 'bg-zinc-100 text-zinc-500 hover:bg-zinc-200'
          }`}
          title={isMinimized ? 'Expand' : 'Minimize'}
        >
          {isMinimized ? <Maximize2 className="w-4 h-4" /> : <Minimize2 className="w-4 h-4" />}
        </button>
      </div>

      {/* Content */}
      {!isMinimized && (
        <div className="flex flex-col gap-5 p-5 animate-in fade-in slide-in-from-top-2 duration-300">
          {error && (
            <div className="flex items-start gap-3 p-4 bg-rose-50 border border-rose-100 rounded-xl text-rose-700">
              <div className="w-1.5 h-1.5 rounded-full bg-rose-500 mt-1.5 shrink-0" />
              <p className="text-[13px] font-medium leading-relaxed">{error}</p>
            </div>
          )}

          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-zinc-500">
                <FileJson className="w-3.5 h-3.5" />
                <span className="text-[12px] font-medium">Decoded Content</span>
              </div>
              {responseDecoded !== null && (
                <button
                  onClick={() => copyToClipboard(prettyJson(responseDecoded), 'json')}
                  className="p-1.5 hover:bg-zinc-100 rounded-md transition-colors text-zinc-400 hover:text-zinc-600"
                >
                  {copiedType === 'json' ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
                </button>
              )}
            </div>

            {responseDecoded !== null ? (
              <div className="relative group">
                <pre className="bg-zinc-50/50 border border-black/5 rounded-xl px-4 py-4 text-[13px] font-mono text-zinc-800 max-h-[400px] overflow-auto shadow-inner custom-scrollbar selection:bg-primary/20">
                  {prettyJson(responseDecoded)}
                </pre>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-12 px-4 rounded-xl border border-dashed border-zinc-200 bg-zinc-50/30">
                <div className="w-10 h-10 rounded-full bg-zinc-100 flex items-center justify-center mb-3">
                  <FileJson className="w-5 h-5 text-zinc-300" />
                </div>
                <p className="text-zinc-400 text-sm font-medium">Waiting for response...</p>
              </div>
            )}
          </div>

          {responseRaw && (
            <div className="space-y-3 pt-2 border-t border-black/5">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-zinc-500">
                  <Hash className="w-3.5 h-3.5" />
                  <span className="text-[12px] font-medium uppercase tracking-wider">Raw Hex Output</span>
                  <span className="text-[10px] bg-zinc-100 px-1.5 py-0.5 rounded text-zinc-400 font-mono">
                    {responseRaw.split(' ').length} B
                  </span>
                </div>
                <button
                  onClick={() => copyToClipboard(responseRaw, 'hex')}
                  className="p-1.5 hover:bg-zinc-100 rounded-md transition-colors text-zinc-400 hover:text-zinc-600"
                >
                  {copiedType === 'hex' ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
                </button>
              </div>
              <pre className="bg-zinc-900/5 border border-black/5 rounded-xl px-4 py-3 text-[12px] font-mono text-zinc-700 max-h-32 overflow-auto whitespace-pre-wrap leading-relaxed">
                {responseRaw}
              </pre>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
