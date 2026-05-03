import { NextResponse } from 'next/server'

export const runtime = 'edge'

function filterHopByHopHeaders(headers: Headers) {
  const out: Record<string, string> = {}
  headers.forEach((value, key) => {
    const k = key.toLowerCase()
    // Hop-by-hop headers that shouldn't be forwarded.
    if (
      k === 'connection' ||
      k === 'keep-alive' ||
      k === 'proxy-authenticate' ||
      k === 'proxy-authorization' ||
      k === 'te' ||
      k === 'trailer' ||
      k === 'transfer-encoding' ||
      k === 'upgrade'
    ) {
      return
    }
    out[key] = value
  })
  return out
}

function sanitizeForwardHeaders(input: unknown) {
  const out: Record<string, string> = {}
  if (!input || typeof input !== 'object') return out

  for (const [rawKey, rawValue] of Object.entries(input as Record<string, unknown>)) {
    if (typeof rawValue !== 'string') continue
    const key = rawKey.trim()
    if (!key) continue

    const lower = key.toLowerCase()
    if (
      lower === 'connection' ||
      lower === 'keep-alive' ||
      lower === 'proxy-authenticate' ||
      lower === 'proxy-authorization' ||
      lower === 'te' ||
      lower === 'trailer' ||
      lower === 'transfer-encoding' ||
      lower === 'upgrade' ||
      lower === 'host' ||
      lower === 'content-length'
    ) {
      continue
    }

    out[key] = rawValue
  }

  return out
}

function resolveTargetUrl(rawTarget: string, reqUrl: string) {
  const trimmed = rawTarget.trim()
  if (!trimmed) {
    return { error: 'Invalid x-target-url value' } as const
  }

  const hasProtocol = /^[a-z][a-z0-9+.-]*:\/\//i.test(trimmed)
  const looksLikeHost = /^(localhost|\d{1,3}(?:\.\d{1,3}){3}|[a-z0-9.-]*\.[a-z]{2,})(:\d+)?(\/.*)?$/i.test(trimmed)
  const targetString = hasProtocol ? trimmed : looksLikeHost ? `http://${trimmed}` : trimmed

  try {
    const base = new URL(reqUrl)
    const target = new URL(targetString, base)
    if (target.protocol !== 'http:' && target.protocol !== 'https:') {
      return { error: 'x-target-url must use http or https protocol' } as const
    }
    return { url: target.toString() } as const
  } catch {
    return { error: 'Invalid x-target-url value' } as const
  }
}

type ProxyRequestMethod = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE' | 'HEAD' | 'OPTIONS'

async function handleProxy(req: Request) {
  // Back-compat with the existing UI: it sends metadata via x-* headers.
  const targetUrlRaw = req.headers.get('x-target-url')
  const originalMethod = (req.headers.get('x-original-method') || 'POST').toUpperCase() as ProxyRequestMethod
  const forwardHeadersRaw = req.headers.get('x-forward-headers')
  const allowedMethods = new Set<ProxyRequestMethod>(['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'HEAD', 'OPTIONS'])

  if (!targetUrlRaw) {
    return NextResponse.json({ error: 'Missing x-target-url header' }, { status: 400 })
  }

  if (!allowedMethods.has(originalMethod)) {
    return NextResponse.json({ error: 'Invalid x-original-method header' }, { status: 400 })
  }

  const resolvedTarget = resolveTargetUrl(targetUrlRaw, req.url)
  if ('error' in resolvedTarget) {
    return NextResponse.json({ error: resolvedTarget.error }, { status: 400 })
  }
  const targetUrl = resolvedTarget.url

  let forwardHeaders: Record<string, string> = {}
  if (forwardHeadersRaw) {
    try {
      forwardHeaders = sanitizeForwardHeaders(JSON.parse(forwardHeadersRaw))
    } catch {
      return NextResponse.json({ error: 'Invalid x-forward-headers JSON' }, { status: 400 })
    }
  }

  // Read body as bytes (if any).
  const bodyBytes = await req.arrayBuffer()
  const hasBody = bodyBytes.byteLength > 0

  let upstreamResp: Response
  try {
    upstreamResp = await fetch(targetUrl, {
      method: originalMethod,
      headers: forwardHeaders,
      body: hasBody && originalMethod !== 'GET' && originalMethod !== 'HEAD' ? bodyBytes : undefined,
      redirect: 'manual'
    })
  } catch (e: unknown) {
    const detail = e instanceof Error ? e.message : String(e)
    return NextResponse.json({ error: 'Upstream fetch failed', detail, targetUrl }, { status: 502 })
  }

  const respBytes = await upstreamResp.arrayBuffer()
  const respHeaders = filterHopByHopHeaders(upstreamResp.headers)

  // Return raw bytes; caller can msgpack-decode.
  return new NextResponse(respBytes, {
    status: upstreamResp.status,
    statusText: upstreamResp.statusText,
    headers: {
      ...respHeaders,
      // Ensure browsers treat it as bytes.
      'content-type': respHeaders['content-type'] || 'application/octet-stream'
    }
  })
}

export const POST = handleProxy
export const GET = handleProxy
