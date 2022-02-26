import classNames from 'classnames'
import { ReactNode } from 'react'

type Props = {
  isMe: boolean
  children: ReactNode
  style?: Style
}

export function PlayerContainer({ isMe, children, style = 'primary' }: Props) {
  return (
    <div className={containerStyle(style, isMe)}>
      {children}
    </div>
  )
}


//
// style
// =====


type Style = 'primary' | 'secondary' | 'grand'

function containerStyle(style: Style, isMe: boolean): string {
  switch(style) {

    case 'primary':
      return classNames(
        'flex items-center bg-slate-100 p-2 px-3 rounded',
        { 'outline outline-offset-2 outline-2 outline-slate-200': isMe }
      )

    case 'secondary':
      return classNames(
        'flex items-center bg-orange-100 p-2 px-3 rounded',
        { 'outline outline-offset-2 outline-2 outline-orange-300': isMe }
      )

    case 'grand':
      return classNames(
        'flex items-center bg-yellow-100 px-3 py-4 rounded',
        { 'outline outline-offset-2 outline-2 outline-yellow-300': isMe }
      )

  }
}