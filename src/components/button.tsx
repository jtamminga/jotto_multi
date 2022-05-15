import { MouseEventHandler } from 'react'
import classNames from 'classnames'
import { Loader } from './loader'

type Type = 'primary' | 'secondary' | 'link'

type Params = {
  onClick: MouseEventHandler<HTMLButtonElement>
  text: string
  type?: Type,
  disabled?: boolean
  loading?: boolean
  className?: string
}

export function Button({
  text,
  type = 'primary',
  disabled,
  loading,
  className,
  onClick
}: Params) {

  const classes = classNames(
    'h-12 px-6 flex justify-center items-center transition-colors',

    {
      // loading state
      'animate-pulse': loading,

      // primary style
      'text-white font-semibold rounded': type === 'primary',
      [primaryStyle]: type === 'primary',

      // secondary style
      'border-2 rounded': type === 'secondary',
      [secondaryStyle]: type === 'secondary',

       // link style
      'underline': type === 'link',
      [linkStyle]: type === 'link',
    }, 

    // inherited
    className
  )

  return (
    <button
      type="button"
      disabled={disabled || loading}
      className={classes}
      onClick={onClick}
    >
      {text}
    </button>
  )
}

const primaryStyle =
  'bg-emerald-400 hover:bg-emerald-500 ' +
  'focus:ring focus:ring-emerald-100 focus:border-emerald-400 focus:outline-none ' +
  'disabled:bg-emerald-100'

const secondaryStyle =
  'border-emerald-300 hover:border-emerald-400 text-emerald-500 ' +
  'hover:text-emerald-600 focus:ring focus:ring-emerald-100 focus:outline-none ' +
  'disabled:border-slate-100 disabled:text-slate-300'  

const linkStyle =
  'text-slate-600 hover:text-slate-700 ' +
  'disabled:text-slate-300'
