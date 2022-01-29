import { PinInput } from './pin_input'
import { duplicateChars } from 'jotto_core'
import { useState } from 'react'

type Props = {
  value?: string,
  onChange?: (event: FiveWordChangeEvent) => void
}

export function FiveWordInput(props: Props) {
  const [error, setError] = useState<string>()

  // handle pin input change
  function onChange(value: string) {
    const error = valid(value)
    const isValid = !error && value.length == 5
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


function valid(word: string): string | undefined {
  if (duplicateChars(word).length > 0) {
    return 'word cannot have a duplicate letter'
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