import { PinInput } from './pin_input'
import { duplicateChars } from 'jotto_core'
import { useState } from 'react'
import ValidWordList from 'jotto_core/words.json'
import { Guess } from 'src/core'
import { Button } from './button'
import { useMe } from 'src/core/hooks'
import classNames from 'classnames'

type Props = {
  className?: string
  buttonLabel: string
  onSubmit: (word: string) => void
}

export function FiveWordInput({ className, buttonLabel, onSubmit }: Props) {
  const [error, setError] = useState<string>()
  const [value, setValue] = useState<string>('')
  const { me } = useMe()
  // determine if the value is valid
  const isValid = !error && value.length === 5

  // handle pin input change
  function onChange(value: string) {
    setValue(value)
    setError(valid(value, me.guesses))
  }

  // render
  return (
    <div className={classNames('flex flex-col gap-3', className)}>
      {error &&
        <div className="text-red-800 text-center">{error}</div>
      }
      <div className="flex justify-center">
        <PinInput
          numFields={5}
          value={value}
          onChange={onChange}
        />
      </div>
      <Button
        text={buttonLabel}
        className="w-full"
        disabled={!isValid}
        onClick={() => {
          onSubmit(value)
          setValue('')
        }}
      ></Button>
    </div>
  )
}


function valid(word: string, guesses: Guess[] | undefined): string | undefined {
  if (duplicateChars(word).length > 0) {
    return 'Cannot have a duplicate letter'
  }

  if (guesses) {
    if (guesses.map(g => g.word).includes(word)) {
      return 'Already guessed this word'
    }
  }

  if (word.length === 5) {
    if (!ValidWordList.words.includes(word)) {
      return 'Not a valid word'
    }
  }
}

export interface FiveWordChangeEvent {

  /**
   * The current value of the input
   */
  value: string | undefined

  /**
   * The complete word otherwise undefined
   */
  word: string | undefined

  /**
   * Whether the value is a valid word
   */
  isValid: boolean

  /**
   * What the error is
   */
  error: string | undefined
}