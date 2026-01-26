import { useEffect, useState } from 'react'
import { Minimize2, Maximize2, Plus, SlidersHorizontal, Trash2 } from 'lucide-react'

type HeaderKV = { key: string; value: string }

type HeaderDef = {
    key: string
    description: string
    example: string
}

const requestHeadersDefaults: HeaderDef[] = [
    { key: 'Content-Type', description: 'Media type of the request body.', example: 'application/msgpack' },
    { key: 'Accept', description: 'Media types acceptable for response.', example: 'application/msgpack, application/json' },
    { key: 'Authorization', description: 'Auth header (Bearer, Basic, etc.).', example: 'Bearer <token>' },
    { key: 'X-API-Key', description: 'API key header.', example: '<your-api-key>' },
    { key: 'User-Agent', description: 'Identifies the client.', example: 'msgpackclient/1.0' },
    { key: 'X-Request-Id', description: 'Correlation ID for tracing.', example: '550e8400-e29b-41d4-a716-446655440000' },
    { key: 'Accept-Language', description: 'Preferred language for response.', example: 'en-US' },
]

type Props = {
    customHeaders: HeaderKV[]
    onAdd: () => void
    onUpdate: (index: number, kv: HeaderKV) => void
    onRemove: (index: number) => void
}

export default function RequestHeadersPanel({
    customHeaders,
    onAdd,
    onUpdate,
    onRemove,
}: Props) {
    const [isMinimized, setIsMinimized] = useState(false)

    // Seed defaults
    useEffect(() => {
        if (customHeaders.length > 0) return

        onAdd()
        onUpdate(0, { key: 'Content-Type', value: 'application/msgpack' })

        onAdd()
        onUpdate(1, {
            key: 'Accept',
            value: 'application/msgpack, application/json',
        })
    }, [])

    const usedKeys = customHeaders.map(h => h.key.toLowerCase())
    const availableHeaders = requestHeadersDefaults.filter(
        h => !usedKeys.includes(h.key.toLowerCase())
    )

    const getHelp = (key: string) =>
        requestHeadersDefaults.find(h => h.key === key)

    return (
        <div className={`flex flex-col rounded-2xl transition-all duration-300 shadow-sm border ${
            isMinimized 
                ? 'bg-primary border-primary ring-4 ring-primary/10' 
                : 'bg-white/80 backdrop-blur-xl border-black/5 ring-1 ring-black/5'
        }`}>
            {/* Panel header */}
            <div className={`flex items-center justify-between px-5 py-3 transition-colors ${
                isMinimized 
                    ? 'border-none' 
                    : 'border-b border-black/5'
            }`}>
                <div className="flex items-center gap-3">
                    <div className={`p-1.5 rounded-lg ${isMinimized ? 'bg-white/20' : 'bg-primary/10'}`}>
                        <SlidersHorizontal className={`w-4 h-4 ${isMinimized ? 'text-white' : 'text-primary'}`} />
                    </div>
                    <strong className={`text-[15px] font-semibold tracking-tight ${
                        isMinimized ? 'text-white' : 'text-zinc-800'
                    }`}>
                        Request Headers
                    </strong>
                </div>

                <div className="flex items-center gap-2">
                    {!isMinimized && (
                        <div className="relative group">
                            <Plus className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-zinc-400 group-hover:text-primary transition-colors" />
                            <select
                                value=""
                                onChange={(e) => {
                                    const key = e.target.value
                                    if (!key) return
                                    const def = requestHeadersDefaults.find(h => h.key === key)
                                    onAdd()
                                    onUpdate(customHeaders.length, {
                                        key,
                                        value: def?.example || '',
                                    })
                                }}
                                className="pl-8 pr-3 py-1.5 text-xs bg-zinc-100 hover:bg-zinc-200 border-none rounded-lg focus:ring-2 focus:ring-primary/20 appearance-none cursor-pointer font-medium text-zinc-600 transition-all"
                            >
                                <option value="">Add Header</option>
                                {availableHeaders.map(h => (
                                    <option key={h.key} value={h.key}>
                                        {h.key}
                                    </option>
                                ))}
                            </select>
                        </div>
                    )}

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
            </div>

            {/* Header rows */}
            {!isMinimized && (
                <div className="flex flex-col gap-2 p-4 animate-in fade-in slide-in-from-top-2 duration-300">
                    {customHeaders.map((header, idx) => {
                        const help = getHelp(header.key)
                        const value = idx === 0 && !header.value ? 'application/msgpack' : header.value

                        return (
                            <div key={idx} className="flex items-center gap-2 group p-1 hover:bg-zinc-50 rounded-xl transition-colors">
                                <div className="flex-1 flex items-center gap-2">
                                    {/* Header key */}
                                    <div className="relative flex-1">
                                        <select
                                            value={header.key}
                                            onChange={(e) => onUpdate(idx, {
                                                key: e.target.value,
                                                value: idx === 0 ? 'application/msgpack' : header.value,
                                            })}
                                            className="w-full text-[13px] px-3 py-2 bg-white border border-black/5 rounded-lg focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all font-medium text-zinc-700 appearance-none"
                                        >
                                            <option value="">Header Key</option>
                                            {header.key && <option value={header.key}>{header.key}</option>}
                                            {availableHeaders.map(h => (
                                                <option key={h.key} value={h.key}>{h.key}</option>
                                            ))}
                                        </select>
                                    </div>

                                    {/* Header value */}
                                    <div className="flex-[2] relative">
                                        <input
                                            type="text"
                                            value={value}
                                            placeholder={help?.example || 'Value'}
                                            onChange={(e) => onUpdate(idx, { key: header.key, value: e.target.value })}
                                            className="w-full text-[13px] px-3 py-2 bg-white border border-black/5 rounded-lg focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all font-mono text-zinc-600"
                                        />
                                    </div>
                                </div>

                                {/* Remove */}
                                <button
                                    onClick={() => onRemove(idx)}
                                    className="p-2 text-zinc-300 hover:text-rose-500 hover:bg-rose-50 rounded-lg transition-all opacity-0 group-hover:opacity-100"
                                    title="Remove header"
                                >
                                    <Trash2 className="w-4 h-4" />
                                </button>
                            </div>
                        )
                    })}

                    {customHeaders.length === 0 && (
                        <div className="flex flex-col items-center justify-center py-8 rounded-xl border border-dashed border-zinc-200 bg-zinc-50/30">
                            <p className="text-zinc-400 text-sm font-medium">No headers added</p>
                        </div>
                    )}
                </div>
            )}
        </div>
    )
}
