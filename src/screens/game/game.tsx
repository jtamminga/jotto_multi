import { ReactNode, useRef, useState } from 'react'
import { Button, FiveWordChangeEvent, FiveWordInput } from 'src/components'
import { gameFlow } from 'src/core/di'
import { useMe, useNotes } from 'src/core/hooks'
import { GuessResults } from './components/guess_results'
import { Hud } from './components/hud'
import { Observer } from './components/observer'

export function Game() {
  const [value, setValue] = useState<string>()
  const [isValid, setIsValid] = useState(false)
  const guessListRef = useRef<HTMLDivElement>(null)

  const { me } = useMe()
  const { notes } = useNotes()

  function onChange(e: FiveWordChangeEvent) {
    setIsValid(e.isValid)
    setValue(e.value)
  }

  function onGuess() {
    me.guess(value!)
    setValue(undefined)
    guessListRef.current?.scrollTo({ top: 0, behavior: 'smooth' })
  }

  let content: ReactNode = null

  if (me.won) {
    content = (
      <div className="bg-emerald-100 p-5 rounded text-center mb-5">
        You guessed right! 🥳

        <Button
          text="Observe"
          className="mt-3 w-full"
          onClick={() => gameFlow.observe()}
        />
      </div>
    )
  } else {
    content = (
      <>
        <div className="flex justify-center mb-5">
          <FiveWordInput
            value={value}
            guesses={me.guesses}
            onChange={onChange}
          />
        </div>

        <Button
          text="Guess"
          className="w-full mb-5"
          disabled={!isValid}
          onClick={onGuess}
        />
      </>
    )
  }

  return (
    <>
      <div className="px-3">
        <Hud className="my-2" />

        <Observer
          className="mb-5"
          onClick={word => word && setValue(word)}
        />

        {content}
      </div>

      <div className="px-3 grow overflow-y-auto" ref={guessListRef}>
        <div className="text-center mb-3">
          Guesses
        </div>

        <GuessResults
          guesses={me.guesses}
          notes={notes}
        />
      </div>
    </>
  )

}