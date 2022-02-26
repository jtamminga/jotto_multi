import classNames from 'classnames'
import { ReactNode } from 'react'

type Props = {
  isMe: boolean
  children: ReactNode
  style?: Style
  num?: number 
}

export function PlayerContainer({ isMe, children, num, style = 'primary' }: Props) {
  return (
    <div className={containerStyle(style, isMe)}>
      { num !== undefined &&
        <div className={numStyle(style)}>
          {num}
        </div>
      }
      <div className="grow flex items-center">
        {children}
      </div>
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
        'flex bg-slate-100 p-2 px-3 rounded',
        { 'ring-2 ring-slate-200': isMe }
      )

    case 'secondary':
      return classNames(
        'flex bg-orange-100 p-2 px-3 rounded',
        { 'ring-2 ring-orange-200': isMe }
      )

    case 'grand':
      return classNames(
        'flex bg-yellow-100 px-3 py-4 rounded',
        { 'ring-2 ring-yellow-200': isMe }
      )

  }
}

function numStyle(style: Style): string {
  let color: string
  switch(style) {
    case 'primary':
    case 'secondary':
      color = 'text-slate-400'
      break

    case 'grand':
      color = 'text-yellow-500'
      break
  }

  return 'w-6 ' + color
}