import { useState } from 'react'
import { Button, FiveWordChangeEvent, FiveWordInput } from 'src/components'
import { players } from 'src/core/di'
import { useMe } from 'src/core/hooks'
import { GuessResults } from './components/guess_results'
import { Hud } from './components/hud'
import { Observer } from './components/observer'

export function Game() {
  const [word, setWord] = useState<string>()
  const [isValid, setIsValid] = useState(false)

  const { me } = useMe()

  function onChange(e: FiveWordChangeEvent) {
    setIsValid(e.isValid)
    if (e.isValid) {
      setWord(e.word)
    }
  }

  function onGuess() {
    players.me.guess(word!)
    setWord(undefined)
  }

  return (
    <div>
      <Hud me={me} className="my-2" />
      <Observer
        className="mb-5"
        onClick={word => word && setWord(word)}
      />

      <div className="flex justify-center mb-5">
        <FiveWordInput
          value={word}
          onChange={onChange}
        />
      </div>

      <Button
        text="Guess"
        className="w-full"
        disabled={!isValid}
        onClick={onGuess}
      />

      <div className="mt-5">
        <div className="text-center mb-3">
          Guesses
        </div>

        <GuessResults guesses={me.guessResults} />
      </div>
    </div>
  )

}