import { MouseEventHandler } from 'react'
import classNames from 'classnames'

type Type = 'primary' | 'secondary' | 'link'

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
    { [primaryStyleEnabled]: type === 'primary' && !disabled },
    { [primaryStyleDisabled]: type === 'primary' && disabled },

    // secondary style
    { 'border-2 rounded': type === 'secondary' },
    { [secondaryStyleEnabled]: type === 'secondary' && !disabled },
    { [secondaryStyleDisabled]: type === 'secondary' && disabled },

    // link style
    { 'underline': type === 'link' },
    { [linkStyleEnabled]: type === 'link' && !disabled },
    { [linkStyleDisabled]: type === 'link' && disabled },

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

const primaryStyleEnabled =
  'bg-emerald-400  hover:bg-emerald-500 ' +
  'focus:ring focus:ring-emerald-100 focus:border-emerald-400 focus:outline-none'

const primaryStyleDisabled =
  'bg-emerald-100 disabled'

const secondaryStyleEnabled =
  'border-emerald-300 hover:border-emerald-400 text-emerald-500 ' +
  'hover:text-emerald-600 focus:ring focus:ring-emerald-100 focus:outline-none'

const secondaryStyleDisabled =
  'border-slate-100 disabled text-slate-300'

const linkStyleEnabled =
  'text-slate-600 hover:text-slate-700'

const linkStyleDisabled =
  'text-slate-300 disabled'
