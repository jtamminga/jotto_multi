import { ReactNode } from 'react'

type Props = {
  children: ReactNode
}

export function Em({ children }: Props) {
  return <span className="text-emerald-500">{children}</span>
}

export function Muted({ children }: Props) {
  return <span className="text-slate-400">{children}</span>
}