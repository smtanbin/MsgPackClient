'use client';

import RequestHeadersPanel from './comoponents/RequestHeadersPanel';
import RequestPanel from './comoponents/RequestPanel';
import { useState, useEffect } from 'react';
import { Trash2 } from 'lucide-react';
import URLBar from './URLBar';
import ResponsePanel from "@/app/home/comoponents/ResponsePanel";


type Endpoint = { name: string };
type HeaderKV = { key: string; value: string };

type HttpMethod = 'GET' | 'POST' | 'PUT' | 'DELETE' | 'HEAD';

export default function Home() {
  const [mounted, setMounted] = useState(false);

  // -- States --
  const [method, setMethod] = useState<HttpMethod>('POST');
  const [url, setUrl] = useState<string>('');
  const [baseUrl, setBaseUrl] = useState<string | undefined>(undefined);
  const [loading, setLoading] = useState(false);

  const [endpoints, setEndpoints] = useState<Endpoint[]>([{ name: 'Endpoint 1' }]);
  const [activeIdx, setActiveIdx] = useState<number>(0);

  const [methodsList, setMethodsList] = useState<HttpMethod[]>(['POST']);
  const [urlsList, setUrlsList] = useState<string[]>(['']);
  const [requestTexts, setRequestTexts] = useState<string[]>(['']);
  const [headersList, setHeadersList] = useState<HeaderKV[][]>([[]]);
  const [customHeaderInput, setCustomHeaderInput] = useState<string[]>(['']);

  // -- Effect 1: Initialization --
  // Mount logic + Load from LocalStorage + Custom Event Listener
  useEffect(() => {
    try {
      const storage = {
        method: localStorage.getItem('mpc-method') as HttpMethod,
        url: localStorage.getItem('mpc-url'),
        endpoints: JSON.parse(localStorage.getItem('mpc-endpoints') || 'null'),
        activeIdx: Number(localStorage.getItem('mpc-active-ep') || '0'),
        methods: JSON.parse(localStorage.getItem('mpc-methods-list') || 'null'),
        urls: JSON.parse(localStorage.getItem('mpc-urls-list') || 'null'),
        reqs: JSON.parse(localStorage.getItem('mpc-request-texts') || 'null'),
        headers: JSON.parse(localStorage.getItem('mpc-headers-list') || 'null'),
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
      console.error('Failed to load state from localStorage:', e);
    }

    setMounted(true);

    const onBaseChange = (e: Event) => {
      setBaseUrl((e as CustomEvent).detail || undefined);
    };
    window.addEventListener('mpc:baseUrl', onBaseChange);
    return () => window.removeEventListener('mpc:baseUrl', onBaseChange);
  }, []);

  // -- Effect 2: Persistence --
  // Consolidate ALL state saving into one single periodic effect
  useEffect(() => {
    if (!mounted) return;
    try {
      localStorage.setItem('mpc-method', method);
      localStorage.setItem('mpc-url', url);
      localStorage.setItem('mpc-endpoints', JSON.stringify(endpoints));
      localStorage.setItem('mpc-active-ep', String(activeIdx));
      localStorage.setItem('mpc-methods-list', JSON.stringify(methodsList));
      localStorage.setItem('mpc-urls-list', JSON.stringify(urlsList));
      localStorage.setItem('mpc-request-texts', JSON.stringify(requestTexts));
      localStorage.setItem('mpc-headers-list', JSON.stringify(headersList));
    } catch {}
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

  const handleSend = () => {
    setLoading(true);
    setTimeout(() => setLoading(false), 1000);
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
                <button className={`h-10 px-4 text-sm rounded-full ${endpoints.length >= 9 ? 'text-gray-300 cursor-not-allowed' : 'text-[#86868b] hover:text-[#1d1d1f] bg-white border border-gray-200'}`} onClick={addEndpoint} disabled={endpoints.length >= 9}>+ New</button>
              </div>

              <div className="flex-none ml-auto">
                <button
                  className="h-10 px-4 text-sm rounded-full bg-gray-400 text-white hover:bg-black shadow-sm hover:shadow-md transition-all active:scale-95 flex items-center gap-2"
                  onClick={() => {

                    console.log('Open environment panel');
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
                  className="w-full px-3 py-2 bg-white border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  {endpoints.map((ep, idx) => (
                    <option key={idx} value={idx}>
                      {ep.name || `Endpoint ${idx + 1}`}
                    </option>
                  ))}
                </select>
              </div>
              <button
                className={`px-3 py-2 text-sm rounded-full ${endpoints.length >= 9 ? 'text-gray-300 cursor-not-allowed' : 'text-[#86868b] hover:text-[#1d1d1f] bg-white border border-gray-200'}`}
                onClick={addEndpoint}
                disabled={endpoints.length >= 9}
              >
                +
              </button>
              <button
                className="px-3 py-2 bg-gray-400 text-white hover:bg-black rounded-lg shadow-sm hover:shadow-md transition-all active:scale-95"
                onClick={() => {
                  // TODO: Open environment panel
                  console.log('Open environment panel');
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
                          <input
                            type="text"
                            className="flex-1 px-3 py-2 border border-primary/30 rounded-lg text-sm font-mono bg-white/80 focus:outline-none focus:ring-2 focus:ring-primary/20"
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
                          onAdd={() => setHeadersList(hs => hs.map((h, i) => i === idx ? [...h, { key: '', value: '' }] : h))}
                          onUpdate={(hIdx, kv) => setHeadersList(hs => hs.map((h, i) => i === idx ? h.map((v, j) => j === hIdx ? kv : v) : h))}
                          onRemove={hIdx => setHeadersList(hs => hs.map((h, i) => i === idx ? h.filter((_, j) => j !== hIdx) : h))}
                        />
                        <RequestPanel
                          requestText={requestTexts[idx]}
                          onChange={val => setRequestTexts(reqs => reqs.map((r, i) => i === idx ? val : r))}
                        />
                      </div>
                      <div className="flex flex-col gap-4">
                        {/* Placeholder for ResponsePanel or other right-side content */}

                          <ResponsePanel statusLine={""} error={null} responseDecoded={undefined} responseRaw={""}/>

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
