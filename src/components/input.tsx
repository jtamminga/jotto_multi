import classNames from 'classnames'
import { DetailedHTMLProps, ForwardedRef, forwardRef, InputHTMLAttributes } from 'react'

type Props = DetailedHTMLProps<InputHTMLAttributes<HTMLInputElement>, HTMLInputElement>

function _input(props: Props, ref: ForwardedRef<null>) {

  const classes = classNames(
    inputStyle,
    props.className
  )

  return (

    <input
      ref={ref}
      autoComplete="new-password"
      {...props}
      className={classes}
    />

  )
}

const inputStyle =
  'appearance-none h-12 rounded text-slate-00 px-4 w-full ' +
  'border border-1 border-slate-200 ' +
  'focus:ring focus:ring-emerald-100 focus:border-emerald-400 focus:outline-none'


// decorate with forward ref and export
export const Input = forwardRef(_input)