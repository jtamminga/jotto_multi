import classNames from "classnames"
import { MouseEventHandler, ReactNode } from "react"

type Props = {
  onClick: MouseEventHandler<HTMLButtonElement>
  className?: string
  children: ReactNode
}

export function Clickable({ onClick, className, children }: Props) {
  return (
    <button
      className={classNames(className, style)}
      onClick={onClick}
    >
      {children}
    </button>
  )
}

const style =
  'bg-slate-100 px-6 py-3 rounded ' +
  'hover:bg-slate-100 active:bg-slate-100 ' +
  'focus:ring focus:ring-slate-200 focus:outline-none'