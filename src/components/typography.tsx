import { ReactNode } from 'react'

type Props = {
  children: ReactNode
}

export function Text({ children }: Props) {
  return <span className="text-slate-900 dark:text-white">{children}</span>
}

export function Em({ children }: Props) {
  return <span className="text-emerald-500">{children}</span>
}

export function Muted({ children }: Props) {
  return <span className="text-slate-400">{children}</span>
}