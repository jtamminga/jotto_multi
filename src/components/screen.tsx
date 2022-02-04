import { ReactNode } from 'react'
import { GameHeader, Header } from './header'

type Props = {
  children: ReactNode
  title: string
}

export function Screen({ title, children }: Props) {
  return (
    <div>
      <GameHeader />
      <Header className="mb-8">{title}</Header>

      {children}
    </div>
  )
}