/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useEffect } from 'react'
import { encode, decode } from '@msgpack/msgpack'
import HeadersPanel from '@/app/home/comoponents/RequestHeadersPanel'
import HexDecodePanel from './HexDecodePanel'
import RequestPanel from '@/app/home/comoponents/RequestPanel'
import ResponsePanel from '@/app/home/comoponents/ResponsePanel'
import URLBar from '@/app/home/URLBar'


function bytesToHex(bytes: Uint8Array) {
  return Array.from(bytes)
    .map((b) => b.toString(16).padStart(2, '0'))
    .join(' ')
}

type KV = { key: string; value: string }

type HeaderKV = { key: string; value: string }

type Props = {
  baseUrl: string
  envVars: KV[]
}

function applyVars(str: string, vars: KV[]) {
  return str.replace(/\{\{([^}]+)\}\}/g, (_, name) => {
    const found = vars.find(v => v.key === String(name).trim())
    return found ? found.value : ''
  })
}

function resolveUrl(input: string, baseUrl: string) {
  const isAbsolute = /^https?:\/\//i.test(input)
  if (isAbsolute || !baseUrl) return input
  if (!input) return baseUrl
  const a = baseUrl.endsWith('/') ? baseUrl.slice(0, -1) : baseUrl
  const b = input.startsWith('/') ? input : `/${input}`
  return a + b
}

