import classNames from 'classnames'
import { useRef, KeyboardEvent, ReactNode, useEffect } from 'react'
import { Input } from './input'

type Props = {
  numFields: number,
  value?: string,
  onChange?: (val: string) => void,
  onComplete?: (val: string) => void,
  className?: string
}

export function PinInput({ numFields, value, className, onChange }: Props) {

  const refs = useRef<Array<HTMLInputElement | null>>([])

  useEffect(() => {
    if (!value) {
      clear()
      onValueChange('')
      return
    }

    for (let i = 0; i < value.length; i++) {
      const el = refs.current[i]
      if (el) {
        el.value = value[i]
      }
    }

    onValueChange(value)
  }, [value])


  //
  // event handlers
  // ==============


  function onValueChange(val: string) {
    if (onChange) onChange(val)
  }

  function onKey(e: KeyboardEvent<HTMLInputElement>, i: number) {
    // always prevent default
    // only exception is if tabbing on the last input
    if (!(e.key === 'Tab' && !e.shiftKey && i + 1 === numFields)) {
      e.preventDefault()
    }

    var el = refs.current[i]
    if (!el) {
      return
    }

    switch (e.key) {
      case 'Backspace':
        el.value = ''
        onValueChange(getVal())
        focusPrev(i)
        break
      case 'ArrowLeft':
        focusPrev(i)
        break
      case 'ArrowRight':
        focusNext(i)
        break
      case 'Tab':
        if (e.shiftKey) {
          focusPrev(i)
        } else {
          focusNext(i)
        }
        break
    }


    if (e.key.length != 1 || !e.key.match(/[a-z]/i)) {
      return
    }

    el.value = e.key

    focusNext(i)
    onValueChange(getVal())
  }


  //
  // helper functions
  // ================


  function clear() {
    for (let i = 0; i < numFields; i++) {
      refs.current[i]!.value = ''
    }
  }

  function getVal(): string {
    return refs.current
      .reduce((str, ref) => str + ref?.value, '')
      .toLowerCase()
  }

  function focusNext(i: number) {
    refs.current[i + 1]?.focus()
  }

  function focusPrev(i: number) {
    refs.current[i - 1]?.focus()
  }

  const containerClasses = classNames(
    'inline-grid grid-flow-col gap-x-3',
    className
  )


  //
  // rendering
  // =========


  // create the inputs
  const inputs: ReactNode[] = []
  for (let i = 0; i < numFields; i++) {
    inputs.push(
      <Input
        key={i}
        type="text"
        ref={el => refs.current[i] = el}
        className="text-center uppercase w-12"
        onKeyDown={e => onKey(e, i) }
      />
    )
  }

  return (
    <div className={containerClasses}>
      {inputs}
    </div>
  )
}