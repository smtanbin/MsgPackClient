import type { ReactNode } from 'react'

export default function MsgpackLayout({ children }: { children: ReactNode }) {
  return <div className="min-h-screen p-4">{children}</div>
}
