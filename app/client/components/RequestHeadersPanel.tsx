import { useEffect, useState } from 'react'
import { Minimize2, Maximize2, Plus, SlidersHorizontal, Trash2, X, Check, Edit } from 'lucide-react'

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
    { key: 'User-Agent', description: 'Identifies the client.', example: 'pack-tester/1.0' },
    { key: 'X-Request-Id', description: 'Correlation ID for tracing.', example: '550e8400-e29b-41d4-a716-446655440000' },
    { key: 'Accept-Language', description: 'Preferred language for response.', example: 'en-US' },
]

type Props = {
    customHeaders: HeaderKV[]
    headerVars: Array<{ key: string; value: string }>
    onAdd: () => void
    onUpdate: (index: number, kv: HeaderKV) => void
    onRemove: (index: number) => void
}

export default function RequestHeadersPanel({
    customHeaders,
    headerVars,
    onAdd,
    onUpdate,
    onRemove,
}: Props) {
    const [isMinimized, setIsMinimized] = useState(false)
    const [editingIndex, setEditingIndex] = useState<number | null>(null)

    // Function to check if a variable is valid (exists and has value)
    const isValidVariable = (varName: string) => {
        const trimmedVar = varName.trim()
        const exists = headerVars.some(v => v.key.trim().toLowerCase() === trimmedVar.toLowerCase() && v.value && v.value.trim())
        console.log('Checking variable:', trimmedVar, 'exists:', exists, 'available vars:', headerVars)
        return exists
    }

    // Function to remove a variable from header value
    const removeVariableFromValue = (value: string, varName: string) => {
        return value.replace(new RegExp(`\\{\\{\\s*${varName}\\s*\\}\\}`, 'g'), '').trim()
    }

    // Component to render header value with variable badges
    const renderHeaderValue = (value: string, headerIndex: number) => {
        const help = getHelp(customHeaders[headerIndex]?.key || '')
        const variableRegex = /\{\{\s*([^}]+?)\s*\}\}/g
        const parts: any[] = []
        let lastIndex = 0
        let match

        while ((match = variableRegex.exec(value)) !== null) {
            if (match.index > lastIndex) {
                parts.push(value.slice(lastIndex, match.index))
            }
            const varName = match[1].trim()
            if (isValidVariable(varName)) {
                parts.push(
                    <span
                        key={match.index}
                        contentEditable={false}
                        className="inline-flex items-center gap-1 px-1 py-0.5 bg-blue-100 text-blue-700 rounded text-[11px] font-mono pointer-events-none"
                    >
                        {`{{${varName}}}`}
                    </span>
                )
            } else {
                parts.push(match[0])
            }
            lastIndex = match.index + match[0].length
        }
        if (lastIndex < value.length) {
            parts.push(value.slice(lastIndex))
        }

        return (
            <div className="flex-1 flex items-center gap-2">
                <div
                    key={`header-value-${headerIndex}-${editingIndex === headerIndex ? 'edit' : 'view'}`}
                    contentEditable={editingIndex === headerIndex}
                    suppressContentEditableWarning
                    data-header-index={headerIndex}
                    onBlur={(e) => {
                        const text = e.currentTarget.textContent || ''
                        onUpdate(headerIndex, {
                            key: customHeaders[headerIndex]?.key || '',
                            value: text
                        })
                        setEditingIndex(null)
                    }}
                    className={`flex-1 text-[13px] px-3 py-2 bg-white border border-black/5 rounded-lg focus:border-primary focus:ring-2 focus:ring-primary/10 transition-all font-mono text-zinc-600 min-h-[32px] flex flex-wrap gap-1 items-center outline-none ${editingIndex === headerIndex ? '' : 'opacity-60 cursor-not-allowed'}`}
                >
                    {editingIndex === headerIndex ? parts : value}
                </div>
                <button
                    onClick={() => {
                        if (editingIndex === headerIndex) {
                            setEditingIndex(null)
                        } else {
                            setEditingIndex(headerIndex)
                            // Focus the input after setting editing
                            setTimeout(() => {
                                const input = document.querySelector(`[data-header-index="${headerIndex}"]`) as HTMLElement
                                if (input) input.focus()
                            }, 0)
                        }
                    }}
                    className="p-1 bg-transparent text-green-600 hover:text-green-700 rounded-lg transition-all"
                    title={editingIndex === headerIndex ? "Save" : "Edit header value"}
                >
                    {editingIndex === headerIndex ? <Check className="w-4 h-4" /> : <Edit className="w-4 h-4" />}
                </button>
            </div>
        )
    }

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
        <div className={`flex flex-col rounded-2xl transition-all duration-300 shadow-sm border ${isMinimized
                ? 'bg-primary-600 border-none'
                : ' border-white/80 backdrop-blur-xl border-black/5 ring-1 ring-black/5'
            }`}>
            {/* Panel header */}
            <div className={`flex items-center justify-between px-5 py-3 transition-colors`}>
                <div className="flex items-center gap-3">
                    <div className={`p-1.5 rounded-lg `}>
                        <SlidersHorizontal className={`w-4 h-4 ${isMinimized ? 'text-white' : 'text-primary'}`} />
                    </div>
                    <strong className={`text-[15px] font-semibold tracking-tight ${isMinimized ? 'text-white' : 'text-zinc-800'
                        }`}>
                        Request Headers
                    </strong>
                </div>

                <div className="flex items-center gap-2">
                    {!isMinimized && (
                        <div className="relative group bg-primary-200 rounded-lg">
                            <Plus className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-primary pointer-events-none transition-colors" />
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
                                className="pl-8 pr-3 py-1.5 text-xs bg-transparent hover:bg-primary-300 border-none rounded-lg appearance-none cursor-pointer font-medium text-primary transition-all"
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
                        className={`flex items-center justify-center w-8 h-8 rounded-full transition-all active:scale-90 ${isMinimized
                                ? 'bg-white/20 text-white hover:bg-white/30'
                                : 'bg-primary-100 text-primary hover:bg-primary-200'
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
                            <div key={idx} className="flex items-start gap-2 group p-2 hover:bg-zinc-50 rounded-xl transition-colors">
                                <div className="flex-1 flex flex-col sm:flex-row items-start sm:items-center gap-2">
                                    {/* Header key */}
                                    <div className="relative w-full sm:flex-1">
                                        <input
                                            type="text"
                                            value={header.key}
                                            disabled={editingIndex !== idx}
                                            onChange={(e) => onUpdate(idx, {
                                                key: e.target.value,
                                                value: header.value,
                                            })}
                                            className={`w-full text-[13px] px-3 py-2 bg-white border border-zinc-300 rounded-lg focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all font-medium text-zinc-700 ${editingIndex === idx ? 'cursor-text' : 'cursor-not-allowed opacity-60'}`}
                                            placeholder="Header Key"
                                        />
                                    </div>

                                    {/* Header value */}
                                    <div className="w-full sm:flex-[2] relative">
                                        {renderHeaderValue(value, idx)}
                                    </div>
                                </div>

                                {/* Remove icon with background */}
                                <div
                                    onClick={() => onRemove(idx)}
                                    className="p-2 bg-rose-100 text-rose-600 hover:bg-rose-200 rounded-lg transition-all cursor-pointer flex-shrink-0 active:scale-95"
                                    title="Remove header"
                                >
                                    <Trash2 className="w-4 h-4" />
                                </div>
                            </div>
                        )
                    })}

                    {customHeaders.length === 0 && (
                        <div className="flex flex-col items-center justify-center py-8 rounded-xl border border-dashed border-zinc-200 bg-zinc-50/30">
                            <p className="text-zinc-600 text-sm font-medium">No headers added</p>
                        </div>
                    )}
                </div>
            )}
        </div>
    )
}