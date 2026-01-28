'use client'

import { useRouter } from 'next/navigation'
import { useState, useEffect } from 'react'
import { getItem, setItem } from '@/app/utils/db'
import { Plus, Trash2, Settings, X, Check, Edit, Eye, EyeOff, Copy, CheckCircle2 } from 'lucide-react'

export default function EnvPage() {
  const router = useRouter()
  const [baseUrl, setBaseUrl] = useState('')
  const [vars, setVars] = useState<Array<{ key: string, value: string, type: 'default' | 'secret' }>>([])
  const [validationErrors, setValidationErrors] = useState<Record<number, string>>({})
  const [editingIndex, setEditingIndex] = useState<number | null>(null)
  const [editKey, setEditKey] = useState('')
  const [editValue, setEditValue] = useState('')
  const [editType, setEditType] = useState<'default' | 'secret'>('default')
  const [hiddenValues, setHiddenValues] = useState<Set<number>>(new Set())
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null)

  useEffect(() => {
    const load = async () => {
      const b = await getItem('mpc-base-url') || ''
      const v = JSON.parse(await getItem('mpc-header-vars') || '[]')
      setBaseUrl(b)
      setVars(v.map((item: any) => ({
        key: item.key,
        value: item.value,
        type: item.type || 'default'
      })))

      // Hide all secret values by default
      const secretIndices = new Set<number>()
      v.forEach((item: any, idx: number) => {
        if (item.type === 'secret') {
          secretIndices.add(idx)
        }
      })
      setHiddenValues(secretIndices)
    }
    load()
  }, [])

  const onBaseUrlChange = (v: string) => {
    setBaseUrl(v)
    setItem('mpc-base-url', v)
    window.dispatchEvent(new CustomEvent('mpc:baseUrl', { detail: v }))
  }

  const onAddVar = () => {
    setVars(prev => [...prev, { key: '', value: '', type: 'default' }])
    setEditingIndex(vars.length)
    setEditKey('')
    setEditValue('')
    setEditType('default')
  }

  const toggleValueVisibility = (index: number) => {
    setHiddenValues(prev => {
      const newSet = new Set(prev)
      if (newSet.has(index)) {
        newSet.delete(index)
      } else {
        newSet.add(index)
      }
      return newSet
    })
  }

  const copyToClipboard = async (text: string, index: number) => {
    try {
      await navigator.clipboard.writeText(text)
      setCopiedIndex(index)
      setTimeout(() => setCopiedIndex(null), 2000)
    } catch (err) {
      console.error('Failed to copy:', err)
    }
  }

  const onRemoveVar = (index: number) => {
    const newVars = vars.filter((_, i) => i !== index)
    setVars(newVars)
    setValidationErrors(prev => {
      const newErrors = { ...prev }
      delete newErrors[index]
      return newErrors
    })
    setItem('mpc-header-vars', JSON.stringify(newVars))
    window.dispatchEvent(new CustomEvent('mpc:headerVars', { detail: newVars }))
  }

  const startEdit = (index: number) => {
    const variable = vars[index]
    setEditingIndex(index)
    setEditKey(variable.key)
    setEditValue(variable.value)
    setEditType(variable.type)
  }

  const saveEdit = () => {
    if (editingIndex === null) return

    const trimmedKey = editKey.trim().toUpperCase()
    const trimmedValue = editValue.trim()

    // Validate
    let error = ''
    if (!trimmedKey) {
      error = 'Variable name is required'
    } else {
      const isDuplicate = vars.some((v, i) => i !== editingIndex && v.key.trim().toUpperCase() === trimmedKey)
      if (isDuplicate) {
        error = 'Variable name already exists'
      }
    }

    if (!trimmedValue) {
      error = error || 'Variable value is required'
    }

    if (error) {
      setValidationErrors(prev => ({
        ...prev,
        [editingIndex]: error
      }))
      return
    }

    const newVars = vars.map((v, i) => i === editingIndex ? { key: trimmedKey, value: trimmedValue, type: editType } : v)
    setVars(newVars)
    setValidationErrors(prev => {
      const newErrors = { ...prev }
      delete newErrors[editingIndex]
      return newErrors
    })

    // Auto-hide secret values
    if (editType === 'secret') {
      setHiddenValues(prev => new Set(prev).add(editingIndex))
    }

    setEditingIndex(null)
    setEditKey('')
    setEditValue('')
    setEditType('default')
    setItem('mpc-header-vars', JSON.stringify(newVars))
    window.dispatchEvent(new CustomEvent('mpc:headerVars', { detail: newVars }))
  }

  const cancelEdit = () => {
    // If it's a new variable (empty), remove it
    if (editingIndex !== null && !vars[editingIndex].key && !vars[editingIndex].value) {
      onRemoveVar(editingIndex)
    }
    setEditingIndex(null)
    setEditKey('')
    setEditValue('')
    setEditType('default')
    setValidationErrors(prev => {
      const newErrors = { ...prev }
      if (editingIndex !== null) {
        delete newErrors[editingIndex]
      }
      return newErrors
    })
  }

  const onResetAll = () => {
    if (!window.confirm('Are you sure you want to delete all variables? This action cannot be undone.')) {
      return
    }
    setVars([])
    setValidationErrors({})
    setEditingIndex(null)
    setEditKey('')
    setEditValue('')
    setEditType('default')
    setHiddenValues(new Set())
    setItem('mpc-header-vars', '[]')
    window.dispatchEvent(new CustomEvent('mpc:headerVars', { detail: [] }))
  }

  const onClose = () => {
    setValidationErrors({})
    setEditingIndex(null)
    setEditKey('')
    setEditValue('')
    setEditType('default')
    router.back()
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-primary">
                <Settings className="w-5 h-5 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-semibold text-gray-900">
                  Environment Variables
                </h1>
                <p className="text-xs text-gray-500 mt-0.5">
                  Manage global variables for your API requests
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 text-gray-600 hover:text-gray-800 rounded-lg hover:bg-gray-100 transition-colors"
              title="Close"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="space-y-6">
          {/* Base URL Section */}
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <label className="text-sm font-semibold text-gray-900">Base URL</label>
                <span className="text-xs text-gray-500">Optional</span>
              </div>
              <input
                type="text"
                value={baseUrl}
                onChange={(e) => onBaseUrlChange(e.target.value)}
                placeholder="https://api.example.com"
                className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-sm font-mono text-gray-900 placeholder:text-gray-600 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
              />
              <p className="text-xs text-gray-500">
                Set a base URL that will be prepended to all relative paths in your requests
              </p>
            </div>
          </div>

          {/* Variables Section */}
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
            {/* Table Header */}
            <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-sm font-semibold text-gray-900">Variables</h2>
                  <p className="text-xs text-gray-500 mt-0.5">
                    {vars.length} {vars.length === 1 ? 'variable' : 'variables'}
                  </p>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={onAddVar}
                    className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg text-sm font-medium hover:bg-primary/90 transition-all active:scale-95 shadow-sm"
                  >
                    <Plus className="w-4 h-4" />
                    Add Variable
                  </button>
                  {vars.length > 0 && (
                    <button
                      onClick={onResetAll}
                      className="px-4 py-2 bg-white border border-gray-200 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-50 transition-all active:scale-95"
                    >
                      Clear All
                    </button>
                  )}
                </div>
              </div>
            </div>

            {/* Table */}
            {vars.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50 border-b border-gray-200">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider w-[35%]">
                        Variable
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider w-[35%]">
                        Initial Value
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider w-[15%]">
                        Type
                      </th>
                      <th className="px-6 py-3 text-center text-xs font-semibold text-gray-600 uppercase tracking-wider w-[15%]">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {vars.map((v, idx) => (
                      <tr key={idx} className="hover:bg-gray-50 transition-colors">
                        {editingIndex === idx ? (
                          <>
                            <td className="px-6 py-4">
                              <input
                                type="text"
                                value={editKey}
                                onChange={(e) => setEditKey(e.target.value)}
                                className={`w-full px-3 py-2 text-sm font-mono border rounded-lg focus:outline-none focus:ring-2 transition-all ${validationErrors[idx]
                                    ? 'border-red-300 focus:ring-red-200 bg-red-50'
                                    : 'border-gray-300 focus:ring-primary/20 bg-white'
                                  }`}
                                placeholder="VARIABLE_NAME"
                                autoFocus
                              />
                              {validationErrors[idx] && (
                                <p className="text-xs text-red-600 mt-1.5 flex items-center gap-1">
                                  <span className="w-1 h-1 bg-red-600 rounded-full"></span>
                                  {validationErrors[idx]}
                                </p>
                              )}
                            </td>
                            <td className="px-6 py-4">
                              <input
                                type="text"
                                value={editValue}
                                onChange={(e) => setEditValue(e.target.value)}
                                className="w-full px-3 py-2 text-sm font-mono border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 bg-white"
                                placeholder="value"
                              />
                            </td>
                            <td className="px-6 py-4">
                              <select
                                value={editType}
                                onChange={(e) => setEditType(e.target.value as 'default' | 'secret')}
                                className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 bg-white"
                              >
                                <option value="default">Default</option>
                                <option value="secret">Secret</option>
                              </select>
                            </td>
                            <td className="px-6 py-4">
                              <div className="flex items-center justify-center gap-2">
                                <button
                                  onClick={saveEdit}
                                  className="px-3 py-1.5 bg-green-500 hover:bg-green-600 text-white rounded-md text-xs font-medium transition-all active:scale-95"
                                  title="Save"
                                >
                                  Save
                                </button>
                                <button
                                  onClick={cancelEdit}
                                  className="px-3 py-1.5 bg-gray-200 hover:bg-gray-300 text-gray-700 rounded-md text-xs font-medium transition-all active:scale-95"
                                  title="Cancel"
                                >
                                  Cancel
                                </button>
                              </div>
                            </td>
                          </>
                        ) : (
                          <>
                            <td className="px-6 py-4">
                              <div className="flex items-center gap-2">
                                <code className="text-sm font-mono font-semibold text-primary">
                                  {v.key}
                                </code>
                              </div>
                            </td>
                            <td className="px-6 py-4">
                              <div className="flex items-center gap-2">
                                {v.type === 'secret' && hiddenValues.has(idx) ? (
                                  <span className="text-sm text-gray-600 font-mono select-none">
                                    ••••••••••••
                                  </span>
                                ) : (
                                  <span className="text-sm text-gray-700 font-mono break-all">
                                    {v.value}
                                  </span>
                                )}
                                {v.type === 'secret' && (
                                  <button
                                    onClick={() => toggleValueVisibility(idx)}
                                    className="p-1 text-gray-600 hover:text-gray-800 rounded transition-colors flex-shrink-0"
                                    title={hiddenValues.has(idx) ? 'Show value' : 'Hide value'}
                                  >
                                    {hiddenValues.has(idx) ? (
                                      <Eye className="w-4 h-4" />
                                    ) : (
                                      <EyeOff className="w-4 h-4" />
                                    )}
                                  </button>
                                )}
                                <button
                                  onClick={() => copyToClipboard(v.value, idx)}
                                    className="p-1 text-gray-600 hover:text-gray-800 rounded transition-colors flex-shrink-0"
                                  title="Copy value"
                                >
                                  {copiedIndex === idx ? (
                                    <CheckCircle2 className="w-4 h-4 text-green-500" />
                                  ) : (
                                    <Copy className="w-4 h-4" />
                                  )}
                                </button>
                              </div>
                            </td>
                            <td className="px-6 py-4">
                              <span className={`inline-flex items-center px-2.5 py-1 rounded-md text-xs font-medium ${v.type === 'secret'
                                  ? 'bg-purple-100 text-purple-700'
                                  : 'bg-gray-100 text-gray-700'
                                }`}>
                                {v.type === 'secret' ? 'Secret' : 'Default'}
                              </span>
                            </td>
                            <td className="px-6 py-4">
                              <div className="flex items-center justify-center gap-1">
                                <button
                                  onClick={() => startEdit(idx)}
                                  className="p-2 text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded-lg transition-colors"
                                  title="Edit variable"
                                >
                                  <Edit className="w-4 h-4" />
                                </button>
                                <button
                                  onClick={() => onRemoveVar(idx)}
                                  className="p-2 text-red-600 hover:text-red-800 hover:bg-red-50 rounded-lg transition-colors"
                                  title="Delete variable"
                                >
                                  <Trash2 className="w-4 h-4" />
                                </button>
                              </div>
                            </td>
                          </>
                        )}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="px-6 py-16 text-center">
                <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-gray-100 mb-4">
                  <Settings className="w-6 h-6 text-gray-600" />
                </div>
                <h3 className="text-sm font-medium text-gray-900 mb-1">No variables yet</h3>
                <p className="text-sm text-gray-500 mb-4">
                  Create your first variable to get started
                </p>
                <button
                  onClick={onAddVar}
                  className="inline-flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg text-sm font-medium hover:bg-primary/90 transition-all active:scale-95 shadow-sm"
                >
                  <Plus className="w-4 h-4" />
                  Add Variable
                </button>
              </div>
            )}
          </div>

          {/* Usage Guide */}
          <div className="bg-gradient-to-br from-blue-50 to-indigo-50 border border-blue-200 rounded-xl p-6">
            <div className="flex items-start gap-3">
              <div className="p-2 rounded-lg bg-blue-500 flex-shrink-0">
                <Check className="w-4 h-4 text-white" />
              </div>
              <div className="flex-1">
                <h3 className="text-sm font-semibold text-blue-900 mb-2">How to use variables</h3>
                <p className="text-sm text-blue-800 mb-4">
                  Reference variables using double curly braces: <code className="bg-blue-100 px-2 py-0.5 rounded font-mono text-xs">{'{{VARIABLE_NAME}}'}</code>
                </p>
                <div className="space-y-3">
                  <div className="bg-white/60 rounded-lg p-3 border border-blue-200">
                    <div className="text-xs font-semibold text-blue-900 mb-1">In URLs:</div>
                    <code className="text-xs text-blue-700 font-mono break-all">
                      {baseUrl || 'https://api.example.com'}/users/{vars.length > 0 ? `{{${vars[0].key}}}` : '{{USER_ID}}'}
                    </code>
                  </div>
                  <div className="bg-white/60 rounded-lg p-3 border border-blue-200">
                    <div className="text-xs font-semibold text-blue-900 mb-1">In Headers:</div>
                    <code className="text-xs text-blue-700 font-mono break-all">
                      Authorization: Bearer {vars.length > 0 ? `{{${vars[0].key}}}` : '{{API_TOKEN}}'}
                    </code>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}