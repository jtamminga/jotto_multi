import { useEffect, useState } from 'react'
import { filter } from 'rxjs'
import { observer, players } from 'src/core/di'
import { GameEvent, PlayerEvent } from 'src/core/events'

export function useObserver() {
  const [latestEvent, setLatestEvent] = useState<PlayerEvent | GameEvent>()

  useEffect(() => {
    const subscription = observer.players$
      .pipe(filter(e => e.player !== players.me
      ))
      .subscribe(e => setLatestEvent(e))

    return () => subscription.unsubscribe()
  }, [])

  return { latestEvent }
}