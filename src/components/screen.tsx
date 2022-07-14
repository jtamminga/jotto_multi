import { ReactNode, useState } from 'react'
import { appFlow } from 'src/core/di'
import { Button } from './button'
import { GameHeader, Header } from './header'
import { Modal } from './modal'

type Props = {
  children: ReactNode
  title: string
  canLeave?: boolean
}

export function Screen({ title, children, canLeave = true }: Props) {

  const [isModalVisible, showModal] = useState(false)

  return (
    <EmptyScreen>

      {/* confirm modal */}
      <Modal visible={isModalVisible} onClose={() => showModal(false)}>
        <div className="text-center mb-3">
          Are you sure you want to leave?
        </div>

        <div className="flex space-x-3">
          <Button
            text="Yes"
            type="secondary"
            className="grow"
            onClick={() => appFlow.leave()}
          />

          <Button
            text="No"
            type="primary"
            className="grow"
            onClick={() => showModal(false)}
          />
        </div>
      </Modal>

      {/* main jotto header */}
      <div className="mt-3 mb-8">
        <div className="relative">
          <GameHeader />

          { canLeave &&
            <button
              className="absolute top-0 right-0 text-slate-400 underline z-10"
              onClick={() => showModal(true)}
            >
              Leave
            </button>
          }
        </div>

        {/* screen title */}
        <Header>{title}</Header>
      </div>

      {children}
    </EmptyScreen>
  )
}


// basic empty screen
export function EmptyScreen({ children }: Record<'children', ReactNode>) {
  return (
    <div className="px-3 grow flex flex-col">
      {children}
    </div>
  )
}