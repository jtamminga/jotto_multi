import classNames from 'classnames'
import { ReactNode } from 'react'

type Props = {
  children: ReactNode
  className?: string
}

export function PlayersHeader({ className, children }: Props) {
  const classes = classNames('flex px-3', className)

  return (
    <div className={classes}>
      <div className="w-6"></div>
      <div className="flex grow text-slate-400 text-sm">
        {children}
      </div>
    </div>
  )
}