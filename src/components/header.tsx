import classNames from 'classnames'
import { ReactNode } from 'react'

type ClassProps = {
  className?: string
}

export function GameHeader({ className }: ClassProps) {
  const classes = classNames(
    'text-2xl text-center font-black uppercase',
    className
  )

  return (
    <div>
      <h1 className={classes}>Jotto</h1>
    </div>
  )
}

//
// Header
//

type HeaderProps = { children: ReactNode } & ClassProps

export function Header({ children, className }: HeaderProps) {
  const classes = classNames(
    'text-lg text-center',
    className
  )

  return (
    <h1 className={classes}>{children}</h1>
  )
}