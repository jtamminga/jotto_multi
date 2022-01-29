import { useEffect, useState } from 'react'
import { filter, throttleTime } from 'rxjs'
import { observer, players } from 'src/core/di'
import { GuessEvent } from 'src/core/events'

export function useObserver() {
  const [latestEvent, setLatestEvent] = useState<GuessEvent>()

  useEffect(() => {
    const subscription = observer.guessResult$
      .pipe(
        filter(e => e.player !== players.me),
        throttleTime(500)
      )
      .subscribe(e => setLatestEvent(e))

    return () => subscription.unsubscribe()
  }, [])

  return { latestEvent }
}