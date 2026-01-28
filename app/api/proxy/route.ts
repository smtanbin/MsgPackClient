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

export async function POST(req: Request) {
  // Back-compat with the existing UI: it sends metadata via x-* headers.
  const targetUrl = req.headers.get('x-target-url')
  const originalMethod = (req.headers.get('x-original-method') || 'POST').toUpperCase()
  const forwardHeadersRaw = req.headers.get('x-forward-headers')

  if (!targetUrl) {
    return NextResponse.json({ error: 'Missing x-target-url header' }, { status: 400 })
  }

  let forwardHeaders: Record<string, string> = {}
  if (forwardHeadersRaw) {
    try {
      forwardHeaders = JSON.parse(forwardHeadersRaw) as Record<string, string>
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
      body: hasBody ? bodyBytes : undefined,
      redirect: 'manual'
    })
  } catch (e: unknown) {
    return NextResponse.json({ error: 'Upstream fetch failed', detail: String(e) }, { status: 502 })
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
