import { ReactNode } from 'react'

export function GameHeader() {
  return (
    <div>
      <h1 className="text-2xl mb-3">Jotto</h1>
    </div>
  )
}

type HeaderProps = { children: ReactNode }

export function Header({ children }: HeaderProps) {
  return (
    <h4 className="text-lg mb-3">{children}</h4>
  )
}