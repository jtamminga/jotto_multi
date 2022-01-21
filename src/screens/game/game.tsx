import { useState } from 'react'
import { Button, FiveWordChangeEvent, FiveWordInput } from 'src/components'
import { players } from 'src/core/di'
import { useMe } from 'src/core/hooks'

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
      <div>
        <div>name: {me.username}</div>
        <div>word: {me.word}</div>
        <div>won: {me.won ? 'yes!' : 'not yet'}</div>
        <div>against: {me.opponent.username}</div>
      </div>

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

      <div>
        <b>guesses:</b>
        <ol>
          {me.guesses.map(guess =>
            <li key={guess.id}>
              word: {guess.word}, common: {guess.common}
            </li>
          )}
        </ol>
      </div>
    </div>
  )

}