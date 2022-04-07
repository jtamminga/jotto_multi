import { ReactNode } from 'react'
import { GameHeader, Header } from './header'
import { menu } from 'src/core/di'

type Props = {
  children: ReactNode
  title: string
  showMenu?: boolean
}

export function Screen({ title, children, showMenu = false }: Props) {
  return (
    <div className="px-3 grow flex flex-col">

      {/* main jotto header */}
      <div className="mt-3 mb-8">
        <div className="relative">
          <GameHeader />

          { showMenu &&
            <button
              className="absolute top-0 right-0 text-slate-400 underline z-10"
              onClick={() => menu.toggle()}
            >
              {menu.visible ? 'back' : 'menu'}
            </button>
          }
        </div>

        {/* screen title */}
        <Header>{title}</Header>
      </div>

      {children}
    </div>
  )
}