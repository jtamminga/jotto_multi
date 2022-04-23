import { GuessResult } from 'src/core'
import { GuessResults } from 'src/screens/game/components/guess_results'
import { useEffect } from 'react'
import { players } from 'src/core/di'
import * as Text from 'src/components/typography'
import { useNotes } from 'src/core/hooks'

export function StepFour() {

  const { notes } = useNotes()
  const [from, to] = players.all

  const guesses: GuessResult[] = [
    { id: '1', word: 'stack', common: 0, from, to, won: false, date: 0 },
    { id: '2', word: 'stock', common: 1, from, to, won: false, date: 1 },
    { id: '3', word: 'stark', common: 1, from, to, won: false, date: 2 },
  ]

  useEffect(() => {
    if (notes) notes.restore(guesses)
  }, [])
  

  return (
    <div>
      <p className="mb-5">
        One strategy is to try to guess a word with <Text.Em>zero letters</Text.Em> in common. Then you know for sure those five letters are not in your opponent's word.
      </p>

      <div className="mb-5">
        <div className="text-center mb-3">
          Example words guessed
          <div className="text-sm text-slate-400">latest guess is at the top</div>
        </div>
        <GuessResults guesses={guesses} notes={notes} />
      </div>

      <p>
        From these three guesses you can deduce that both <Text.Em>O</Text.Em> and <Text.Em>R</Text.Em> are in the word, and <Text.Em>S</Text.Em>, <Text.Em>T</Text.Em>, <Text.Em>A</Text.Em>, <Text.Em>C</Text.Em>, <Text.Em>K</Text.Em> are not in the word.
      </p>
    </div>
  )
}