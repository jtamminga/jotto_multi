import { ReactNode, useRef } from 'react'
import { Button, FiveWordInput } from 'src/components'
import { gameFlow } from 'src/core/di'
import { useMe, useNotes } from 'src/core/hooks'
import { GuessResults } from './components/guess_results'
import { Hud } from './components/hud'
import { Observer } from './components/observer'

export function Game() {
  const guessListRef = useRef<HTMLDivElement>(null)
  const { me } = useMe()
  const { notes } = useNotes()

  function onGuess(word: string) {
    me.guess(word)
    guessListRef.current?.scrollTo({ top: 0, behavior: 'smooth' })
  }

  let content: ReactNode = null

  if (me.won) {
    content = (
      <div className="bg-emerald-100 p-5 rounded text-center mb-3">
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
      <FiveWordInput
        className="my-3"
        buttonLabel="Guess"
        onSubmit={onGuess}
      />
    )
  }

  return (
    <>
      <div className="px-3">
        <Hud className="my-3" />
        <Observer className="mb-3" />
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

      <div className="px-3">
        {content}
      </div>
    </>
  )

}