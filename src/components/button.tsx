import { MouseEventHandler } from 'react'
import classNames from 'classnames'

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

    // primary style
    { 'text-white font-semibold rounded': type === 'primary' },
    { [primaryStyle]: type === 'primary' },
    { 'text-emerald-500': loading },

    // secondary style
    { 'border-2 rounded': type === 'secondary' },
    { [secondaryStyle]: type === 'secondary' },

    // link style
    { 'underline': type === 'link' },
    { [linkStyle]: type === 'link' },

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
      {loading ?
        <><Loader /> <span>Loading</span></>
        :
        <span>{text}</span>
      }
    </button>
  )
}

function Loader() {
  return (
    <svg className="animate-spin h-5 w-5 text-emerald-500 mr-2" fill="none" viewBox="0 0 24 24">
      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
    </svg>
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
