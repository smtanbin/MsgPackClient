'use client'

import EnvPanel from '../home/EnvPanel'
import { useRouter } from 'next/navigation'
import { useState, useEffect } from 'react'
import { getItem, setItem } from '@/app/utils/db'

export default function EnvPage() {
  const router = useRouter()
  const [baseUrl, setBaseUrl] = useState('')
  const [vars, setVars] = useState<Array<{key: string, value: string}>>([])

  useEffect(() => {
    const load = async () => {
      const b = await getItem('mpc-base-url') || ''
      const v = JSON.parse(await getItem('mpc-header-vars') || '[]')
      setBaseUrl(b)
      setVars(v)
    }
    load()
  }, [])

  const onBaseUrlChange = (v: string) => {
    setBaseUrl(v)
    setItem('mpc-base-url', v)
    window.dispatchEvent(new CustomEvent('mpc:baseUrl', { detail: v }))
  }

  const onAddVar = () => {
    setVars(prev => [...prev, { key: '', value: '' }])
  }

  const onUpdateVar = (index: number, kv: {key: string, value: string}) => {
    const newVars = vars.map((v, i) => i === index ? kv : v)
    setVars(newVars)
    setItem('mpc-header-vars', JSON.stringify(newVars))
    window.dispatchEvent(new CustomEvent('mpc:headerVars', { detail: newVars }))
  }

  const onRemoveVar = (index: number) => {
    const newVars = vars.filter((_, i) => i !== index)
    setVars(newVars)
    setItem('mpc-header-vars', JSON.stringify(newVars))
    window.dispatchEvent(new CustomEvent('mpc:headerVars', { detail: newVars }))
  }

  const onResetAll = () => {
    setVars([])
    setItem('mpc-header-vars', '[]')
    window.dispatchEvent(new CustomEvent('mpc:headerVars', { detail: [] }))
  }

  const onClose = () => {
    router.back()
  }

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <EnvPanel baseUrl={baseUrl} vars={vars} onBaseUrlChange={onBaseUrlChange} onAddVar={onAddVar} onUpdateVar={onUpdateVar} onRemoveVar={onRemoveVar} onResetAll={onResetAll} onClose={onClose} />
    </div>
  )
}