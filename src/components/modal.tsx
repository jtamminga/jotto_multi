import classnames from 'classnames'
import { MouseEvent, ReactNode, TouchEvent } from 'react'
import { useTransition } from 'react-spring'

type Props = {
  onClose: () => void,
  children: ReactNode
}

export function Modal({ children, onClose }: Props) {

  // const transitions = useTransition(
    
  // )

  return (
    <div
      className="fixed inset-0 z-10 bg-slate-100/[.8] flex flex-col justify-center items-center p-3"
      onClick={() => onClose()}
    >

      <div className="max-w-screen-sm w-full bg-white p-3 rounded drop-shadow-2xl">
        {children}
      </div>

    </div>
  )
}