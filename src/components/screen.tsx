import { ReactNode } from 'react'
import { GameHeader, Header } from './header'

type Props = {
  children: ReactNode
  title: string
}

export function Screen({ title, children }: Props) {
  return (
    <div className="px-3 grow">
      <div className="mt-3 mb-8">
        <GameHeader />
        <Header>{title}</Header>
      </div>

      {children}
    </div>
  )
}