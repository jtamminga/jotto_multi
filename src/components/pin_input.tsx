import classNames from 'classnames'
import { ReactNode, useEffect, useState } from 'react'
import { filter } from 'rxjs'
import { keyboard } from 'src/core/di'

type Props = {
  numFields: number,
  value?: string,
  onChange?: (val: string) => void,
  className?: string
}

export function PinInput({ numFields, value, className, onChange }: Props) {

  const [word, setWord] = useState('')
 
  // handle keypress events
  useEffect(() => {
    const subscription = keyboard.keyPress$
      .pipe(filter(e => !e.isMarking))
      .subscribe(e => onKeyPress(e.key))

    return () => subscription.unsubscribe()
  }, [word])

  // handle set word events
  useEffect(() => {
    const subscription = keyboard.setWord$
      .subscribe(e => onValueChange(e.word))

    return () => subscription.unsubscribe()
  }, [word])

  // prop update
  useEffect(() => {
    onValueChange(value ?? '')
  }, [value])


  //
  // event handlers
  // ==============


  function onValueChange(val: string) {
    if (onChange && word !== val && val.length <= numFields) {
      onChange(val)
      setWord(val)
    }
  }

  function onKeyPress(key: string) {
    
    if (key === 'backspace') {
      onValueChange(word.substring(0, word.length - 1))
    }

    else if (key === 'clear') {
      onValueChange('')
    }

    else {
      onValueChange(word + key)
    }
  }


  //
  // helper functions
  // ================


  const containerClasses = classNames(
    'flex gap-x-3',
    className
  )


  //
  // rendering
  // =========


  // create the inputs
  const inputs: ReactNode[] = []
  for (let i = 0; i < numFields; i++) {
    inputs.push(
      <div
        key={i}
        className={charStyle(word, i)}
      >{word[i]}</div>
    )
  }

  return (
    <div className={containerClasses}>
      {inputs}
    </div>
  )
}


//
// styles
// ======


function charStyle(word: string, i: number) {
  return classNames(
    'uppercase w-12 h-14 flex items-center justify-center border border-1 border-slate-200 rounded',
    {
      'ring ring-emerald-100 border-emerald-400': i === word.length,
      'bg-slate-100': i < word.length
    }
  )
}