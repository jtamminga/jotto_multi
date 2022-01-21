import { MouseEventHandler } from 'react'
import classNames from 'classnames'

type Type = 'primary' | 'link'

type Params = {
  onClick: MouseEventHandler<HTMLButtonElement>
  text: string
  type?: Type,
  disabled?: boolean
  className?: string
}

export function Button({
  text,
  type = 'primary',
  disabled,
  className,
  onClick
}: Params) {

  const classes = classNames(
    'h-12 px-6',

    // primary style
    { 'text-white font-semibold rounded': type === 'primary' },
    { [primaryStyle]: type === 'primary' && !disabled },
    { 'bg-emerald-100': type === 'primary' && disabled },

    // link style
    { 'text-slate-600 hover:text-slate-700 underline': type === 'link' && !disabled },
    { 'text-slate-300 underline': type === 'link' && disabled },

    // inherited
    className
  )

  return (
    <button
      type="button"
      disabled={disabled}
      className={classes}
      onClick={onClick}
    >{text}</button>

  )
}

const primaryStyle =
  'bg-emerald-400  hover:bg-emerald-500 ' +
  'focus:ring focus:ring-emerald-100 focus:border-emerald-400 focus:outline-none'


