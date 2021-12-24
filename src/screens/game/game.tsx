import { useState } from 'react'
import { players } from 'src/core/di'
import { useMe } from 'src/core/hooks'

export function Game() {
  const [word, setWord] = useState('')

  const { me } = useMe()

  return (
    <div>
      <div>
        <div>name: {me.username}</div>
        <div>word: {me.word}</div>
        <div>won: {me.won ? 'yes!' : 'not yet'}</div>
        <div>against: {me.opponent.username}</div>
      </div>

      <input
        value={word}
        onChange={e => setWord(e.target.value)}
      />

      <button
        type="button"
        onClick={() => players.me.guess(word)}
      >Submit</button>

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