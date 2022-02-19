import { useEffect, useState } from 'react'
import { concat, filter, Observable, of, throttleTime } from 'rxjs'
import { gameFlow, observer, players } from 'src/core/di'
import { createGuessResult, GuessEvent } from 'src/core/events'
import { GuessResult } from '../types'

export function useObserver() {
  const [latestEvent, setLatestEvent] = useState<GuessEvent>()

  useEffect(() => {

    const observables: Observable<GuessEvent>[] = []
    const latestGuess = getLatestGuess()

    // if there is a guess then push it on first
    if (latestGuess) {
      observables.push(of(createGuessResult(latestGuess)))
    }

    // then push the observable for upcoming guesses
    observables.push(
      observer.guessResult$
        .pipe(
          filter(e => e.player !== players.me),
          throttleTime(500)
        )
    )

    const subscription = concat(...observables)
      .subscribe(e => setLatestEvent(e))

    return () => subscription.unsubscribe()
  }, [])

  return { latestEvent }
}

function getLatestGuess(): GuessResult | undefined {
  const otherGuesses = gameFlow.game.guesses
      .filter(e => e.from !== players.me)

  return otherGuesses[otherGuesses.length - 1]
}