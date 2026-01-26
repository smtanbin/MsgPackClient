'use client'

import { Plus, Trash2, RotateCw, Save as SaveIcon, X } from 'lucide-react'

type KV = { key: string; value: string }

type Props = {
  baseUrl: string
  vars: KV[]
  onBaseUrlChange: (v: string) => void
  onAddVar: () => void
  onUpdateVar: (index: number, kv: KV) => void
  onRemoveVar: (index: number) => void
  onClose: () => void
}

export default function EnvPanel({ baseUrl, vars, onBaseUrlChange, onAddVar, onUpdateVar, onRemoveVar, onClose }: Props) {
  return (
      <div className="fixed inset-0 z-50 bg-black/20 backdrop-blur-sm flex items-center justify-center p-4">
        <div className="bg-white/90 backdrop-blur-md rounded-3xl shadow-xl border border-gray-200 w-full max-w-lg p-6 flex flex-col gap-5">

          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-zinc-900">Environment</h2>
            <button onClick={onClose} className="p-1 hover:bg-gray-200 rounded-full transition">
              <X className="w-5 h-5 text-zinc-700" />
            </button>
          </div>

          <div className="flex flex-col gap-3 rounded-xl p-4 border border-gray-100 bg-gray-50">
            <label className="text-sm font-medium text-zinc-700">Base URL</label>
            <input
                type="text"
                value={baseUrl}
                onChange={(e) => onBaseUrlChange(e.target.value)}
                placeholder="https://api.example.com"
                className="bg-white border border-gray-200 rounded-lg px-3 py-2 text-sm font-mono shadow-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition"
            />
            <div className="flex gap-2 items-center mt-2">
              <button
                  className="flex items-center gap-1 text-sm px-3 py-1.5 rounded-lg bg-primary text-white hover:bg-primary/90 font-medium active:scale-95 transition-transform"
                  onClick={() => { try { localStorage.setItem('mpc-base-url', baseUrl) } catch (e) { void e } }}
              >
                <SaveIcon className="w-4 h-4" />
                Save
              </button>
              <button
                  className="flex items-center gap-1 text-sm px-3 py-1.5 rounded-lg bg-gray-200 text-gray-800 hover:bg-gray-300 font-medium active:scale-95 transition-transform"
                  onClick={() => onBaseUrlChange('')}
              >
                <RotateCw className="w-4 h-4" />
                Reset
              </button>
              <p className="text-xs text-gray-500 ml-auto">Relative URLs will be prefixed by Base URL.</p>
            </div>
          </div>

          <div className="flex items-center justify-between">
            <strong className="text-sm font-semibold text-zinc-900">Header Variables</strong>
            <button
                onClick={onAddVar}
                className="inline-flex items-center gap-1 bg-primary text-white rounded-lg px-3 py-1.5 text-sm font-medium shadow-sm hover:bg-primary/90 active:scale-95 transition-transform"
            >
              <Plus className="w-4 h-4" />
              New
            </button>
          </div>

          <div className="flex flex-col gap-2 max-h-56 overflow-y-auto">
            {vars.map((v, i) => (
                <div key={i} className="flex gap-2 items-center p-2">
                  <input
                      type="text"
                      placeholder="Name (e.g. token)"
                      value={v.key}
                      onChange={(e) => onUpdateVar(i, { key: e.target.value, value: v.value })}
                      className="flex-1 bg-white border border-gray-200 rounded-lg px-3 py-2 text-sm font-mono shadow-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition"
                  />
                  <input
                      type="text"
                      placeholder="Value"
                      value={v.value}
                      onChange={(e) => onUpdateVar(i, { key: v.key, value: e.target.value })}
                      className="flex-1 bg-white border border-gray-200 rounded-lg px-3 py-2 text-sm font-mono shadow-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition"
                  />
                  <button
                      onClick={() => onRemoveVar(i)}
                      className="inline-flex items-center gap-1 text-red-500 px-2 py-1 text-sm font-medium hover:text-red-600 transition"
                  >
                    <Trash2 className="w-4 h-4" />
                    Remove
                  </button>
                </div>
            ))}
          </div>

          <div className="text-xs text-gray-500 bg-gray-50 rounded-lg p-3">Use variables with {'{{name}}'} in URLs and headers.</div>
        </div>
      </div>
  )
}
