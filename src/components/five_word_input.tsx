import { PinInput } from './pin_input'
import { duplicateChars } from 'jotto_core'
import { useState } from 'react'
import ValidWordList from 'jotto_core/words.json'
import { Guess } from 'src/core'

type Props = {
  value?: string,
  guesses?: Guess[],
  onChange?: (event: FiveWordChangeEvent) => void
}

export function FiveWordInput(props: Props) {
  const [error, setError] = useState<string>()

  // handle pin input change
  function onChange(value: string) {
    
    const error = valid(value, props.guesses)
    const isValid = !error && value.length === 5
    const word = isValid ? value : undefined
    
    setError(error)

    if (props.onChange) {
      props.onChange({
        value,
        word,
        isValid,
        error
      })
    }
  }

  // render
  return (
    <div>
      <PinInput
        numFields={5}
        value={props.value}
        onChange={onChange}
      />
      { error &&
        <div className="text-red-800 pt-3">{error}</div>
      }
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