export default function MsgPackTester({ baseUrl, envVars }: Props) {
  const [url, setUrl] = useState(() => {
    try {
      return localStorage.getItem('mpc-url') || 'https://httpbin.org/post'
    } catch {
      return 'https://httpbin.org/post'
    }
  })
  const [method, setMethod] = useState(() => {
    try {
      return (localStorage.getItem('mpc-method') as string) || 'POST'
    } catch (e: unknown) {
      void e
      return 'POST'
    }
  })
  const [requestText, setRequestText] = useState(() => {
    try {
      return localStorage.getItem('mpc-request') || '{\n  "hello": "world"\n}'
    } catch {
      return '{\n  "hello": "world"\n}'
    }
  })
  const [responseDecoded, setResponseDecoded] = useState<unknown | null>(null)
  const [responseRaw, setResponseRaw] = useState<string>('')
  const [statusLine, setStatusLine] = useState<string>('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [customHeaders, setCustomHeaders] = useState<Array<{ key: string; value: string }>>(() => {
    try {
      const raw = localStorage.getItem('mpc-headers')
      return raw ? JSON.parse(raw) : []
    } catch {
      return []
    }
  })
  const [leftTab, setLeftTab] = useState<'json' | 'hex'>(() => {
    try {
      return ((localStorage.getItem('mpc-left-tab') as 'json' | 'hex') || 'json')
    } catch {
      return 'json'
    }
  })

  // Expose state collectors (single tool)
  useEffect(() => {
    ;(window as any).__mpc_collect_state = () => ({
      url,
      method,
      requestText,
      customHeaders,
      leftTab
    })
    ;(window as any).__mpc_load_state = (state: any) => {
      try {
        if (typeof state?.url === 'string') setUrl(state.url)
        if (typeof state?.method === 'string') setMethod(state.method)
        if (typeof state?.requestText === 'string') setRequestText(state.requestText)
        if (Array.isArray(state?.customHeaders)) setCustomHeaders(state.customHeaders)
        if (state?.leftTab === 'json' || state?.leftTab === 'hex') setLeftTab(state.leftTab)
      } catch (e) {
        console.error(e)
      }
    }
    return () => {
      delete (window as any).__mpc_collect_state
      delete (window as any).__mpc_load_state
    }
  }, [url, method, requestText, customHeaders, leftTab])

  useEffect(() => {
    try {
      localStorage.setItem('mpc-method', method)
    } catch (e: unknown) {
      void e
    }
  }, [method])

  useEffect(() => {
    try {
      localStorage.setItem('mpc-url', url)
    } catch (e) { void e }
  }, [url])

  useEffect(() => {
    try {
      localStorage.setItem('mpc-request', requestText)
    } catch (e) { void e }
  }, [requestText])

  useEffect(() => {
    try {
      localStorage.setItem('mpc-headers', JSON.stringify(customHeaders))
    } catch (e) { void e }
  }, [customHeaders])

  useEffect(() => {
    try {
      localStorage.setItem('mpc-left-tab', leftTab)
    } catch {
      // ignore
    }
  }, [leftTab])

  async function send() {
    setError(null)
    setResponseDecoded(null)
    setResponseRaw('')
    setStatusLine('')

    let parsed: unknown = null
    if (requestText.trim().length) {
      try {
        parsed = JSON.parse(requestText)
      } catch (err: unknown) {
        setError('Invalid JSON: ' + String(err))
        return
      }
    }

    let encoded: Uint8Array | undefined
    try {
      encoded = parsed === null ? undefined : encode(parsed as any)
    } catch (err: unknown) {
      setError('Encode error: ' + String(err))
      return
    }

    setLoading(true)
    try {
      const targetHeaders: Record<string, string> = {}
      if (encoded) targetHeaders['Content-Type'] = 'application/msgpack'
      targetHeaders['Accept'] = 'application/msgpack, */*'

      // Add custom headers
      customHeaders.forEach((header) => {
        if (header.key.trim() && header.value.trim()) {
          targetHeaders[header.key] = header.value
        }
      })


      const proxyHeaders: Record<string, string> = {
        'x-forward-headers': JSON.stringify(targetHeaders),
        'x-target-url': applyVars(resolveUrl(url, baseUrl), envVars),
        'x-original-method': method
      }

      const proxyUrl = '/api/proxy'
      const fetchOptions: RequestInit = {
        method: 'POST',
        headers: proxyHeaders
      }

      if (encoded) {
        fetchOptions.body = encoded.slice().buffer as ArrayBuffer
      }

      const resp = await fetch(proxyUrl, fetchOptions)
      const arr = new Uint8Array(await resp.arrayBuffer())
      setResponseRaw(bytesToHex(arr))
      setStatusLine(`${resp.status} ${resp.statusText}`)

      try {
        const dec = decode(arr)
        setResponseDecoded(dec)
      } catch {
        try {
          const text = new TextDecoder().decode(arr)
          try {
            setResponseDecoded(JSON.parse(text))
          } catch {
            setResponseDecoded(text)
          }
        } catch (readErr: unknown) {
          setError('Failed to decode response: ' + String(readErr))
        }
      }
    } catch (err: unknown) {
      setError('Network error: ' + String(err))
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <URLBar
         method={method}
         url={url}
         baseUrl={baseUrl}
         loading={loading}
         onMethodChange={setMethod}
         onUrlChange={setUrl}
         onSend={send}
       />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 flex-1">
        <div className="flex flex-col gap-4">
          <div className="bg-white/60 border border-black/10 rounded-2xl p-3 shadow-sm flex flex-col gap-3">
            <div className="bg-white/60 border border-black/10 rounded-xl p-1 shadow-sm">
              <div className="flex">
                <button
                  className={`px-3 py-1.5 text-[12px] rounded-lg ${leftTab === 'json' ? 'bg-white border border-black/10 text-[#1d1d1f]' : 'text-[#86868b]'}`}
                  onClick={() => setLeftTab('json')}
                >JSON</button>
                <button
                  className={`px-3 py-1.5 text-[12px] rounded-lg ${leftTab === 'hex' ? 'bg-white border border-black/10 text-[#1d1d1f]' : 'text-[#86868b]'}`}
                  onClick={() => setLeftTab('hex')}
                >Hex</button>
              </div>
            </div>

            {leftTab === 'json' ? (
              <>
                <HeadersPanel
                  customHeaders={customHeaders}
                  onAdd={() => setCustomHeaders([...customHeaders, { key: '', value: '' }])}
                  onUpdate={(idx: number, kv: HeaderKV) => {
                    const updated = [...customHeaders]
                    updated[idx] = kv
                    setCustomHeaders(updated)
                  }}
                  onRemove={(idx: number) => setCustomHeaders(customHeaders.filter((_, i) => i !== idx))}
                />
                <RequestPanel
                  requestText={requestText}
                  onChange={(v: string) => setRequestText(v)}
                />
              </>
            ) : (
              <HexDecodePanel />
            )}
          </div>
        </div>

        <ResponsePanel
          statusLine={statusLine}
          error={error}
          responseDecoded={responseDecoded}
          responseRaw={responseRaw}
        />
      </div>

    </>
  )
 }
