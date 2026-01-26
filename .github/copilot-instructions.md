# MsgPackClient - AI Coding Agent Instructions

## Project Overview
A modern MessagePack testing client built with Next.js 16.1+ and React 19, similar to Postman but specialized for MessagePack binary serialization. The app provides two main features: API testing with MsgPack encoding/decoding, and a standalone encoder/decoder tool.

## Architecture & Key Components

### App Structure (Next.js App Router)
- **[app/page.tsx](../app/page.tsx)**: Landing page with "Open Client" button redirecting to `/home`
- **[app/home/page.tsx](../app/home/page.tsx)**: Main API testing interface with multi-tab endpoint management (up to 9 tabs)
- **[app/encoder-decoder/page.tsx](../app/encoder-decoder/page.tsx)**: Standalone MsgPack ↔ JSON converter
- **[app/api/proxy/route.ts](../app/api/proxy/route.ts)**: Server-side proxy to bypass CORS, handles binary MsgPack requests

### State Management Pattern
**Critical**: This app uses localStorage + React state, NOT external state libraries. All state is persisted to localStorage on every change.

Key state keys (see [app/home/page.tsx](../app/home/page.tsx)):
- `mpc-method`, `mpc-url`, `mpc-endpoints`, `mpc-active-ep`
- `mpc-methods-list`, `mpc-urls-list`, `mpc-request-texts`, `mpc-headers-list`
- `mpc-base-url` (managed in [ClientShell.tsx](../app/home/ClientShell.tsx))

State is synchronized via custom events (`window.dispatchEvent(new CustomEvent('mpc:baseUrl', {...}))`).

### Tab System (Multi-Endpoint Management)
Each tab represents a separate API endpoint with independent:
- HTTP method (GET, POST, PUT, DELETE, HEAD)
- URL and request body
- Custom headers
- Arrays indexed by `activeIdx`: `methodsList[activeIdx]`, `urlsList[activeIdx]`, etc.

Max 9 tabs enforced in `addEndpoint()` function.

### MessagePack Encoding/Decoding
Uses `@msgpack/msgpack` library (v3.1.3):
```typescript
import { encode, decode } from '@msgpack/msgpack'
const encoded = encode(jsonObject)  // Returns Uint8Array
const decoded = decode(uint8Array)   // Returns any
```

Hex conversion utilities in [RequestPanel.tsx](../app/home/components/RequestPanel.tsx) and [encoder-decoder/page.tsx](../app/encoder-decoder/page.tsx):
```typescript
function bytesToHex(bytes: Uint8Array): string
function hexToBytes(hex: string): Uint8Array | null
```

## Styling Conventions

### Color System
Primary brand color defined in [globals.css](../app/globals.css):
```css
--color-primary: rgb(244, 29, 97)  /* Pink/magenta */
```
Use `bg-primary`, `text-primary`, `ring-primary/10` classes.

### Component Design Pattern
All panels follow this structure (see [RequestPanel.tsx](../app/home/components/RequestPanel.tsx)):
```tsx
<div className="rounded-2xl bg-white/80 backdrop-blur-xl border border-black/5 ring-1 ring-black/5 shadow-sm">
  <div className="flex items-center justify-between px-5 py-3 border-b border-black/5">
    {/* Header with icon + title */}
  </div>
  <div className="p-4">
    {/* Content */}
  </div>
</div>
``` 

### Typography
- Font: SF Pro Display/Text fallback (`font-family: -apple-system, BlinkMacSystemFont...`)
- Use `font-semibold`, `tracking-tight` for headings
- Monospace for code/JSON: `font-mono text-[13px]`

## Development Workflow

### Commands
```bash
npm run dev    # Start dev server at localhost:3000
npm run build  # Production build
npm run lint   # ESLint check
```

### File Naming
- Components: PascalCase (e.g., `RequestPanel.tsx`, `EnvPanel.tsx`)
- Routes: lowercase (e.g., `page.tsx`, `layout.tsx`)
- Note: components live under `app/home/components/` (create new panels there)

### TypeScript Configuration
- Path alias: `@/*` maps to project root (see [tsconfig.json](../tsconfig.json))
- Import example: `import ResponsePanel from "@/app/home/components/ResponsePanel"`
- Strict mode enabled, target ES2017

## Critical Patterns

### Client Components
All interactive components MUST have `'use client'` directive at top (Next.js 13+ requirement).

### Copy to Clipboard Pattern
Use the fallback pattern from [RequestPanel.tsx](../app/home/components/RequestPanel.tsx#L23-L33):
```typescript
function copyToClipboard(text: string) {
  if (navigator.clipboard) {
    navigator.clipboard.writeText(text)
  } else {
    // Fallback for older browsers
    const textarea = document.createElement('textarea')
    textarea.value = text
    document.body.appendChild(textarea)
    textarea.select()
    document.execCommand('copy')
    document.body.removeChild(textarea)
  }
}
```

### Proxy API Usage
Client sends MsgPack via `/api/proxy` with metadata headers:
- `x-target-url`: Actual endpoint URL
- `x-original-method`: HTTP method (GET, POST, etc.)
- `x-forward-headers`: JSON-stringified headers object

The proxy filters hop-by-hop headers and returns raw binary response.

### Size Calculation & Reduction Stats
All encoder/decoder components show size reduction percentage:
```typescript
const jsonSize = new Blob([jsonText]).size
const hexSize = encodedBytes.length
const reduction = jsonSize > 0 ? ((jsonSize - hexSize) / jsonSize) * 100 : 0
```

## Dependencies & Integration

### Key Libraries
- **Next.js**: 16.1.4 (App Router, React Server Components)
- **React**: 19.2.3 (latest with concurrent features)
- **Lucide React**: Icon library (`lucide-react@0.563.0`)
- **Tailwind CSS**: 4.1.18 (with @tailwindcss/postcss)

### No External State Management
Do NOT suggest Redux, Zustand, or Context API. State management is intentionally simple using:
1. React useState
2. localStorage persistence
3. Custom events for cross-component sync

## Common Tasks

### Adding a New Tab Feature
1. Update state arrays in [app/home/page.tsx](../app/home/page.tsx) (add new array to track per-tab data)
2. Add to `useEffect` persistence block
3. Update `addEndpoint()` and `removeEndpoint()` to manage array
4. Sync with `activeIdx` changes

### Adding a New Panel Component
1. Create in `app/home/components/`
2. Add `'use client'` directive
3. Follow the rounded-2xl card pattern
4. Use Lucide icons from `lucide-react`
5. Add to [app/home/page.tsx](../app/home/page.tsx) layout

### Modifying MessagePack Handling
- Encoding logic: [RequestPanel.tsx](../app/home/components/RequestPanel.tsx)
- Decoding logic: [ResponsePanel.tsx](../app/home/components/ResponsePanel.tsx)
- Bidirectional: [encoder-decoder/page.tsx](../app/encoder-decoder/page.tsx)
- Proxy layer: [api/proxy/route.ts](../app/api/proxy/route.ts)

## Testing & Debugging
- Use browser DevTools → Application → LocalStorage to inspect state
- Check Network tab for `/api/proxy` requests
- MessagePack errors typically show in encode/decode try-catch blocks
- Invalid JSON shows inline error in encoder panels

## Accessibility
- All interactive elements need `aria-label` attributes
- Logo is clickable with keyboard support (`tabIndex={0}`)
- Use semantic HTML (`<button>`, `<label>`, etc.)
