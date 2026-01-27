'use client';

import RequestHeadersPanel from './components/RequestHeadersPanel';
import RequestPanel from './components/RequestPanel';
import RequestPreview from './components/RequestPreview';
import { useState, useEffect } from 'react';
import { Trash2 } from 'lucide-react';
import URLBar from './URLBar';
import ResponsePanel from "@/app/home/components/ResponsePanel";
import { getItem, setItem } from '@/app/utils/db';


type Endpoint = { name: string }; 
type HeaderKV = { key: string; value: string };

type HttpMethod = 'GET' | 'POST' | 'PUT' | 'DELETE' | 'HEAD';

function applyVars(str: string, vars: Array<{ key: string; value: string }>) {
  return str.replace(/\{\{([^}]+)\}\}/g, (_, name) => {
    const found = vars.find(v => v.key.toLowerCase() === String(name).trim().toLowerCase())
    return found ? found.value : ''
  })
}

export default function Home() {
  const [mounted, setMounted] = useState(false);
  // -- States --
  const [method, setMethod] = useState<HttpMethod>('POST');
  const [url, setUrl] = useState<string>('');
  const [baseUrl, setBaseUrl] = useState<string | undefined>(undefined);
  const [loading, setLoading] = useState(false);
  const [responseData, setResponseData] = useState<{
    statusLine: string;
    error: string | null;
    responseDecoded: unknown | null;
    responseRaw: string;
  }>({
    statusLine: '',
    error: null,
    responseDecoded: null,
    responseRaw: ''
  });

  const [endpoints, setEndpoints] = useState<Endpoint[]>([{ name: 'Endpoint 1' }]);
  const [activeIdx, setActiveIdx] = useState<number>(0);

  const [methodsList, setMethodsList] = useState<HttpMethod[]>(['POST']);
  const [urlsList, setUrlsList] = useState<string[]>(['']);
  const [requestTexts, setRequestTexts] = useState<string[]>(['']);
  const [headersList, setHeadersList] = useState<HeaderKV[][]>([[]]);
  const [customHeaderInput, setCustomHeaderInput] = useState<string[]>(['']);
  const [headerVars, setHeaderVars] = useState<Array<{ key: string; value: string }>>([]);

  // -- Effect 1: Initialization --
  // Mount logic + Load from IndexedDB + Custom Event Listener
  useEffect(() => {
    const loadState = async () => {
      try {
        const storage = {
          method: await getItem('mpc-method') as HttpMethod,
          url: await getItem('mpc-url'),
          endpoints: JSON.parse(await getItem('mpc-endpoints') || 'null'),
          activeIdx: Number(await getItem('mpc-active-ep') || '0'),
          methods: JSON.parse(await getItem('mpc-methods-list') || 'null'),
          urls: JSON.parse(await getItem('mpc-urls-list') || 'null'),
          reqs: JSON.parse(await getItem('mpc-request-texts') || 'null'),
          headers: JSON.parse(await getItem('mpc-headers-list') || 'null'),
        };

        if (storage.method) setMethod(storage.method);
        if (storage.url) setUrl(storage.url);
        if (storage.endpoints) setEndpoints(storage.endpoints);
        if (storage.activeIdx !== undefined) setActiveIdx(storage.activeIdx);
        if (storage.methods) setMethodsList(storage.methods);
        if (storage.urls) setUrlsList(storage.urls);
        if (storage.reqs) setRequestTexts(storage.reqs);
        if (storage.headers) setHeadersList(storage.headers);
      } catch (e) {
        console.error('Failed to load state from database:', e);
      }

      setMounted(true);

      const onBaseChange = (e: Event) => {
        setBaseUrl((e as CustomEvent).detail || undefined);
      };
      window.addEventListener('mpc:baseUrl', onBaseChange);

      const onHeaderVarsChange = (e: Event) => {
        setHeaderVars((e as CustomEvent).detail || []);
      };
      window.addEventListener('mpc:headerVars', onHeaderVarsChange);

      return () => {
        window.removeEventListener('mpc:baseUrl', onBaseChange);
        window.removeEventListener('mpc:headerVars', onHeaderVarsChange);
      };
    };

    loadState();
  }, []);

  // -- Effect 2: Persistence --
  // Consolidate ALL state saving into one single periodic effect
  useEffect(() => {
    if (!mounted) return;
    const saveState = async () => {
      try {
        await setItem('mpc-method', method);
        await setItem('mpc-url', url);
        await setItem('mpc-endpoints', JSON.stringify(endpoints));
        await setItem('mpc-active-ep', String(activeIdx));
        await setItem('mpc-methods-list', JSON.stringify(methodsList));
        await setItem('mpc-urls-list', JSON.stringify(urlsList));
        await setItem('mpc-request-texts', JSON.stringify(requestTexts));
        await setItem('mpc-headers-list', JSON.stringify(headersList));
      } catch (e) {
        console.error('Failed to save state to database:', e);
      }
    };
    saveState();
  }, [mounted, method, url, endpoints, activeIdx, methodsList, urlsList, requestTexts, headersList]);

  // -- Event Handlers --
  // Logic shifted here from useEffects to reduce reactivity complexity
  const handleMethodChange = (m: HttpMethod) => {
    setMethod(m);
    setMethodsList(prev => prev.map((v, i) => i === activeIdx ? m : v));
  };

  const handleUrlChange = (u: string) => {
    setUrl(u);
    setUrlsList(prev => prev.map((v, i) => i === activeIdx ? u : v));
  };

  const handleTabChange = (idx: number) => {
    setActiveIdx(idx);
    setMethod(methodsList[idx] || 'POST');
    setUrl(urlsList[idx] || '');
  };

  const addEndpoint = () => {
    if (endpoints.length >= 9) return;
    const newIdx = endpoints.length;
    const defaultName = `Endpoint ${newIdx + 1}`;
    setEndpoints([...endpoints, { name: defaultName }]);
    setMethodsList([...methodsList, 'POST']);
    setUrlsList([...urlsList, '']);
    setRequestTexts([...requestTexts, '']);
    setHeadersList([...headersList, []]);
    setCustomHeaderInput([...customHeaderInput, '']);
    setActiveIdx(newIdx);
    setMethod('POST');
    setUrl('');
  };

  const removeEndpoint = (idx: number) => {
    if (endpoints.length === 1) return;
    const newEndpoints = endpoints.filter((_, i) => i !== idx);
    const newMethods = methodsList.filter((_, i) => i !== idx);
    const newUrls = urlsList.filter((_, i) => i !== idx);

    setEndpoints(newEndpoints);
    setMethodsList(newMethods);
    setUrlsList(newUrls);
    setRequestTexts(prev => prev.filter((_, i) => i !== idx));
    setHeadersList(prev => prev.filter((_, i) => i !== idx));
    setCustomHeaderInput(prev => prev.filter((_, i) => i !== idx));

    const nextIdx = activeIdx > idx ? activeIdx - 1 : Math.min(newEndpoints.length - 1, activeIdx);
    setActiveIdx(nextIdx);
    setMethod(newMethods[nextIdx] || 'POST');
    setUrl(newUrls[nextIdx] || '');
  };

  const renameEndpoint = (idx: number, name: string) => {
    setEndpoints(eps => eps.map((ep, i) => i === idx ? { ...ep, name } : ep));
  };

  const handleSend = async () => {
    setLoading(true);
    setResponseData({
      statusLine: '',
      error: null,
      responseDecoded: null,
      responseRaw: ''
    });

    try {
      // Get current endpoint data
      const currentHeaders = headersList[activeIdx] || [];
      const currentRequestText = requestTexts[activeIdx] || '';
      const fullUrl = baseUrl && !url.startsWith('http') ? `${baseUrl}${url.startsWith('/') ? url : `/${url}`}` : url;

      // Apply variable substitution
      const substitutedUrl = applyVars(fullUrl, headerVars);

      // Prepare request body
      let body: ArrayBuffer | undefined;
      if (currentRequestText.trim()) {
        const parsed = JSON.parse(currentRequestText);
        const { encode } = await import('@msgpack/msgpack');
        const encoded = encode(parsed);
        body = encoded.buffer.slice(encoded.byteOffset, encoded.byteOffset + encoded.byteLength);
      }

      // Prepare headers with variable substitution
      const headers: Record<string, string> = {};
      currentHeaders.forEach(h => {
        if (h.key && h.value) {
          headers[h.key] = applyVars(h.value, headerVars);
        }
      });

      // Make request to proxy
      const proxyUrl = '/api/proxy';
      const resp = await fetch(proxyUrl, {
        method,
        headers: {
          'x-target-url': substitutedUrl,
          'x-original-method': method,
          'x-forward-headers': JSON.stringify(headers),
          ...(body && { 'Content-Type': 'application/octet-stream' })
        },
        body
      });

      const respBody = await resp.arrayBuffer();
      const { decode } = await import('@msgpack/msgpack');
      let decoded: unknown = null;
      let rawHex = '';

      if (respBody.byteLength > 0) {
        try {
          const uint8 = new Uint8Array(respBody);
          decoded = decode(uint8);
          rawHex = Array.from(uint8).map(b => b.toString(16).padStart(2, '0')).join(' ');
        } catch (e) {
          // If decoding fails, just show raw hex
          const uint8 = new Uint8Array(respBody);
          rawHex = Array.from(uint8).map(b => b.toString(16).padStart(2, '0')).join(' ');
        }
      }

      setResponseData({
        statusLine: `${resp.status} ${resp.statusText}`,
        error: null,
        responseDecoded: decoded,
        responseRaw: rawHex
      });
    } catch (error) {
      setResponseData({
        statusLine: '',
        error: error instanceof Error ? error.message : 'Request failed',
        responseDecoded: null,
        responseRaw: ''
      });
    } finally {
      setLoading(false);
    }
  };

  if (!mounted) return null;

  return (


      <main>
        <div className=" p-1 overflow-hidden">
          {/* Endpoint Tabs UI */}


          <div className="bg-primary-50 rounded-lg border border-black/10 px-4 py-3 overflow-hidden">
            {/* Desktop Tabs */}
            <div role="tablist" aria-label="Endpoints" className="hidden md:flex gap-2 items-center overflow-x-auto">
              {endpoints.map((ep, idx) => {
                const isActive = activeIdx === idx;
                return (
                  <div key={idx} className="relative">
                    <div className="inline-flex items-center">
                      <div
                        id={`endpoint-tab-${idx}`}
                        role="tab"
                        aria-selected={isActive}
                        aria-controls={`endpoint-panel-${idx}`}
                        tabIndex={isActive ? 0 : -1}
                        className={`inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-[13px] font-medium transition cursor-pointer group ${isActive ? 'text-white shadow' : 'bg-white border border-gray-200 text-zinc-700 hover:bg-gray-50'}`}
                        onClick={() => handleTabChange(idx)}
                        onDoubleClick={() => {
                          const newName = prompt('Rename endpoint', ep.name || `Endpoint ${idx + 1}`);
                          if (newName) renameEndpoint(idx, newName);
                        }}
                        style={isActive ? { background: 'var(--color-primary)' } : undefined}
                      >
                        <span className="truncate max-w-40">{ep.name || `Endpoint ${idx + 1}`}</span>
                        {isActive && endpoints.length > 1 && (
                          <button
                            type="button"
                            aria-label="Delete endpoint"
                            onClick={e => { e.stopPropagation(); removeEndpoint(idx); }}
                            className="ml-1 hover:bg-white/20 p-1 rounded-full transition-colors flex items-center justify-center"
                            title="Delete"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
              <div className="flex-none">
                <button className={` px-4 py-1.5 text-sm rounded-full ${endpoints.length >= 9 ? 'text-gray-300 cursor-not-allowed bg-gray-100' : 'bg-accent text-white hover:bg-accent-300 shadow-sm hover:shadow-md transition-all active:scale-95'}`} onClick={addEndpoint} disabled={endpoints.length >= 9}>+ New Tab</button>
              </div>

              <div className="flex-none ml-auto">
                <button
                  className="h-10 px-4 text-sm rounded-full bg-black text-white hover:bg-gray-600 shadow-sm hover:shadow-md transition-all active:scale-95 flex items-center gap-2"
                  onClick={() => {
                    window.dispatchEvent(new CustomEvent('mpc:openEnv'));
                  }}
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  Environment
                </button>
              </div>
            </div>

            {/* Mobile Tabs Dropdown */}
            <div className="md:hidden flex gap-2 items-center">
              <div className="flex-1">
                <select
                  value={activeIdx}
                  onChange={(e) => handleTabChange(Number(e.target.value))}
                  className="w-full px-3 py-2 bg-white border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 text-zinc-800"
                >
                  {endpoints.map((ep, idx) => (
                    <option key={idx} value={idx}>
                      {ep.name || `Endpoint ${idx + 1}`}
                    </option>
                  ))}
                </select>
              </div>
              <button
              className={`px-3 py-2 text-sm rounded-full ${endpoints.length >= 9 ? 'text-gray-300 cursor-not-allowed' : 'text-[#86868b] hover:text-[#1d1d1f] bg-white border border-gray-200 hover:bg-gray-50'}`}
                onClick={addEndpoint}
                disabled={endpoints.length >= 9}
              >
                +
              </button>
              <button
              className="px-3 py-2 bg-primary text-white rounded-lg shadow-sm hover:bg-primary/90 transition-all active:scale-95"
                onClick={() => {
                  window.dispatchEvent(new CustomEvent('mpc:openEnv'));
                }}
                title="Environment"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              </button>
            </div>

            <div className="mt-4 p-4 bg-white rounded-md">
              {/* Global URLBar - always visible */}
              <div className="mb-6">
                <URLBar
                  method={method}
                  url={url}
                  baseUrl={baseUrl}
                  loading={loading}
                  onMethodChange={(v) => handleMethodChange(v as HttpMethod)}
                  onUrlChange={(v) => handleUrlChange(v)}
                  onSend={handleSend}
                />
              </div>

              {/* Tab Content */}
              {endpoints.map((ep, idx) => (
                <div key={idx} id={`endpoint-panel-${idx}`} role="tabpanel" aria-labelledby={`endpoint-tab-${idx}`} aria-hidden={activeIdx !== idx} className={`${activeIdx === idx ? 'block' : 'hidden'}`}>
                  {activeIdx === idx && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="flex flex-col gap-6">
                        {/* Custom Header Input */}
                        <div className="flex items-center gap-2 mb-2">
                          <div className="flex-1 relative">
                            <input
                              type="text"
                              className="w-full px-3 py-2  rounded-lg text-sm font-mono  bg-primary-50 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:shadow-lg focus:shadow-primary/20 text-zinc-800"
                              placeholder="Add custom header (e.g. X-Custom: value)"
                              value={customHeaderInput[idx] || ''}
                              aria-label="Custom header input"
                              aria-describedby={`custom-header-desc-${idx}`}
                              onChange={e => setCustomHeaderInput(arr => arr.map((v, i) => i === idx ? e.target.value : v))}
                              onKeyDown={e => {
                                if (e.key === 'Enter' && customHeaderInput[idx]) {
                                  const [key, ...rest] = customHeaderInput[idx].split(':');
                                  const value = rest.join(':').trim();
                                  if (key && value) {
                                    setHeadersList(hs => hs.map((h, i) => i === idx ? [...h, { key: key.trim(), value }] : h));
                                    setCustomHeaderInput(arr => arr.map((v, i) => i === idx ? '' : v));
                                  }
                                }
                              }}
                            />
                            {/* Variable badges for custom header input */}
                            {(() => {
                              const inputValue = customHeaderInput[idx] || '';
                              const colonIndex = inputValue.indexOf(':');
                              const valuePart = colonIndex !== -1 ? inputValue.slice(colonIndex + 1).trim() : '';
                              const variableRegex = /\{\{([^}]+)\}\}/g;
                              const variables = [];
                              let match;
                              while ((match = variableRegex.exec(valuePart)) !== null) {
                                const varName = match[1];
                                if (headerVars.some(v => v.key === varName)) {
                                  variables.push(varName);
                                }
                              }
                              return variables.length > 0 ? (
                                <div className="flex flex-wrap gap-1 mt-1">
                                  {variables.map((varName, varIdx) => (
                                    <span key={varIdx} className="inline-flex items-center gap-1 bg-blue-100 text-blue-800 px-2 py-0.5 rounded text-xs font-medium">
                                      <code>{`{{${varName}}}`}</code>
                                    </span>
                                  ))}
                                </div>
                              ) : null;
                            })()}
                          </div>
                          <span id={`custom-header-desc-${idx}`} className="sr-only">Type a header as key:value and press Enter or Add</span>
                          <button
                            className="px-3 py-2 bg-primary text-white rounded-lg text-xs font-semibold hover:bg-primary/90 transition-all active:scale-95"
                            aria-label="Add custom header"
                            onClick={() => {
                              if (customHeaderInput[idx]) {
                                const [key, ...rest] = customHeaderInput[idx].split(':');
                                const value = rest.join(':').trim();
                                if (key && value) {
                                  setHeadersList(hs => hs.map((h, i) => i === idx ? [...h, { key: key.trim(), value }] : h));
                                  setCustomHeaderInput(arr => arr.map((v, i) => i === idx ? '' : v));
                                }
                              }
                            }}
                            title="Add custom header"
                          >Add</button>
                        </div>
                        <RequestHeadersPanel
                          customHeaders={headersList[idx]}
                          headerVars={headerVars}
                          onAdd={() => setHeadersList(hs => hs.map((h, i) => i === idx ? [...h, { key: '', value: '' }] : h))}
                          onUpdate={(hIdx, kv) => setHeadersList(hs => hs.map((h, i) => i === idx ? h.map((v, j) => j === hIdx ? kv : v) : h))}
                          onRemove={hIdx => setHeadersList(hs => hs.map((h, i) => i === idx ? h.filter((_, j) => j !== hIdx) : h))}
                        />
                        <RequestPanel
                          requestText={requestTexts[idx]}
                          onChange={val => setRequestTexts(reqs => reqs.map((r, i) => i === idx ? val : r))}
                        />
                        <RequestPreview
                          method={method}
                          url={url}
                          baseUrl={baseUrl}
                          headers={headersList[idx] || []}
                          requestText={requestTexts[idx]}
                          headerVars={headerVars}
                        />
                      </div>
                      <div className="flex flex-col gap-4">
                        {/* Placeholder for ResponsePanel or other right-side content */}

                          <ResponsePanel statusLine={responseData.statusLine} error={responseData.error} responseDecoded={responseData.responseDecoded} responseRaw={responseData.responseRaw}/>

                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>

      </main>

  );
}
