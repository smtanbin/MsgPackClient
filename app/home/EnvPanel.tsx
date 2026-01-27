'use client'

import { Plus, Trash2, RotateCw, Save as SaveIcon, X, Edit3, Check, X as CancelIcon } from 'lucide-react'
import { setItem } from '@/app/utils/db'
import { useState } from 'react'

type KV = { key: string; value: string }

type Props = {
  baseUrl: string
  vars: KV[]
  onBaseUrlChange: (v: string) => void
  onAddVar: () => void
  onUpdateVar: (index: number, kv: KV) => void
  onRemoveVar: (index: number) => void
  onResetAll: () => void
  onClose: () => void
}

export default function EnvPanel({ baseUrl, vars, onBaseUrlChange, onAddVar, onUpdateVar, onRemoveVar, onResetAll, onClose }: Props) {
  const [editingIndex, setEditingIndex] = useState<number | null>(null)
  const [editKey, setEditKey] = useState('')
  const [editValue, setEditValue] = useState('')
  const [keyError, setKeyError] = useState('')

  const validateKey = (key: string) => {
    if (!key.trim()) return 'Key name is required'
    if (!/^[a-zA-Z0-9_]+$/.test(key)) return 'Key name can only contain letters, numbers, and underscores'
    return ''
  }

  const startEdit = (index: number, key: string, value: string) => {
    setEditingIndex(index)
    setEditKey(key)
    setEditValue(value)
    setKeyError('')
  }

  const saveEdit = () => {
    const error = validateKey(editKey)
    if (error) {
      setKeyError(error)
      return
    }
    if (editingIndex !== null) {
      onUpdateVar(editingIndex, { key: editKey, value: editValue })
    }
    setEditingIndex(null)
    setEditKey('')
    setEditValue('')
    setKeyError('')
  }

  const cancelEdit = () => {
    setEditingIndex(null)
    setEditKey('')
    setEditValue('')
    setKeyError('')
  }
  return (
    <div className="bg-white rounded-3xl shadow-xl border border-gray-200 w-full max-w-4xl p-8 flex flex-col gap-6">

          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold text-zinc-900">Environment Settings</h2>
            <button onClick={onClose} className="p-2 hover:bg-gray-200 rounded-full transition">
              <X className="w-6 h-6 text-zinc-700" />
            </button>
          </div>

          <div className="flex flex-col gap-4 rounded-xl p-6 border border-gray-100 bg-gray-50">
            <label className="text-base font-medium text-zinc-700">Base URL</label>
            <input
                type="text"
                value={baseUrl}
                onChange={(e) => onBaseUrlChange(e.target.value)}
                placeholder="https://api.example.com"
                className="bg-white border border-gray-200 rounded-lg px-4 py-3 text-base font-mono shadow-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition text-zinc-800"
            />
            <div className="flex gap-3 items-center mt-3">
              <button
                  className="flex items-center gap-2 text-sm px-4 py-2 rounded-lg bg-gray-200 text-gray-800 hover:bg-gray-300 font-medium active:scale-95 transition-transform"
                  onClick={async () => { try { await setItem('mpc-base-url', baseUrl) } catch (e) { void e } }}
              >
                <SaveIcon className="w-4 h-4" />
                Save
              </button>
              <button
                  className="flex items-center gap-2 text-sm px-4 py-2 rounded-lg bg-gray-200 text-gray-800 hover:bg-gray-300 font-medium active:scale-95 transition-transform"
                  onClick={() => onBaseUrlChange('')}
              >
                <RotateCw className="w-4 h-4" />
                Reset
              </button>
              <p className="text-sm text-gray-500 ml-auto">Relative URLs will be prefixed by Base URL.</p>
            </div>
          </div>

          <div className="flex items-center justify-between">
            <strong className="text-base font-semibold text-zinc-900">Environment Variables</strong>
            <div className="flex items-center gap-2">
              <button
                onClick={onResetAll}
                className="inline-flex items-center gap-2 bg-red-500 text-white rounded-lg px-3 py-2 text-sm font-medium shadow-sm hover:bg-red-600 active:scale-95 transition-transform"
              >
                <RotateCw className="w-4 h-4" />
                Reset All
              </button>
              <button
                onClick={onAddVar}
                className="inline-flex items-center gap-2 bg-primary text-white rounded-lg px-4 py-2 text-sm font-medium shadow-sm hover:bg-primary/90 active:scale-95 transition-transform"
              >
                <Plus className="w-4 h-4" />
                Add Variable
              </button>
            </div>
          </div>

          {vars.length > 0 ? (
            <div className="border border-gray-200 rounded-lg overflow-hidden">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-3 text-left text-sm font-medium text-zinc-700">Variable Name</th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-zinc-700">Value</th>
                    <th className="px-4 py-3 text-center text-sm font-medium text-zinc-700 w-32">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {vars.map((v, i) => (
                    <tr key={i} className="hover:bg-gray-50">
                      <td className="px-4 py-3">
                        {editingIndex === i ? (
                          <div>
                            <input
                              type="text"
                              value={editKey}
                              onChange={(e) => {
                                setEditKey(e.target.value)
                                setKeyError('')
                              }}
                              className="w-full bg-white border border-gray-300 rounded px-3 py-2 text-sm font-mono focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                              placeholder="variable_name"
                            />
                            {keyError && <p className="text-red-500 text-xs mt-1">{keyError}</p>}
                          </div>
                        ) : (
                          <div className="flex items-center gap-2">
                            <code className="bg-gray-100 px-2 py-1 rounded text-sm font-mono text-zinc-800">
                              {'{{' + v.key + '}}'}
                            </code>
                          </div>
                        )}
                      </td>
                      <td className="px-4 py-3">
                        {editingIndex === i ? (
                          <input
                            type="text"
                            value={editValue}
                            onChange={(e) => setEditValue(e.target.value)}
                            className="w-full bg-white border border-gray-300 rounded px-3 py-2 text-sm font-mono focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                            placeholder="variable value"
                          />
                        ) : (
                          <input
                            type="text"
                            value={v.value}
                            disabled
                            className="w-full bg-gray-50 border border-gray-200 rounded px-3 py-2 text-sm font-mono text-zinc-600 cursor-not-allowed"
                          />
                        )}
                      </td>
                      <td className="px-4 py-3 text-center">
                        {editingIndex === i ? (
                          <div className="flex items-center justify-center gap-2">
                            <button
                              onClick={saveEdit}
                              className="p-1 text-green-600 hover:text-green-800 transition"
                              title="Save"
                            >
                              <Check className="w-4 h-4" />
                            </button>
                            <button
                              onClick={cancelEdit}
                              className="p-1 text-gray-600 hover:text-gray-800 transition"
                              title="Cancel"
                            >
                              <CancelIcon className="w-4 h-4" />
                            </button>
                          </div>
                        ) : (
                          <div className="flex items-center justify-center gap-2">
                            <button
                              onClick={() => startEdit(i, v.key, v.value)}
                              className="p-1 text-blue-600 hover:text-blue-800 transition"
                              title="Edit"
                            >
                              <Edit3 className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => onRemoveVar(i)}
                              className="p-1 text-red-600 hover:text-red-800 transition"
                              title="Remove"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="text-center py-8 text-gray-500">
              <p className="text-sm">No environment variables added yet.</p>
              <p className="text-xs mt-1">Click Add Variable to create your first variable.</p>
            </div>
          )}

          <div className="text-sm text-gray-600 bg-blue-50 rounded-lg p-4 border border-blue-200">
            <strong className="text-blue-800">Variable Usage:</strong> Use variables with <code className="bg-blue-100 px-1 py-0.5 rounded text-xs">{'{{name}}'}</code> in URLs and headers.
            Variable names can only contain letters, numbers, and underscores.
          </div>
        </div>
  )
}
