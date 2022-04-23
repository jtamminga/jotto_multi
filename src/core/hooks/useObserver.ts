import { useEffect, useState } from 'react'
import { filter, throttleTime } from 'rxjs'
import { gameFlow, observer, players } from 'src/core/di'
import { GuessResult } from '../types'

export function useObserver() {
  const [latestResult, setLatestResult] = useState<GuessResult>()

  useEffect(() => {

    const latestGuess = getLatestGuess()

    // if there is a guess then push it on first
    if (latestGuess) {
      setLatestResult(latestGuess)
    }

    const subscription = observer.guessResult$
      .pipe(
        filter(e => e.player !== players.me),
        throttleTime(500)
      )
      .subscribe(e => setLatestResult(e.guessResult))

    return () => subscription.unsubscribe()
  }, [])

  return { latestResult }
}


function getLatestGuess(): GuessResult | undefined {
  const otherGuesses = gameFlow.game.guesses
      .filter(e => e.from !== players.me)

  return otherGuesses[otherGuesses.length - 1]
}