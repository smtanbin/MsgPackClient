'use client'

import { useMemo } from 'react'
import { Copy, Code } from 'lucide-react'

type HeaderKV = { key: string; value: string }
type HttpMethod = 'GET' | 'POST' | 'PUT' | 'DELETE' | 'HEAD'

type Props = {
  method: HttpMethod
  url: string
  baseUrl?: string
  headers: HeaderKV[]
  requestText: string
  headerVars: Array<{ key: string; value: string }>
}

function applyVars(str: string, vars: Array<{ key: string; value: string }>) {
  return str.replace(/\{\{([^}]+)\}\}/g, (_, name) => {
    const found = vars.find(v => v.key === String(name).trim())
    return found ? found.value : ''
  })
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

export default function RequestPreview({ method, url, baseUrl, headers, requestText, headerVars }: Props) {
  // Function to check if a variable is valid (exists)
  const isValidVariable = (varName: string) => {
    const trimmedVarName = varName.trim()
    return headerVars.some(v => v.key === trimmedVarName)
  }

  // Function to render header value with variable highlighting
  const renderHeaderValue = (value: string) => {
    const variableRegex = /\{\{([^}]+)\}\}/g
    const parts = []
    let lastIndex = 0
    let match

    while ((match = variableRegex.exec(value)) !== null) {
      // Add text before the variable
      if (match.index > lastIndex) {
        parts.push(value.slice(lastIndex, match.index))
      }

      const varName = match[1]
      if (isValidVariable(varName)) {
        parts.push(
          <span key={`var-${match.index}`} className="inline-flex items-center gap-1 bg-blue-100 text-blue-800 px-2 py-0.5 rounded text-xs font-medium mx-1">
            <code>{`{{${varName}}}`}</code>
          </span>
        )
      } else {
        // Invalid variable - show as plain text
        parts.push(match[0])
      }

      lastIndex = match.index + match[0].length
    }

    // Add remaining text
    if (lastIndex < value.length) {
      parts.push(value.slice(lastIndex))
    }

    return parts.length > 0 ? parts : value
  }

  const curlCommand = useMemo(() => {
    // Build the full URL with baseUrl and variable substitution
    const fullUrl = baseUrl && !url.startsWith('http') ? `${baseUrl}${url.startsWith('/') ? url : `/${url}`}` : url
    const substitutedUrl = applyVars(fullUrl, headerVars)

    let command = `curl -X ${method.toUpperCase()}`

    // Add headers
    const processedHeaders = headers.filter(h => h.key && h.value)
    processedHeaders.forEach(header => {
      const substitutedValue = applyVars(header.value, headerVars)
      command += ` \\\n  -H "${header.key}: ${substitutedValue}"`
    })

    // Add URL
    command += ` \\\n  "${substitutedUrl}"`

    // Add body if present
    if (requestText.trim()) {
      try {
        const parsed = JSON.parse(requestText)
        // For curl preview, show the JSON (since curl doesn't handle MsgPack natively)
        const jsonBody = JSON.stringify(parsed, null, 2)
        command += ` \\\n  -d '${jsonBody}'`
      } catch (e) {
        // Invalid JSON, show as-is
        command += ` \\\n  -d '${requestText}'`
      }
    }

    return command
  }, [method, url, baseUrl, headers, requestText, headerVars])

  return (
    <div className="flex flex-col rounded-2xl bg-white/80 backdrop-blur-xl border border-black/5 ring-1 ring-black/5 shadow-sm">
      {/* Header */}
      <div className="flex items-center justify-between px-5 py-3 border-b border-black/5">
        <div className="flex items-center gap-3">
          <div className="p-1.5 rounded-lg bg-primary/10">
            <Code className="w-4 h-4 text-primary" />
          </div>
          <strong className="text-[15px] font-semibold tracking-tight text-zinc-800">
            Request Preview & cURL
          </strong>
        </div>
        <button
          onClick={() => copyToClipboard(curlCommand)}
          className="flex items-center gap-1.5 px-3 py-1 bg-zinc-100 hover:bg-zinc-200 text-zinc-600 rounded-lg text-xs font-semibold transition-all active:scale-95"
          title="Copy curl command"
        >
          <Copy className="w-3.5 h-3.5" />
          Copy cURL
        </button>
      </div>

      {/* Content */}
      <div className="p-4 space-y-4">
        {/* Headers Preview */}
        {headers.filter(h => h.key && h.value).length > 0 && (
          <div className="space-y-2">
            <h4 className="text-sm font-semibold text-zinc-700">Headers</h4>
            <div className="space-y-1">
              {headers.filter(h => h.key && h.value).map((header, idx) => (
                <div key={idx} className="flex items-center gap-2 text-sm">
                  <span className="font-medium text-zinc-600 min-w-0 flex-shrink-0">{header.key}:</span>
                  <span className="font-mono text-zinc-800 flex-1 min-w-0 break-all">
                    {renderHeaderValue(header.value)}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Curl Command */}
        <div className="space-y-2">
          <h4 className="text-sm font-semibold text-zinc-700">cURL Command</h4>
          <div className="bg-zinc-900/5 border border-black/5 rounded-xl p-4">
            <pre className="text-[13px] font-mono text-zinc-800 whitespace-pre-wrap overflow-x-auto">
              {curlCommand}
            </pre>
          </div>
        </div>

        <div className="text-xs text-zinc-500">
          Variables like <code className="bg-blue-100 text-blue-800 px-1 rounded">{'{{key}}'}</code> will be substituted with their values when sending the request.
        </div>
      </div>
    </div>
  )
}
